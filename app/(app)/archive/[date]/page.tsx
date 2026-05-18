import { createClient } from '@/lib/supabase/server'
import { getEntryForDate, listEntryDatesForYear } from '@/lib/entries/queries'
import { formatDateBanner } from '@/lib/dates/today'
import { DatePickerHeader } from '@/components/archive/date-picker'
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
    <article className="mx-auto max-w-[72ch] px-6 py-16">
      <header className="mb-12">
        <DatePickerHeader
          dateIso={params.date}
          dateLabel={formatDateBanner(params.date)}
          writtenDates={dates}
        />
      </header>
      <div className="font-serif text-lg leading-loose whitespace-pre-wrap text-stone-900">
        {entry.content}
      </div>
      <p className="mt-16 font-mono text-xs text-stone-400">
        <a href="/archive" className="underline">
          archive
        </a>{' '}
        ·{' '}
        <a href="/today" className="underline">
          today
        </a>
      </p>
    </article>
  )
}
