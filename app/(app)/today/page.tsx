import { createClient } from '@/lib/supabase/server'
import { getEntryForDate, getUserTimezone } from '@/lib/entries/queries'
import { todayIsoIn, formatDateBanner } from '@/lib/dates/today'
import { WritingSurface } from '@/components/editor/writing-surface'
import { DateBanner } from '@/components/editor/date-banner'

export default async function TodayPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const tz = await getUserTimezone(user!.id)
  const date = todayIsoIn(tz)
  const entry = await getEntryForDate(user!.id, date)
  return (
    <>
      <DateBanner text={formatDateBanner(date)} />
      <WritingSurface
        entryDate={date}
        initialContent={entry?.content ?? ''}
        initialWordCount={entry?.word_count ?? 0}
      />
    </>
  )
}
