import { createClient } from '@/lib/supabase/server'
import { getEntryForDate, getUserTimezone } from '@/lib/entries/queries'
import { todayIsoIn, formatDateBanner } from '@/lib/dates/today'
import { WritingSurface } from '@/components/editor/writing-surface'

export default async function TodayPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const tz = await getUserTimezone(user!.id)
  const date = todayIsoIn(tz)
  const entry = await getEntryForDate(user!.id, date)
  return (
    <WritingSurface
      entryDate={date}
      dateLabel={formatDateBanner(date)}
      initialContent={entry?.content ?? ''}
      initialWordCount={entry?.word_count ?? 0}
    />
  )
}
