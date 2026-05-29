'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { THEME_COOKIE, isThemeChoice, type ThemeChoice } from './theme'

export async function updateDisplayName(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim().slice(0, 60)
  if (!name) return { error: 'a name is required.' }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'please sign in again.' }

  const { error } = await supabase
    .from('user_meta')
    .upsert({ user_id: user.id, display_name: name }, { onConflict: 'user_id' })
  if (error) return { error: error.message.toLowerCase() }

  revalidatePath('/settings')
  return { error: null, ok: true }
}

export async function changePassword(formData: FormData) {
  const password = String(formData.get('password') ?? '')
  const confirm = String(formData.get('confirm') ?? '')
  if (password.length < 8) return { error: 'password must be at least 8 characters.' }
  if (password !== confirm) return { error: 'passwords don’t match.' }

  const supabase = createClient()
  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { error: error.message.toLowerCase() }
  return { error: null, ok: true }
}

export async function saveTheme(choice: ThemeChoice) {
  if (!isThemeChoice(choice)) return { error: 'invalid theme.' }

  cookies().set(THEME_COOKIE, choice, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) {
    await supabase
      .from('user_meta')
      .upsert({ user_id: user.id, theme: choice }, { onConflict: 'user_id' })
  }

  revalidatePath('/', 'layout')
  return { error: null, ok: true }
}

export async function recordPaletteInterest() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'please sign in again.' }

  const { error } = await supabase
    .from('user_meta')
    .upsert(
      { user_id: user.id, palette_interest: true },
      { onConflict: 'user_id' },
    )
  if (error) return { error: error.message.toLowerCase() }
  return { error: null, ok: true }
}

export async function resendEmailConfirmation() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.email) return { error: 'no email on file.' }
  if (user.email_confirmed_at) return { error: null, ok: true, alreadyVerified: true }

  const { error } = await supabase.auth.resend({ type: 'signup', email: user.email })
  if (error) return { error: error.message.toLowerCase() }
  return { error: null, ok: true }
}
