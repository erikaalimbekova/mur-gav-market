// AD-7: значения совпадают с enum в базе
export const ANIMALS = { cat: "Кошки", dog: "Собаки" } as const
export const AGES = { baby: "Детёныш", adult: "Взрослый", senior: "Пожилой" } as const
export const AGES_BY_ANIMAL = {
  cat: { baby: "Котёнок", adult: "Взрослая", senior: "Пожилая" },
  dog: { baby: "Щенок", adult: "Взрослая", senior: "Пожилая" },
} as const
export const SIZES = { small: "Мелкий", medium: "Средний", large: "Крупный" } as const
export const FOOD_TYPES = { dry: "Сухой", wet: "Влажный", treat: "Лакомство" } as const
export const ORDER_STATUSES = {
  new: "Новый",
  processing: "В работе",
  delivered: "Доставлен",
  cancelled: "Отменён",
} as const
export const PAYMENT_METHODS = {
  cash: "Наличными при получении",
  card_on_delivery: "Картой курьеру",
} as const

export type Animal = keyof typeof ANIMALS
export type Age = keyof typeof AGES
export type Size = keyof typeof SIZES
export type FoodType = keyof typeof FOOD_TYPES
export type OrderStatus = keyof typeof ORDER_STATUSES
export type PaymentMethod = keyof typeof PAYMENT_METHODS

export function keysOf<T extends object>(o: T) {
  return Object.keys(o) as (keyof T)[]
}
