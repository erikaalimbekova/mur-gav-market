import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getProduct, getSimilarProducts } from "@/features/catalog/queries"
import { ProductImage } from "@/features/product/product-image"
import { Price, discountPercent } from "@/features/product/price"
import { ProductBuyBox } from "@/features/product/product-buy-box"
import { ProductGrid } from "@/features/catalog/product-card"
import { AGES_BY_ANIMAL, ANIMALS, FOOD_TYPES, SIZES } from "@/lib/dictionaries"

export async function generateMetadata(props: PageProps<"/product/[id]">): Promise<Metadata> {
  const { id } = await props.params
  const product = await getProduct(id)
  return { title: product?.name ?? "Товар не найден" }
}

export default async function ProductPage(props: PageProps<"/product/[id]">) {
  const { id } = await props.params
  const product = await getProduct(id)
  if (!product) notFound()
  const similar = await getSimilarProducts(product)
  const discount = discountPercent(product.price, product.old_price)

  const specs: [string, string][] = [
    ["Бренд", product.brand?.name ?? "—"],
    ["Животное", ANIMALS[product.animal]],
    ["Возраст", AGES_BY_ANIMAL[product.animal][product.age]],
    ...(product.size ? ([["Размер", SIZES[product.size]]] as [string, string][]) : []),
    ["Тип корма", FOOD_TYPES[product.food_type]],
    ["Вес", product.weight],
  ]

  return (
    <div className="mt-6">
      <nav className="mb-4 text-sm text-muted-foreground" aria-label="Навигация">
        <Link href="/" className="hover:text-primary">Главная</Link> /{" "}
        <Link href={`/catalog?animal=${product.animal}`} className="hover:text-primary">
          {product.animal === "cat" ? "Кошкам" : "Собакам"}
        </Link>
      </nav>
      <div className="grid gap-6 md:grid-cols-2 md:gap-10">
        <div className="relative">
          <ProductImage name={product.name} imageUrl={product.image_url} animal={product.animal} foodType={product.food_type} big className="rounded-3xl" />
          {discount && (
            <span className="absolute top-3 left-3 rounded-full bg-sale px-3 py-1 text-sm font-extrabold text-white">−{discount}%</span>
          )}
        </div>
        <div>
          <div className="font-semibold text-muted-foreground">{product.brand?.name}</div>
          <h1 className="mt-1 text-2xl leading-tight font-extrabold md:text-3xl">{product.name}</h1>
          <Price price={product.price} oldPrice={product.old_price} className="mt-4 [&>span:first-child]:text-3xl" />
          <p className={`mt-2 font-bold ${product.stock > 0 ? "text-success" : "text-muted-foreground"}`}>
            {product.stock > 0 ? `В наличии: ${product.stock} шт.` : "Нет в наличии"}
          </p>
          <div className="mt-5 max-w-sm">
            <ProductBuyBox productId={product.id} stock={product.stock} />
          </div>
          <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 rounded-2xl border bg-card p-4">
            {specs.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-bold">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="mb-2 text-xl font-extrabold">Описание</h2>
          <p>{product.description || "Описание скоро появится."}</p>
        </div>
        <div>
          <h2 className="mb-2 text-xl font-extrabold">Состав</h2>
          <p>{product.composition || "—"}</p>
        </div>
      </section>
      {similar.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-2xl font-extrabold">Похожие товары</h2>
          <ProductGrid products={similar} />
        </section>
      )}
    </div>
  )
}
