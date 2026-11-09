"use client"

import Link from "next/link"
import { Trash2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/format"
import { calcDelivery } from "@/lib/pricing"
import { ProductImage } from "@/features/product/product-image"
import { useCart } from "./cart-store"
import { useCartProducts } from "./use-cart-products"
import { QtyStepper } from "./add-to-cart-button"
import { DeliveryProgress } from "./delivery-progress"

export function EmptyCart() {
  return (
    <div className="mt-6 rounded-3xl border bg-card p-10 text-center">
      <div className="text-6xl" aria-hidden="true">🐾</div>
      <p className="mt-3 text-xl font-extrabold">В корзине пока пусто — питомец ждёт 🐾</p>
      <div className="mt-5 flex justify-center gap-3">
        <Link href="/catalog?animal=cat" className="rounded-full bg-cat px-6 py-3 font-extrabold text-white">Кошкам</Link>
        <Link href="/catalog?animal=dog" className="rounded-full bg-dog px-6 py-3 font-extrabold text-white">Собакам</Link>
      </div>
    </div>
  )
}

export function CartView() {
  const { setQty, remove } = useCart()
  const { items, subtotal, loading, error, lines } = useCartProducts()
  const delivery = calcDelivery(subtotal)
  const missing = lines.length - items.length

  if (loading) {
    return (
      <div className="mt-6 space-y-3">
        {[0, 1, 2].map((i) => <Skeleton key={i} className="h-28 w-full rounded-2xl" />)}
      </div>
    )
  }
  if (error) {
    return <p className="mt-6 rounded-2xl border bg-card p-6">Не получилось связаться с сервером. Попробуйте ещё раз.</p>
  }
  if (!items.length) return <EmptyCart />

  const hasStockProblem = items.some((i) => i.qty > i.product.stock)

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
      <ul className="space-y-3">
        {items.map(({ product, qty }) => {
          const tooMany = qty > product.stock
          return (
            <li key={product.id} className={`flex gap-3 rounded-2xl border bg-card p-3 sm:gap-4 ${tooMany ? "border-destructive" : ""}`}>
              <Link href={`/product/${product.id}`} className="w-20 shrink-0 sm:w-24">
                <ProductImage name={product.name} imageUrl={product.image_url} animal={product.animal} foodType={product.food_type} className="[&>span]:text-4xl" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link href={`/product/${product.id}`} className="font-bold leading-snug hover:text-primary">{product.name}</Link>
                    <div className="text-sm text-muted-foreground">{product.brand?.name} · {product.weight} · {formatPrice(product.price)}</div>
                  </div>
                  <button type="button" aria-label={`Удалить «${product.name}»`} onClick={() => remove(product.id)} className="grid size-10 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-destructive">
                    <Trash2 className="size-5" />
                  </button>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  {product.stock > 0 ? (
                    <QtyStepper value={qty} max={Math.max(qty, product.stock)} onChange={(q) => setQty(product.id, q)} className="w-32" />
                  ) : (
                    <span className="font-bold text-destructive">Нет в наличии</span>
                  )}
                  <span className="text-lg font-extrabold">{formatPrice(product.price * qty)}</span>
                </div>
                {tooMany && product.stock > 0 && (
                  <p className="text-sm font-semibold text-destructive">
                    В наличии только {product.stock} шт.{" "}
                    <button type="button" className="underline" onClick={() => setQty(product.id, product.stock)}>Исправить</button>
                  </p>
                )}
              </div>
            </li>
          )
        })}
        {missing > 0 && <li className="text-sm text-muted-foreground">Некоторые товары больше не продаются и убраны из расчёта.</li>}
      </ul>
      <aside className="h-fit space-y-4 rounded-2xl border bg-card p-5 lg:sticky lg:top-24">
        <DeliveryProgress subtotal={subtotal} />
        <dl className="space-y-2">
          <div className="flex justify-between"><dt>Товары</dt><dd className="font-bold">{formatPrice(subtotal)}</dd></div>
          <div className="flex justify-between"><dt>Доставка</dt><dd className="font-bold">{delivery ? formatPrice(delivery) : "бесплатно"}</dd></div>
          <div className="flex justify-between border-t pt-2 text-xl font-extrabold"><dt>Итого</dt><dd>{formatPrice(subtotal + delivery)}</dd></div>
        </dl>
        {hasStockProblem ? (
          <Button disabled className="h-12 w-full rounded-full text-base font-extrabold">Уменьшите количество</Button>
        ) : (
          <Button asChild className="h-12 w-full rounded-full text-base font-extrabold hover:bg-primary-hover">
            <Link href="/checkout">Оформить заказ</Link>
          </Button>
        )}
      </aside>
    </div>
  )
}
