"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { CheckCircle2 } from "lucide-react"
import { formatPrice } from "@/lib/format"
import { PAYMENT_METHODS, type PaymentMethod } from "@/lib/dictionaries"
import { LAST_ORDER_KEY } from "./checkout-form"

type Saved = {
  number: number
  subtotal: number
  delivery_fee: number
  total: number
  address: string
  payment_method: PaymentMethod
  items: { name: string; qty: number; price: number }[]
}

export function OrderSuccess({ number }: { number: number }) {
  const [order, setOrder] = useState<Saved | null>(null)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(LAST_ORDER_KEY)
      const parsed = raw ? (JSON.parse(raw) as Saved) : null
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sessionStorage доступен только в браузере
      if (parsed?.number === number) setOrder(parsed)
    } catch {}
  }, [number])

  return (
    <div className="mx-auto mt-10 max-w-xl rounded-3xl border bg-card p-6 text-center md:p-10">
      <CheckCircle2 className="mx-auto size-16 text-success" aria-hidden="true" />
      <h1 className="mt-3 text-2xl font-extrabold md:text-3xl">Заказ №{number} принят!</h1>
      <p className="mt-2 text-muted-foreground">Скоро позвоним, чтобы уточнить время доставки.</p>
      {order && (
        <div className="mt-6 space-y-3 text-left">
          <ul className="space-y-1.5">
            {order.items.map((i) => (
              <li key={i.name} className="flex justify-between gap-3">
                <span>{i.name} × {i.qty}</span>
                <span className="shrink-0 font-bold">{formatPrice(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="space-y-1 border-t pt-3">
            <div className="flex justify-between"><dt>Доставка</dt><dd className="font-bold">{order.delivery_fee ? formatPrice(order.delivery_fee) : "бесплатно"}</dd></div>
            <div className="flex justify-between text-lg font-extrabold"><dt>Итого</dt><dd>{formatPrice(order.total)}</dd></div>
            <div className="flex justify-between gap-3"><dt>Адрес</dt><dd className="text-right font-bold">{order.address}</dd></div>
            <div className="flex justify-between gap-3"><dt>Оплата</dt><dd className="text-right font-bold">{PAYMENT_METHODS[order.payment_method]}</dd></div>
          </dl>
        </div>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/catalog" className="inline-flex h-11 items-center rounded-full bg-primary px-6 font-extrabold text-primary-foreground hover:bg-primary-hover">
          Продолжить покупки
        </Link>
        <Link href="/account/orders" className="inline-flex h-11 items-center rounded-full border px-6 font-bold hover:border-primary">
          Мои заказы
        </Link>
      </div>
    </div>
  )
}
