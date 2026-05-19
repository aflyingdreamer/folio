import { describe, it, expect, beforeEach } from 'vitest'
import { readLocalPrefs, writeLocalPrefs, type SoundPrefs } from '@/components/sound/persistence'

beforeEach(() => {
  localStorage.clear()
})

describe('localStorage prefs', () => {
  it('returns defaults when storage is empty', () => {
    const p = readLocalPrefs()
    expect(p).toEqual({
      enabled: null,
      track: 'soft_rain',
      volume: 60,
      loopMode: 'loop_one',
    })
  })

  it('round-trips a full prefs object', () => {
    const next: SoundPrefs = {
      enabled: true,
      track: 'fireplace',
      volume: 30,
      loopMode: 'shuffle',
    }
    writeLocalPrefs(next)
    expect(readLocalPrefs()).toEqual(next)
  })

  it('ignores invalid track values in storage and returns the default', () => {
    localStorage.setItem('folio.sound.track', 'not_a_track')
    expect(readLocalPrefs().track).toBe('soft_rain')
  })

  it('clamps out-of-range volume', () => {
    localStorage.setItem('folio.sound.volume', '999')
    expect(readLocalPrefs().volume).toBe(60)
  })
})
