import Link from "next/link"
import { UserRound } from "lucide-react"
import { getCurrentUser } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/format"
import { FREE_DELIVERY_THRESHOLD } from "@/lib/pricing"
import { Logo } from "./logo"
import { NAV_LINKS } from "./nav-links"
import { SearchBox } from "./search-box"
import { CartButton } from "./cart-button"
import { MobileMenu } from "./mobile-menu"
import { cn } from "@/lib/utils"

export async function Header() {
  const user = await getCurrentUser()
  return (
    <>
      <div className="bg-secondary px-4 py-2 text-center text-sm font-semibold">
        🚚 Бесплатная доставка по Алматы при заказе от {formatPrice(FREE_DELIVERY_THRESHOLD)}
      </div>
      <header className="sticky top-0 z-40 bg-card shadow-[0_6px_20px_rgba(59,36,22,0.06)]">
        <div className="mx-auto flex h-[72px] max-w-[1200px] items-center gap-3 px-4 lg:gap-5 lg:px-6">
          <MobileMenu isAdmin={user?.profile?.role === "admin"} />
          <Logo />
          <nav className="hidden gap-5 text-[15px] font-bold lg:flex" aria-label="Главное меню">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn("hover:text-primary", "sale" in l && "text-sale")}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="hidden flex-1 lg:block">
            <SearchBox />
          </div>
          <div className="ml-auto flex items-center gap-2">
            {user?.profile?.role === "admin" && (
              <Link href="/admin" className="hidden text-sm font-bold text-primary hover:underline sm:block">
                Админка
              </Link>
            )}
            <Link
              href={user ? "/account" : "/login"}
              aria-label={user ? "Личный кабинет" : "Войти"}
              className="grid size-11 place-items-center rounded-full border bg-card hover:border-primary"
            >
              <UserRound className="size-5" />
            </Link>
            <CartButton />
          </div>
        </div>
        <div className="px-4 pb-3 lg:hidden">
          <SearchBox />
        </div>
      </header>
    </>
  )
}
