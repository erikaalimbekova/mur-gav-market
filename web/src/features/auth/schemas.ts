import { z } from "zod"

export const emailSchema = z.string().trim().toLowerCase().email("Введите корректный email")
export const passwordSchema = z.string().min(8, "Пароль — не короче 8 символов").max(72, "Слишком длинный пароль")

export const loginSchema = z.object({ email: emailSchema, password: z.string().min(1, "Введите пароль") })
export const registerSchema = z.object({
  full_name: z.string().trim().min(2, "Укажите имя").max(80),
  email: emailSchema,
  password: passwordSchema,
})
