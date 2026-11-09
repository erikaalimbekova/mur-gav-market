export function InfoPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="mx-auto mt-8 max-w-3xl rounded-3xl border bg-card p-6 md:p-10">
      <h1 className="text-2xl font-extrabold md:text-3xl">{title}</h1>
      <div className="mt-4 space-y-4 text-[17px] [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-extrabold [&_li]:ml-5 [&_li]:list-disc">
        {children}
      </div>
    </article>
  )
}
