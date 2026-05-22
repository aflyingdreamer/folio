'use client'
import { useEffect } from 'react'
import { upsertTimezone } from '@/lib/entries/actions'

export function TzCapture() {
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    const stored = localStorage.getItem('folio-tz')
    if (stored === tz) return
    // Defer to idle so we don't compete with first paint on authed routes.
    const run = () => {
      upsertTimezone(tz)
        .then(() => {
          localStorage.setItem('folio-tz', tz)
        })
        .catch((err) => {
          if (process.env.NODE_ENV !== 'production') {
            console.warn('[tz] upsert failed, will retry next mount', err)
          }
        })
    }
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number }
    const id = w.requestIdleCallback
      ? w.requestIdleCallback(run)
      : window.setTimeout(run, 1200)
    return () => {
      const w2 = window as Window & { cancelIdleCallback?: (id: number) => void }
      if (w2.cancelIdleCallback) w2.cancelIdleCallback(id as number)
      else window.clearTimeout(id as number)
    }
  }, [])
  return null
}
