import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TypewriterLine } from '@/components/home/typewriter-line'

export default async function Home() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) redirect('/today')

  const year = new Date().getFullYear()

  return (
    <main className="h-screen flex flex-col bg-stone-50 folio-paper-grain overflow-hidden">
      <header className="px-8 py-6 font-mono text-sm">
        <span className="text-stone-700">folio</span>
      </header>

      <section className="flex-1 flex items-center justify-center px-6 -mt-12">
        <TypewriterLine ctaHref="/login" />
      </section>

      <footer className="px-6 sm:px-8 py-6 font-mono text-xs text-stone-400">
        <div className="mx-auto max-w-4xl flex flex-col sm:flex-row sm:flex-wrap items-center sm:justify-between gap-3 text-center">
          <span>made quietly · {year}</span>
          <div className="space-x-3">
            <Link href="/about" className="hover:text-stone-700 transition">
              about
            </Link>
            <span aria-hidden>·</span>
            <a
              href="mailto:ducanhaof272@gmail.com"
              className="hover:text-stone-700 transition"
            >
              contact
            </a>
            <span aria-hidden>·</span>
            <Link href="/legal/privacy" className="hover:text-stone-700 transition">
              privacy
            </Link>
            <span aria-hidden>·</span>
            <Link href="/legal/terms" className="hover:text-stone-700 transition">
              terms
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
