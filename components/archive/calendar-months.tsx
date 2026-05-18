import Link from 'next/link'
import { eachDayOfInterval, startOfMonth, endOfMonth, format, getDay } from 'date-fns'

export function CalendarMonths({ year, entryDates }: { year: number; entryDates: Set<string> }) {
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
                return hit ? (
                  <Link
                    key={iso}
                    href={`/archive/${iso}`}
                    className="aspect-square bg-stone-900 hover:bg-stone-700"
                    title={iso}
                  />
                ) : (
                  <div key={iso} className="aspect-square border border-stone-200" title={iso} />
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
