'use client'
import { useSound } from './useSound'

const W = 44
const H = 18
const POINTS = 17 // higher density so the wave reads smoothly

// At rest, the line is a gentle sine wave (recognisable as "audio").
// When playing, amplitude scales the wave height beyond rest.
const REST_AMP = 0.18
const CYCLES = 1.5 // number of full sine cycles drawn across the width

export function SoundWaveform() {
  const { amplitude, isPlaying, toggleControls } = useSound()

  const cy = H / 2
  const maxAvailable = H / 2 - 1.5
  // Combine rest amplitude with live amplitude so the waveform "breathes" alive
  // smoothly out of the resting shape rather than snapping from flat to moving.
  const ampNorm = Math.min(1, amplitude * 2.4)
  const drawnAmp = isPlaying
    ? Math.max(REST_AMP, ampNorm) * maxAvailable
    : REST_AMP * maxAvailable

  const pts: string[] = []
  for (let i = 0; i < POINTS; i++) {
    const t = i / (POINTS - 1)
    const x = t * W
    const y = cy + Math.sin(t * Math.PI * 2 * CYCLES) * drawnAmp
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`)
  }

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
          points={pts.join(' ')}
        />
      </svg>
    </button>
  )
}
