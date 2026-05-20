'use client'
import { useEffect, useRef, useState } from 'react'
import { CalendarMonths } from './calendar-months'
import { getArchiveDates } from '@/lib/entries/archive-action'

export function ArchiveDrawer() {
  const [open, setOpen] = useState(false)
  const [year, setYear] = useState<number | null>(null)
  const [dates, setDates] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open || year !== null) return
    setLoading(true)
    setLoadError(false)
    getArchiveDates()
      .then(({ year, dates }) => {
        setYear(year)
        setDates(new Set(dates))
      })
      .catch((err) => {
        setLoadError(true)
        if (process.env.NODE_ENV !== 'production') console.warn('[archive] load failed', err)
      })
      .finally(() => setLoading(false))
  }, [open, year])

  // When the calendar is in view, snap today's cell into the visible band.
  useEffect(() => {
    if (!open || year === null) return
    const t = requestAnimationFrame(() => {
      const todayEl = scrollRef.current?.querySelector<HTMLElement>('[data-folio-today]')
      todayEl?.scrollIntoView({ block: 'center', behavior: 'instant' as ScrollBehavior })
    })
    return () => cancelAnimationFrame(t)
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
    const openEvt = () => setOpen(true)
    window.addEventListener('keydown', h)
    window.addEventListener('folio:open-archive', openEvt)
    return () => {
      window.removeEventListener('keydown', h)
      window.removeEventListener('folio:open-archive', openEvt)
    }
  }, [])

  const filled = dates.size
  const dayWord = filled === 1 ? 'day' : 'days'

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="hidden sm:inline font-mono text-xs text-stone-400 hover:text-stone-700"
      >
        archive
      </button>
      <aside
        data-folio-drawer
        className={`fixed top-0 right-0 h-full w-full sm:w-[360px] bg-stone-50 sm:border-l border-stone-200 z-30 transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div ref={scrollRef} className="overflow-y-auto h-full">
          <button
            onClick={() => setOpen(false)}
            aria-label="close archive"
            className="sm:hidden fixed top-6 left-6 z-50 font-mono text-xs text-stone-400 hover:text-stone-700"
          >
            close
          </button>
          <header className="sticky top-0 z-10 bg-stone-50/95 backdrop-blur-sm px-6 pt-20 pb-4 sm:pt-10">
            <div className="flex items-baseline justify-between mb-2">
              <h1 className="font-mono text-sm text-stone-500">{year ?? ''}</h1>
              <a
                href="/today"
                className="font-mono text-xs text-stone-400 hover:text-stone-700"
              >
                today
              </a>
            </div>
            <p className="font-mono text-xs text-stone-400 leading-relaxed">
              {year !== null && (
                <>
                  <span className="text-stone-600">{filled} {dayWord}</span> this year ·{' '}
                </>
              )}
              a long day, just for you — seals at midnight.
            </p>
          </header>
          <div className="px-6 pt-6 pb-16">
            {loading && <p className="font-mono text-xs text-stone-400">loading…</p>}
            {loadError && (
              <p className="font-mono text-xs text-rose-500">couldn’t load — try again in a moment.</p>
            )}
            {year !== null && (
              <CalendarMonths
                year={year}
                entryDates={dates}
                todayIso={new Intl.DateTimeFormat('en-CA').format(new Date())}
              />
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
