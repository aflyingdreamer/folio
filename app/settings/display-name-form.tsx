'use client'
import { useState } from 'react'
import { updateDisplayName } from '@/lib/settings/actions'

export function DisplayNameForm({ initial }: { initial: string }) {
  const [name, setName] = useState(initial)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [err, setErr] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('saving')
    setErr(null)
    const fd = new FormData()
    fd.append('name', name)
    const res = await updateDisplayName(fd)
    if (res?.error) {
      setStatus('error')
      setErr(res.error)
      return
    }
    setStatus('saved')
    setTimeout(() => setStatus('idle'), 1800)
  }

  const label =
    status === 'saving' ? 'saving…' :
    status === 'saved'  ? 'saved'   :
    status === 'error'  ? 'try again' :
    'save'

  return (
    <form onSubmit={onSubmit} className="flex items-end gap-3">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={60}
        required
        className="flex-1 border-b border-stone-300 bg-transparent py-2 font-serif text-base focus:outline-none focus:border-stone-900 transition"
      />
      <button
        type="submit"
        disabled={status === 'saving' || !name.trim()}
        className="font-mono text-xs text-stone-500 hover:text-stone-900 disabled:opacity-40"
      >
        {label}
      </button>
      {err && <span className="font-mono text-xs text-rose-500">{err}</span>}
    </form>
  )
}
