"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { ORDER_STATUSES, keysOf } from "@/lib/dictionaries"
import type { ActionResult } from "@/lib/types"

const schema = z.object({
  orderId: z.string().uuid(),
  status: z.enum(keysOf(ORDER_STATUSES) as [string, ...string[]]),
})

export async function changeOrderStatus(orderId: string, status: string): Promise<ActionResult> {
  const parsed = schema.safeParse({ orderId, status })
  if (!parsed.success) return { ok: false, error: "Неверные данные" }
  const supabase = await createClient()
  // AD-2: статус меняет только функция базы (она же возвращает остатки при отмене)
  const { error } = await supabase.rpc("set_order_status", { p_order_id: parsed.data.orderId, p_status: parsed.data.status })
  if (error) {
    const msg = error.message.includes("ALREADY_CANCELLED")
      ? "Отменённый заказ нельзя вернуть в работу"
      : error.message.includes("FORBIDDEN")
        ? "Нет доступа"
        : "Не получилось сменить статус"
    return { ok: false, error: msg }
  }
  revalidatePath("/admin/orders")
  revalidatePath(`/admin/orders/${parsed.data.orderId}`)
  return { ok: true, data: undefined }
}
