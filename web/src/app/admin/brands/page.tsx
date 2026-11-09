import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { BrandsManager } from "@/features/admin-brands/brands-manager"

export const metadata: Metadata = { title: "Бренды" }

export default async function AdminBrandsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from("brands").select("id, name, products(count)").order("name")
  const brands = (data ?? []).map((b) => ({
    id: b.id as string,
    name: b.name as string,
    products: (b.products as unknown as { count: number }[])?.[0]?.count ?? 0,
  }))
  return (
    <div className="max-w-2xl">
      <h1 className="mb-4 text-2xl font-extrabold">Бренды</h1>
      <BrandsManager brands={brands} />
    </div>
  )
}
