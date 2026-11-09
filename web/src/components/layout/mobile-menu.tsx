"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { NAV_LINKS } from "./nav-links"

export function MobileMenu({ isAdmin }: { isAdmin: boolean }) {
  const [open, setOpen] = useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Меню"
        className="grid size-11 shrink-0 place-items-center rounded-full border bg-card lg:hidden"
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle>Меню</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4 text-lg font-bold">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-2 py-3 hover:bg-muted">
              {l.label}
            </Link>
          ))}
          <Link href="/about" onClick={() => setOpen(false)} className="rounded-lg px-2 py-3 hover:bg-muted">
            О магазине
          </Link>
          {isAdmin && (
            <Link href="/admin" onClick={() => setOpen(false)} className="rounded-lg px-2 py-3 text-primary hover:bg-muted">
              Админка
            </Link>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
