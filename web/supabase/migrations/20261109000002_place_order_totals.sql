-- place_order возвращает суммы для страницы подтверждения (гость не может читать заказ через RLS).
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

  return jsonb_build_object('ok', true, 'id', v_order.id, 'number', v_order.number,
    'subtotal', v_order.subtotal, 'delivery_fee', v_order.delivery_fee, 'total', v_order.total);
end;
$$;
