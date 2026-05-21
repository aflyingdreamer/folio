import Link from 'next/link'
import { eachDayOfInterval, startOfMonth, endOfMonth, format, getDay } from 'date-fns'

export function CalendarMonths({
  year,
  entryDates,
  todayIso,
}: {
  year: number
  entryDates: Set<string>
  todayIso?: string
}) {
  const months = Array.from({ length: 12 }, (_, m) => m)
  return (
    <div className="space-y-12">
      {months.map((m) => {
        const start = startOfMonth(new Date(year, m, 1))
        const end = endOfMonth(start)
        const days = eachDayOfInterval({ start, end })
        const padStart = (getDay(start) + 6) % 7 // Mon=0
        return (
          <section key={m}>
            <h2 className="font-mono text-sm text-stone-500 mb-3">
              {format(start, 'MMMM').toLowerCase()} {year}
            </h2>
            <div className="grid grid-cols-7 gap-1 max-w-xs">
              {Array.from({ length: padStart }).map((_, i) => (
                <div key={`p${i}`} />
              ))}
              {days.map((d) => {
                const iso = format(d, 'yyyy-MM-dd')
                const hit = entryDates.has(iso)
                const isToday = iso === todayIso
                const ring = isToday ? 'ring-2 ring-stone-900 ring-offset-1' : ''
                const href = isToday ? '/today' : `/archive/${iso}`
                const todayAttr = isToday ? { 'data-mornings-today': 'true' as const } : {}
                return hit ? (
                  <Link
                    key={iso}
                    href={href}
                    className={`aspect-square bg-stone-900 hover:bg-stone-700 ${ring}`}
                    title={iso}
                    {...todayAttr}
                  />
                ) : isToday ? (
                  <Link
                    key={iso}
                    href="/today"
                    className={`aspect-square border border-stone-200 hover:bg-stone-100 ${ring}`}
                    title={iso}
                    {...todayAttr}
                  />
                ) : (
                  <div
                    key={iso}
                    className="aspect-square border border-stone-200"
                    title={iso}
                  />
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
