'use client'
import { useSound } from './useSound'
import { TRACKS } from './tracks'

export function SoundControls() {
  const { prefs, controlsOpen, isPlaying, setTrack, setVolume, togglePlay, toggleLoopMode } = useSound()
  if (!controlsOpen) return null

  return (
    <div
      data-folio-sound-controls
      className="fixed top-16 right-6 z-30 font-mono text-xs text-stone-500 max-w-[640px] flex flex-col items-end gap-3"
    >
      <div className="flex flex-wrap justify-end gap-x-3 gap-y-1">
        {TRACKS.map((t, i) => (
          <span key={t.slug} className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTrack(t.slug)}
              className={
                'transition hover:text-stone-700 ' +
                (t.slug === prefs.track ? 'text-stone-700' : 'opacity-40')
              }
            >
              {t.label}
            </button>
            {i < TRACKS.length - 1 && <span className="opacity-30">·</span>}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-6">
        <VolumeLine value={prefs.volume} onChange={setVolume} />
        <button type="button" onClick={togglePlay} className="hover:text-stone-700 transition">
          {isPlaying ? 'pause' : 'play'}
        </button>
        <button type="button" onClick={toggleLoopMode} className="hover:text-stone-700 transition">
          {prefs.loopMode === 'loop_one' ? 'loop one' : 'shuffle'}
        </button>
      </div>
    </div>
  )
}

function VolumeLine({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="folio-volume w-32 appearance-none bg-transparent cursor-pointer"
        aria-label="volume"
      />
      <span className="w-8 text-right opacity-60">{value}</span>
    </label>
  )
}
