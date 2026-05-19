'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DateBanner } from './date-banner'
import { countWords } from '@/lib/words/count'

const GOAL = 750

export function ReadOnlyEntry({
  dateIso,
  dateLabel,
  content,
  writtenDates,
}: {
  dateIso: string
  dateLabel: string
  content: string
  writtenDates: string[]
}) {
  const router = useRouter()
  const sorted = [...writtenDates].sort()
  const idx = sorted.indexOf(dateIso)
  const prev = idx > 0 ? sorted[idx - 1] : null
  const next = idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && prev) router.push(`/archive/${prev}`)
      if (e.key === 'ArrowRight' && next) router.push(`/archive/${next}`)
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [prev, next, router])

  const count = countWords(content)

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-24 relative">
      <DateBanner text={dateLabel} count={count} goal={GOAL} />
      <div className="font-serif text-lg leading-loose whitespace-pre-wrap text-stone-900">
        {content}
      </div>
    </div>
  )
}
