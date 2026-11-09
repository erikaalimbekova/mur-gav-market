import type { Metadata } from "next"
import { NewPasswordForm } from "@/features/auth/auth-forms"

export const metadata: Metadata = { title: "Смена пароля" }

export default function PasswordPage() {
  return (
    <div className="max-w-md rounded-2xl border bg-card p-5 md:p-6">
      <h1 className="mb-4 text-2xl font-extrabold">Смена пароля</h1>
      <NewPasswordForm />
    </div>
  )
}
