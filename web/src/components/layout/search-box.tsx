"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"

export function SearchBox() {
  const router = useRouter()
  const params = useSearchParams()
  return (
    <form
      role="search"
      className="relative"
      onSubmit={(e) => {
        e.preventDefault()
        const q = String(new FormData(e.currentTarget).get("q") ?? "").trim()
        router.push(q ? `/catalog?q=${encodeURIComponent(q)}` : "/catalog")
      }}
    >
      <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        key={params.get("q") ?? ""}
        name="q"
        type="search"
        defaultValue={params.get("q") ?? ""}
        placeholder="Найти корм или бренд"
        aria-label="Поиск"
        onKeyDown={(e) => {
          if (e.key === "Escape") e.currentTarget.value = ""
        }}
        className="h-11 w-full rounded-full border bg-background pr-4 pl-10 outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/30"
      />
    </form>
  )
}
