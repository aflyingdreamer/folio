'use server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { todayIsoIn } from '@/lib/dates/today'

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

const Upsert = z.object({
  entryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  content: z.string().max(50_000),
  wordCount: z.number().int().min(0),
})

export async function upsertEntry(input: z.infer<typeof Upsert>) {
  const parsed = Upsert.parse(input)
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('unauthenticated')

  // Seal: refuse to write to any date other than today in the user's tz.
  const { data: meta } = await supabase
    .from('user_meta')
    .select('timezone')
    .eq('user_id', user.id)
    .maybeSingle()
  const tz = meta?.timezone ?? 'UTC'
  if (parsed.entryDate !== todayIsoIn(tz)) {
    throw new Error('entry is sealed')
  }

  const existing = await supabase
    .from('entries')
    .select('id, started_at')
    .eq('user_id', user.id)
    .eq('entry_date', parsed.entryDate)
    .maybeSingle()

  const started_at = existing.data?.started_at ?? new Date().toISOString()
  const completed_at = parsed.wordCount >= 750 ? new Date().toISOString() : null

  const { error } = await supabase.from('entries').upsert(
    {
      user_id: user.id,
      entry_date: parsed.entryDate,
      content: parsed.content,
      word_count: parsed.wordCount,
      started_at,
      completed_at,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,entry_date' },
  )

  if (error) throw error
  revalidatePath('/today')
  return { ok: true as const, completed: parsed.wordCount >= 750 }
}
