'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const FULL = 'Three pages. Every morning. For yourself.'
const SPEED_MS = 80

export function TypewriterLine({ ctaHref }: { ctaHref: string }) {
  // SSR + first paint show the full text immediately so Lighthouse captures a
  // fast LCP. On the client we briefly reset and animate if motion is allowed.
  const [shown, setShown] = useState(FULL)
  const [done, setDone] = useState(true)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    setShown('')
    setDone(false)
    let i = 0
    const id = setInterval(() => {
      i += 1
      setShown(FULL.slice(0, i))
      if (i >= FULL.length) {
        clearInterval(id)
        setDone(true)
      }
    }, SPEED_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="text-center">
      <p
        className="font-serif text-4xl sm:text-5xl text-stone-900 leading-tight text-balance"
        suppressHydrationWarning
      >
        {shown}
        <span
          aria-hidden
          className="inline-block w-[2px] h-[1em] bg-stone-500 align-[-0.15em] ml-1 animate-pulse"
        />
      </p>
      <div
        className={`mt-12 font-mono text-sm transition-opacity duration-700 ${
          done ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden={!done}
      >
        <Link
          href={ctaHref}
          tabIndex={done ? 0 : -1}
          className="text-stone-700 hover:text-stone-900 underline underline-offset-4 decoration-stone-300 hover:decoration-stone-900 transition"
        >
          start writing →
        </Link>
      </div>
    </div>
  )
}
