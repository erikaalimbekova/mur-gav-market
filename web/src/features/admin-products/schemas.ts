import { z } from "zod"
import { AGES, ANIMALS, FOOD_TYPES, SIZES, keysOf } from "@/lib/dictionaries"

const intField = (msg: string) =>
  z.preprocess((v) => (v === "" || v === null ? NaN : Number(v)), z.number({ message: msg }).int(msg).min(0, "Не меньше 0"))

export const productSchema = z
  .object({
    name: z.string().trim().min(3, "Укажите название").max(150),
    brand_id: z.string().uuid("Выберите бренд"),
    animal: z.enum(keysOf(ANIMALS) as [string, ...string[]], { message: "Выберите животное" }),
    age: z.enum(keysOf(AGES) as [string, ...string[]], { message: "Выберите возраст" }),
    size: z.preprocess((v) => (v === "" ? null : v), z.enum(keysOf(SIZES) as [string, ...string[]]).nullable()),
    food_type: z.enum(keysOf(FOOD_TYPES) as [string, ...string[]], { message: "Выберите тип корма" }),
    weight: z.string().trim().min(1, "Укажите вес").max(30),
    price: intField("Укажите цену целым числом"),
    old_price: z.preprocess((v) => (v === "" || v === null ? null : Number(v)), z.number().int("Целое число").min(0).nullable()),
    stock: intField("Укажите остаток целым числом"),
    description: z.string().trim().max(2000).default(""),
    composition: z.string().trim().max(1000).default(""),
  })
  .transform((d) => ({ ...d, size: d.animal === "dog" ? d.size : null }))
  .refine((d) => d.old_price === null || d.old_price > d.price, { message: "Старая цена должна быть больше цены", path: ["old_price"] })
