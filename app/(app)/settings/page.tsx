import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { DisplayNameForm } from './display-name-form'
import { PasswordForm } from './password-form'
import { EmailVerify } from './email-verify'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: meta } = await supabase
    .from('user_meta')
    .select('display_name')
    .eq('user_id', user.id)
    .maybeSingle()

  const verified = Boolean(user.email_confirmed_at)

  return (
    <main className="mx-auto max-w-2xl px-6 pt-24 pb-32 space-y-20">
      <section>
        <p className="font-serif text-lg text-stone-700 leading-relaxed">
          Folio is a tribute to Julia Cameron’s morning pages and Buster Benson’s
          {' '}
          <a href="https://750words.com" className="underline decoration-stone-300 underline-offset-4 hover:text-stone-900">750words.com</a>.
          {' '}Write three pages. Close the tab. Come back tomorrow.
        </p>
        <p className="mt-4 font-mono text-xs text-stone-400">
          v0.1 ·{' '}
          <Link href="/about" className="hover:text-stone-700">about & credits</Link>
        </p>
      </section>

      <Row label="display name">
        <DisplayNameForm initial={meta?.display_name ?? ''} />
      </Row>

      <Row label="email">
        <EmailVerify email={user.email ?? ''} verified={verified} />
      </Row>

      <Row label="password">
        <PasswordForm />
      </Row>
    </main>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-3 sm:gap-8 items-start">
      <div className="font-mono text-xs text-stone-400 pt-2">{label}</div>
      <div>{children}</div>
    </section>
  )
}
