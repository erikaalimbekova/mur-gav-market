import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"

export function Price({ price, oldPrice, className }: { price: number; oldPrice: number | null; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2", className)}>
      <span className="text-xl font-extrabold">{formatPrice(price)}</span>
      {oldPrice && (
        <span className="text-sm font-semibold text-muted-foreground line-through">{formatPrice(oldPrice)}</span>
      )}
    </div>
  )
}

export function discountPercent(price: number, oldPrice: number | null) {
  if (!oldPrice) return null
  return Math.round((1 - price / oldPrice) * 100)
}
