import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { CartProvider } from "@/features/cart/cart-store"
import "./globals.css"

const nunito = Nunito({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700", "800"],
})

export const metadata: Metadata = {
  title: { default: "Мур-Гав Маркет — корма для кошек и собак в Алматы", template: "%s — Мур-Гав Маркет" },
  description: "Интернет-магазин кормов для кошек и собак с доставкой по Алматы. Учебный проект.",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <CartProvider>{children}</CartProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
