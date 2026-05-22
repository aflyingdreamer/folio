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
          Hi, I&apos;m Brian. I built Mornings in two days — planning
          to launching — because I needed it.
        </p>
        <p className="text-balance">
          For years I&apos;ve kept a writing hobby. Notes, Notion,
          whatever was open. Just clearing the cache in my head.
          But the &ldquo;for me&rdquo; pages always ended up sitting
          next to meeting notes and PRDs, and I&apos;d open the app
          to write something private and get pulled back into work.
          The container was wrong.
        </p>
        <p className="text-balance">
          I wanted one page on the internet that had no work in it.
          No notifications, no AI, no feed. Just somewhere quiet to
          show up and write 750 words.
        </p>
        <p className="text-balance">
          I used{' '}
          <a
            href="https://750words.com"
            className="underline underline-offset-4 decoration-stone-300 hover:decoration-stone-900"
            target="_blank"
            rel="noreferrer"
          >
            750words.com
          </a>{' '}
          for years and loved it. It still works — go use it. I just
          wondered what it would look like if it were built today, so
          I built that. A tribute to Julia Cameron, who named the
          ritual, and to Buster Benson, who first put it online.
        </p>
        <p className="text-balance">
          It&apos;s mine first. It&apos;s my morning pages and my
          diary and whatever else I need it to be on a given day.
          There are no rules. If it&apos;s useful to you too, that&apos;s
          a bonus.
        </p>
        <p className="text-balance">
          It&apos;s free. I have no plans to monetise it. I have a
          day job; this is the thing I build in the evenings because
          I enjoy building things I use every day.
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
