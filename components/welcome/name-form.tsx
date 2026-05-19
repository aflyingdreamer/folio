'use client'
import { useState } from 'react'
import { saveDisplayName } from '@/lib/user/save-display-name'

export function NameForm() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setErr(null)
    const res = await saveDisplayName(name)
    if (res?.error) {
      setErr(res.error)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 font-mono text-sm">
      <input
        type="text"
        autoFocus
        required
        maxLength={60}
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full text-center font-serif text-2xl border-b border-stone-300 bg-transparent py-3 focus:outline-none focus:border-stone-900 transition placeholder:text-stone-300"
        placeholder="your name"
      />
      <button
        type="submit"
        disabled={loading || !name.trim()}
        className="border border-stone-900 py-2 px-5 hover:bg-stone-900 hover:text-stone-50 transition disabled:opacity-40"
      >
        {loading ? 'saving…' : 'continue →'}
      </button>
      {err && <p className="text-red-700">{err}</p>}
    </form>
  )
}
