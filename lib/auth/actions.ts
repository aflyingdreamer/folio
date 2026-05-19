'use server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

function origin() {
  const h = headers()
  const host = h.get('x-forwarded-host') ?? h.get('host')
  const proto = h.get('x-forwarded-proto') ?? 'https'
  return `${proto}://${host}`
}

export async function signUp(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim().slice(0, 60)
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')

  if (!name || !email || password.length < 6) {
    return { error: 'name, email, and a password of at least 6 characters are required.' }
  }

  const supabase = createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: name } },
  })
  if (error) return { error: error.message.toLowerCase() }

  if (data.user) {
    await supabase
      .from('user_meta')
      .upsert({ user_id: data.user.id, display_name: name }, { onConflict: 'user_id' })
  }

  if (!data.session) {
    return { error: null, needsConfirm: true, email }
  }
  redirect('/welcome?first=1')
}

export async function signIn(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')
  if (!email || !password) return { error: 'email and password are required.' }

  const supabase = createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message.toLowerCase() }
  redirect('/welcome')
}

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  if (!email) return { error: 'email is required.' }
  const supabase = createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin()}/reset`,
  })
  if (error) return { error: error.message.toLowerCase() }
  return { error: null, sent: true }
}

export async function saveDisplayName(formData: FormData) {
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

  redirect('/welcome?first=1')
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get('password') ?? '')
  if (password.length < 6) return { error: 'password must be at least 6 characters.' }
  const supabase = createClient()
  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { error: error.message.toLowerCase() }
  redirect('/welcome')
}
