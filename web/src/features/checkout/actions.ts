"use server"

import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import type { ActionResult } from "@/lib/types"
import { cartLinesSchema, checkoutSchema } from "./schemas"

export type PlacedOrder = { id: string; number: number; subtotal: number; delivery_fee: number; total: number }
export type StockProblem = { product_id: string; available: number }

export async function placeOrder(
  lines: unknown,
  form: unknown,
): Promise<ActionResult<PlacedOrder> & { problems?: StockProblem[] }> {
  const parsedLines = cartLinesSchema.safeParse(lines)
  if (!parsedLines.success) return { ok: false, error: "Корзина пуста" }

  const parsedForm = checkoutSchema.safeParse(form)
  if (!parsedForm.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsedForm.error.issues) {
      const key = String(issue.path[0])
      fieldErrors[key] ??= issue.message
    }
    return { ok: false, error: "Проверьте поля формы", fieldErrors }
  }

  // Объединяем повторяющиеся товары
  const merged = new Map<string, number>()
  for (const l of parsedLines.data) merged.set(l.productId, (merged.get(l.productId) ?? 0) + l.qty)
  const items = [...merged].map(([productId, qty]) => ({ productId, qty }))

  const supabase = await createClient()
  // AD-2: заказ создаёт только функция базы
  const { data, error } = await supabase.rpc("place_order", { items, contact: parsedForm.data })
  if (error) {
    return { ok: false, error: "Не получилось оформить заказ. Попробуйте ещё раз." }
  }

  const result = z
    .union([
      z.object({ ok: z.literal(true), id: z.string(), number: z.number(), subtotal: z.number(), delivery_fee: z.number(), total: z.number() }),
      z.object({ ok: z.literal(false), problems: z.array(z.object({ product_id: z.string(), available: z.number() })) }),
    ])
    .safeParse(data)

  if (!result.success) return { ok: false, error: "Не получилось оформить заказ. Попробуйте ещё раз." }
  if (!result.data.ok) {
    return { ok: false, error: "Некоторых товаров не хватает на складе", problems: result.data.problems }
  }
  const { id, number, subtotal, delivery_fee, total } = result.data
  return { ok: true, data: { id, number, subtotal, delivery_fee, total } }
}
