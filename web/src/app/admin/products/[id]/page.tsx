import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getBrands, getProduct } from "@/features/catalog/queries"
import { ProductForm } from "@/features/admin-products/product-form"

export const metadata: Metadata = { title: "Изменить товар" }

export default async function EditProductPage(props: PageProps<"/admin/products/[id]">) {
  const { id } = await props.params
  const [product, brands] = await Promise.all([getProduct(id), getBrands()])
  if (!product) notFound()
  return (
    <div className="max-w-3xl">
      <h1 className="mb-4 text-2xl font-extrabold">Изменить товар</h1>
      <ProductForm product={product} brands={brands} />
    </div>
  )
}
