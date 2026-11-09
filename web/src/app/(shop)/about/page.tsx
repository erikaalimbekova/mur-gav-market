import type { Metadata } from "next"
import { InfoPage } from "@/components/layout/info-page"

export const metadata: Metadata = { title: "О магазине" }

export default function AboutPage() {
  return (
    <InfoPage title="О магазине">
      <p>«Мур-Гав Маркет» — небольшой магазин кормов для кошек и собак в Алматы. Мы продаём только корм, поэтому в каталоге легко найти нужный: выберите животное, возраст, размер и тип корма.</p>
      <p>Все наши сотрудники — владельцы кошек и собак, поэтому мы знаем, что важно питомцам и их хозяевам.</p>
      <p className="text-sm text-muted-foreground">Это учебный проект. Бренды, товары и контакты вымышленные, настоящие заказы не выполняются.</p>
    </InfoPage>
  )
}
