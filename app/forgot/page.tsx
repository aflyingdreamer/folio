'use client'
import Link from 'next/link'
import { useState } from 'react'
import { requestPasswordReset } from '@/lib/auth/actions'

export default function ForgotPage() {
  const [err, setErr] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErr(null)
    setLoading(true)
    const res = await requestPasswordReset(new FormData(e.currentTarget))
    setLoading(false)
    if (res?.error) setErr(res.error)
    else if (res?.sent) setSent(true)
  }

  return (
    <main className="mx-auto max-w-md px-6 mt-32 font-mono text-sm text-stone-700">
      <h1 className="font-serif text-5xl text-stone-900 mb-12">Folio</h1>

      {sent ? (
        <div className="space-y-4">
          <p className="font-serif text-xl text-stone-900">a reset link is on its way.</p>
          <p className="text-stone-500 leading-relaxed">
            open it on this device. the link expires in an hour.
          </p>
          <Link
            href="/login"
            className="inline-block mt-6 underline underline-offset-4 text-stone-500 hover:text-stone-900"
          >
            back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5">
          <p className="font-serif text-lg text-stone-700 mb-6">reset your password.</p>
          <input
            name="email"
            type="email"
            required
            autoFocus
            placeholder="your email"
            className="w-full border-b border-stone-300 bg-transparent py-2 focus:outline-none focus:border-stone-900 transition placeholder:text-stone-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="border border-stone-900 py-2 px-5 hover:bg-stone-900 hover:text-stone-50 transition disabled:opacity-40"
          >
            {loading ? 'sending…' : 'send reset link'}
          </button>
          {err && <p className="text-red-700">{err}</p>}
        </form>
      )}

      <p className="mt-12">
        <Link
          href="/login"
          className="text-stone-500 hover:text-stone-900 underline underline-offset-4 decoration-stone-300"
        >
          ← back to sign in
        </Link>
      </p>
    </main>
  )
}
