"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { emailSchema, loginSchema, passwordSchema, registerSchema } from "./schemas"

export type AuthState = { error?: string; fieldErrors?: Record<string, string>; message?: string } | undefined

function fieldErrorsOf(issues: { path: PropertyKey[]; message: string }[]) {
  const out: Record<string, string> = {}
  for (const i of issues) out[String(i.path[0])] ??= i.message
  return out
}

function safeNext(next: FormDataEntryValue | null) {
  const v = typeof next === "string" ? next : ""
  return v.startsWith("/") && !v.startsWith("//") ? v : "/account"
}

async function origin() {
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host")
  const proto = h.get("x-forwarded-proto") ?? "http"
  return `${proto}://${host}`
}

export async function login(_: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { fieldErrors: fieldErrorsOf(parsed.error.issues) }
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)
  if (error) {
    return {
      error: error.message.includes("Email not confirmed")
        ? "Подтвердите email по ссылке из письма"
        : "Неверный email или пароль",
    }
  }
  redirect(safeNext(formData.get("next")))
}

export async function register(_: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { fieldErrors: fieldErrorsOf(parsed.error.issues) }
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.full_name },
      emailRedirectTo: `${await origin()}/auth/callback?next=/account`,
    },
  })
  if (error) {
    return { error: error.message.includes("already") ? "Такой email уже зарегистрирован" : "Не получилось зарегистрироваться. Попробуйте ещё раз" }
  }
  if (!data.session) {
    return { message: "Почти готово! Мы отправили письмо — перейдите по ссылке в нём, чтобы подтвердить email." }
  }
  redirect(safeNext(formData.get("next")))
}

export async function requestPasswordReset(_: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = emailSchema.safeParse(formData.get("email"))
  if (!parsed.success) return { fieldErrors: { email: parsed.error.issues[0].message } }
  const supabase = await createClient()
  await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${await origin()}/auth/callback?next=/account/password`,
  })
  return { message: "Если такой email зарегистрирован, мы отправили на него ссылку для сброса пароля." }
}

export async function updatePassword(_: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = passwordSchema.safeParse(formData.get("password"))
  if (!parsed.success) return { fieldErrors: { password: parsed.error.issues[0].message } }
  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password: parsed.data })
  if (error) return { error: "Не получилось сменить пароль. Попробуйте ещё раз" }
  return { message: "Пароль изменён." }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}
