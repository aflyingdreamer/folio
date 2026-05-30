import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { applyFirstTouch } from '@/lib/attribution/apply'

// Handles email confirmation links and password-reset links.
// Supabase appends a `code` query param; we exchange it for a session,
// then route by `next` (default /welcome).
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/welcome'

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`)
  }

  const supabase = createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    return NextResponse.redirect(`${origin}/login?error=expired`)
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) await applyFirstTouch(supabase, user.id)

  return NextResponse.redirect(`${origin}${next}`)
}
