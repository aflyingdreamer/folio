import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SoundContext, type SoundContextValue } from '@/components/sound/useSound'
import { FirstVisitAsk } from '@/components/sound/FirstVisitAsk'
import { DEFAULT_PREFS } from '@/components/sound/persistence'

function ctx(overrides: Partial<SoundContextValue> = {}): SoundContextValue {
  return {
    prefs: DEFAULT_PREFS,
    amplitude: 0,
    waveform: [],
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

describe('FirstVisitAsk', () => {
  it('renders the question when enabled is null', () => {
    render(
      <SoundContext.Provider value={ctx({ prefs: { ...DEFAULT_PREFS, enabled: null } })}>
        <FirstVisitAsk />
      </SoundContext.Provider>
    )
    expect(screen.getByText(/play ambient sound/i)).toBeTruthy()
  })

  it('renders nothing once enabled is set', () => {
    const { container } = render(
      <SoundContext.Provider value={ctx({ prefs: { ...DEFAULT_PREFS, enabled: true } })}>
        <FirstVisitAsk />
      </SoundContext.Provider>
    )
    expect(container.textContent).toBe('')
  })

  it('calls setEnabled(true) on yes', () => {
    const setEnabled = vi.fn()
    render(
      <SoundContext.Provider value={ctx({ prefs: { ...DEFAULT_PREFS, enabled: null }, setEnabled })}>
        <FirstVisitAsk />
      </SoundContext.Provider>
    )
    fireEvent.click(screen.getByRole('button', { name: 'yes' }))
    expect(setEnabled).toHaveBeenCalledWith(true)
  })

  it('calls setEnabled(false) on no, thanks', () => {
    const setEnabled = vi.fn()
    render(
      <SoundContext.Provider value={ctx({ prefs: { ...DEFAULT_PREFS, enabled: null }, setEnabled })}>
        <FirstVisitAsk />
      </SoundContext.Provider>
    )
    fireEvent.click(screen.getByRole('button', { name: 'no, thanks' }))
    expect(setEnabled).toHaveBeenCalledWith(false)
  })
})
