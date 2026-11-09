---
name: Мур-Гав Маркет
description: Учебный интернет-магазин кормов для кошек и собак в Алматы. shadcn/ui на Next.js + Tailwind; этот DESIGN.md задаёт только фирменные отличия.
status: final
created: 2026-11-09
updated: 2026-11-09
sources:
  - _bmad-output/planning-artifacts/prds/prd-Bmad-2026-11-09/prd.md
colors:
  # Фирменный слой поверх shadcn. Не перечисленные токены наследуются от shadcn.
  primary: '#F07B1A'
  primary-hover: '#D9680C'
  primary-foreground: '#FFFFFF'
  background: '#FFFBF5'
  surface: '#FFFFFF'
  surface-warm: '#FFF1E0'
  foreground: '#3B2416'
  muted-foreground: '#7A6253'
  border: '#F0E2D2'
  cat: '#F4A259'
  dog: '#8CB369'
  sale: '#E63946'
  success: '#2A9D8F'
typography:
  display:
    fontFamily: 'Nunito'
    fontSize: 36px
    fontWeight: '800'
    lineHeight: '1.15'
  h2:
    fontFamily: 'Nunito'
    fontSize: 24px
    fontWeight: '800'
    lineHeight: '1.25'
  body:
    fontFamily: 'Nunito'
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  price:
    fontFamily: 'Nunito'
    fontSize: 20px
    fontWeight: '800'
  label:
    fontFamily: 'Nunito'
    fontSize: 14px
    fontWeight: '600'
rounded:
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  full: 9999px
spacing:
  container: 1200px
  gutter-mobile: 16px
  gutter-desktop: 24px
  section: 48px
components:
  button-primary:
    background: '{colors.primary}'
    foreground: '{colors.primary-foreground}'
    radius: '{rounded.full}'
    hover: '{colors.primary-hover}'
  product-card:
    background: '{colors.surface}'
    border: '{colors.border}'
    radius: '{rounded.lg}'
  animal-tile-cat:
    background: '{colors.cat}'
    radius: '{rounded.xl}'
  animal-tile-dog:
    background: '{colors.dog}'
    radius: '{rounded.xl}'
  delivery-bar:
    background: '{colors.surface-warm}'
    foreground: '{colors.foreground}'
  badge-sale:
    background: '{colors.sale}'
    foreground: '#FFFFFF'
    radius: '{rounded.full}'
---

## Brand & Style

«Мур-Гав Маркет» — тёплый, дружелюбный и простой магазин кормов. Ощущение — уютная лавка, где знают твоего питомца, а не огромный гипермаркет. Отсюда мягкие скругления, крупные понятные плитки «Кошкам» и «Собакам», оранжевый как цвет действия и много воздуха. Стиль вдохновлён zoomarket.kz (тёплые цвета, плашка доставки, разделы по животным), но проще и чище.

Компоненты shadcn/ui (Button, Card, Input, Select, Checkbox, Sheet, Dialog, Toast, Table, Badge) берутся как есть. Этот документ задаёт только цвета, шрифт, скругления и несколько фирменных компонентов.

## Colors

- **Оранжевый `{colors.primary}`** — цвет действия: кнопки «В корзину» и «Оформить заказ», активные пункты меню, ссылки. Не используется для декора и больших фонов.
- **Кремовый фон `{colors.background}`** и **белые карточки `{colors.surface}`** — основа страниц.
- **Тёплый бежевый `{colors.surface-warm}`** — плашка бесплатной доставки и фоны отдельных блоков на главной.
- **Тёмно-коричневый `{colors.foreground}`** — основной текст; **`{colors.muted-foreground}`** — подписи, бренд, вес.
- **Абрикосовый `{colors.cat}` и травяной `{colors.dog}`** — только плитки и метки разделов «Кошкам» и «Собакам».
- **Красный `{colors.sale}`** — только скидки и старая цена. Ошибки форм — стандартный `destructive` из shadcn.
- **Бирюзовый `{colors.success}`** — «Заказ принят», статус «Доставлен».

Контраст текста `{colors.foreground}` на `{colors.background}` и белого на `{colors.primary-hover}` — не ниже WCAG AA. На `{colors.primary}` белый текст допустим только для крупных жирных кнопок (16px, 700+).

## Typography

Весь интерфейс набран шрифтом **Nunito** (Google Fonts, есть кириллица): округлый, дружелюбный, хорошо читается. Роли:
- `{typography.display}` — заголовок баннера на главной.
- `{typography.h2}` — заголовки разделов и страниц.
- `{typography.body}` — основной текст, описания товаров.
- `{typography.price}` — цены. Формат: «12 000 ₸» с неразрывным пробелом.
- `{typography.label}` — кнопки, фильтры, бейджи.

## Layout & Spacing

Содержимое по центру, максимальная ширина `{spacing.container}`. Поля: `{spacing.gutter-mobile}` на телефоне, `{spacing.gutter-desktop}` на компьютере. Между блоками главной — `{spacing.section}`. Сетка карточек товаров: 2 колонки на телефоне, 3 на планшете, 4 на компьютере. Каталог на компьютере: слева колонка фильтров 260px, справа сетка.

## Elevation & Depth

Почти плоско. Карточки отделяются рамкой `{colors.border}`; при наведении — мягкая тень `0 6px 20px rgba(59,36,22,0.08)` и подъём на 2px. Шапка при прокрутке закреплена и получает такую же тень.

## Shapes

Мягкие скругления — часть характера: карточки `{rounded.lg}`, плитки животных `{rounded.xl}`, поля ввода `{rounded.md}`, кнопки и бейджи — таблетки `{rounded.full}`. Острых углов нет.

## Components

- **Шапка.** Белая, высота 72px. Слева логотип: иконка лапки + «Мур-Гав Маркет» жирным. По центру меню, справа поиск, «Войти»/аватар и корзина с оранжевым счётчиком. Над шапкой — `delivery-bar` с текстом про бесплатную доставку.
- **Плитки животных** (`animal-tile-cat`, `animal-tile-dog`). Большие цветные блоки с иллюстрацией-иконкой животного и подписью «Кошкам» / «Собакам».
- **Карточка товара** (`product-card`). Фото на светлом фоне квадратом, бренд мелко серым, название (до 2 строк), вес, цена, кнопка-таблетка «В корзину». Скидка — бейдж `badge-sale` в углу фото и зачёркнутая старая цена. «Нет в наличии» — фото полупрозрачное, кнопка неактивна.
- **Кнопки.** `button-primary` — главное действие экрана, одна на блок. Второстепенные — shadcn `outline`.
- **Статус заказа.** Badge: «Новый» — оранжевый контур, «В работе» — оранжевая заливка, «Доставлен» — `{colors.success}`, «Отменён» — серый.

## Do's and Don'ts

- ✅ Одно главное оранжевое действие на блок.
- ✅ Цены всегда в тенге и с пробелами между разрядами.
- ✅ Изображения-заглушки нейтральные, без чужих логотипов и фото с других сайтов.
- ❌ Не использовать оранжевый для больших фонов и текста абзацев.
- ❌ Не добавлять градиенты, тени сильнее описанной, больше трёх акцентных цветов на экране.
- ❌ Не копировать логотип, баннеры и фото zoomarket.kz.

→ Макет главной: [mockups/home.html](mockups/home.html). При расхождении прав этот документ.
