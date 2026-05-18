import { createClient } from '@/lib/supabase/server'
import { listEntryDatesForYear, getUserTimezone } from '@/lib/entries/queries'
import { todayIsoIn } from '@/lib/dates/today'
import { CalendarMonths } from '@/components/archive/calendar-months'

export default async function ArchivePage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const tz = await getUserTimezone(user!.id)
  const year = Number(todayIsoIn(tz).slice(0, 4))
  const set = await listEntryDatesForYear(user!.id, year)
  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-mono text-sm text-stone-500 mb-12">{year}</h1>
      <CalendarMonths year={year} entryDates={set} />
      <p className="mt-16 font-mono text-xs text-stone-400">
        <a href="/today" className="underline">
          today
        </a>
      </p>
    </main>
  )
}
