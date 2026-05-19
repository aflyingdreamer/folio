import { createClient } from '@/lib/supabase/server'
import { getEntryForDate, listEntryDatesForYear } from '@/lib/entries/queries'
import { formatDateBanner } from '@/lib/dates/today'
import { ReadOnlyEntry } from '@/components/editor/read-only-entry'
import { notFound } from 'next/navigation'

export default async function EntryPage({ params }: { params: { date: string } }) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(params.date)) notFound()
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const entry = await getEntryForDate(user!.id, params.date)
  if (!entry) notFound()
  const year = Number(params.date.slice(0, 4))
  const dates = [...(await listEntryDatesForYear(user!.id, year))]
  return (
    <ReadOnlyEntry
      dateIso={params.date}
      dateLabel={formatDateBanner(params.date)}
      content={entry.content}
      writtenDates={dates}
    />
  )
}
