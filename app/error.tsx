'use client'

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-32 font-serif text-lg leading-loose text-stone-700">
      <p className="font-mono text-sm text-stone-500 mb-8">— a pause —</p>
      <p>something interrupted the page. take a breath; we&rsquo;ll try again together.</p>
      <p className="mt-12 font-mono text-xs text-stone-400 flex gap-4">
        <button onClick={reset} className="underline hover:text-stone-700">
          try again
        </button>
        <a href="/today" className="underline hover:text-stone-700">
          return to today
        </a>
      </p>
    </main>
  )
}
