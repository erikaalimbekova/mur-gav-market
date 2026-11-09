import type { Metadata } from "next"
import { AuthCard } from "@/components/layout/auth-card"
import { ResetPasswordForm } from "@/features/auth/auth-forms"

export const metadata: Metadata = { title: "Сброс пароля" }

export default function ResetPasswordPage() {
  return (
    <AuthCard title="Сброс пароля">
      <p className="mb-4 text-muted-foreground">Введите email — пришлём ссылку для нового пароля.</p>
      <ResetPasswordForm />
    </AuthCard>
  )
}
