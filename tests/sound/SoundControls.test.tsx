import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SoundContext, type SoundContextValue } from '@/components/sound/useSound'
import { SoundControls } from '@/components/sound/SoundControls'
import { DEFAULT_PREFS } from '@/components/sound/persistence'

function ctx(overrides: Partial<SoundContextValue> = {}): SoundContextValue {
  return {
    prefs: DEFAULT_PREFS,
    amplitude: 0,
    waveform: [],
    controlsOpen: true,
    isPlaying: true,
    toggleControls: () => {},
    setEnabled: () => {},
    setTrack: () => {},
    setVolume: () => {},
    toggleLoopMode: () => {},
    togglePlay: () => {},
    ...overrides,
  }
}

describe('SoundControls', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <SoundContext.Provider value={ctx({ controlsOpen: false })}>
        <SoundControls />
      </SoundContext.Provider>
    )
    expect(container.textContent).toBe('')
  })

  it('lists all track labels when open', () => {
    render(
      <SoundContext.Provider value={ctx()}>
        <SoundControls />
      </SoundContext.Provider>
    )
    expect(screen.getByText('soft rain')).toBeTruthy()
    expect(screen.getByText('fireplace')).toBeTruthy()
    expect(screen.getByText('forest at dawn')).toBeTruthy()
  })

  it('clicking a track calls setTrack', () => {
    const setTrack = vi.fn()
    render(
      <SoundContext.Provider value={ctx({ setTrack })}>
        <SoundControls />
      </SoundContext.Provider>
    )
    fireEvent.click(screen.getByText('fireplace'))
    expect(setTrack).toHaveBeenCalledWith('fireplace')
  })

  it('shows "pause" when playing and "play" when paused', () => {
    const { rerender } = render(
      <SoundContext.Provider value={ctx({ isPlaying: true })}>
        <SoundControls />
      </SoundContext.Provider>
    )
    expect(screen.getByRole('button', { name: 'pause' })).toBeTruthy()
    rerender(
      <SoundContext.Provider value={ctx({ isPlaying: false })}>
        <SoundControls />
      </SoundContext.Provider>
    )
    expect(screen.getByRole('button', { name: 'play' })).toBeTruthy()
  })

  it('shows current loop mode and toggles it', () => {
    const toggleLoopMode = vi.fn()
    render(
      <SoundContext.Provider value={ctx({ toggleLoopMode })}>
        <SoundControls />
      </SoundContext.Provider>
    )
    fireEvent.click(screen.getByRole('button', { name: 'loop one' }))
    expect(toggleLoopMode).toHaveBeenCalled()
  })
})
