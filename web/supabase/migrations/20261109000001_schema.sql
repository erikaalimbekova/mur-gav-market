-- Мур-Гав Маркет: схема, RLS, функции (AD-2, AD-3, AD-5, AD-7)

create type public.animal as enum ('cat', 'dog');
create type public.pet_age as enum ('baby', 'adult', 'senior');
create type public.dog_size as enum ('small', 'medium', 'large');
create type public.food_type as enum ('dry', 'wet', 'treat');
create type public.order_status as enum ('new', 'processing', 'delivered', 'cancelled');
create type public.payment_method as enum ('cash', 'card_on_delivery');

-- Профили ---------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  full_name text,
  phone text,
  address text,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Запрет менять себе роль: роль меняется только в SQL-консоли
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.role is distinct from old.role and (select auth.uid()) is not null then
    raise exception 'Нельзя менять роль';
  end if;
  return new;
end;
$$;

create trigger protect_profile_role
  before update on public.profiles
  for each row execute function public.protect_profile_role();

-- Настройки магазина (одна строка) --------------------------------------
create table public.settings (
  id boolean primary key default true check (id),
  free_delivery_threshold integer not null check (free_delivery_threshold >= 0),
  delivery_fee integer not null check (delivery_fee >= 0)
);

-- Каталог ---------------------------------------------------------------
create table public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand_id uuid not null references public.brands (id) on delete restrict,
  animal public.animal not null,
  age public.pet_age not null,
  size public.dog_size,
  food_type public.food_type not null,
  weight text not null,
  price integer not null check (price >= 0),
  old_price integer check (old_price is null or old_price > price),
  stock integer not null default 0 check (stock >= 0),
  description text not null default '',
  composition text not null default '',
  image_url text,
  popularity integer not null default 0,
  created_at timestamptz not null default now(),
  constraint size_only_for_dogs check (animal = 'dog' or size is null)
);

create index products_brand_idx on public.products (brand_id);
create index products_filter_idx on public.products (animal, food_type, age);

-- Заказы ----------------------------------------------------------------
create sequence public.order_number_seq start 1001;

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  number integer not null unique default nextval('public.order_number_seq'),
  user_id uuid references public.profiles (id) on delete set null,
  status public.order_status not null default 'new',
  customer_name text not null,
  phone text not null,
  address text not null,
  comment text,
  payment_method public.payment_method not null,
  subtotal integer not null,
  delivery_fee integer not null,
  total integer not null,
  created_at timestamptz not null default now()
);

create index orders_user_idx on public.orders (user_id);
create index orders_status_idx on public.orders (status, created_at desc);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  product_name text not null,
  unit_price integer not null,
  qty integer not null check (qty > 0)
);

create index order_items_order_idx on public.order_items (order_id);
create index order_items_product_idx on public.order_items (product_id);

-- RLS -------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.settings enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "profiles: свой или админ читает" on public.profiles
  for select to authenticated using (id = (select auth.uid()) or (select public.is_admin()));
create policy "profiles: свой обновляет" on public.profiles
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy "settings: читают все" on public.settings for select using (true);

create policy "brands: читают все" on public.brands for select using (true);
create policy "brands: админ добавляет" on public.brands for insert to authenticated with check ((select public.is_admin()));
create policy "brands: админ меняет" on public.brands for update to authenticated using ((select public.is_admin()));
create policy "brands: админ удаляет" on public.brands for delete to authenticated using ((select public.is_admin()));

create policy "products: читают все" on public.products for select using (true);
create policy "products: админ добавляет" on public.products for insert to authenticated with check ((select public.is_admin()));
create policy "products: админ меняет" on public.products for update to authenticated using ((select public.is_admin()));
create policy "products: админ удаляет" on public.products for delete to authenticated using ((select public.is_admin()));

create policy "orders: владелец или админ читает" on public.orders
  for select to authenticated using (user_id = (select auth.uid()) or (select public.is_admin()));
create policy "order_items: владелец или админ читает" on public.order_items
  for select to authenticated using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.user_id = (select auth.uid()) or (select public.is_admin()))
    )
  );
-- Вставка и смена статуса заказов — только через функции ниже (AD-2)

-- Создание заказа (AD-2) ------------------------------------------------
create or replace function public.place_order(items jsonb, contact jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_item jsonb;
  v_product public.products%rowtype;
  v_qty integer;
  v_problems jsonb := '[]'::jsonb;
  v_subtotal integer := 0;
  v_fee integer;
  v_settings public.settings%rowtype;
  v_order public.orders%rowtype;
  v_payment public.payment_method;
begin
  if items is null or jsonb_typeof(items) <> 'array' or jsonb_array_length(items) = 0 then
    raise exception 'EMPTY_CART';
  end if;

  if coalesce(trim(contact ->> 'name'), '') = ''
     or coalesce(contact ->> 'phone', '') !~ '^\+7\d{10}$'
     or coalesce(trim(contact ->> 'address'), '') = '' then
    raise exception 'INVALID_CONTACT';
  end if;

  v_payment := (contact ->> 'payment_method')::public.payment_method;

  -- Блокируем товары в одном порядке, чтобы избежать взаимных блокировок
  perform 1 from public.products
    where id in (select (e ->> 'productId')::uuid from jsonb_array_elements(items) e)
    order by id
    for update;

  for v_item in select * from jsonb_array_elements(items) loop
    v_qty := (v_item ->> 'qty')::integer;
    if v_qty is null or v_qty < 1 then
      raise exception 'INVALID_QTY';
    end if;
    select * into v_product from public.products where id = (v_item ->> 'productId')::uuid;
    if not found then
      v_problems := v_problems || jsonb_build_object('product_id', v_item ->> 'productId', 'available', 0);
    elsif v_product.stock < v_qty then
      v_problems := v_problems || jsonb_build_object('product_id', v_product.id, 'available', v_product.stock);
    else
      v_subtotal := v_subtotal + v_product.price * v_qty;
    end if;
  end loop;

  if jsonb_array_length(v_problems) > 0 then
    return jsonb_build_object('ok', false, 'problems', v_problems);
  end if;

  select * into v_settings from public.settings where id;
  v_fee := case when v_subtotal >= v_settings.free_delivery_threshold then 0 else v_settings.delivery_fee end;

  insert into public.orders (user_id, customer_name, phone, address, comment, payment_method, subtotal, delivery_fee, total)
  values (
    (select auth.uid()),
    trim(contact ->> 'name'),
    contact ->> 'phone',
    trim(contact ->> 'address'),
    nullif(trim(coalesce(contact ->> 'comment', '')), ''),
    v_payment,
    v_subtotal,
    v_fee,
    v_subtotal + v_fee
  )
  returning * into v_order;

  insert into public.order_items (order_id, product_id, product_name, unit_price, qty)
  select v_order.id, p.id, p.name, p.price, (e ->> 'qty')::integer
  from jsonb_array_elements(items) e
  join public.products p on p.id = (e ->> 'productId')::uuid;

  update public.products p
  set stock = p.stock - agg.qty, popularity = p.popularity + agg.qty
  from (
    select (e ->> 'productId')::uuid as id, sum((e ->> 'qty')::integer) as qty
    from jsonb_array_elements(items) e group by 1
  ) agg
  where p.id = agg.id;

  return jsonb_build_object('ok', true, 'id', v_order.id, 'number', v_order.number);
end;
$$;

-- Смена статуса (AD-2) --------------------------------------------------
create or replace function public.set_order_status(p_order_id uuid, p_status public.order_status)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_old public.order_status;
begin
  if not public.is_admin() then
    raise exception 'FORBIDDEN';
  end if;

  select status into v_old from public.orders where id = p_order_id for update;
  if not found then
    raise exception 'NOT_FOUND';
  end if;
  if v_old = p_status then
    return;
  end if;
  if v_old = 'cancelled' then
    raise exception 'ALREADY_CANCELLED';
  end if;

  if p_status = 'cancelled' then
    update public.products p
    set stock = p.stock + oi.qty
    from public.order_items oi
    where oi.order_id = p_order_id and oi.product_id = p.id;
  end if;

  update public.orders set status = p_status where id = p_order_id;
end;
$$;

revoke execute on function public.place_order(jsonb, jsonb) from public;
grant execute on function public.place_order(jsonb, jsonb) to anon, authenticated;
revoke execute on function public.set_order_status(uuid, public.order_status) from public, anon;
grant execute on function public.set_order_status(uuid, public.order_status) to authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- Хранилище фото товаров ------------------------------------------------
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "product-images: админ загружает" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images' and (select public.is_admin()));
create policy "product-images: админ меняет" on storage.objects
  for update to authenticated using (bucket_id = 'product-images' and (select public.is_admin()));
create policy "product-images: админ удаляет" on storage.objects
  for delete to authenticated using (bucket_id = 'product-images' and (select public.is_admin()));
