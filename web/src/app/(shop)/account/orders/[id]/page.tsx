import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getOrderWithItems } from "@/features/account/queries"
import { OrderDetails } from "@/features/account/order-details"

export const metadata: Metadata = { title: "Заказ" }

export default async function MyOrderPage(props: PageProps<"/account/orders/[id]">) {
  const { id } = await props.params
  const res = await getOrderWithItems(id)
  if (!res) notFound()
  return (
    <div>
      <Link href="/account/orders" className="mb-4 inline-block font-bold text-primary hover:underline">← Мои заказы</Link>
      <OrderDetails order={res.order} items={res.items} />
    </div>
  )
}
