import type { Metadata } from "next"
import Link from "next/link"
import { getBrands, getCatalog, PAGE_SIZE, parseCatalogParams } from "@/features/catalog/queries"
import { ProductGrid } from "@/features/catalog/product-card"
import { DesktopFilters, MobileFilters, ResetFiltersButton, SortSelect } from "@/features/catalog/catalog-filters"
import { ANIMALS } from "@/lib/dictionaries"

export const metadata: Metadata = { title: "Каталог" }

export default async function CatalogPage(props: PageProps<"/catalog">) {
  const raw = await props.searchParams
  const params = parseCatalogParams(raw)
  const [{ products, total }, brands] = await Promise.all([getCatalog(params), getBrands()])
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const title = params.q
    ? `Поиск: «${params.q}»`
    : params.sale
      ? "Акции"
      : params.animal === "cat"
        ? "Корма для кошек"
        : params.animal === "dog"
          ? "Корма для собак"
          : "Каталог"

  const pageHref = (page: number) => {
    const sp = new URLSearchParams()
    for (const [k, v] of Object.entries(raw)) {
      if (typeof v === "string" && k !== "page") sp.set(k, v)
    }
    if (page > 1) sp.set("page", String(page))
    return `/catalog?${sp.toString()}`
  }

  return (
    <div className="mt-6">
      <h1 className="text-2xl font-extrabold md:text-3xl">{title}</h1>
      <p className="mt-1 text-muted-foreground">
        {params.animal && !params.q ? `${ANIMALS[params.animal]} · ` : ""}Найдено товаров: {total}
      </p>
      <div className="mt-4 flex items-center justify-between gap-2">
        <MobileFilters brands={brands} total={total} />
        <div className="ml-auto">
          <SortSelect />
        </div>
      </div>
      <div className="mt-4 flex gap-6">
        <DesktopFilters brands={brands} />
        <div className="min-w-0 flex-1">
          {products.length ? (
            <ProductGrid products={products} />
          ) : (
            <div className="rounded-2xl border bg-card p-10 text-center">
              <div className="text-5xl" aria-hidden="true">🔍</div>
              <p className="mt-3 text-lg font-bold">Ничего не нашли. Попробуйте убрать часть фильтров</p>
              <div className="mt-4">
                <ResetFiltersButton />
              </div>
            </div>
          )}
          {pages > 1 && (
            <nav className="mt-8 flex flex-wrap justify-center gap-2" aria-label="Страницы">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={pageHref(p)}
                  aria-current={p === params.page ? "page" : undefined}
                  className={`grid size-11 place-items-center rounded-full border font-bold ${p === params.page ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary"}`}
                >
                  {p}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </div>
  )
}
