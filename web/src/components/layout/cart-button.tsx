"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/features/cart/cart-store"
import { useHydrated } from "@/lib/use-hydrated"

export function CartButton() {
  const hydrated = useHydrated()
  const cart = useCart()
  const count = hydrated ? cart.count : 0
  return (
    <Link
      href="/cart"
      aria-label={`Корзина, товаров: ${count}`}
      className="relative grid size-11 place-items-center rounded-full border bg-card hover:border-primary"
    >
      <ShoppingCart className="size-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-xs font-extrabold text-primary-foreground">
          {count}
        </span>
      )}
    </Link>
  )
}
