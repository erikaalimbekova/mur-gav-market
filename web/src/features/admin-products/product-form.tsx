"use client"

import Link from "next/link"
import { useActionState, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AGES, ANIMALS, FOOD_TYPES, SIZES } from "@/lib/dictionaries"
import type { Brand, Product } from "@/lib/types"
import { saveProduct } from "./actions"

const selectCls = "h-11 w-full rounded-xl border bg-card px-3 text-base"

export function ProductForm({ product, brands }: { product?: Product; brands: Brand[] }) {
  const [state, action, pending] = useActionState(saveProduct, undefined)
  const [animal, setAnimal] = useState(product?.animal ?? "cat")
  const [preview, setPreview] = useState<string | null>(product?.image_url ?? null)
  const err = (k: string) => state?.fieldErrors?.[k]
  const errEl = (k: string) => (err(k) ? <p role="alert" className="text-sm font-semibold text-destructive">{err(k)}</p> : null)

  return (
    <form action={action} className="grid gap-5 rounded-2xl border bg-card p-5 md:grid-cols-2" noValidate>
      {state?.error && (
        <Alert variant="destructive" className="md:col-span-2"><AlertDescription>{state.error}</AlertDescription></Alert>
      )}
      <input type="hidden" name="id" value={product?.id ?? ""} />
      <div className="space-y-1.5 md:col-span-2">
        <Label htmlFor="name">Название</Label>
        <Input id="name" name="name" defaultValue={product?.name} className="h-11 rounded-xl text-base" />
        {errEl("name")}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="brand_id">Бренд</Label>
        <select id="brand_id" name="brand_id" defaultValue={product?.brand_id ?? ""} className={selectCls}>
          <option value="" disabled>Выберите бренд</option>
          {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        {errEl("brand_id")}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="animal">Животное</Label>
        <select id="animal" name="animal" value={animal} onChange={(e) => setAnimal(e.target.value as "cat" | "dog")} className={selectCls}>
          {Object.entries(ANIMALS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="age">Возраст</Label>
        <select id="age" name="age" defaultValue={product?.age ?? "adult"} className={selectCls}>
          {Object.entries(AGES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="size">Размер собаки</Label>
        <select id="size" name="size" defaultValue={product?.size ?? ""} disabled={animal !== "dog"} className={`${selectCls} disabled:opacity-50`}>
          <option value="">—</option>
          {Object.entries(SIZES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="food_type">Тип корма</Label>
        <select id="food_type" name="food_type" defaultValue={product?.food_type ?? "dry"} className={selectCls}>
          {Object.entries(FOOD_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="weight">Вес / объём</Label>
        <Input id="weight" name="weight" defaultValue={product?.weight} placeholder="1,5 кг" className="h-11 rounded-xl text-base" />
        {errEl("weight")}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="price">Цена, ₸</Label>
        <Input id="price" name="price" inputMode="numeric" defaultValue={product?.price} className="h-11 rounded-xl text-base" />
        {errEl("price")}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="old_price">Старая цена, ₸ (для акции)</Label>
        <Input id="old_price" name="old_price" inputMode="numeric" defaultValue={product?.old_price ?? ""} className="h-11 rounded-xl text-base" />
        {errEl("old_price")}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="stock">Остаток, шт.</Label>
        <Input id="stock" name="stock" inputMode="numeric" defaultValue={product?.stock ?? 0} className="h-11 rounded-xl text-base" />
        {errEl("stock")}
      </div>
      <div className="space-y-1.5 md:col-span-2">
        <Label htmlFor="description">Описание</Label>
        <Textarea id="description" name="description" defaultValue={product?.description} className="min-h-24 rounded-xl text-base" />
      </div>
      <div className="space-y-1.5 md:col-span-2">
        <Label htmlFor="composition">Состав</Label>
        <Textarea id="composition" name="composition" defaultValue={product?.composition} className="min-h-20 rounded-xl text-base" />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="image">Фото (до 3 МБ)</Label>
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element -- превью выбранного файла
          <img src={preview} alt="Превью" className="size-32 rounded-xl border object-contain" />
        )}
        <Input id="image" name="image" type="file" accept="image/*" className="h-11 rounded-xl" onChange={(e) => {
          const f = e.target.files?.[0]
          setPreview(f ? URL.createObjectURL(f) : product?.image_url ?? null)
        }} />
        {product?.image_url && (
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="remove_image" /> Удалить текущее фото</label>
        )}
        {errEl("image")}
      </div>
      <div className="flex gap-3 md:col-span-2">
        <Button type="submit" disabled={pending} className="h-11 rounded-full px-8 font-extrabold hover:bg-primary-hover">
          {pending ? "Сохраняем…" : "Сохранить"}
        </Button>
        <Button asChild variant="outline" className="h-11 rounded-full px-6"><Link href="/admin/products">Отмена</Link></Button>
      </div>
    </form>
  )
}
