'use client'
import { useState } from 'react'
import Link from 'next/link'
import { changePassword } from '@/lib/settings/actions'

export function PasswordForm() {
  const [status, setStatus] = useState<'idle' | 'saving' | 'updated' | 'error'>('idle')
  const [err, setErr] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setStatus('saving')
    setErr(null)
    const res = await changePassword(new FormData(form))
    if (res?.error) {
      setStatus('error')
      setErr(res.error)
      return
    }
    setStatus('updated')
    form.reset()
    setTimeout(() => setStatus('idle'), 1800)
  }

  const label =
    status === 'saving' ? 'saving…' :
    status === 'updated' ? 'saved' :
    status === 'error' ? 'try again' :
    'save'

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input
        name="password"
        type="password"
        placeholder="new password"
        minLength={8}
        required
        autoComplete="new-password"
        className="w-full border-b border-stone-300 bg-transparent py-2 font-serif text-base placeholder:text-stone-400 focus:outline-none focus:border-stone-900 transition"
      />
      <input
        name="confirm"
        type="password"
        placeholder="confirm new password"
        minLength={8}
        required
        autoComplete="new-password"
        className="w-full border-b border-stone-300 bg-transparent py-2 font-serif text-base placeholder:text-stone-400 focus:outline-none focus:border-stone-900 transition"
      />
      <div className="flex items-center justify-between pt-1">
        <Link href="/forgot" className="font-mono text-xs text-stone-400 hover:text-stone-700">
          forgot password?
        </Link>
        <button
          type="submit"
          disabled={status === 'saving'}
          className="font-mono text-xs text-stone-500 hover:text-stone-900 disabled:opacity-40"
        >
          {label}
        </button>
      </div>
      {err && <p className="font-mono text-xs text-rose-500">{err}</p>}
    </form>
  )
}
