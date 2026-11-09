"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import type { ActionResult } from "@/lib/types"

const nameSchema = z.string().trim().min(2, "Не короче 2 символов").max(60, "Слишком длинное название")

function done() {
  revalidatePath("/", "layout")
}

export async function addBrand(name: string): Promise<ActionResult> {
  const parsed = nameSchema.safeParse(name)
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message }
  const supabase = await createClient()
  const { error } = await supabase.from("brands").insert({ name: parsed.data })
  if (error) return { ok: false, error: error.code === "23505" ? "Такой бренд уже есть" : "Не получилось добавить бренд" }
  done()
  return { ok: true, data: undefined }
}

export async function renameBrand(id: string, name: string): Promise<ActionResult> {
  const parsed = nameSchema.safeParse(name)
  if (!parsed.success || !z.string().uuid().safeParse(id).success) return { ok: false, error: parsed.error?.issues[0].message ?? "Неверные данные" }
  const supabase = await createClient()
  const { error } = await supabase.from("brands").update({ name: parsed.data }).eq("id", id)
  if (error) return { ok: false, error: error.code === "23505" ? "Такой бренд уже есть" : "Не получилось переименовать" }
  done()
  return { ok: true, data: undefined }
}

export async function removeBrand(id: string): Promise<ActionResult> {
  if (!z.string().uuid().safeParse(id).success) return { ok: false, error: "Неверный бренд" }
  const supabase = await createClient()
  const { error } = await supabase.from("brands").delete().eq("id", id)
  if (error) return { ok: false, error: error.code === "23503" ? "У бренда есть товары — сначала удалите или перенесите их" : "Не получилось удалить" }
  done()
  return { ok: true, data: undefined }
}
