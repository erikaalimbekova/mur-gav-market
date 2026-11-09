import type { Metadata } from "next"
import { getBrands } from "@/features/catalog/queries"
import { ProductForm } from "@/features/admin-products/product-form"

export const metadata: Metadata = { title: "Новый товар" }

export default async function NewProductPage() {
  const brands = await getBrands()
  return (
    <div className="max-w-3xl">
      <h1 className="mb-4 text-2xl font-extrabold">Новый товар</h1>
      <ProductForm brands={brands} />
    </div>
  )
}
