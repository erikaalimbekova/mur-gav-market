import type { Metadata } from "next"
import { getCurrentUser } from "@/lib/supabase/server"
import { ProfileForm } from "@/features/account/profile-form"
import { formatPhone } from "@/lib/format"

export const metadata: Metadata = { title: "Профиль" }

export default async function AccountPage() {
  const user = await getCurrentUser()
  const p = user?.profile
  return (
    <div className="rounded-2xl border bg-card p-5 md:p-6">
      <h1 className="mb-4 text-2xl font-extrabold">Профиль</h1>
      <ProfileForm defaults={{ full_name: p?.full_name ?? "", phone: p?.phone ? formatPhone(p.phone) : "", address: p?.address ?? "" }} />
    </div>
  )
}
