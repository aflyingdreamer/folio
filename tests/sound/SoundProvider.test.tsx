import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { SoundProvider } from '@/components/sound/SoundProvider'
import { useSound } from '@/components/sound/useSound'

function Probe() {
  const s = useSound()
  return (
    <div>
      <span data-testid="enabled">{String(s.prefs.enabled)}</span>
      <span data-testid="track">{s.prefs.track}</span>
      <span data-testid="volume">{s.prefs.volume}</span>
      <span data-testid="amp">{s.amplitude.toFixed(2)}</span>
      <button onClick={() => s.setTrack('fireplace')}>set fireplace</button>
      <button onClick={() => s.setVolume(25)}>vol 25</button>
      <button onClick={() => s.setEnabled(true)}>enable</button>
      <button onClick={() => s.setEnabled(false)}>disable</button>
      <button onClick={() => s.toggleLoopMode()}>toggle loop</button>
    </div>
  )
}

beforeEach(() => {
  localStorage.clear()
})

describe('SoundProvider', () => {
  it('exposes defaults when nothing is persisted', () => {
    render(<SoundProvider><Probe /></SoundProvider>)
    expect(screen.getByTestId('enabled').textContent).toBe('null')
    expect(screen.getByTestId('track').textContent).toBe('soft_rain')
    expect(screen.getByTestId('volume').textContent).toBe('60')
  })

  it('updates and persists track', () => {
    render(<SoundProvider><Probe /></SoundProvider>)
    act(() => { screen.getByText('set fireplace').click() })
    expect(screen.getByTestId('track').textContent).toBe('fireplace')
    expect(localStorage.getItem('folio.sound.track')).toBe('fireplace')
  })

  it('updates and persists volume', () => {
    render(<SoundProvider><Probe /></SoundProvider>)
    act(() => { screen.getByText('vol 25').click() })
    expect(screen.getByTestId('volume').textContent).toBe('25')
    expect(localStorage.getItem('folio.sound.volume')).toBe('25')
  })

  it('updates enabled state', () => {
    render(<SoundProvider><Probe /></SoundProvider>)
    act(() => { screen.getByText('enable').click() })
    expect(screen.getByTestId('enabled').textContent).toBe('true')
  })
})
