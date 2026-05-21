import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { todayIsoIn, formatDateBanner } from '@/lib/dates/today'
import { WritingSurface } from '@/components/editor/writing-surface'

export default function TodayPage() {
  return (
    <Suspense fallback={<WritingSurfaceSkeleton />}>
      <TodayEntry />
    </Suspense>
  )
}

async function TodayEntry() {
  const supabase = createClient()
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

function WritingSurfaceSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 pt-28 pb-20 sm:py-24 relative" aria-hidden>
      <div className="mornings-fade-in fixed top-6 left-6 pointer-events-none font-mono text-xs sm:text-sm z-10">
        <p className="sm:mt-1 tabular-nums text-stone-300">0 / 750</p>
      </div>
      <div className="font-serif text-base sm:text-lg leading-loose text-stone-300">
        begin anywhere. three pages, no rules.
      </div>
    </div>
  )
}
