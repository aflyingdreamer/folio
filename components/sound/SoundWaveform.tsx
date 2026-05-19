'use client'
import { useSound } from './useSound'

const W = 44
const H = 18
const REST_POINTS = 17
const REST_AMP = 0.18
const REST_CYCLES = 1.5

function pathFor(samples: number[]): string {
  const cy = H / 2
  const max = H / 2 - 1.5
  const n = samples.length
  const pts: string[] = []
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * W
    const y = cy + samples[i] * max
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`)
  }
  return pts.join(' ')
}

function restSamples(): number[] {
  const out: number[] = new Array(REST_POINTS)
  for (let i = 0; i < REST_POINTS; i++) {
    const t = i / (REST_POINTS - 1)
    out[i] = Math.sin(t * Math.PI * 2 * REST_CYCLES) * REST_AMP
  }
  return out
}

const REST = restSamples()

export function SoundWaveform() {
  const { waveform, isPlaying, toggleControls } = useSound()

  const samples = isPlaying && waveform.length > 0 ? waveform : REST

  return (
    <button
      type="button"
      aria-label="sound"
      title="sound"
      onClick={toggleControls}
      className={
        'inline-flex items-center justify-center align-middle transition-opacity ' +
        (isPlaying ? 'opacity-100' : 'opacity-60 hover:opacity-100')
      }
      style={{ width: W, height: H }}
    >
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden>
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={pathFor(samples)}
        />
      </svg>
    </button>
  )
}
