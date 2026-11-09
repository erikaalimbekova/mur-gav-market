"use client"

import { useActionState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateProfile } from "./actions"

export function ProfileForm({ defaults }: { defaults: { full_name: string; phone: string; address: string } }) {
  const [state, action, pending] = useActionState(updateProfile, undefined)
  useEffect(() => {
    if (state?.ok) toast.success("Профиль сохранён")
    if (state?.error) toast.error(state.error)
  }, [state])

  const field = (name: keyof typeof defaults, label: string, props: React.ComponentProps<"input"> = {}) => {
    const err = state?.fieldErrors?.[name]
    return (
      <div className="space-y-1.5">
        <Label htmlFor={name}>{label}</Label>
        <Input id={name} name={name} defaultValue={defaults[name]} aria-invalid={Boolean(err) || undefined} aria-describedby={err ? `${name}-error` : undefined} className="h-11 rounded-xl bg-card text-base" {...props} />
        {err && <p id={`${name}-error`} role="alert" className="text-sm font-semibold text-destructive">{err}</p>}
      </div>
    )
  }

  return (
    <form action={action} className="space-y-4" noValidate>
      {field("full_name", "Имя", { autoComplete: "name" })}
      {field("phone", "Телефон", { type: "tel", placeholder: "+7 777 123 45 67", autoComplete: "tel" })}
      {field("address", "Адрес доставки по умолчанию", { placeholder: "ул. Абая, 10, кв. 5", autoComplete: "street-address" })}
      <Button type="submit" disabled={pending} className="h-11 rounded-full px-8 font-extrabold hover:bg-primary-hover">
        {pending ? "Сохраняем…" : "Сохранить"}
      </Button>
    </form>
  )
}
