import type { Metadata } from "next"
import { getCurrentUser } from "@/lib/supabase/server"
import { CheckoutForm } from "@/features/checkout/checkout-form"
import { formatPhone } from "@/lib/format"

export const metadata: Metadata = { title: "Оформление заказа" }

export default async function CheckoutPage() {
  const user = await getCurrentUser()
  const p = user?.profile
  return (
    <div className="mt-6">
      <h1 className="text-2xl font-extrabold md:text-3xl">Оформление заказа</h1>
      {!user && (
        <p className="mt-1 text-muted-foreground">
          Можно без регистрации. <a href="/login?next=/checkout" className="font-bold text-primary hover:underline">Войдите</a>, чтобы заказ сохранился в истории.
        </p>
      )}
      <CheckoutForm defaults={{ name: p?.full_name ?? "", phone: p?.phone ? formatPhone(p.phone) : "", address: p?.address ?? "" }} />
    </div>
  )
}
