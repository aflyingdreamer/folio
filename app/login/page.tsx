'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    })
    if (error) setErr(error.message)
    else setSent(true)
  }

  return (
    <main className="mx-auto max-w-md px-6 mt-32 font-mono text-stone-700">
      <h1 className="font-serif text-4xl text-stone-900 mb-12">Folio</h1>
      {sent ? (
        <p>check your inbox.</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-b border-stone-300 bg-transparent py-2 focus:outline-none focus:border-stone-900"
            placeholder="email"
          />
          <button className="border border-stone-900 py-2 px-4 hover:bg-stone-900 hover:text-stone-50 transition">
            send link
          </button>
          {err && <p className="text-red-700 text-sm">{err}</p>}
        </form>
      )}
    </main>
  )
}
