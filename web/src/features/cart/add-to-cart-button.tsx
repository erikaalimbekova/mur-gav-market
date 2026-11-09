"use client"

import { Minus, Plus } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useCart } from "./cart-store"
import { cn } from "@/lib/utils"
import { useHydrated } from "@/lib/use-hydrated"

export function QtyStepper({
  value,
  max,
  onChange,
  className,
}: {
  value: number
  max: number
  onChange: (qty: number) => void
  className?: string
}) {
  return (
    <div className={cn("flex h-11 items-center justify-between rounded-full border bg-card", className)}>
      <button
        type="button"
        aria-label="Уменьшить количество"
        className="grid size-11 place-items-center rounded-full hover:bg-muted disabled:opacity-40"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
      >
        <Minus className="size-4" />
      </button>
      <span className="min-w-8 text-center font-extrabold" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        aria-label="Увеличить количество"
        className="grid size-11 place-items-center rounded-full hover:bg-muted disabled:opacity-40"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <Plus className="size-4" />
      </button>
    </div>
  )
}

export function AddToCartButton({ productId, stock, className }: { productId: string; stock: number; className?: string }) {
  const { lines, add, setQty, ready } = useCart()
  const hydrated = useHydrated()
  const line = lines.find((l) => l.productId === productId)

  if (stock < 1) {
    return (
      <Button disabled className={cn("h-11 w-full rounded-full", className)}>
        Нет в наличии
      </Button>
    )
  }

  if (hydrated && ready && line) {
    return (
      <QtyStepper
        className={className}
        value={line.qty}
        max={stock}
        onChange={(q) => (q < 1 ? undefined : setQty(productId, q))}
      />
    )
  }

  return (
    <Button
      className={cn("h-11 w-full rounded-full text-[15px] font-extrabold hover:bg-primary-hover", className)}
      onClick={() => {
        add(productId, 1, stock)
        toast.success("Добавлено в корзину")
      }}
    >
      В корзину
    </Button>
  )
}
