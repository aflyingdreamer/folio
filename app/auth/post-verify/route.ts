import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { origin } = new URL(request.url)
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(`${origin}/login`)

  // Try to read display_name; if user_meta row missing, the trigger creates one.
  const { data: meta } = await supabase
    .from('user_meta')
    .select('display_name')
    .eq('user_id', user.id)
    .maybeSingle()

  // If OAuth gave us a name and there isn't one stored yet, persist it.
  const oauthName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined)

  if (!meta?.display_name && oauthName) {
    await supabase
      .from('user_meta')
      .update({ display_name: oauthName })
      .eq('user_id', user.id)
    return NextResponse.redirect(`${origin}/welcome?first=1`)
  }

  if (!meta?.display_name) {
    return NextResponse.redirect(`${origin}/welcome/name`)
  }

  return NextResponse.redirect(`${origin}/welcome`)
}
