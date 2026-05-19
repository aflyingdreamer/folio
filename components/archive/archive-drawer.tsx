'use client'
import { useEffect, useState } from 'react'
import { CalendarMonths } from './calendar-months'
import { getArchiveDates } from '@/lib/entries/archive-action'

export function ArchiveDrawer() {
  const [open, setOpen] = useState(false)
  const [year, setYear] = useState<number | null>(null)
  const [dates, setDates] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open || year !== null) return
    setLoading(true)
    getArchiveDates()
      .then(({ year, dates }) => {
        setYear(year)
        setDates(new Set(dates))
      })
      .finally(() => setLoading(false))
  }, [open, year])

  useEffect(() => {
    const root = document.getElementById('folio-main')
    if (root) {
      const isDesktop = window.matchMedia('(min-width: 640px)').matches
      root.style.transition = 'padding-right 300ms ease'
      root.style.paddingRight = open && isDesktop ? '360px' : '0px'
    }
    if (!open) return
    const close = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (t.closest('[data-folio-drawer]') || t.closest('[data-folio-nav]')) return
      setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="font-mono text-xs text-stone-400 hover:text-stone-700"
      >
        archive
      </button>
      <aside
        data-folio-drawer
        className={`fixed top-0 right-0 h-full w-full sm:w-[360px] bg-stone-50 sm:border-l border-stone-200 z-30 transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="px-6 pt-20 pb-16 sm:py-16 overflow-y-auto h-full">
          <button
            onClick={() => setOpen(false)}
            aria-label="close archive"
            className="sm:hidden absolute top-6 left-6 font-mono text-xs text-stone-400 hover:text-stone-700"
          >
            close
          </button>
          <div className="flex items-baseline justify-between mb-12">
            <h1 className="font-mono text-sm text-stone-500">{year ?? ''}</h1>
            <a
              href="/today"
              className="font-mono text-xs text-stone-400 hover:text-stone-700"
            >
              today
            </a>
          </div>
          {loading && <p className="font-mono text-xs text-stone-400">loading…</p>}
          {year !== null && (
            <CalendarMonths
              year={year}
              entryDates={dates}
              todayIso={new Intl.DateTimeFormat('en-CA').format(new Date())}
            />
          )}
        </div>
      </aside>
    </>
  )
}
