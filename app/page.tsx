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
    <main className="min-h-screen flex flex-col bg-stone-50 folio-paper-grain">
      <header className="px-8 py-6 font-mono text-sm">
        <span className="text-stone-700">folio</span>
      </header>

      <section className="flex-1 flex items-center justify-center px-6 -mt-12">
        <TypewriterLine ctaHref="/login" />
      </section>

      <section className="px-8 py-24 border-t border-stone-200/70">
        <div className="mx-auto max-w-2xl font-serif text-stone-600 leading-relaxed space-y-6">
          <p className="text-balance">
            Hi, I&apos;m Brian — just a regular IT guy trying to keep
            my head above water in the AI era. Most of my days are
            loud: notifications, models, dashboards, more tabs than
            I&apos;d like to admit. I made Folio for the opposite
            reason — a small, quiet room on the internet where the
            only thing asked of you is to show up and write.
          </p>
          <p className="text-balance">
            I started writing morning pages on paper, then on{' '}
            <a
              href="https://750words.com"
              className="underline underline-offset-4 decoration-stone-300 hover:decoration-stone-900"
              target="_blank"
              rel="noreferrer"
            >
              750words.com
            </a>
            , and it changed how my mornings felt. Folio is my
            tribute to that ritual — to Julia Cameron, who named it,
            and to Buster Benson, who first put it online.
          </p>
          <p className="text-balance">
            There are no streaks to defend, no likes to chase, no
            algorithm watching. Just a page that waits for you each
            morning, and forgets about you the rest of the day. If
            that sounds like something you&apos;ve been looking for,
            you&apos;re in the right place. The ritual is free, forever.
          </p>
        </div>
      </section>

      <footer className="px-8 py-12 border-t border-stone-200/70 font-mono text-xs text-stone-400">
        <div className="mx-auto max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-6">
          <div className="space-y-2">
            <p className="font-serif text-base text-stone-700">Folio</p>
            <p>made quietly · {year}</p>
          </div>
          <div className="sm:text-right space-y-3">
            <div className="leading-relaxed">
              <p>a tribute</p>
              <p>to morning pages by Julia Cameron</p>
              <p>and to 750words.com by Buster Benson</p>
            </div>
            <div className="space-x-3">
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
        </div>
      </footer>
    </main>
  )
}
