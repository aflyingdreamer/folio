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
      .catch(() => {})
  }, [router])
  return null
}
