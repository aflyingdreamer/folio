'use client'

import { useEffect, useState } from 'react'

export function TipButton() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hover:text-stone-700 transition"
      >
        buy me a coffee
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Leave a tip"
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-[min(420px,92vw)] rounded-lg bg-stone-50 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-stone-900 text-stone-50 font-mono text-xs hover:bg-stone-700 transition"
            >
              ✕
            </button>
            <iframe
              src="https://ko-fi.com/brianfolio/?hidefeed=true&widget=true&embed=true&preview=true"
              style={{ border: 'none', width: '100%', padding: 4, background: '#f9f9f9' }}
              height={712}
              title="brianfolio"
            />
          </div>
        </div>
      )}
    </>
  )
}
