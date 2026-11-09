import Link from "next/link"

export function Footer() {
  return (
    <footer className="mt-16 bg-foreground py-10 text-[15px] text-[#F6E9DC]">
      <div className="mx-auto grid max-w-[1200px] gap-6 px-4 md:grid-cols-[2fr_1fr_1fr] lg:px-6">
        <div>
          <h2 className="mb-2 font-extrabold text-white">Мур-Гав Маркет</h2>
          <p>Корма для кошек и собак с доставкой по Алматы.</p>
          <p className="mt-1">+7 700 000 00 00 · ежедневно 9:00–21:00</p>
        </div>
        <div>
          <h2 className="mb-2 font-extrabold text-white">Покупателям</h2>
          <ul className="space-y-1 opacity-85">
            <li><Link href="/delivery" className="hover:underline">Доставка</Link></li>
            <li><Link href="/payment" className="hover:underline">Оплата</Link></li>
            <li><Link href="/about" className="hover:underline">О магазине</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-2 font-extrabold text-white">Каталог</h2>
          <ul className="space-y-1 opacity-85">
            <li><Link href="/catalog?animal=cat" className="hover:underline">Кошкам</Link></li>
            <li><Link href="/catalog?animal=dog" className="hover:underline">Собакам</Link></li>
            <li><Link href="/catalog?sale=1" className="hover:underline">Акции</Link></li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-6 max-w-[1200px] px-4 text-xs opacity-60 lg:px-6">
        Учебный проект. Бренды и товары вымышленные.
      </p>
    </footer>
  )
}
