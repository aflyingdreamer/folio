'use server'
import { createClient } from '@/lib/supabase/server'
import { listEntryDatesForYear, getUserTimezone } from '@/lib/entries/queries'
import { todayIsoIn } from '@/lib/dates/today'

export async function getArchiveDates(year?: number): Promise<{ year: number; dates: string[] }> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { year: year ?? new Date().getUTCFullYear(), dates: [] }
  const tz = await getUserTimezone(user.id)
  const y = year ?? Number(todayIsoIn(tz).slice(0, 4))
  const set = await listEntryDatesForYear(user.id, y)
  return { year: y, dates: Array.from(set) }
}
