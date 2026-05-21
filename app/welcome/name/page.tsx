'use client'
import { useState } from 'react'
import { saveDisplayName } from '@/lib/auth/actions'

export default function WelcomeNamePage() {
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErr(null)
    setLoading(true)
    const res = await saveDisplayName(new FormData(e.currentTarget))
    setLoading(false)
    if (res?.error) setErr(res.error)
  }

  return (
    <main className="mx-auto max-w-md px-6 mt-20 sm:mt-32 pb-20 font-mono text-sm text-stone-700">
      <h1 className="font-serif text-4xl sm:text-5xl text-stone-900 mb-3">Mornings</h1>
      <p className="font-serif text-lg text-stone-500 italic mb-12">
        what should the page call you?
      </p>

      <form onSubmit={onSubmit} className="space-y-5">
        <input
          name="name"
          type="text"
          required
          autoFocus
          autoComplete="name"
          maxLength={60}
          placeholder="your name"
          className="w-full border-b border-stone-300 bg-transparent py-2 focus:outline-none focus:border-stone-900 transition placeholder:text-stone-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="border border-stone-900 py-2 px-5 hover:bg-stone-900 hover:text-stone-50 transition disabled:opacity-40"
        >
          {loading ? 'saving…' : 'continue →'}
        </button>
        {err && <p className="text-red-700">{err}</p>}
      </form>
    </main>
  )
}
