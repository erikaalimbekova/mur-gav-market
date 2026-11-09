"use client"

import { useEffect, useState } from "react"
import type { Product } from "@/lib/types"
import { useCart } from "./cart-store"
import { loadCartProducts } from "./actions"

export function useCartProducts() {
  const { lines, ready } = useCart()
  const [products, setProducts] = useState<Record<string, Product>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const idsKey = lines.map((l) => l.productId).sort().join(",")

  useEffect(() => {
    if (!ready) return
    let cancelled = false
    const ids = idsKey ? idsKey.split(",") : []
    if (!ids.length) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- пустая корзина не требует запроса
      setProducts({})
      setLoading(false)
      return
    }
    setLoading(true)
    loadCartProducts(ids)
      .then((list) => {
        if (cancelled) return
        setProducts(Object.fromEntries(list.map((p) => [p.id, p])))
        setError(false)
      })
      .catch(() => !cancelled && setError(true))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [idsKey, ready])

  const items = lines
    .map((l) => ({ ...l, product: products[l.productId] }))
    .filter((i): i is typeof i & { product: Product } => Boolean(i.product))
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0)

  return { items, subtotal, loading: loading || !ready, error, lines }
}
