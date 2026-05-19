'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const errorCopy: Record<string, string> = {
  expired: 'that link has expired. send a new one below.',
  missing_code: 'something went wrong with the link. try again.',
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  )
}

function LoginInner() {
  const params = useSearchParams()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    const e = params.get('error')
    if (e && errorCopy[e]) setErr(errorCopy[e])
  }, [params])

  async function sendLink(e?: React.FormEvent) {
    e?.preventDefault()
    if (!email) return
    setErr(null)
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    })
    setLoading(false)
    if (error) setErr(error.message.toLowerCase())
    else setSent(true)
  }

  return (
    <main className="mx-auto max-w-md px-6 mt-32 font-mono text-sm text-stone-700">
      <h1 className="font-serif text-5xl text-stone-900 mb-3">Folio</h1>
      <p className="font-serif text-lg text-stone-500 italic mb-16">
        Three pages. Every morning. For yourself.
      </p>

      {sent ? (
        <div className="space-y-6">
          <p className="text-stone-900">a link is on its way to</p>
          <p className="font-serif text-xl text-stone-900">{email}</p>
          <p className="text-stone-500 leading-relaxed">
            open it on this device to begin. the link expires in an hour.
          </p>
          <button
            onClick={() => {
              setSent(false)
              setEmail('')
            }}
            className="underline underline-offset-4 text-stone-500 hover:text-stone-900 transition"
          >
            use a different email
          </button>
        </div>
      ) : (
        <form onSubmit={sendLink} className="space-y-6">
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-b border-stone-300 bg-transparent py-2 focus:outline-none focus:border-stone-900 transition placeholder:text-stone-400"
            placeholder="your email"
          />
          <button
            type="submit"
            disabled={loading || !email}
            className="border border-stone-900 py-2 px-5 hover:bg-stone-900 hover:text-stone-50 transition disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-stone-700"
          >
            {loading ? 'sending…' : 'send link'}
          </button>
          {err && <p className="text-red-700">{err}</p>}
        </form>
      )}

      <footer className="fixed bottom-8 left-0 right-0 text-center text-xs text-stone-400">
        a tribute to morning pages by Julia Cameron
        <br />
        and 750words.com by Buster Benson
      </footer>
    </main>
  )
}
