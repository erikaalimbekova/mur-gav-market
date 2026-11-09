"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { deleteProduct } from "./actions"

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const [open, setOpen] = useState(false)
  const [pending, start] = useTransition()
  const router = useRouter()
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Удалить «${name}»`} className="size-10 text-muted-foreground hover:text-destructive"><Trash2 className="size-5" /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Удалить товар?</DialogTitle>
          <DialogDescription>«{name}» исчезнет из каталога. В старых заказах он останется по названию.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Отмена</Button></DialogClose>
          <Button variant="destructive" disabled={pending} onClick={() => start(async () => {
            const res = await deleteProduct(id)
            if (res.ok) { toast.success("Товар удалён"); setOpen(false); router.refresh() }
            else toast.error(res.error)
          })}>Удалить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
