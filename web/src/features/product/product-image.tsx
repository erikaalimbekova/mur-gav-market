import type { Animal, FoodType } from "@/lib/dictionaries"
import { cn } from "@/lib/utils"

const EMOJI: Record<FoodType, Record<Animal, string>> = {
  dry: { cat: "🥣", dog: "🦴" },
  wet: { cat: "🥫", dog: "🥫" },
  treat: { cat: "🐟", dog: "🍖" },
}

export function ProductImage({
  name,
  imageUrl,
  animal,
  foodType,
  className,
  big,
}: {
  name: string
  imageUrl: string | null
  animal: Animal
  foodType: FoodType
  className?: string
  big?: boolean
}) {
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- фото из Supabase Storage
      <img src={imageUrl} alt={name} className={cn("aspect-square w-full rounded-xl bg-muted object-contain", className)} />
    )
  }
  return (
    <div
      role="img"
      aria-label={name}
      className={cn(
        "relative grid aspect-square w-full place-items-center overflow-hidden rounded-xl",
        animal === "cat" ? "bg-[#FDE6D0]" : "bg-[#E4EED9]",
        className,
      )}
    >
      <span className={big ? "text-[120px]" : "text-6xl"} aria-hidden="true">
        {EMOJI[foodType][animal]}
      </span>
      <span className={cn("absolute right-2 bottom-1", big ? "text-5xl" : "text-2xl")} aria-hidden="true">
        {animal === "cat" ? "🐱" : "🐶"}
      </span>
    </div>
  )
}
