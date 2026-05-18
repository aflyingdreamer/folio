'use client'
import { useEffect } from 'react'
import { upsertTimezone } from '@/lib/entries/actions'

export function TzCapture() {
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    const stored = localStorage.getItem('folio-tz')
    if (stored === tz) return
    upsertTimezone(tz)
      .then(() => localStorage.setItem('folio-tz', tz))
      .catch(() => {})
  }, [])
  return null
}
