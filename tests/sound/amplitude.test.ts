import { describe, it, expect } from 'vitest'
import { rms, smooth } from '@/components/sound/amplitude'

describe('rms', () => {
  it('returns 0 for an all-silent buffer (128 = midpoint of Uint8 time-domain)', () => {
    const buf = new Uint8Array(64).fill(128)
    expect(rms(buf)).toBe(0)
  })

  it('returns ~1 for a buffer at full positive deflection (255)', () => {
    // 8-bit time-domain max is 127/128 from centre, not exactly 1.
    const buf = new Uint8Array(64).fill(255)
    expect(rms(buf)).toBeCloseTo(127 / 128, 5)
  })

  it('returns 1 for a buffer at full negative deflection (0)', () => {
    // (0-128)/128 = -1 exactly.
    const buf = new Uint8Array(64).fill(0)
    expect(rms(buf)).toBe(1)
  })

  it('returns a value between 0 and 1 for mixed content', () => {
    const buf = new Uint8Array([128, 200, 128, 56, 128, 200, 128, 56])
    const r = rms(buf)
    expect(r).toBeGreaterThan(0)
    expect(r).toBeLessThan(1)
  })
})

describe('smooth', () => {
  it('returns the input on the first call (no previous value)', () => {
    expect(smooth(0.5, null, 0.15)).toBe(0.5)
  })

  it('moves toward the new value by alpha', () => {
    expect(smooth(1, 0, 0.15)).toBeCloseTo(0.15, 5)
  })

  it('stays near previous when alpha is small', () => {
    expect(smooth(0, 0.8, 0.1)).toBeCloseTo(0.72, 5)
  })
})
