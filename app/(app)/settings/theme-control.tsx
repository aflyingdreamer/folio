'use client'
import { useEffect, useState, useTransition } from 'react'
import { saveTheme } from '@/lib/settings/actions'
import type { ThemeChoice } from '@/lib/settings/theme'

const OPTIONS: ThemeChoice[] = ['light', 'dark', 'system']

function applyResolved(choice: ThemeChoice) {
  const resolved =
    choice === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : choice
  document.documentElement.setAttribute('data-theme', resolved)
  document.documentElement.setAttribute('data-theme-pref', choice)
}

export function ThemeControl({ initial }: { initial: ThemeChoice }) {
  const [value, setValue] = useState<ThemeChoice>(initial)
  const [, startTransition] = useTransition()

  // When the user picks 'system', follow live OS changes until they change choice.
  useEffect(() => {
    if (value !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyResolved('system')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [value])

  function onPick(choice: ThemeChoice) {
    if (choice === value) return
    setValue(choice)
    applyResolved(choice)
    startTransition(() => {
      saveTheme(choice)
    })
  }

  return (
    <div
      role="radiogroup"
      aria-label="appearance"
      className="inline-flex border border-stone-200 rounded-sm overflow-hidden font-mono text-xs"
    >
      {OPTIONS.map((opt, i) => {
        const active = opt === value
        return (
          <button
            key={opt}
            role="radio"
            aria-checked={active}
            onClick={() => onPick(opt)}
            className={[
              'px-3 py-1.5 transition',
              i > 0 ? 'border-l border-stone-200' : '',
              active
                ? 'bg-stone-900 text-stone-50'
                : 'text-stone-500 hover:text-stone-900',
            ].join(' ')}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}
