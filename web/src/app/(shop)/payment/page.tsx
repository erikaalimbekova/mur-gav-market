import type { Metadata } from "next"
import { InfoPage } from "@/components/layout/info-page"

export const metadata: Metadata = { title: "Оплата" }

export default function PaymentPage() {
  return (
    <InfoPage title="Оплата">
      <p>Онлайн-оплаты на сайте нет — вы платите только когда получили заказ.</p>
      <ul>
        <li><b>Наличными</b> курьеру при получении.</li>
        <li><b>Картой</b> курьеру при получении — у курьера есть терминал.</li>
      </ul>
      <p>Если товар не подошёл по качеству, курьер заберёт его обратно, и вы ничего не платите.</p>
    </InfoPage>
  )
}
