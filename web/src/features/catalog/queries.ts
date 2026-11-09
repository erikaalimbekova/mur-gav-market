import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { AGES, ANIMALS, FOOD_TYPES, SIZES, keysOf } from "@/lib/dictionaries"
import type { Brand, Product } from "@/lib/types"

export const PAGE_SIZE = 12
export const PRODUCT_SELECT = "*, brand:brands(name)"

const enumOrUndef = <T extends string>(values: T[]) =>
  z.preprocess((v) => (typeof v === "string" && values.includes(v as T) ? v : undefined), z.enum(values as [T, ...T[]]).optional())

const intOrUndef = z.preprocess((v) => {
  const n = Number(v)
  return v !== undefined && v !== "" && Number.isFinite(n) && n >= 0 ? Math.floor(n) : undefined
}, z.number().int().optional())

const listOf = <T extends string>(values: T[]) =>
  z.preprocess((v) => {
    const arr = Array.isArray(v) ? v : typeof v === "string" ? v.split(",") : []
    return arr.filter((x): x is T => values.includes(x as T))
  }, z.array(z.string()))

// AD-6: единственный разбор параметров каталога
export const catalogParamsSchema = z.object({
  animal: enumOrUndef(keysOf(ANIMALS)),
  age: listOf(keysOf(AGES)),
  size: listOf(keysOf(SIZES)),
  type: listOf(keysOf(FOOD_TYPES)),
  brand: z.preprocess((v) => (Array.isArray(v) ? v : typeof v === "string" && v ? v.split(",") : []), z.array(z.string().uuid().catch("")).transform((a) => a.filter(Boolean))),
  min: intOrUndef,
  max: intOrUndef,
  sale: z.preprocess((v) => v === "1", z.boolean()),
  q: z.preprocess((v) => (typeof v === "string" ? v.trim().slice(0, 100) : ""), z.string()),
  sort: z.preprocess((v) => (["popular", "cheap", "expensive", "new"].includes(String(v)) ? v : "popular"), z.enum(["popular", "cheap", "expensive", "new"])),
  page: z.preprocess((v) => Math.max(1, Math.floor(Number(v)) || 1), z.number().int()),
})

export type CatalogParams = z.infer<typeof catalogParamsSchema>

export function parseCatalogParams(raw: Record<string, string | string[] | undefined>): CatalogParams {
  return catalogParamsSchema.parse(raw)
}

export async function getCatalog(params: CatalogParams) {
  const supabase = await createClient()
  let query = supabase.from("products").select(PRODUCT_SELECT, { count: "exact" })

  if (params.animal) query = query.eq("animal", params.animal)
  if (params.age.length) query = query.in("age", params.age)
  if (params.animal === "dog" && params.size.length) query = query.in("size", params.size)
  if (params.type.length) query = query.in("food_type", params.type)
  if (params.brand.length) query = query.in("brand_id", params.brand)
  if (params.min !== undefined) query = query.gte("price", params.min)
  if (params.max !== undefined) query = query.lte("price", params.max)
  if (params.sale) query = query.not("old_price", "is", null)

  if (params.q) {
    const term = params.q.replace(/[%_,()*\\]/g, " ").trim()
    if (term) {
      const { data: brands } = await supabase.from("brands").select("id").ilike("name", `%${term}%`)
      const brandIds = (brands ?? []).map((b) => b.id)
      query = brandIds.length
        ? query.or(`name.ilike.%${term}%,brand_id.in.(${brandIds.join(",")})`)
        : query.ilike("name", `%${term}%`)
    }
  }

  switch (params.sort) {
    case "cheap":
      query = query.order("price", { ascending: true })
      break
    case "expensive":
      query = query.order("price", { ascending: false })
      break
    case "new":
      query = query.order("created_at", { ascending: false })
      break
    default:
      query = query.order("popularity", { ascending: false })
  }
  query = query.order("id")

  const from = (params.page - 1) * PAGE_SIZE
  const { data, count, error } = await query.range(from, from + PAGE_SIZE - 1)
  if (error) throw new Error(error.message)
  return { products: (data ?? []) as Product[], total: count ?? 0 }
}

export async function getBrands(): Promise<Brand[]> {
  const supabase = await createClient()
  const { data } = await supabase.from("brands").select("id, name").order("name")
  return data ?? []
}

export async function getPopularProducts(limit = 8): Promise<Product[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .gt("stock", 0)
    .order("popularity", { ascending: false })
    .limit(limit)
  return (data ?? []) as Product[]
}

export async function getProduct(id: string): Promise<Product | null> {
  if (!z.string().uuid().safeParse(id).success) return null
  const supabase = await createClient()
  const { data } = await supabase.from("products").select(PRODUCT_SELECT).eq("id", id).maybeSingle()
  return data as Product | null
}

export async function getSimilarProducts(product: Product, limit = 4): Promise<Product[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("animal", product.animal)
    .eq("food_type", product.food_type)
    .neq("id", product.id)
    .gt("stock", 0)
    .order("popularity", { ascending: false })
    .limit(limit)
  return (data ?? []) as Product[]
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  const valid = ids.filter((id) => z.string().uuid().safeParse(id).success)
  if (!valid.length) return []
  const supabase = await createClient()
  const { data } = await supabase.from("products").select(PRODUCT_SELECT).in("id", valid)
  return (data ?? []) as Product[]
}
