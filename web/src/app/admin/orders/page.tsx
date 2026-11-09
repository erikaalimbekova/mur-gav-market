import type { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { ORDER_STATUSES, type OrderStatus } from "@/lib/dictionaries"
import { formatDate, formatPhone, formatPrice } from "@/lib/format"
import type { Order } from "@/lib/types"
import { StatusSelect } from "@/features/admin-orders/status-select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export const metadata: Metadata = { title: "Заказы" }

export default async function AdminOrdersPage(props: PageProps<"/admin/orders">) {
  const { status: raw } = await props.searchParams
  const status = typeof raw === "string" && raw in ORDER_STATUSES ? (raw as OrderStatus) : null
  const supabase = await createClient()
  let q = supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(200)
  if (status) q = q.eq("status", status)
  const { data } = await q
  const orders = (data ?? []) as Order[]
  const tabs: [string, string | null][] = [["Все", null], ...Object.entries(ORDER_STATUSES).map(([k, v]) => [v, k] as [string, string])]

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Заказы</h1>
      <nav className="mt-4 flex flex-wrap gap-2" aria-label="Фильтр по статусу">
        {tabs.map(([label, key]) => (
          <Link key={label} href={key ? `/admin/orders?status=${key}` : "/admin/orders"} aria-current={status === key ? "page" : undefined}
            className={`rounded-full border px-4 py-2 text-sm font-bold ${status === key ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary"}`}>
            {label}
          </Link>
        ))}
      </nav>
      {orders.length === 0 ? (
        <p className="mt-6 rounded-2xl border bg-card p-8 text-center font-bold">Заказов пока нет</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-2xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>№</TableHead><TableHead>Дата</TableHead><TableHead>Покупатель</TableHead><TableHead>Сумма</TableHead><TableHead>Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell><Link href={`/admin/orders/${o.id}`} className="font-extrabold text-primary hover:underline">{o.number}</Link></TableCell>
                  <TableCell className="whitespace-nowrap">{formatDate(o.created_at)}</TableCell>
                  <TableCell>{o.customer_name}<div className="text-xs text-muted-foreground">{formatPhone(o.phone)}</div></TableCell>
                  <TableCell className="font-bold whitespace-nowrap">{formatPrice(o.total)}</TableCell>
                  <TableCell><StatusSelect orderId={o.id} status={o.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
