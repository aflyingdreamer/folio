'use client'
import { useSound } from './useSound'

export function FirstVisitAsk() {
  const { prefs, setEnabled } = useSound()
  if (prefs.enabled !== null) return null

  return (
    <div
      data-folio-first-visit-ask
      className="fixed top-16 right-6 z-30 font-mono text-xs text-stone-500 flex items-center gap-4"
    >
      <span>play ambient sound while you write?</span>
      <button type="button" onClick={() => setEnabled(true)} className="hover:text-stone-700 transition">
        yes
      </button>
      <button type="button" onClick={() => setEnabled(false)} className="hover:text-stone-700 transition">
        no, thanks
      </button>
    </div>
  )
}
