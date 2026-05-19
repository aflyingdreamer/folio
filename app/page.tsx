import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) redirect('/today')

  const ctaHref = '/login'
  const ctaLabel = 'start writing'

  return (
    <main className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-8 py-6 font-mono text-sm">
        <span className="font-serif text-xl text-stone-900">Folio</span>
        <Link
          href={ctaHref}
          className="text-stone-700 hover:text-stone-900 underline underline-offset-4 decoration-stone-300 hover:decoration-stone-900 transition"
        >
          {ctaLabel}
        </Link>
      </header>

      <section className="flex-1 flex items-center">
        <div className="mx-auto max-w-2xl px-8 -mt-16">
          <h1 className="font-serif text-5xl sm:text-6xl text-stone-900 leading-tight text-balance">
            Wake.<br />
            Write three pages.<br />
            <span className="text-stone-400">Close the tab.</span>
          </h1>
          <p className="font-serif text-xl text-stone-600 leading-relaxed mt-10 max-w-lg text-balance">
            A quiet daily writing space. No streaks, no badges,
            no audience. Just you, the page, and tomorrow.
          </p>
          <div className="mt-12 font-mono text-sm">
            <Link
              href={ctaHref}
              className="inline-block border border-stone-900 py-3 px-6 hover:bg-stone-900 hover:text-stone-50 transition"
            >
              {ctaLabel} →
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-stone-200 px-8 py-16">
        <div className="mx-auto max-w-2xl font-serif text-stone-600 leading-relaxed space-y-6">
          <p className="text-balance">
            In 1992, Julia Cameron asked her readers to fill three
            longhand pages every morning — unedited, unread, for no
            one but themselves. She called them <em>morning pages</em>.
          </p>
          <p className="text-balance">
            In 2009, Buster Benson built{' '}
            <a
              href="https://750words.com"
              className="underline underline-offset-4 decoration-stone-300 hover:decoration-stone-900"
              target="_blank"
              rel="noreferrer"
            >
              750words.com
            </a>{' '}
            so people could do the same thing on a screen, privately,
            every day. It's still running.
          </p>
          <p className="text-balance">
            Folio is a small tribute to both. The ritual is free,
            forever.
          </p>
        </div>
      </section>

      <footer className="px-8 py-10 font-mono text-xs text-stone-400 text-center border-t border-stone-200">
        made quietly · {new Date().getFullYear()}
      </footer>
    </main>
  )
}
