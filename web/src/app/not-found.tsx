import Link from "next/link"

export default function NotFound() {
  return (
    <main className="grid flex-1 place-items-center px-4 py-20 text-center">
      <div>
        <div className="text-7xl" aria-hidden="true">🐶</div>
        <h1 className="mt-4 text-3xl font-extrabold">Страница убежала за мячиком</h1>
        <p className="mt-2 text-muted-foreground">Такой страницы нет. Возможно, ссылка устарела.</p>
        <Link href="/" className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-6 font-extrabold text-primary-foreground hover:bg-primary-hover">
          На главную
        </Link>
      </div>
    </main>
  )
}
