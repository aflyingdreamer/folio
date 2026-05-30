export const FIRST_TOUCH_COOKIE = 'mp_first_touch'

export type FirstTouch = {
  source: string | null
  medium: string | null
  campaign: string | null
  referrer: string | null
  path: string | null
  at: string
}

export function parseFirstTouchCookie(raw: string | undefined): FirstTouch | null {
  if (!raw) return null
  try {
    const decoded = JSON.parse(decodeURIComponent(raw)) as Partial<FirstTouch>
    if (!decoded || typeof decoded !== 'object') return null
    const clip = (v: unknown) =>
      typeof v === 'string' ? v.slice(0, 500) : null
    return {
      source: clip(decoded.source),
      medium: clip(decoded.medium),
      campaign: clip(decoded.campaign),
      referrer: clip(decoded.referrer),
      path: clip(decoded.path),
      at: typeof decoded.at === 'string' ? decoded.at : new Date().toISOString(),
    }
  } catch {
    return null
  }
}
