'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { signInWithGoogle, verifyOtpCode } from '@/lib/auth/sign-in'

const errorCopy: Record<string, string> = {
  expired: 'that link has expired. send a new one below.',
  missing_code: 'something went wrong with the link. try again.',
  oauth: 'google sign-in failed. try again or use email.',
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
  const [mode, setMode] = useState<'link' | 'code'>('link')
  const [code, setCode] = useState('')

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

  async function submitCode(e?: React.FormEvent) {
    e?.preventDefault()
    if (!code || !email) return
    setErr(null)
    setLoading(true)
    const res = await verifyOtpCode(email, code.trim())
    setLoading(false)
    if (res.error) setErr(res.error)
    else location.assign('/auth/post-verify')
  }

  return (
    <main className="mx-auto max-w-md px-6 mt-32 font-mono text-sm text-stone-700">
      <h1 className="font-serif text-5xl text-stone-900 mb-3">Folio</h1>
      <p className="font-serif text-lg text-stone-500 italic mb-12">
        Three pages. Every morning. For yourself.
      </p>

      {/* Google */}
      {!sent && (
        <>
          <form action={signInWithGoogle}>
            <button
              type="submit"
              className="w-full border border-stone-900 py-3 px-4 hover:bg-stone-900 hover:text-stone-50 transition flex items-center justify-center gap-3"
            >
              <GoogleGlyph />
              continue with google
            </button>
          </form>

          <div className="my-8 flex items-center gap-4 text-stone-400 text-xs">
            <span className="flex-1 h-px bg-stone-200" />
            or by email
            <span className="flex-1 h-px bg-stone-200" />
          </div>
        </>
      )}

      {sent ? (
        <div className="space-y-6">
          <p className="text-stone-900">a link is on its way to</p>
          <p className="font-serif text-xl text-stone-900">{email}</p>
          <p className="text-stone-500 leading-relaxed">
            open it on this device — or paste the 6-digit code from the
            email below.
          </p>

          <form onSubmit={submitCode} className="space-y-4">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              className="w-40 border-b border-stone-300 bg-transparent py-2 focus:outline-none focus:border-stone-900 transition placeholder:text-stone-400 tracking-[0.4em] text-center"
              placeholder="••••••"
              autoFocus
            />
            <div className="flex gap-4 items-center">
              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="border border-stone-900 py-2 px-5 hover:bg-stone-900 hover:text-stone-50 transition disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-stone-700"
              >
                {loading ? 'verifying…' : 'enter'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSent(false)
                  setCode('')
                  setEmail('')
                  setErr(null)
                }}
                className="underline underline-offset-4 text-stone-500 hover:text-stone-900 transition"
              >
                use a different email
              </button>
            </div>
            {err && <p className="text-red-700">{err}</p>}
          </form>
        </div>
      ) : (
        <form onSubmit={sendLink} className="space-y-6">
          <input
            type="email"
            required
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

function GoogleGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.2-.1-2.3-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.5-5.2l-6.2-5.2c-2 1.4-4.5 2.4-7.3 2.4-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.6l6.2 5.2C40.9 35.6 44 30.3 44 24c0-1.2-.1-2.3-.4-3.5z"/>
    </svg>
  )
}
