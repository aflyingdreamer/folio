import Link from 'next/link'

export const metadata = {
  title: 'About',
  description:
    'What morning pages are, where the practice came from, and why Mornings exists — a tribute to Julia Cameron and Buster Benson.',
  alternates: { canonical: '/about' },
}

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'About Mornings — a tribute to morning pages',
  description:
    'An essay on the morning pages practice from Julia Cameron, its digital life via Buster Benson, and why Mornings was built as a quiet tribute.',
  author: { '@type': 'Person', name: 'Brian (Duc Anh)' },
  publisher: {
    '@type': 'Organization',
    name: 'Mornings',
    url: 'https://mornings.page',
  },
  mainEntityOfPage: 'https://mornings.page/about',
  inLanguage: 'en',
}

export default function About() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 sm:py-24 font-serif text-stone-700 leading-relaxed">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <header className="mb-12 font-mono text-sm">
        <Link href="/" className="text-stone-500 hover:text-stone-900 transition">
          ← mornings
        </Link>
      </header>

      <article className="space-y-10 text-stone-600">
        <h1 className="font-serif text-2xl sm:text-3xl text-stone-900">About</h1>

        <section className="space-y-5">
          <p className="text-balance">
            Hi, I&apos;m Brian. I built Mornings in two days — planning to
            launching — because I needed it. This is the story of the
            practice it&apos;s built on, and why it exists.
          </p>
        </section>

        <section className="space-y-5">
          <h2 className="font-serif text-xl text-stone-900">
            What are morning pages
          </h2>
          <p className="text-balance">
            Morning pages are three pages of longhand, stream-of-consciousness
            writing, done first thing in the morning. The instruction is
            almost embarrassingly simple: sit down, write until you&apos;ve
            filled three pages, stop. The pages aren&apos;t for anyone.
            They aren&apos;t for posterity. They aren&apos;t even really
            for you to re-read.
          </p>
          <p className="text-balance">
            The point isn&apos;t to produce writing. The point is to clear
            whatever is sitting on top of your mind before the day asks
            anything of you. Julia Cameron, who named the practice in{' '}
            <em>The Artist&apos;s Way</em> in 1992, describes them as a
            way of getting past the inner censor — the voice that tells
            you your ideas are boring, your sentences are wrong, your
            feelings are dramatic. You write past that voice by writing
            faster than it can object.
          </p>
          <p className="text-balance">
            Most people who try it for a few weeks notice the same thing:
            the writing itself is bad, and that&apos;s not the point.
            What changes is the rest of the day.
          </p>
        </section>

        <section className="space-y-5">
          <h2 className="font-serif text-xl text-stone-900">
            How they came online
          </h2>
          <p className="text-balance">
            In 2009, Buster Benson built{' '}
            <a
              href="https://750words.com"
              className="underline underline-offset-4 decoration-stone-300 hover:decoration-stone-900"
              target="_blank"
              rel="noreferrer"
            >
              750words.com
            </a>
            — a small site that quietly translated Cameron&apos;s ritual to
            the web. Three handwritten pages is roughly 750 typed words,
            so that became the daily target. The site counted your words,
            kept your streak, and gave you a private place to dump
            whatever was in your head.
          </p>
          <p className="text-balance">
            750words is still there, still excellent, and still one of
            the best small products on the internet. If you haven&apos;t
            used it, go use it. Most of what I know about how this should
            feel, I learned from years of writing there.
          </p>
        </section>

        <section className="space-y-5">
          <h2 className="font-serif text-xl text-stone-900">
            Why Mornings
          </h2>
          <p className="text-balance">
            For years I&apos;ve kept a writing hobby. Notes, Notion,
            whatever was open. Just clearing the cache in my head. But
            the &ldquo;for me&rdquo; pages always ended up sitting next
            to meeting notes and PRDs, and I&apos;d open the app to write
            something private and get pulled back into work. The
            container was wrong.
          </p>
          <p className="text-balance">
            I wanted one page on the internet that had no work in it.
            No notifications. No AI writing for me. No feed, no likes,
            no followers, no algorithm deciding what I see next. Just
            somewhere quiet to show up and write 750 words.
          </p>
          <p className="text-balance">
            So I built it. A tribute to Julia Cameron, who named the
            ritual, and to Buster Benson, who first put it online. Not
            a replacement — both of theirs still work — just a small
            version, built today, in the way I&apos;d want it for myself.
          </p>
        </section>

        <section className="space-y-5">
          <h2 className="font-serif text-xl text-stone-900">
            How it works
          </h2>
          <p className="text-balance">
            You sign in. You see today&apos;s page. You write. When the
            day ends, the page seals itself and moves to the archive,
            where you can read it later if you want, or never. There
            are no streaks to break. There&apos;s no public profile.
            There are no badges, no shares, no exports-to-substack. The
            whole thing fits on one screen.
          </p>
        </section>

        <section className="space-y-5">
          <h2 className="font-serif text-xl text-stone-900">
            What it isn&apos;t
          </h2>
          <p className="text-balance">
            It isn&apos;t an AI journaling app. It isn&apos;t a productivity
            tool. It isn&apos;t a social network for writers. It isn&apos;t
            trying to be an alternative to anything. The ritual is free,
            and it will stay free — that part isn&apos;t a trial.
          </p>
          <p className="text-balance">
            It&apos;s mine first. It&apos;s my morning pages and my diary
            and whatever else I need it to be on a given day. If
            it&apos;s useful to you too, that&apos;s a bonus.
          </p>
        </section>
      </article>

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
