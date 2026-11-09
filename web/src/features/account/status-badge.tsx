import { ORDER_STATUSES, type OrderStatus } from "@/lib/dictionaries"
import { cn } from "@/lib/utils"

const STYLES: Record<OrderStatus, string> = {
  new: "border-primary text-primary bg-transparent",
  processing: "border-primary bg-primary text-primary-foreground",
  delivered: "border-success bg-success text-white",
  cancelled: "border-muted-foreground/40 bg-muted text-muted-foreground",
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={cn("inline-flex rounded-full border px-3 py-0.5 text-sm font-bold whitespace-nowrap", STYLES[status])}>
      {ORDER_STATUSES[status]}
    </span>
  )
}
