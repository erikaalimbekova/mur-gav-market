import type { Metadata } from "next"
import { CartView } from "@/features/cart/cart-view"

export const metadata: Metadata = { title: "Корзина" }

export default function CartPage() {
  return (
    <div className="mt-6">
      <h1 className="text-2xl font-extrabold md:text-3xl">Корзина</h1>
      <CartView />
    </div>
  )
}
