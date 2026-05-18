'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

function useKey(key: string, fn: () => void) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === key) fn()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [key, fn])
}

export function DatePickerHeader({
  dateIso,
  dateLabel,
  writtenDates,
}: {
  dateIso: string
  dateLabel: string
  writtenDates: string[]
}) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const sorted = [...writtenDates].sort()
  const idx = sorted.indexOf(dateIso)
  const prev = idx > 0 ? sorted[idx - 1] : null
  const next = idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null

  useKey('ArrowLeft', () => {
    if (prev) router.push(`/archive/${prev}`)
  })
  useKey('ArrowRight', () => {
    if (next) router.push(`/archive/${next}`)
  })

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className="font-mono text-sm text-stone-500 hover:text-stone-900"
      >
        {dateLabel}
      </button>
      {open && (
        <ul className="absolute mt-2 left-0 z-10 bg-stone-50 border border-stone-200 max-h-72 overflow-auto font-mono text-sm min-w-[14rem]">
          {sorted.map((d) => (
            <li key={d}>
              <button
                onClick={() => {
                  setOpen(false)
                  router.push(`/archive/${d}`)
                }}
                className={`block w-full text-left px-3 py-1 hover:bg-stone-200 ${d === dateIso ? 'text-stone-900' : 'text-stone-500'}`}
              >
                {d}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
