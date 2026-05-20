'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { upsertTimezone } from '@/lib/entries/actions'

export function TzCapture() {
  const router = useRouter()
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    const stored = localStorage.getItem('folio-tz')
    if (stored === tz) return
    upsertTimezone(tz)
      .then(() => {
        localStorage.setItem('folio-tz', tz)
        router.refresh()
      })
      .catch((err) => {
        if (process.env.NODE_ENV !== 'production') {
          // Surface in dev so we notice silent regressions; in prod we
          // intentionally swallow — TzCapture retries on every mount.
          console.warn('[tz] upsert failed, will retry next mount', err)
        }
      })
  }, [router])
  return null
}
