import { z } from "zod"

export function normalizePhone(input: string): string {
  let d = input.replace(/\D/g, "")
  if (d.length === 11 && d.startsWith("8")) d = "7" + d.slice(1)
  if (d.length === 10) d = "7" + d
  return d.length === 11 && d.startsWith("7") ? `+${d}` : input.trim()
}

export const phoneSchema = z
  .string()
  .transform(normalizePhone)
  .refine((v) => /^\+7\d{10}$/.test(v), "Введите телефон в формате +7 777 123 45 67")

export const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Укажите имя").max(80, "Слишком длинное имя"),
  phone: phoneSchema,
  address: z.string().trim().min(5, "Укажите адрес: улица, дом, квартира").max(200, "Слишком длинный адрес"),
  comment: z.string().trim().max(500, "Не больше 500 символов").optional().default(""),
  payment_method: z.enum(["cash", "card_on_delivery"], { message: "Выберите способ оплаты" }),
})

export const cartLinesSchema = z
  .array(z.object({ productId: z.string().uuid(), qty: z.number().int().min(1).max(999) }))
  .min(1, "Корзина пуста")
  .max(100)

export type CheckoutInput = z.infer<typeof checkoutSchema>
