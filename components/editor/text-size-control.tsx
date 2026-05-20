'use client'
import { useEffect, useState } from 'react'

const KEY = 'folio.textSize'
const EVENT = 'folio:text-size'
export const TEXT_SIZE_STEPS = [
  'text-base sm:text-lg',
  'text-lg sm:text-xl',
  'text-xl sm:text-2xl',
  'text-2xl sm:text-3xl',
] as const
export const MAX_STEP = TEXT_SIZE_STEPS.length - 1

function readStep(): number {
  if (typeof window === 'undefined') return 0
  const raw = window.localStorage.getItem(KEY)
  const n = raw ? parseInt(raw, 10) : 0
  return Number.isFinite(n) && n >= 0 && n <= MAX_STEP ? n : 0
}

export function useTextSize() {
  const [step, setStep] = useState(0)
  useEffect(() => {
    setStep(readStep())
    const onChange = (e: Event) => setStep((e as CustomEvent<number>).detail)
    window.addEventListener(EVENT, onChange)
    return () => window.removeEventListener(EVENT, onChange)
  }, [])
  return { step, className: TEXT_SIZE_STEPS[step] }
}

export function TextSizeMenuControl() {
  const [step, setStep] = useState(0)
  useEffect(() => setStep(readStep()), [])
  function update(next: number) {
    const clamped = Math.max(0, Math.min(MAX_STEP, next))
    setStep(clamped)
    try {
      window.localStorage.setItem(KEY, String(clamped))
    } catch {}
    window.dispatchEvent(new CustomEvent(EVENT, { detail: clamped }))
  }
  return (
    <div className="flex items-center justify-between gap-4 whitespace-nowrap">
      <span>text size</span>
      <span className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => update(step - 1)}
          disabled={step === 0}
          aria-label="decrease text size"
          className="hover:text-stone-900 disabled:opacity-30 disabled:hover:text-stone-500"
        >
          a-
        </button>
        <button
          type="button"
          onClick={() => update(step + 1)}
          disabled={step === MAX_STEP}
          aria-label="increase text size"
          className="hover:text-stone-900 disabled:opacity-30 disabled:hover:text-stone-500 text-sm"
        >
          A+
        </button>
      </span>
    </div>
  )
}
