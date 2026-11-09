# Мур-Гав Маркет

Учебный интернет-магазин кормов для кошек и собак (Алматы, цены в тенге).

**Стек:** Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · shadcn/ui · Supabase (Postgres, Auth, Storage) · Vercel.

Документы проекта (BMAD): бриф, PRD, UX и архитектура — в папке `../_bmad-output/planning-artifacts/`.

## Запуск локально

```bash
cd web
npm install
cp .env.example .env.local   # вписать URL и публичный ключ Supabase
npm run dev
```

Сайт откроется на http://localhost:3000.

## База данных

- `supabase/migrations/` — таблицы, правила доступа (RLS), функции `place_order` и `set_order_status`.
- `supabase/seed.sql` — 6 вымышленных брендов и 24 товара.

## Как сделать администратора

Зарегистрируйтесь на сайте, затем в Supabase → SQL Editor выполните:

```sql
update public.profiles set role = 'admin'
where id = (select id from auth.users where email = 'ваш@email');
```

После этого в шапке появится ссылка «Админка» (`/admin`).
