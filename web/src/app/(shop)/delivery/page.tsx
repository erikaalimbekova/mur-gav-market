import type { Metadata } from "next"
import { InfoPage } from "@/components/layout/info-page"
import { formatPrice } from "@/lib/format"
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from "@/lib/pricing"

export const metadata: Metadata = { title: "Доставка" }

export default function DeliveryPage() {
  return (
    <InfoPage title="Доставка">
      <p>Мы доставляем корма по Алматы ежедневно с 10:00 до 21:00. После оформления заказа мы позвоним, чтобы согласовать удобное время.</p>
      <h2>Стоимость</h2>
      <ul>
        <li>Заказ от {formatPrice(FREE_DELIVERY_THRESHOLD)} — доставка бесплатно.</li>
        <li>Заказ дешевле — доставка {formatPrice(DELIVERY_FEE)}.</li>
      </ul>
      <h2>Сроки</h2>
      <p>Заказы, оформленные до 15:00, обычно привозим в тот же день, остальные — на следующий.</p>
      <p>Доставки за пределы Алматы пока нет.</p>
    </InfoPage>
  )
}
