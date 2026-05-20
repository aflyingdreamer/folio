import { createClient } from '@/lib/supabase/server'
import { todayIsoIn, formatDateBanner } from '@/lib/dates/today'
import { WritingSurface } from '@/components/editor/writing-surface'

export default async function TodayPage() {
  const supabase = createClient()
  // Single roundtrip: tz + today's entry in one RPC call. Layout already
  // gated auth, so we trust the session cookie and skip a getUser() hop.
  type TodayRow = { timezone: string | null; entry_date: string | null; content: string | null; word_count: number | null }
  const { data } = await supabase.rpc('get_today_entry').maybeSingle<TodayRow>()
  const tz = data?.timezone ?? 'UTC'
  const date = data?.entry_date ?? todayIsoIn(tz)
  return (
    <WritingSurface
      entryDate={date}
      dateLabel={formatDateBanner(date)}
      initialContent={data?.content ?? ''}
      initialWordCount={data?.word_count ?? 0}
    />
  )
}
