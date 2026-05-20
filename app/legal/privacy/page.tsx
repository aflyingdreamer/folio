import Link from 'next/link'

export const metadata = { title: 'Privacy · Folio' }

const updated = 'May 20, 2026'

export default function Privacy() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24 font-serif text-stone-700 leading-relaxed">
      <header className="mb-12 font-mono text-sm">
        <Link href="/" className="text-stone-500 hover:text-stone-900 transition">
          ← folio
        </Link>
      </header>

      <h1 className="font-serif text-3xl text-stone-900 mb-2">Privacy</h1>
      <p className="font-mono text-xs text-stone-400 mb-10">last updated {updated}</p>

      <p className="text-balance mb-10">
        Your pages belong to you. We don&apos;t read them, sell them, train
        models on them, or share them with anyone. This page explains what we
        do store, why, and how to take it all back.
      </p>

      <Section title="What we collect">
        <ul className="list-disc pl-5 space-y-2">
          <li><b>Account.</b> Your email and a hashed password (handled by Supabase Auth). Optionally, a display name.</li>
          <li><b>Your writing.</b> The text of each daily entry, its word count, the date it was written, and your timezone (so &ldquo;today&rdquo; means today where you are).</li>
          <li><b>Preferences.</b> Theme choice (light / dark / system).</li>
          <li><b>Cookies.</b> A Supabase session cookie to keep you signed in, and a small cookie remembering your theme. No tracking or advertising cookies.</li>
          <li><b>Performance pings.</b> Vercel Speed Insights records anonymous page-load timings. No content, no personal identifiers.</li>
        </ul>
        <p className="mt-4">
          That&apos;s the whole list. No analytics, no fingerprinting, no third-party
          trackers, no ad networks.
        </p>
      </Section>

      <Section title="Where it lives">
        <ul className="list-disc pl-5 space-y-2">
          <li><b>Supabase</b> — stores your account and your entries in a Postgres database with row-level security. You can only see your own rows; we&apos;ve verified this with policies and tests.</li>
          <li><b>Vercel</b> — serves the site and runs the app. No data is stored there.</li>
          <li>Data is transmitted over HTTPS. The database is encrypted at rest by Supabase&apos;s infrastructure. We do <i>not</i> currently offer client-side or end-to-end encryption — if and when we do, we&apos;ll say so plainly.</li>
        </ul>
      </Section>

      <Section title="What we never do">
        <ul className="list-disc pl-5 space-y-2">
          <li>Sell, rent, or share your writing with advertisers, AI trainers, or anyone else.</li>
          <li>Read your entries for product, marketing, or moderation purposes.</li>
          <li>Mine your text for &ldquo;insights,&rdquo; sentiment, or summaries.</li>
        </ul>
      </Section>

      <Section title="Emails we send">
        Only transactional ones — sign-in confirmation, password resets, and the
        optional daily reminder if you turn it on. No newsletters or marketing
        blasts without your explicit opt-in.
      </Section>

      <Section title="Your controls">
        <ul className="list-disc pl-5 space-y-2">
          <li><b>See your data.</b> Everything you&apos;ve written is visible to you in <Link href="/archive" className="underline underline-offset-4 decoration-stone-300 hover:decoration-stone-900">/archive</Link>.</li>
          <li><b>Delete your account.</b> Go to <Link href="/settings" className="underline underline-offset-4 decoration-stone-300 hover:decoration-stone-900">/settings → danger</Link>. This irreversibly erases every page you&apos;ve written and your account. We do not keep backups of deleted accounts.</li>
          <li><b>Export.</b> A built-in export is on the roadmap. Until it ships, email us and we&apos;ll send your entries as plain text.</li>
        </ul>
      </Section>

      <Section title="Children">
        Folio is intended for people 13 and older. If you&apos;re under 13, please
        don&apos;t create an account.
      </Section>

      <Section title="Changes">
        If we change this policy in any material way, we&apos;ll update the date at
        the top and, for changes that affect existing users, send an email
        before the change takes effect.
      </Section>

      <Section title="Contact">
        Questions, concerns, or a data request:{' '}
        <a
          href="mailto:ducanhaof272@gmail.com"
          className="underline underline-offset-4 decoration-stone-300 hover:decoration-stone-900"
        >
          ducanhaof272@gmail.com
        </a>
        .
      </Section>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-serif text-xl text-stone-900 mb-3">{title}</h2>
      <div className="text-balance">{children}</div>
    </section>
  )
}
