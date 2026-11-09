// AD-5: должно совпадать с таблицей settings в базе
export const FREE_DELIVERY_THRESHOLD = 12000
export const DELIVERY_FEE = 1000

export function calcDelivery(subtotal: number): number {
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
}
