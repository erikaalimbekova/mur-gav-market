import Link from "next/link"
import { getBrands, getPopularProducts } from "@/features/catalog/queries"
import { ProductGrid } from "@/features/catalog/product-card"
import { formatPrice } from "@/lib/format"
import { FREE_DELIVERY_THRESHOLD } from "@/lib/pricing"

export default async function HomePage() {
  const [products, brands] = await Promise.all([getPopularProducts(8), getBrands()])
  return (
    <>
      <section className="mt-6 grid items-center gap-4 overflow-hidden rounded-3xl bg-secondary px-6 py-8 md:grid-cols-[1.3fr_1fr] md:p-12">
        <div>
          <h1 className="text-[28px] leading-tight font-extrabold md:text-4xl">
            Вкусный корм для котиков и пёсиков — с доставкой по Алматы
          </h1>
          <p className="mt-3 mb-5 text-[17px] text-muted-foreground">
            Подберите корм по возрасту и размеру питомца за пару минут.
          </p>
          <Link
            href="/catalog?sale=1"
            className="inline-flex h-11 items-center rounded-full bg-primary px-6 font-extrabold text-primary-foreground hover:bg-primary-hover"
          >
            Смотреть акции
          </Link>
        </div>
        <div className="text-center text-8xl md:text-[140px]" aria-hidden="true">
          🐱🐶
        </div>
      </section>

      <section className="mt-12 grid grid-cols-2 gap-4" aria-label="Разделы">
        <Link href="/catalog?animal=cat" className="relative flex min-h-40 flex-col justify-between overflow-hidden rounded-3xl bg-cat p-6 text-2xl font-extrabold text-white md:min-h-56 md:text-[32px]">
          Кошкам
          <span className="text-[15px] font-semibold">Сухой, влажный, лакомства</span>
          <span className="absolute right-3 bottom-1 text-7xl md:text-[110px]" aria-hidden="true">🐈</span>
        </Link>
        <Link href="/catalog?animal=dog" className="relative flex min-h-40 flex-col justify-between overflow-hidden rounded-3xl bg-dog p-6 text-2xl font-extrabold text-white md:min-h-56 md:text-[32px]">
          Собакам
          <span className="text-[15px] font-semibold">Для мелких, средних и крупных</span>
          <span className="absolute right-3 bottom-1 text-7xl md:text-[110px]" aria-hidden="true">🐕</span>
        </Link>
      </section>

      <section className="mt-12">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-2xl font-extrabold">Популярные товары</h2>
          <Link href="/catalog" className="font-bold text-primary hover:underline">
            Весь каталог →
          </Link>
        </div>
        <ProductGrid products={products} />
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-extrabold">Популярные бренды</h2>
        <div className="flex flex-wrap gap-3">
          {brands.map((b) => (
            <Link key={b.id} href={`/catalog?brand=${b.id}`} className="rounded-full border bg-card px-5 py-2.5 font-extrabold text-muted-foreground hover:border-primary hover:text-primary">
              {b.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-3 md:grid-cols-3" aria-label="Преимущества">
        {[
          ["🚚", `Бесплатно от ${formatPrice(FREE_DELIVERY_THRESHOLD)} по Алматы`],
          ["💵", "Оплата при получении — наличными или картой"],
          ["🐾", "Только корма — легко найти нужный"],
        ].map(([icon, text]) => (
          <div key={text} className="flex items-center gap-3 rounded-2xl border bg-card p-5 font-bold">
            <span className="text-3xl" aria-hidden="true">{icon}</span>
            {text}
          </div>
        ))}
      </section>
    </>
  )
}
