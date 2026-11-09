export function AuthCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto mt-10 max-w-md rounded-3xl border bg-card p-6 md:p-8">
      <h1 className="mb-5 text-2xl font-extrabold">{title}</h1>
      {children}
    </div>
  )
}
