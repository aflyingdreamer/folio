'use client'
import { useEffect } from 'react'
import { FIRST_TOUCH_COOKIE } from '@/lib/attribution/first-touch'

function hasCookie(name: string): boolean {
  return document.cookie.split('; ').some((c) => c.startsWith(`${name}=`))
}

function sameHost(url: string): boolean {
  try {
    return new URL(url).host === window.location.host
  } catch {
    return false
  }
}

export function FirstTouchCapture() {
  useEffect(() => {
    if (hasCookie(FIRST_TOUCH_COOKIE)) return

    const params = new URLSearchParams(window.location.search)
    const ref = document.referrer && !sameHost(document.referrer) ? document.referrer : null
    const payload = {
      source: params.get('utm_source'),
      medium: params.get('utm_medium'),
      campaign: params.get('utm_campaign'),
      referrer: ref,
      path: window.location.pathname,
      at: new Date().toISOString(),
    }

    // Skip if there's nothing worth recording (direct, no utm, no referrer).
    if (!payload.source && !payload.medium && !payload.campaign && !payload.referrer) {
      // Still record path + timestamp so we know "direct" with landing context.
    }

    const value = encodeURIComponent(JSON.stringify(payload))
    const maxAge = 60 * 60 * 24 * 90 // 90 days
    document.cookie = `${FIRST_TOUCH_COOKIE}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax`
  }, [])

  return null
}
