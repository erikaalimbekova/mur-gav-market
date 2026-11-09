"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { phoneSchema } from "@/features/checkout/schemas"

export type ProfileState = { ok?: boolean; error?: string; fieldErrors?: Record<string, string> } | undefined

const profileSchema = z.object({
  full_name: z.string().trim().min(2, "Укажите имя").max(80),
  phone: z.union([z.literal(""), phoneSchema]),
  address: z.string().trim().max(200, "Слишком длинный адрес"),
})

export async function updateProfile(_: ProfileState, formData: FormData): Promise<ProfileState> {
  const parsed = profileSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] ??= i.message
    return { fieldErrors }
  }
  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getUser()
  if (!auth.user) return { error: "Войдите в аккаунт" }
  const { error } = await supabase
    .from("profiles")
    .update({ full_name: parsed.data.full_name, phone: parsed.data.phone || null, address: parsed.data.address || null })
    .eq("id", auth.user.id)
  if (error) return { error: "Не получилось сохранить. Попробуйте ещё раз" }
  revalidatePath("/account")
  return { ok: true }
}
