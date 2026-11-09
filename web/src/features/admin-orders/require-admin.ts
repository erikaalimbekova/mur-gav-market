import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/supabase/server"

// Только UX-проверка: настоящая защита — RLS в базе (AD-3)
export async function requireAdminPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login?next=/admin")
  return { user, isAdmin: user.profile?.role === "admin" }
}
