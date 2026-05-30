import { cookies } from 'next/headers'
import type { SupabaseClient } from '@supabase/supabase-js'
import { FIRST_TOUCH_COOKIE, parseFirstTouchCookie } from './first-touch'

export async function applyFirstTouch(supabase: SupabaseClient, userId: string) {
  const jar = cookies()
  const raw = jar.get(FIRST_TOUCH_COOKIE)?.value
  const ft = parseFirstTouchCookie(raw)
  if (!ft) return

  const { data: existing } = await supabase
    .from('user_meta')
    .select('first_landing_at')
    .eq('user_id', userId)
    .maybeSingle()

  if (existing?.first_landing_at) {
    jar.delete(FIRST_TOUCH_COOKIE)
    return
  }

  await supabase.from('user_meta').upsert(
    {
      user_id: userId,
      first_source: ft.source,
      first_medium: ft.medium,
      first_campaign: ft.campaign,
      first_referrer: ft.referrer,
      first_landing_path: ft.path,
      first_landing_at: ft.at,
    },
    { onConflict: 'user_id' },
  )

  jar.delete(FIRST_TOUCH_COOKIE)
}
