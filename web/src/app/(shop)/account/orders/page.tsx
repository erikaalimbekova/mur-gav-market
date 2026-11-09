import type { Metadata } from "next"
import Link from "next/link"
import { getCurrentUser } from "@/lib/supabase/server"
import { getMyOrders } from "@/features/account/queries"
import { StatusBadge } from "@/features/account/status-badge"
import { formatDate, formatPrice } from "@/lib/format"

export const metadata: Metadata = { title: "Мои заказы" }

export default async function MyOrdersPage() {
  const user = await getCurrentUser()
  const orders = user ? await getMyOrders(user.id) : []
  return (
    <div>
      <h1 className="mb-4 text-2xl font-extrabold">Мои заказы</h1>
      {orders.length === 0 ? (
        <div className="rounded-2xl border bg-card p-8 text-center">
          <p className="text-lg font-bold">Вы ещё ничего не заказывали</p>
          <Link href="/catalog" className="mt-4 inline-flex h-11 items-center rounded-full bg-primary px-6 font-extrabold text-primary-foreground">В каталог</Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((o) => (
            <li key={o.id}>
              <Link href={`/account/orders/${o.id}`} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-4 hover:border-primary">
                <div>
                  <p className="font-extrabold">Заказ №{o.number}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(o.created_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={o.status} />
                  <span className="font-extrabold">{formatPrice(o.total)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
