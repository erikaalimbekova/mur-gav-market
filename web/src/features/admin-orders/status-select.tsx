"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { ORDER_STATUSES, type OrderStatus } from "@/lib/dictionaries"
import { changeOrderStatus } from "./actions"

export function StatusSelect({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const [pending, start] = useTransition()
  return (
    <select
      aria-label="Статус заказа"
      value={status}
      disabled={pending || status === "cancelled"}
      onChange={(e) => {
        const next = e.target.value
        if (next === "cancelled" && !confirm("Отменить заказ? Товары вернутся на склад.")) return
        start(async () => {
          const res = await changeOrderStatus(orderId, next)
          if (res.ok) toast.success("Статус обновлён")
          else toast.error(res.error)
        })
      }}
      className="h-10 rounded-full border bg-card px-3 font-bold disabled:opacity-60"
    >
      {(Object.keys(ORDER_STATUSES) as OrderStatus[]).map((s) => (
        <option key={s} value={s}>{ORDER_STATUSES[s]}</option>
      ))}
    </select>
  )
}
