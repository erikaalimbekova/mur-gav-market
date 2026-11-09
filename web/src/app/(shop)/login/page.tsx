import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { AuthCard } from "@/components/layout/auth-card"
import { LoginForm } from "@/features/auth/auth-forms"
import { getCurrentUser } from "@/lib/supabase/server"

export const metadata: Metadata = { title: "Вход" }

export default async function LoginPage(props: PageProps<"/login">) {
  const { next } = await props.searchParams
  if (await getCurrentUser()) redirect("/account")
  return (
    <AuthCard title="Вход">
      <LoginForm next={typeof next === "string" ? next : undefined} />
    </AuthCard>
  )
}
