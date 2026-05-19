import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createGraph, crossfadeTo, setMasterGain } from '@/components/sound/audio-graph'

function makeMockAudioContext() {
  const make = () => {
    const node: any = {
      gain: {
        value: 0,
        linearRampToValueAtTime: vi.fn(),
        setValueAtTime: vi.fn(),
        cancelScheduledValues: vi.fn(),
      },
      connect: vi.fn(),
      disconnect: vi.fn(),
    }
    return node
  }
  const ctx: any = {
    currentTime: 0,
    destination: {},
    createGain: vi.fn(make),
    createAnalyser: vi.fn(() => ({
      fftSize: 0,
      smoothingTimeConstant: 0,
      getByteTimeDomainData: vi.fn(),
      connect: vi.fn(),
      disconnect: vi.fn(),
    })),
    createMediaElementSource: vi.fn(() => ({ connect: vi.fn(), disconnect: vi.fn() })),
    resume: vi.fn().mockResolvedValue(undefined),
    state: 'suspended',
  }
  return ctx
}

function makeMockAudio(src = '') {
  const a: any = {
    src,
    loop: false,
    crossOrigin: null,
    play: vi.fn().mockResolvedValue(undefined),
    pause: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }
  return a
}

beforeEach(() => {
  globalThis.AudioContext = vi.fn(makeMockAudioContext) as any
})

describe('createGraph', () => {
  it('builds two source channels feeding one analyser', () => {
    const audioA = makeMockAudio('/sounds/a.mp3')
    const audioB = makeMockAudio('/sounds/b.mp3')
    const g = createGraph({ audioA, audioB })
    expect(g.ctx.createGain).toHaveBeenCalledTimes(3)
    expect(g.ctx.createAnalyser).toHaveBeenCalledTimes(1)
    expect(g.analyser).toBeDefined()
    expect(g.activeChannel).toBe('A')
  })
})

describe('crossfadeTo', () => {
  it('ramps active gain to 0 and incoming gain to 1 over the duration', () => {
    const audioA = makeMockAudio()
    const audioB = makeMockAudio()
    const g = createGraph({ audioA, audioB })
    ;(g.ctx as any).currentTime = 10
    crossfadeTo(g, 'B', '/sounds/new.mp3', 1.5)
    expect(g.gainA.gain.linearRampToValueAtTime).toHaveBeenCalledWith(0, 11.5)
    expect(g.gainB.gain.linearRampToValueAtTime).toHaveBeenCalledWith(1, 11.5)
    expect(audioB.src).toBe('/sounds/new.mp3')
    expect(audioB.play).toHaveBeenCalled()
    expect(g.activeChannel).toBe('B')
  })

  it('is a no-op if target channel already active with same src', () => {
    const audioA = makeMockAudio('/sounds/a.mp3')
    const audioB = makeMockAudio()
    const g = createGraph({ audioA, audioB })
    crossfadeTo(g, 'A', '/sounds/a.mp3', 1.5)
    expect(audioA.play).not.toHaveBeenCalled()
  })
})

describe('setMasterGain', () => {
  it('writes the value to the master gain node', () => {
    const g = createGraph({ audioA: makeMockAudio(), audioB: makeMockAudio() })
    setMasterGain(g, 0.42)
    expect(g.master.gain.value).toBe(0.42)
  })
})
