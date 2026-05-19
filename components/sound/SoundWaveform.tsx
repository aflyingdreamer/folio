'use client'
import { useSound } from './useSound'

const W = 28
const H = 14
const POINTS = 9

export function SoundWaveform() {
  const { amplitude, isPlaying, toggleControls } = useSound()

  const cy = H / 2
  const maxDev = (H / 2 - 1) * Math.min(1, amplitude * 2.4)
  const pts: string[] = []
  for (let i = 0; i < POINTS; i++) {
    const x = (i / (POINTS - 1)) * W
    const envelope = Math.sin((i / (POINTS - 1)) * Math.PI)
    const sign = i % 2 === 0 ? 1 : -1
    const y = cy + sign * envelope * maxDev
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`)
  }

  return (
    <button
      type="button"
      aria-label="sound"
      onClick={toggleControls}
      className={
        'inline-flex items-center justify-center align-middle transition-opacity ' +
        (isPlaying ? 'opacity-100' : 'opacity-40 hover:opacity-70')
      }
      style={{ width: W, height: H }}
    >
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden>
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={pts.join(' ')}
        />
      </svg>
    </button>
  )
}
