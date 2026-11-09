import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import type { Order, OrderItem } from "@/lib/types"

export async function getMyOrders(userId: string): Promise<Order[]> {
  const supabase = await createClient()
  const { data } = await supabase.from("orders").select("*").eq("user_id", userId).order("created_at", { ascending: false })
  return (data ?? []) as Order[]
}

// RLS (AD-3) гарантирует, что чужой заказ не вернётся
export async function getOrderWithItems(id: string): Promise<{ order: Order; items: OrderItem[] } | null> {
  if (!z.string().uuid().safeParse(id).success) return null
  const supabase = await createClient()
  const { data: order } = await supabase.from("orders").select("*").eq("id", id).maybeSingle()
  if (!order) return null
  const { data: items } = await supabase.from("order_items").select("*").eq("order_id", id)
  return { order: order as Order, items: (items ?? []) as OrderItem[] }
}
