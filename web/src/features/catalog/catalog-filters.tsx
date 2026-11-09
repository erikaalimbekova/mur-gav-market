"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { SlidersHorizontal } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { AGES_BY_ANIMAL, AGES, ANIMALS, FOOD_TYPES, SIZES } from "@/lib/dictionaries"
import type { Brand } from "@/lib/types"

const MULTI = ["age", "size", "type", "brand"] as const

function useCatalogUrl() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  const update = (mutate: (p: URLSearchParams) => void) => {
    const next = new URLSearchParams(params.toString())
    mutate(next)
    next.delete("page")
    router.push(`${pathname}?${next.toString()}`, { scroll: false })
  }

  const list = (key: string) => (params.get(key) ?? "").split(",").filter(Boolean)

  const toggle = (key: (typeof MULTI)[number], value: string) =>
    update((p) => {
      const cur = new Set((p.get(key) ?? "").split(",").filter(Boolean))
      if (cur.has(value)) cur.delete(value)
      else cur.add(value)
      if (cur.size) p.set(key, [...cur].join(","))
      else p.delete(key)
    })

  const set = (key: string, value: string | null) =>
    update((p) => {
      if (value) p.set(key, value)
      else p.delete(key)
      if (key === "animal" && value !== "dog") p.delete("size")
    })

  const setMany = (values: Record<string, string | null>) =>
    update((p) => {
      for (const [k, v] of Object.entries(values)) {
        if (v) p.set(k, v)
        else p.delete(k)
      }
    })

  const reset = () => {
    const q = params.get("q")
    router.push(q ? `${pathname}?q=${encodeURIComponent(q)}` : pathname, { scroll: false })
  }

  const activeCount =
    (params.get("animal") ? 1 : 0) +
    MULTI.reduce((s, k) => s + list(k).length, 0) +
    (params.get("min") ? 1 : 0) +
    (params.get("max") ? 1 : 0) +
    (params.get("sale") ? 1 : 0)

  return { params, list, toggle, set, setMany, reset, activeCount }
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-b pb-4">
      <legend className="mb-2 font-extrabold">{title}</legend>
      <div className="flex flex-col gap-2">{children}</div>
    </fieldset>
  )
}

function CheckRow({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: () => void }) {
  return (
    <label htmlFor={id} className="flex min-h-8 cursor-pointer items-center gap-2.5 font-semibold">
      <Checkbox id={id} checked={checked} onCheckedChange={onChange} className="size-5" />
      {label}
    </label>
  )
}

function FilterFields({ brands, idPrefix }: { brands: Brand[]; idPrefix: string }) {
  const { params, list, toggle, set, setMany } = useCatalogUrl()
  const animal = params.get("animal") as "cat" | "dog" | null
  const ageLabels = animal ? AGES_BY_ANIMAL[animal] : AGES

  return (
    <div className="flex flex-col gap-4">
      <Group title="Животное">
        <div className="flex gap-2">
          {(["cat", "dog"] as const).map((a) => (
            <Button
              key={a}
              type="button"
              variant={animal === a ? "default" : "outline"}
              className="h-10 flex-1 rounded-full font-bold"
              aria-pressed={animal === a}
              onClick={() => set("animal", animal === a ? null : a)}
            >
              {a === "cat" ? "🐱 " : "🐶 "}
              {ANIMALS[a]}
            </Button>
          ))}
        </div>
      </Group>
      <Group title="Возраст">
        {(Object.keys(ageLabels) as (keyof typeof AGES)[]).map((k) => (
          <CheckRow key={k} id={`${idPrefix}-age-${k}`} label={ageLabels[k]} checked={list("age").includes(k)} onChange={() => toggle("age", k)} />
        ))}
      </Group>
      {animal === "dog" && (
        <Group title="Размер собаки">
          {(Object.keys(SIZES) as (keyof typeof SIZES)[]).map((k) => (
            <CheckRow key={k} id={`${idPrefix}-size-${k}`} label={SIZES[k]} checked={list("size").includes(k)} onChange={() => toggle("size", k)} />
          ))}
        </Group>
      )}
      <Group title="Тип корма">
        {(Object.keys(FOOD_TYPES) as (keyof typeof FOOD_TYPES)[]).map((k) => (
          <CheckRow key={k} id={`${idPrefix}-type-${k}`} label={FOOD_TYPES[k]} checked={list("type").includes(k)} onChange={() => toggle("type", k)} />
        ))}
      </Group>
      <Group title="Бренд">
        {brands.map((b) => (
          <CheckRow key={b.id} id={`${idPrefix}-brand-${b.id}`} label={b.name} checked={list("brand").includes(b.id)} onChange={() => toggle("brand", b.id)} />
        ))}
      </Group>
      <Group title="Цена, ₸">
        <form
          key={`${params.get("min")}-${params.get("max")}`}
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            const fd = new FormData(e.currentTarget)
            const min = String(fd.get("min") ?? "").replace(/\D/g, "")
            const max = String(fd.get("max") ?? "").replace(/\D/g, "")
            setMany({ min: min || null, max: max || null })
          }}
        >
          <input name="min" inputMode="numeric" placeholder="от" defaultValue={params.get("min") ?? ""} aria-label="Цена от" className="h-10 w-full rounded-lg border bg-card px-3" />
          <input name="max" inputMode="numeric" placeholder="до" defaultValue={params.get("max") ?? ""} aria-label="Цена до" className="h-10 w-full rounded-lg border bg-card px-3" />
          <Button type="submit" variant="outline" className="h-10 rounded-lg">OK</Button>
        </form>
      </Group>
      <CheckRow id={`${idPrefix}-sale`} label="🔥 Только акции" checked={params.get("sale") === "1"} onChange={() => set("sale", params.get("sale") === "1" ? null : "1")} />
    </div>
  )
}

export function DesktopFilters({ brands }: { brands: Brand[] }) {
  const { reset, activeCount } = useCatalogUrl()
  return (
    <aside className="hidden w-[260px] shrink-0 lg:block" aria-label="Фильтры">
      <div className="sticky top-24 rounded-2xl border bg-card p-4">
        <FilterFields brands={brands} idPrefix="d" />
        {activeCount > 0 && (
          <Button variant="ghost" className="mt-3 w-full" onClick={reset}>
            Сбросить фильтры
          </Button>
        )}
      </div>
    </aside>
  )
}

export function MobileFilters({ brands, total }: { brands: Brand[]; total: number }) {
  const [open, setOpen] = useState(false)
  const { reset, activeCount } = useCatalogUrl()
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="inline-flex h-11 items-center gap-2 rounded-full border bg-card px-4 font-bold lg:hidden">
        <SlidersHorizontal className="size-4" />
        Фильтры{activeCount ? ` (${activeCount})` : ""}
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[85vh] rounded-t-3xl">
        <SheetHeader>
          <SheetTitle>Фильтры</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto px-4">
          <FilterFields brands={brands} idPrefix="m" />
        </div>
        <SheetFooter className="flex-row gap-2">
          {activeCount > 0 && (
            <Button variant="outline" className="h-11 flex-1 rounded-full" onClick={reset}>
              Сбросить
            </Button>
          )}
          <Button className="h-11 flex-1 rounded-full font-extrabold" onClick={() => setOpen(false)}>
            Показать {total} товаров
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function SortSelect() {
  const { params, set } = useCatalogUrl()
  return (
    <label className="flex items-center gap-2 text-sm font-semibold">
      <span className="hidden sm:inline">Сортировка:</span>
      <select
        value={params.get("sort") ?? "popular"}
        onChange={(e) => set("sort", e.target.value === "popular" ? null : e.target.value)}
        className="h-11 rounded-full border bg-card px-4 font-bold"
        aria-label="Сортировка"
      >
        <option value="popular">Популярные</option>
        <option value="cheap">Сначала дешёвые</option>
        <option value="expensive">Сначала дорогие</option>
        <option value="new">Новинки</option>
      </select>
    </label>
  )
}

export function ResetFiltersButton() {
  const { reset } = useCatalogUrl()
  return (
    <Button className="rounded-full font-bold" onClick={reset}>
      Сбросить фильтры
    </Button>
  )
}
