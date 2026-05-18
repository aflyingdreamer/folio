import { describe, it, expect } from 'vitest'
import { todayIsoIn, formatDateBanner } from './today'

describe('todayIsoIn', () => {
  it('returns yyyy-mm-dd in given tz', () => {
    const utc = new Date(Date.UTC(2026, 4, 18, 0, 30))
    expect(todayIsoIn('America/Los_Angeles', utc)).toBe('2026-05-17')
    expect(todayIsoIn('UTC', utc)).toBe('2026-05-18')
    expect(todayIsoIn('Asia/Ho_Chi_Minh', utc)).toBe('2026-05-18')
  })

  it('handles east-of-UTC rollover', () => {
    // 2026-05-17 23:30 UTC = 2026-05-18 08:30 in Tokyo (UTC+9)
    const utc = new Date(Date.UTC(2026, 4, 17, 23, 30))
    expect(todayIsoIn('Asia/Tokyo', utc)).toBe('2026-05-18')
    expect(todayIsoIn('UTC', utc)).toBe('2026-05-17')
  })
})

describe('formatDateBanner', () => {
  it('formats as "sunday, 18 may 2026" lowercase', () => {
    expect(formatDateBanner('2026-05-17')).toBe('sunday, 17 may 2026')
  })
})
