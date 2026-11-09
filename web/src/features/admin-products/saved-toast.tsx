"use client"

import { useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

export function SavedToast() {
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  useEffect(() => {
    if (params.get("saved") === "1") {
      toast.success("Товар сохранён")
      router.replace(pathname)
    }
  }, [params, router, pathname])
  return null
}
