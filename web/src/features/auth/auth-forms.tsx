"use client"

import Link from "next/link"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { login, register, requestPasswordReset, updatePassword, type AuthState } from "./actions"

function Field({ name, label, type = "text", state, autoComplete }: { name: string; label: string; type?: string; state: AuthState; autoComplete?: string }) {
  const err = state?.fieldErrors?.[name]
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} autoComplete={autoComplete} aria-invalid={Boolean(err) || undefined} aria-describedby={err ? `${name}-error` : undefined} className="h-11 rounded-xl bg-card text-base" />
      {err && <p id={`${name}-error`} role="alert" className="text-sm font-semibold text-destructive">{err}</p>}
    </div>
  )
}

function Messages({ state }: { state: AuthState }) {
  return (
    <>
      {state?.error && (
        <Alert variant="destructive"><AlertDescription>{state.error}</AlertDescription></Alert>
      )}
      {state?.message && (
        <Alert className="border-success text-success"><AlertDescription className="text-foreground">{state.message}</AlertDescription></Alert>
      )}
    </>
  )
}

function Submit({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <Button type="submit" disabled={pending} className="h-12 w-full rounded-full text-base font-extrabold hover:bg-primary-hover">
      {pending ? "Подождите…" : children}
    </Button>
  )
}

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(login, undefined)
  return (
    <form action={action} className="space-y-4" noValidate>
      <Messages state={state} />
      <input type="hidden" name="next" value={next ?? ""} />
      <Field name="email" label="Email" type="email" state={state} autoComplete="email" />
      <Field name="password" label="Пароль" type="password" state={state} autoComplete="current-password" />
      <Submit pending={pending}>Войти</Submit>
      <div className="flex justify-between text-sm font-bold">
        <Link href="/reset-password" className="text-muted-foreground hover:text-primary">Забыли пароль?</Link>
        <Link href={next ? `/register?next=${encodeURIComponent(next)}` : "/register"} className="text-primary hover:underline">Регистрация</Link>
      </div>
    </form>
  )
}

export function RegisterForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(register, undefined)
  if (state?.message) return <Messages state={state} />
  return (
    <form action={action} className="space-y-4" noValidate>
      <Messages state={state} />
      <input type="hidden" name="next" value={next ?? ""} />
      <Field name="full_name" label="Имя" state={state} autoComplete="name" />
      <Field name="email" label="Email" type="email" state={state} autoComplete="email" />
      <Field name="password" label="Пароль (не короче 8 символов)" type="password" state={state} autoComplete="new-password" />
      <Submit pending={pending}>Зарегистрироваться</Submit>
      <p className="text-center text-sm font-bold">
        Уже есть аккаунт? <Link href="/login" className="text-primary hover:underline">Войти</Link>
      </p>
    </form>
  )
}

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, undefined)
  return (
    <form action={action} className="space-y-4" noValidate>
      <Messages state={state} />
      <Field name="email" label="Email" type="email" state={state} autoComplete="email" />
      <Submit pending={pending}>Отправить ссылку</Submit>
    </form>
  )
}

export function NewPasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, undefined)
  return (
    <form action={action} className="space-y-4" noValidate>
      <Messages state={state} />
      <Field name="password" label="Новый пароль" type="password" state={state} autoComplete="new-password" />
      <Submit pending={pending}>Сохранить пароль</Submit>
    </form>
  )
}
