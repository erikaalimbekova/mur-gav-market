import Link from "next/link"

export function PawIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className} fill="currentColor">
      <ellipse cx="32" cy="42" rx="14" ry="12" />
      <ellipse cx="14" cy="28" rx="6" ry="8" />
      <ellipse cx="50" cy="28" rx="6" ry="8" />
      <ellipse cx="24" cy="14" rx="6" ry="8" />
      <ellipse cx="40" cy="14" rx="6" ry="8" />
    </svg>
  )
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-lg font-extrabold whitespace-nowrap sm:text-xl">
      <PawIcon className="size-8 text-primary" />
      Мур-Гав Маркет
    </Link>
  )
}
