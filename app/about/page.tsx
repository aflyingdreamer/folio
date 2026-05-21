import Link from 'next/link'

export const metadata = { title: 'About · Mornings' }

export default function About() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 sm:py-24 font-serif text-stone-700 leading-relaxed">
      <header className="mb-12 font-mono text-sm">
        <Link href="/" className="text-stone-500 hover:text-stone-900 transition">
          ← mornings
        </Link>
      </header>

      <h1 className="font-serif text-2xl sm:text-3xl text-stone-900 mb-8">About</h1>

      <div className="space-y-6 text-stone-600">
        <p className="text-balance">
          A quiet tribute to morning pages — the practice from
          Julia Cameron&apos;s <em>The Artist&apos;s Way</em> and
          Buster Benson&apos;s{' '}
          <a
            href="https://750words.com"
            className="underline underline-offset-4 decoration-stone-300 hover:decoration-stone-900"
            target="_blank"
            rel="noreferrer"
          >
            750words.com
          </a>
          .
        </p>
        <p className="text-balance">
          Mornings is a small, calm web app for the daily writing
          ritual: open the page, write 750 words, archive, close
          the tab. No streaks, no AI coach, no feed. The ritual is
          free, forever; Pro unlocks a year-end recap.
        </p>
        <p className="text-balance">
          Built solo in evenings. Next.js, Supabase, Vercel,
          Stripe. Shipped May 2026.
        </p>
      </div>

      <p className="mt-12 text-stone-500 text-balance">
        If this is part of your mornings, you can{' '}
        <a
          href="https://ko-fi.com/brianfolio"
          className="underline underline-offset-4 decoration-stone-300 hover:decoration-stone-900"
          target="_blank"
          rel="noreferrer"
        >
          leave a tip
        </a>
        .
      </p>
    </main>
  )
}
