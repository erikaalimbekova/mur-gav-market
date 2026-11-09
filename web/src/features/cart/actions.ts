"use server"

import { getProductsByIds } from "@/features/catalog/queries"

// AD-4: корзина получает актуальные цены и остатки из базы
export async function loadCartProducts(ids: string[]) {
  return getProductsByIds(ids.slice(0, 100))
}
