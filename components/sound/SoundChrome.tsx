'use client'
import { usePathname } from 'next/navigation'
import { SoundWaveform } from './SoundWaveform'
import { SoundControls } from './SoundControls'
import { FirstVisitAsk } from './FirstVisitAsk'

const HIDDEN_PREFIXES = ['/login', '/signup', '/forgot', '/reset', '/auth']

export function SoundChrome() {
  const pathname = usePathname() ?? ''
  const hidden = HIDDEN_PREFIXES.some(p => pathname === p || pathname.startsWith(p + '/'))
  if (hidden) return null

  return (
    <>
      <div
        data-folio-sound-waveform-slot
        className="fixed top-6 right-[148px] z-40 text-stone-400 hover:text-stone-700 transition-colors"
      >
        <SoundWaveform />
      </div>
      <FirstVisitAsk />
      <SoundControls />
    </>
  )
}
