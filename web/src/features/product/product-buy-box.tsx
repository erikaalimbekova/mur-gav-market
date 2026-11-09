"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { QtyStepper } from "@/features/cart/add-to-cart-button"
import { useCart } from "@/features/cart/cart-store"
import { useHydrated } from "@/lib/use-hydrated"

export function ProductBuyBox({ productId, stock }: { productId: string; stock: number }) {
  const { lines, add } = useCart()
  const hydrated = useHydrated()
  const inCart = hydrated ? (lines.find((l) => l.productId === productId)?.qty ?? 0) : 0
  const left = Math.max(0, stock - inCart)
  const [qty, setQty] = useState(1)

  if (stock < 1) {
    return <Button disabled className="h-12 w-full rounded-full">Нет в наличии</Button>
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <QtyStepper value={Math.min(qty, Math.max(1, left))} max={Math.max(1, left)} onChange={setQty} className="w-36" />
        <Button
          className="h-11 flex-1 rounded-full text-base font-extrabold hover:bg-primary-hover"
          disabled={left < 1}
          onClick={() => {
            add(productId, Math.min(qty, left), stock)
            toast.success("Добавлено в корзину")
            setQty(1)
          }}
        >
          {left < 1 ? "Весь остаток в корзине" : "В корзину"}
        </Button>
      </div>
      {inCart > 0 && (
        <p className="text-sm font-semibold text-muted-foreground">
          В корзине: {inCart} шт. ·{" "}
          <Link href="/cart" className="text-primary hover:underline">Перейти в корзину</Link>
        </p>
      )}
    </div>
  )
}
