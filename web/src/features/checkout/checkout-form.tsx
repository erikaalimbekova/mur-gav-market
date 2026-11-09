"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { useCart } from "@/features/cart/cart-store"
import { useCartProducts } from "@/features/cart/use-cart-products"
import { EmptyCart } from "@/features/cart/cart-view"
import { formatPrice } from "@/lib/format"
import { calcDelivery } from "@/lib/pricing"
import { PAYMENT_METHODS } from "@/lib/dictionaries"
import { checkoutSchema } from "./schemas"
import { placeOrder, type StockProblem } from "./actions"

export const LAST_ORDER_KEY = "mg-last-order"

type Defaults = { name: string; phone: string; address: string }

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return <p id={id} className="text-sm font-semibold text-destructive" role="alert">{message}</p>
}

export function CheckoutForm({ defaults }: { defaults: Defaults }) {
  const router = useRouter()
  const { clear } = useCart()
  const { items, subtotal, loading } = useCartProducts()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [problems, setProblems] = useState<StockProblem[]>([])
  const [pending, startTransition] = useTransition()
  const delivery = calcDelivery(subtotal)

  if (loading) return <Skeleton className="mt-6 h-96 w-full rounded-2xl" />
  if (!items.length) return <EmptyCart />

  const validateField = (name: string, value: string) => {
    const shape = checkoutSchema.shape as Record<string, { safeParse: (v: unknown) => { success: boolean; error?: { issues: { message: string }[] } } }>
    const res = shape[name]?.safeParse(value)
    setErrors((e) => {
      const next = { ...e }
      if (res && !res.success) next[name] = res.error!.issues[0].message
      else delete next[name]
      return next
    })
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = Object.fromEntries(new FormData(e.currentTarget))
    const lines = items.map((i) => ({ productId: i.productId, qty: i.qty }))
    startTransition(async () => {
      try {
        const res = await placeOrder(lines, form)
        if (!res.ok) {
          setErrors(res.fieldErrors ?? {})
          setProblems(res.problems ?? [])
          toast.error(res.error)
          return
        }
        try {
          sessionStorage.setItem(
            LAST_ORDER_KEY,
            JSON.stringify({
              ...res.data,
              address: String(form.address),
              payment_method: String(form.payment_method),
              items: items.map((i) => ({ name: i.product.name, qty: i.qty, price: i.product.price })),
            }),
          )
        } catch {}
        clear()
        router.push(`/order/${res.data.number}/success`)
      } catch {
        toast.error("Не получилось связаться с сервером. Попробуйте ещё раз")
      }
    })
  }

  const fieldProps = (name: string) => ({
    name,
    id: name,
    "aria-invalid": Boolean(errors[name]) || undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => validateField(name, e.target.value),
    className: "h-11 rounded-xl bg-card text-base",
  })

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
      <details className="rounded-2xl border bg-card p-4 lg:hidden">
        <summary className="cursor-pointer font-extrabold">
          Ваш заказ: {items.length} поз. · {formatPrice(subtotal + delivery)}
        </summary>
        <OrderSummary items={items} subtotal={subtotal} delivery={delivery} />
      </details>

      <form onSubmit={onSubmit} noValidate className="space-y-5 rounded-2xl border bg-card p-5">
        {problems.length > 0 && (
          <Alert variant="destructive">
            <AlertTitle>Некоторых товаров не хватает на складе</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5">
                {problems.map((p) => {
                  const item = items.find((i) => i.productId === p.product_id)
                  return (
                    <li key={p.product_id}>
                      {item?.product.name ?? "Товар"}: {p.available > 0 ? `доступно ${p.available} шт.` : "закончился"}
                    </li>
                  )
                })}
              </ul>
              <Link href="/cart" className="mt-2 inline-block font-bold underline">Исправить в корзине</Link>
            </AlertDescription>
          </Alert>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="name">Имя</Label>
          <Input {...fieldProps("name")} defaultValue={defaults.name} autoComplete="name" />
          <FieldError id="name-error" message={errors.name} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Телефон</Label>
          <Input {...fieldProps("phone")} defaultValue={defaults.phone} type="tel" inputMode="tel" autoComplete="tel" placeholder="+7 777 123 45 67" />
          <FieldError id="phone-error" message={errors.phone} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="address">Адрес в Алматы</Label>
          <Input {...fieldProps("address")} defaultValue={defaults.address} autoComplete="street-address" placeholder="ул. Абая, 10, кв. 5" />
          <FieldError id="address-error" message={errors.address} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="comment">Комментарий (необязательно)</Label>
          <Textarea {...fieldProps("comment")} className="min-h-20 rounded-xl bg-card text-base" placeholder="Например: позвоните за час" />
          <FieldError id="comment-error" message={errors.comment} />
        </div>
        <fieldset className="space-y-2">
          <legend className="mb-1.5 text-sm font-medium">Способ оплаты</legend>
          <RadioGroup name="payment_method" defaultValue="cash" className="gap-2">
            {(Object.keys(PAYMENT_METHODS) as (keyof typeof PAYMENT_METHODS)[]).map((k) => (
              <label key={k} htmlFor={`pm-${k}`} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-3 font-semibold has-data-[state=checked]:border-primary">
                <RadioGroupItem value={k} id={`pm-${k}`} />
                {PAYMENT_METHODS[k]}
              </label>
            ))}
          </RadioGroup>
          <FieldError id="payment_method-error" message={errors.payment_method} />
        </fieldset>
        <p className="text-sm text-muted-foreground">Доставляем только по Алматы. Онлайн-оплаты нет — платите при получении.</p>
        <Button type="submit" disabled={pending} className="h-12 w-full rounded-full text-base font-extrabold hover:bg-primary-hover">
          {pending ? "Оформляем…" : `Оформить заказ на ${formatPrice(subtotal + delivery)}`}
        </Button>
      </form>

      <aside className="hidden h-fit rounded-2xl border bg-card p-5 lg:sticky lg:top-24 lg:block">
        <h2 className="text-lg font-extrabold">Ваш заказ</h2>
        <OrderSummary items={items} subtotal={subtotal} delivery={delivery} />
      </aside>
    </div>
  )
}

function OrderSummary({
  items,
  subtotal,
  delivery,
}: {
  items: { productId: string; qty: number; product: { name: string; price: number } }[]
  subtotal: number
  delivery: number
}) {
  return (
    <div className="mt-3 space-y-3">
      <ul className="space-y-2 text-sm">
        {items.map((i) => (
          <li key={i.productId} className="flex justify-between gap-3">
            <span>{i.product.name} × {i.qty}</span>
            <span className="shrink-0 font-bold">{formatPrice(i.product.price * i.qty)}</span>
          </li>
        ))}
      </ul>
      <dl className="space-y-1 border-t pt-3">
        <div className="flex justify-between"><dt>Товары</dt><dd className="font-bold">{formatPrice(subtotal)}</dd></div>
        <div className="flex justify-between"><dt>Доставка</dt><dd className="font-bold">{delivery ? formatPrice(delivery) : "бесплатно"}</dd></div>
        <div className="flex justify-between text-lg font-extrabold"><dt>Итого</dt><dd>{formatPrice(subtotal + delivery)}</dd></div>
      </dl>
    </div>
  )
}
