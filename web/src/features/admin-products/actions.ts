"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { productSchema } from "./schemas"

export type ProductFormState = { error?: string; fieldErrors?: Record<string, string> } | undefined

const MAX_IMAGE = 3 * 1024 * 1024

async function uploadImage(file: File): Promise<string | { error: string }> {
  if (!file.type.startsWith("image/")) return { error: "Можно загрузить только картинку" }
  if (file.size > MAX_IMAGE) return { error: "Фото больше 3 МБ" }
  const supabase = await createClient()
  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg"
  const path = `${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from("product-images").upload(path, file, { contentType: file.type })
  if (error) return { error: "Не получилось загрузить фото" }
  return supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl
}

export async function saveProduct(_: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const id = String(formData.get("id") ?? "")
  const parsed = productSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] ??= i.message
    return { error: "Проверьте поля формы", fieldErrors }
  }

  const values: Record<string, unknown> = { ...parsed.data }
  const image = formData.get("image")
  if (image instanceof File && image.size > 0) {
    const uploaded = await uploadImage(image)
    if (typeof uploaded !== "string") return { fieldErrors: { image: uploaded.error } }
    values.image_url = uploaded
  } else if (formData.get("remove_image") === "on") {
    values.image_url = null
  }

  const supabase = await createClient()
  const { error } = id
    ? await supabase.from("products").update(values).eq("id", id)
    : await supabase.from("products").insert(values)
  if (error) return { error: "Не получилось сохранить товар. Проверьте права администратора." }

  revalidatePath("/", "layout")
  redirect("/admin/products?saved=1")
}

export async function deleteProduct(id: string): Promise<{ ok: boolean; error?: string }> {
  if (!z.string().uuid().safeParse(id).success) return { ok: false, error: "Неверный товар" }
  const supabase = await createClient()
  const { error, count } = await supabase.from("products").delete({ count: "exact" }).eq("id", id)
  if (error || !count) return { ok: false, error: "Не получилось удалить товар" }
  revalidatePath("/", "layout")
  return { ok: true }
}
