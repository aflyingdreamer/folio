import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SoundContext, type SoundContextValue } from '@/components/sound/useSound'
import { SoundWaveform } from '@/components/sound/SoundWaveform'
import { DEFAULT_PREFS } from '@/components/sound/persistence'

function ctx(overrides: Partial<SoundContextValue> = {}): SoundContextValue {
  return {
    prefs: DEFAULT_PREFS,
    amplitude: 0,
    controlsOpen: false,
    isPlaying: false,
    toggleControls: () => {},
    setEnabled: () => {},
    setTrack: () => {},
    setVolume: () => {},
    toggleLoopMode: () => {},
    togglePlay: () => {},
    ...overrides,
  }
}

describe('SoundWaveform', () => {
  it('renders an svg', () => {
    const { container } = render(
      <SoundContext.Provider value={ctx()}>
        <SoundWaveform />
      </SoundContext.Provider>
    )
    expect(container.querySelector('svg')).toBeTruthy()
  })

  it('renders at low opacity when not playing', () => {
    const { container } = render(
      <SoundContext.Provider value={ctx({ isPlaying: false })}>
        <SoundWaveform />
      </SoundContext.Provider>
    )
    const btn = container.querySelector('button')!
    expect(btn.className).toMatch(/opacity-60/)
  })

  it('renders at full opacity when playing', () => {
    const { container } = render(
      <SoundContext.Provider value={ctx({ isPlaying: true })}>
        <SoundWaveform />
      </SoundContext.Provider>
    )
    const btn = container.querySelector('button')!
    expect(btn.className).not.toMatch(/opacity-40/)
  })

  it('calls toggleControls on click', () => {
    let called = false
    render(
      <SoundContext.Provider value={ctx({ toggleControls: () => { called = true } })}>
        <SoundWaveform />
      </SoundContext.Provider>
    )
    fireEvent.click(screen.getByRole('button', { name: /sound/i }))
    expect(called).toBe(true)
  })
})
