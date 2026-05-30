'use client'
import { useState, useTransition } from 'react'
import { recordPaletteInterest } from '@/lib/settings/actions'

type Palette = {
  name: string
  light: string
  dark: string
}

const PALETTES: Palette[] = [
  { name: 'sepia', light: '#f4ecd8', dark: '#3a2f24' },
  { name: 'midnight', light: '#e8eaf2', dark: '#1a1f2e' },
  { name: 'forest', light: '#e8efe4', dark: '#1f2a22' },
  { name: 'dawn', light: '#fce8e6', dark: '#2a1c20' },
]

export function PaletteControl({ initialInterested }: { initialInterested: boolean }) {
  const [open, setOpen] = useState(false)
  const [interested, setInterested] = useState(initialInterested)
  const [showCTA, setShowCTA] = useState(false)
  const [pending, startTransition] = useTransition()

  function onSwatchClick() {
    setShowCTA(true)
  }

  function onCountMeIn() {
    if (interested) return
    startTransition(async () => {
      const res = await recordPaletteInterest()
      if (!res.error) setInterested(true)
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 font-mono text-xs pt-2">
        <span className="text-stone-700">paper</span>
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-stone-500 hover:text-stone-900 transition"
        >
          {open ? 'hide' : 'more palettes →'}
        </button>
      </div>

      {open && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-3">
            {PALETTES.map((p) => (
              <button
                key={p.name}
                onClick={onSwatchClick}
                className="group flex flex-col items-center gap-1.5 focus:outline-none"
                aria-label={`preview palette ${p.name}`}
              >
                <span className="inline-flex border border-stone-200 rounded-sm overflow-hidden">
                  <span
                    className="block w-5 h-5"
                    style={{ backgroundColor: p.light }}
                  />
                  <span
                    className="block w-5 h-5"
                    style={{ backgroundColor: p.dark }}
                  />
                </span>
                <span className="font-mono text-[10px] text-stone-500 group-hover:text-stone-900 transition">
                  {p.name}
                </span>
              </button>
            ))}
          </div>

          {showCTA && (
            <div className="pt-1">
              {interested ? (
                <p className="font-mono text-xs text-stone-400">
                  you&apos;ll be the first to know.
                </p>
              ) : (
                <p className="font-serif text-sm text-stone-600">
                  palettes are coming for supporters.{' '}
                  <button
                    onClick={onCountMeIn}
                    disabled={pending}
                    className="font-mono text-xs text-stone-900 underline underline-offset-4 decoration-stone-300 hover:decoration-stone-900 transition disabled:opacity-50"
                  >
                    count me in →
                  </button>
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
