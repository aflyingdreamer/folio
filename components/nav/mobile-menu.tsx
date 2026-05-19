'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { signOut } from '@/lib/auth/sign-out'

export function MobileMenu() {
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
    <div className="sm:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="menu"
        className="font-mono text-xs text-stone-400 hover:text-stone-700"
      >
        {open ? 'close' : 'menu'}
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute top-8 right-0 z-40 bg-stone-50 border border-stone-200 rounded-sm py-3 px-5 flex flex-col gap-3 font-mono text-xs text-stone-500 min-w-[120px]">
            <Link href="/today" onClick={() => setOpen(false)} className="hover:text-stone-900">today</Link>
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                window.dispatchEvent(new Event('folio:open-archive'))
              }}
              className="hover:text-stone-900 text-left"
            >
              archive
            </button>
            <Link href="/about" onClick={() => setOpen(false)} className="hover:text-stone-900">about</Link>
            <form action={signOut}>
              <button type="submit" className="hover:text-stone-900 text-left w-full">sign out</button>
            </form>
          </div>
        </>
      )}
    </div>
  )
}
