import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { DisplayNameForm } from './display-name-form'
import { PasswordForm } from './password-form'
import { EmailVerify } from './email-verify'
import { ThemeControl } from './theme-control'
import { THEME_COOKIE, isThemeChoice, type ThemeChoice } from '@/lib/settings/theme'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: meta } = await supabase
    .from('user_meta')
    .select('display_name, theme')
    .eq('user_id', user.id)
    .maybeSingle()

  const verified = Boolean(user.email_confirmed_at)

  const cookieTheme = cookies().get(THEME_COOKIE)?.value
  const initialTheme: ThemeChoice = isThemeChoice(cookieTheme)
    ? cookieTheme
    : (isThemeChoice(meta?.theme) ? (meta!.theme as ThemeChoice) : 'system')

  return (
    <main className="mx-auto max-w-2xl px-6 pt-24 pb-32 space-y-20">
      <Row label="appearance">
        <ThemeControl initial={initialTheme} />
      </Row>

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
