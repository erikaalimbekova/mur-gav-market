import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { AuthCard } from "@/components/layout/auth-card"
import { RegisterForm } from "@/features/auth/auth-forms"
import { getCurrentUser } from "@/lib/supabase/server"

export const metadata: Metadata = { title: "Регистрация" }

export default async function RegisterPage(props: PageProps<"/register">) {
  const { next } = await props.searchParams
  if (await getCurrentUser()) redirect("/account")
  return (
    <AuthCard title="Регистрация">
      <RegisterForm next={typeof next === "string" ? next : undefined} />
    </AuthCard>
  )
}
