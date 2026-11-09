import Link from "next/link"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/supabase/server"
import { logout } from "@/features/auth/actions"

export default async function AccountLayout({ children }: LayoutProps<"/account">) {
  const user = await getCurrentUser()
  if (!user) redirect("/login?next=/account")
  return (
    <div className="mt-6 grid gap-6 md:grid-cols-[220px_1fr]">
      <aside className="h-fit rounded-2xl border bg-card p-4">
        <p className="font-extrabold">{user.profile?.full_name || "Покупатель"}</p>
        <p className="truncate text-sm text-muted-foreground">{user.email}</p>
        <nav className="mt-4 flex flex-col gap-1 font-bold" aria-label="Личный кабинет">
          <Link href="/account" className="rounded-lg px-2 py-2 hover:bg-muted">Профиль</Link>
          <Link href="/account/orders" className="rounded-lg px-2 py-2 hover:bg-muted">Мои заказы</Link>
          <Link href="/account/password" className="rounded-lg px-2 py-2 hover:bg-muted">Сменить пароль</Link>
          {user.profile?.role === "admin" && <Link href="/admin" className="rounded-lg px-2 py-2 text-primary hover:bg-muted">Админка</Link>}
        </nav>
        <form action={logout} className="mt-2">
          <button type="submit" className="w-full rounded-lg px-2 py-2 text-left font-bold text-muted-foreground hover:bg-muted hover:text-destructive">Выйти</button>
        </form>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  )
}
