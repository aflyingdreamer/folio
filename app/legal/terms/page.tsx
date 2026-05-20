import Link from 'next/link'

export const metadata = { title: 'Terms · Folio' }

const updated = 'May 20, 2026'

export default function Terms() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24 font-serif text-stone-700 leading-relaxed">
      <header className="mb-12 font-mono text-sm">
        <Link href="/" className="text-stone-500 hover:text-stone-900 transition">
          ← folio
        </Link>
      </header>

      <h1 className="font-serif text-3xl text-stone-900 mb-2">Terms</h1>
      <p className="font-mono text-xs text-stone-400 mb-10">last updated {updated}</p>

      <p className="text-balance mb-10">
        Folio is a small writing space inspired by Julia Cameron&apos;s morning
        pages and Buster Benson&apos;s 750words. It exists to help you write
        every day, then close the tab. These terms are the agreement between
        you and us.
      </p>

      <Section title="The deal">
        The daily ritual — write, archive, close — is free forever. Optional
        paid features may exist later (recap PDFs, themes, export); they are
        clearly marked, optional, and cancellable.
      </Section>

      <Section title="Your account">
        <ul className="list-disc pl-5 space-y-2">
          <li>One account per person. You must be 13 or older.</li>
          <li>Keep your password to yourself. You&apos;re responsible for what happens under your account.</li>
          <li>If you spot suspicious activity, email us and we&apos;ll help.</li>
        </ul>
      </Section>

      <Section title="Your writing">
        <ul className="list-disc pl-5 space-y-2">
          <li>It&apos;s yours. We don&apos;t claim any ownership, copyright, or licence over what you write.</li>
          <li>Entries are sealed at the end of your local day. This is by design: morning pages aren&apos;t for editing.</li>
          <li>You can delete your account at any time, which erases everything. See <Link href="/legal/privacy" className="underline underline-offset-4 decoration-stone-300 hover:decoration-stone-900">Privacy</Link>.</li>
        </ul>
      </Section>

      <Section title="Acceptable use">
        Folio is a private journal. Don&apos;t use it to:
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>Break the law, or plan to.</li>
          <li>Store other people&apos;s private information without their consent.</li>
          <li>Attack, probe, scrape, or overload the service.</li>
          <li>Resell, sublicence, or wrap the service as your own product.</li>
        </ul>
        <p className="mt-4">
          If we have a strong reason to believe an account is being used for the
          above, we may suspend it. We don&apos;t read entries to decide this; we
          look at account-level signals.
        </p>
      </Section>

      <Section title="Service availability">
        We try hard to keep Folio up and your data safe. We&apos;re a small
        operation, though, so we can&apos;t promise zero downtime or zero data
        loss. The service is provided <i>as-is</i> and <i>as available</i>,
        without warranties of any kind, express or implied.
      </Section>

      <Section title="Liability">
        To the maximum extent allowed by law, Folio and its operator are not
        liable for indirect, incidental, or consequential damages — and our
        total liability for any claim relating to the service is limited to the
        amount you&apos;ve paid us in the last twelve months (which, for free
        users, is zero).
      </Section>

      <Section title="Changes to the service">
        We may add, change, or remove features. If we remove something you
        actively use, we&apos;ll give reasonable notice and let you export your
        data first.
      </Section>

      <Section title="Changes to these terms">
        We may update these terms. The date at the top will reflect the latest
        change. For material changes, we&apos;ll email registered users before
        the change takes effect. Continuing to use the service after that means
        you accept the new terms.
      </Section>

      <Section title="Ending things">
        You can delete your account whenever you like from{' '}
        <Link href="/settings" className="underline underline-offset-4 decoration-stone-300 hover:decoration-stone-900">/settings</Link>.
        We may terminate accounts that materially violate these terms; we&apos;ll
        try to give notice and an export window unless the violation is serious.
      </Section>

      <Section title="Governing law">
        These terms are governed by the laws of Vietnam, without regard to
        conflict-of-law principles. Disputes will be handled in the courts of
        Hanoi, Vietnam, unless a local consumer-protection law in your country
        gives you a non-waivable right to a different forum.
      </Section>

      <Section title="Contact">
        Anything unclear, friendly or otherwise:{' '}
        <a
          href="mailto:ducanhaof272@gmail.com"
          className="underline underline-offset-4 decoration-stone-300 hover:decoration-stone-900"
        >
          ducanhaof272@gmail.com
        </a>
        .
      </Section>

      <p className="mt-16 font-mono text-xs text-stone-400">
        with thanks to Julia Cameron and Buster Benson, on whose shoulders this small thing stands.
      </p>
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
