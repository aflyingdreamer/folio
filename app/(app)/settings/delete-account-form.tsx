'use client'
import { useState, useTransition } from 'react'
import { deleteAccount } from '@/lib/settings/actions'

export function DeleteAccountForm() {
  const [armed, setArmed] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  if (!armed) {
    return (
      <button
        type="button"
        onClick={() => setArmed(true)}
        className="font-mono text-xs text-stone-400 hover:text-rose-600 transition"
      >
        delete my account
      </button>
    )
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErr(null)
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const res = await deleteAccount(fd)
      if (res?.error) setErr(res.error)
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <p className="font-serif text-sm text-stone-600">
        this erases every page you’ve written and your account. it cannot be undone.
      </p>
      <input
        name="confirm"
        type="text"
        placeholder='type "delete" to confirm'
        autoComplete="off"
        required
        className="w-full border-b border-stone-300 bg-transparent py-2 font-serif text-base placeholder:text-stone-400 focus:outline-none focus:border-rose-600 transition"
      />
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={() => { setArmed(false); setErr(null) }}
          className="font-mono text-xs text-stone-400 hover:text-stone-700"
        >
          cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="font-mono text-xs text-rose-500 hover:text-rose-700 disabled:opacity-40"
        >
          {isPending ? 'erasing…' : 'erase everything'}
        </button>
      </div>
      {err && <p className="font-mono text-xs text-rose-500">{err}</p>}
    </form>
  )
}
