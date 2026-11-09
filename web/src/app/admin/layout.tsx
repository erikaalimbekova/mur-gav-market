import type { Metadata } from "next"
import Link from "next/link"
import { ClipboardList, Package, Tags, Store } from "lucide-react"
import { requireAdminPage } from "@/features/admin-orders/require-admin"
import { PawIcon } from "@/components/layout/logo"

export const metadata: Metadata = { title: { default: "Админка", template: "%s — Админка" }, robots: { index: false } }

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const { isAdmin } = await requireAdminPage()
  if (!isAdmin) {
    return (
      <main className="grid flex-1 place-items-center p-8 text-center">
        <div>
          <div className="text-6xl" aria-hidden="true">🔒</div>
          <h1 className="mt-3 text-2xl font-extrabold">Нет доступа</h1>
          <p className="mt-1 text-muted-foreground">Этот раздел только для администраторов магазина.</p>
          <Link href="/" className="mt-5 inline-flex h-11 items-center rounded-full bg-primary px-6 font-extrabold text-primary-foreground">На главную</Link>
        </div>
      </main>
    )
  }
  const links = [
    { href: "/admin/orders", label: "Заказы", icon: ClipboardList },
    { href: "/admin/products", label: "Товары", icon: Package },
    { href: "/admin/brands", label: "Бренды", icon: Tags },
    { href: "/", label: "На сайт", icon: Store },
  ]
  return (
    <div className="flex min-h-full flex-1 flex-col md:flex-row">
      <aside className="border-b bg-card md:w-56 md:border-r md:border-b-0">
        <div className="flex items-center gap-2 p-4 font-extrabold">
          <PawIcon className="size-7 text-primary" /> Админка
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:pb-4" aria-label="Админка">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 font-bold hover:bg-muted">
              <Icon className="size-4" /> {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
    </div>
  )
}
