import type { Metadata } from "next"
import Link from "next/link"
import { Pencil } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { PRODUCT_SELECT } from "@/features/catalog/queries"
import { ANIMALS, FOOD_TYPES } from "@/lib/dictionaries"
import { formatPrice } from "@/lib/format"
import type { Product } from "@/lib/types"
import { DeleteProductButton } from "@/features/admin-products/delete-product-button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { SavedToast } from "@/features/admin-products/saved-toast"

export const metadata: Metadata = { title: "Товары" }

export default async function AdminProductsPage(props: PageProps<"/admin/products">) {
  const { q: rawQ } = await props.searchParams
  const q = typeof rawQ === "string" ? rawQ.trim().replace(/[%_,()*\\]/g, " ").slice(0, 100) : ""
  const supabase = await createClient()
  let query = supabase.from("products").select(PRODUCT_SELECT).order("created_at", { ascending: false })
  if (q) query = query.ilike("name", `%${q}%`)
  const { data } = await query
  const products = (data ?? []) as Product[]
  return (
    <div>
      <SavedToast />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Товары <span className="text-muted-foreground">({products.length})</span></h1>
        <Button asChild className="h-11 rounded-full px-6 font-extrabold"><Link href="/admin/products/new">+ Добавить товар</Link></Button>
      </div>
      <form className="mt-4 max-w-sm" role="search">
        <input name="q" defaultValue={q} type="search" placeholder="Поиск по названию" aria-label="Поиск по названию" className="h-11 w-full rounded-full border bg-card px-4" />
      </form>
      <div className="mt-4 overflow-x-auto rounded-2xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead><TableHead>Бренд</TableHead><TableHead>Раздел</TableHead><TableHead>Цена</TableHead><TableHead>Остаток</TableHead><TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="max-w-72 font-bold whitespace-normal">{p.name}</TableCell>
                <TableCell>{p.brand?.name}</TableCell>
                <TableCell className="whitespace-nowrap">{ANIMALS[p.animal]} · {FOOD_TYPES[p.food_type]}</TableCell>
                <TableCell className="whitespace-nowrap">{formatPrice(p.price)}{p.old_price ? <span className="ml-1 text-xs text-sale">акция</span> : null}</TableCell>
                <TableCell className={p.stock === 0 ? "font-bold text-destructive" : ""}>{p.stock}</TableCell>
                <TableCell>
                  <div className="flex">
                    <Button asChild variant="ghost" size="icon" className="size-10"><Link href={`/admin/products/${p.id}`} aria-label={`Изменить «${p.name}»`}><Pencil className="size-5" /></Link></Button>
                    <DeleteProductButton id={p.id} name={p.name} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
