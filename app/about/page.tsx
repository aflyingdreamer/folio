import Link from 'next/link'
import Script from 'next/script'

export const metadata = { title: 'About · Folio' }

export default function About() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24 font-serif text-stone-700 leading-relaxed">
      <header className="mb-12 font-mono text-sm">
        <Link href="/" className="text-stone-500 hover:text-stone-900 transition">
          ← folio
        </Link>
      </header>

      <h1 className="font-serif text-3xl text-stone-900 mb-8">About</h1>

      <div className="space-y-6 text-stone-600">
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

      <Script
        src="https://storage.ko-fi.com/cdn/scripts/overlay-widget.js"
        strategy="afterInteractive"
      />
      <Script id="kofi-widget" strategy="afterInteractive">
        {`kofiWidgetOverlay.draw('brianfolio', {
          'type': 'floating-chat',
          'floating-chat.donateButton.text': 'leave a tip',
          'floating-chat.donateButton.background-color': '#1c1917',
          'floating-chat.donateButton.text-color': '#fafaf9'
        });`}
      </Script>
    </main>
  )
}
