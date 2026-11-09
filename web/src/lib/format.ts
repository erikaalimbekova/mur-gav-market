// AD-5: единственный способ показать сумму
const priceFormatter = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 })

export function formatPrice(value: number): string {
  return `${priceFormatter.format(value).replace(/\s/g, " ")} ₸`
}

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  timeZone: "Asia/Almaty",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})

export function formatDate(value: string): string {
  return dateFormatter.format(new Date(value)).replace(",", "")
}

export function formatPhone(phone: string): string {
  const d = phone.replace(/\D/g, "")
  if (d.length !== 11) return phone
  return `+7 ${d.slice(1, 4)} ${d.slice(4, 7)} ${d.slice(7, 9)} ${d.slice(9, 11)}`
}
