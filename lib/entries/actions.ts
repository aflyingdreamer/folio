'use server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const Tz = z.string().min(1).max(64)

export async function upsertTimezone(tz: string) {
  const parsed = Tz.parse(tz)
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('user_meta').upsert({
    user_id: user.id,
    timezone: parsed,
    updated_at: new Date().toISOString(),
  })
}
