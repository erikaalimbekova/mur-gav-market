import { formatPrice } from "@/lib/format"
import { FREE_DELIVERY_THRESHOLD } from "@/lib/pricing"

export function DeliveryProgress({ subtotal }: { subtotal: number }) {
  const left = FREE_DELIVERY_THRESHOLD - subtotal
  const pct = Math.min(100, Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100))
  return (
    <div className="rounded-2xl bg-secondary p-4">
      <p className="font-bold" aria-live="polite">
        {left > 0 ? `До бесплатной доставки осталось ${formatPrice(left)}` : "Доставка бесплатная 🎉"}
      </p>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-card" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Прогресс до бесплатной доставки">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
