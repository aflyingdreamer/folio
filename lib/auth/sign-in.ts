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

export async function signInWithGoogle() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${origin()}/auth/callback` },
  })
  if (error) throw error
  if (data.url) redirect(data.url)
}

export async function verifyOtpCode(email: string, token: string) {
  const supabase = createClient()
  const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' })
  if (error) return { error: error.message.toLowerCase() }
  return { error: null }
}
