'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const FULL = 'Three pages. Every morning. For yourself.'
const SPEED_MS = 80

export function TypewriterLine({ ctaHref }: { ctaHref: string }) {
  const [shown, setShown] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setShown(FULL)
      setDone(true)
      return
    }
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
      <p className="font-serif text-4xl sm:text-5xl text-stone-900 leading-tight text-balance">
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
