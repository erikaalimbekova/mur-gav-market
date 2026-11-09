import type { Age, Animal, FoodType, OrderStatus, PaymentMethod, Size } from "./dictionaries"

export type Brand = { id: string; name: string }

export type Product = {
  id: string
  name: string
  brand_id: string
  brand?: { name: string } | null
  animal: Animal
  age: Age
  size: Size | null
  food_type: FoodType
  weight: string
  price: number
  old_price: number | null
  stock: number
  description: string
  composition: string
  image_url: string | null
  popularity: number
  created_at: string
}

export type Order = {
  id: string
  number: number
  user_id: string | null
  status: OrderStatus
  customer_name: string
  phone: string
  address: string
  comment: string | null
  payment_method: PaymentMethod
  subtotal: number
  delivery_fee: number
  total: number
  created_at: string
}

export type OrderItem = {
  id: string
  product_id: string | null
  product_name: string
  unit_price: number
  qty: number
}

export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string> }
