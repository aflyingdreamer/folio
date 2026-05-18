import { createClient } from '@/lib/supabase/server'

export async function getEntryForDate(userId: string, dateIso: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('entries')
    .select('*')
    .eq('user_id', userId)
    .eq('entry_date', dateIso)
    .maybeSingle()
  return data
}

export async function getUserTimezone(userId: string): Promise<string> {
  const supabase = createClient()
  const { data } = await supabase
    .from('user_meta')
    .select('timezone')
    .eq('user_id', userId)
    .maybeSingle()
  return data?.timezone ?? 'UTC'
}

export async function listEntryDatesForYear(userId: string, year: number) {
  const supabase = createClient()
  const { data } = await supabase
    .from('entries')
    .select('entry_date')
    .eq('user_id', userId)
    .gte('entry_date', `${year}-01-01`)
    .lte('entry_date', `${year}-12-31`)
  return new Set((data ?? []).map((r) => r.entry_date as string))
}
