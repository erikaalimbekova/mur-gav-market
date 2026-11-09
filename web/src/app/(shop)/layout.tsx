import { Suspense } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function ShopLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Suspense fallback={<div className="h-[120px]" />}>
        <Header />
      </Suspense>
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 lg:px-6">{children}</main>
      <Footer />
    </>
  )
}
