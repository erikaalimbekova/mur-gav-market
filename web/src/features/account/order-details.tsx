import type { Order, OrderItem } from "@/lib/types"
import { formatDate, formatPhone, formatPrice } from "@/lib/format"
import { PAYMENT_METHODS } from "@/lib/dictionaries"
import Link from "next/link"
import { StatusBadge } from "./status-badge"

export function OrderDetails({ order, items, linkProducts = true }: { order: Order; items: OrderItem[]; linkProducts?: boolean }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-extrabold">Заказ №{order.number}</h1>
        <StatusBadge status={order.status} />
        <span className="text-muted-foreground">{formatDate(order.created_at)}</span>
      </div>
      <ul className="divide-y rounded-2xl border bg-card">
        {items.map((i) => (
          <li key={i.id} className="flex justify-between gap-3 p-4">
            <span>
              {linkProducts && i.product_id ? (
                <Link href={`/product/${i.product_id}`} className="font-bold hover:text-primary">{i.product_name}</Link>
              ) : (
                <span className="font-bold">{i.product_name}</span>
              )}
              <span className="text-muted-foreground"> × {i.qty} · {formatPrice(i.unit_price)}</span>
            </span>
            <span className="shrink-0 font-bold">{formatPrice(i.unit_price * i.qty)}</span>
          </li>
        ))}
      </ul>
      <dl className="grid gap-x-6 gap-y-2 rounded-2xl border bg-card p-4 sm:grid-cols-[auto_1fr]">
        <dt className="text-muted-foreground">Получатель</dt><dd className="font-bold">{order.customer_name}, {formatPhone(order.phone)}</dd>
        <dt className="text-muted-foreground">Адрес</dt><dd className="font-bold">{order.address}</dd>
        {order.comment && (<><dt className="text-muted-foreground">Комментарий</dt><dd>{order.comment}</dd></>)}
        <dt className="text-muted-foreground">Оплата</dt><dd className="font-bold">{PAYMENT_METHODS[order.payment_method]}</dd>
        <dt className="text-muted-foreground">Товары</dt><dd className="font-bold">{formatPrice(order.subtotal)}</dd>
        <dt className="text-muted-foreground">Доставка</dt><dd className="font-bold">{order.delivery_fee ? formatPrice(order.delivery_fee) : "бесплатно"}</dd>
        <dt className="text-lg font-extrabold">Итого</dt><dd className="text-lg font-extrabold">{formatPrice(order.total)}</dd>
      </dl>
    </div>
  )
}
