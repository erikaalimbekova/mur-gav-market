"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Brand } from "@/lib/types"
import { addBrand, removeBrand, renameBrand } from "./actions"

export function BrandsManager({ brands }: { brands: (Brand & { products: number })[] }) {
  const [pending, start] = useTransition()
  const [editing, setEditing] = useState<string | null>(null)
  const run = (fn: () => Promise<{ ok: boolean; error?: string }>, okMsg: string, after?: () => void) =>
    start(async () => {
      const res = await fn()
      if (res.ok) { toast.success(okMsg); after?.() } else toast.error(res.error)
    })

  return (
    <div className="space-y-4">
      <form className="flex gap-2 rounded-2xl border bg-card p-4" onSubmit={(e) => {
        e.preventDefault()
        const form = e.currentTarget
        const name = String(new FormData(form).get("name") ?? "")
        run(() => addBrand(name), "Бренд добавлен", () => form.reset())
      }}>
        <Input name="name" placeholder="Новый бренд" aria-label="Название нового бренда" className="h-11 rounded-xl text-base" />
        <Button type="submit" disabled={pending} className="h-11 rounded-full px-6 font-extrabold">Добавить</Button>
      </form>
      <ul className="divide-y rounded-2xl border bg-card">
        {brands.map((b) => (
          <li key={b.id} className="flex flex-wrap items-center gap-3 p-3">
            {editing === b.id ? (
              <form className="flex flex-1 gap-2" onSubmit={(e) => {
                e.preventDefault()
                const name = String(new FormData(e.currentTarget).get("name") ?? "")
                run(() => renameBrand(b.id, name), "Бренд переименован", () => setEditing(null))
              }}>
                <Input name="name" defaultValue={b.name} autoFocus aria-label="Новое название" className="h-10 rounded-xl" />
                <Button type="submit" disabled={pending} className="h-10 rounded-full">Сохранить</Button>
                <Button type="button" variant="outline" className="h-10 rounded-full" onClick={() => setEditing(null)}>Отмена</Button>
              </form>
            ) : (
              <>
                <span className="flex-1 font-bold">{b.name} <span className="font-normal text-muted-foreground">· товаров: {b.products}</span></span>
                <Button variant="outline" className="h-9 rounded-full" onClick={() => setEditing(b.id)}>Переименовать</Button>
                <Button variant="ghost" className="h-9 rounded-full text-destructive" disabled={pending || b.products > 0} title={b.products > 0 ? "У бренда есть товары" : undefined}
                  onClick={() => confirm(`Удалить бренд «${b.name}»?`) && run(() => removeBrand(b.id), "Бренд удалён")}>
                  Удалить
                </Button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
