import Link from 'next/link'

export const metadata = { title: 'Terms · Folio' }

export default function Terms() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24 font-serif text-stone-700 leading-relaxed">
      <header className="mb-12 font-mono text-sm">
        <Link href="/" className="text-stone-500 hover:text-stone-900 transition">
          ← folio
        </Link>
      </header>
      <h1 className="font-serif text-3xl text-stone-900 mb-8">Terms</h1>
      <p className="text-balance">
        Folio is a small writing space, free forever for the daily
        ritual. Use it kindly. The service is provided as-is; we make
        no guarantees of uptime or data permanence — though we try.
      </p>
      <p className="mt-6 text-balance text-stone-500">
        Questions:{' '}
        <a
          href="mailto:ducanhaof272@gmail.com"
          className="underline underline-offset-4 decoration-stone-300 hover:decoration-stone-900"
        >
          ducanhaof272@gmail.com
        </a>
        .
      </p>
    </main>
  )
}
