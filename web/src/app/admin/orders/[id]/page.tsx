import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getOrderWithItems } from "@/features/account/queries"
import { OrderDetails } from "@/features/account/order-details"
import { StatusSelect } from "@/features/admin-orders/status-select"

export const metadata: Metadata = { title: "Заказ" }

export default async function AdminOrderPage(props: PageProps<"/admin/orders/[id]">) {
  const { id } = await props.params
  const res = await getOrderWithItems(id)
  if (!res) notFound()
  return (
    <div className="max-w-3xl space-y-4">
      <Link href="/admin/orders" className="inline-block font-bold text-primary hover:underline">← Все заказы</Link>
      <div className="flex items-center gap-3 rounded-2xl border bg-card p-4">
        <span className="font-bold">Сменить статус:</span>
        <StatusSelect orderId={res.order.id} status={res.order.status} />
      </div>
      <OrderDetails order={res.order} items={res.items} linkProducts={false} />
    </div>
  )
}
