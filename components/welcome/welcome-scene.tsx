'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Quote } from '@/lib/welcome/quotes'

const HOLD_MS = 3200

export function WelcomeScene({
  name,
  first,
  quote,
}: {
  name: string
  first: boolean
  quote: Quote
}) {
  const router = useRouter()

  useEffect(() => {
    const t = setTimeout(() => router.replace('/today'), HOLD_MS)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') router.replace('/today')
    }
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', onKey)
    }
  }, [router])

  const greeting = first
    ? `Welcome, ${name}. The page is yours.`
    : `Welcome back, ${name}.`

  return (
    <main
      onClick={() => router.replace('/today')}
      className="min-h-screen flex flex-col items-center justify-center px-6 bg-stone-50 folio-paper-grain cursor-pointer select-none"
    >
      <p className="font-serif text-4xl sm:text-5xl text-stone-900 text-balance text-center animate-folio-fade-in">
        {greeting}
      </p>
      <figure className="mt-10 sm:mt-16 max-w-md text-center animate-folio-fade-in-late">
        <blockquote className="font-serif italic text-stone-500 text-base sm:text-lg leading-relaxed text-balance">
          &ldquo;{quote.text}&rdquo;
        </blockquote>
        <figcaption className="mt-4 font-mono text-xs text-stone-400">
          — {quote.author}
        </figcaption>
      </figure>
      <p className="mt-12 sm:mt-20 font-mono text-xs text-stone-300">
        <span className="sm:hidden">tap anywhere to continue</span>
        <span className="hidden sm:inline">press enter to continue</span>
      </p>
    </main>
  )
}
