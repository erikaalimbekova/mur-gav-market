import type { Metadata } from "next"
import { OrderSuccess } from "@/features/checkout/order-success"

export const metadata: Metadata = { title: "Заказ принят" }

export default async function OrderSuccessPage(props: PageProps<"/order/[number]/success">) {
  const { number } = await props.params
  return <OrderSuccess number={Number(number)} />
}
