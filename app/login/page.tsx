'use client'
import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { signIn } from '@/lib/auth/actions'

const errorCopy: Record<string, string> = {
  expired: 'that link has expired. try signing in again.',
  reset_sent: 'check your inbox for a password reset link.',
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
  const [err, setErr] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const e = params.get('error')
    const m = params.get('message')
    if (e && errorCopy[e]) setErr(errorCopy[e])
    if (m === 'reset_sent') setInfo('check your inbox for a password reset link.')
  }, [params])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErr(null)
    setLoading(true)
    const res = await signIn(new FormData(e.currentTarget))
    setLoading(false)
    if (res?.error) setErr(res.error)
  }

  return (
    <main className="mx-auto max-w-md px-6 mt-20 sm:mt-32 pb-20 font-mono text-sm text-stone-700">
      <h1 className="font-serif text-4xl sm:text-5xl text-stone-900 mb-3">Folio</h1>
      <p className="font-serif text-lg text-stone-500 italic mb-12">
        Three pages. Every morning. For yourself.
      </p>

      <form onSubmit={onSubmit} className="space-y-5">
        <Field name="email" type="email" placeholder="your email" autoComplete="email" autoFocus />
        <Field name="password" type="password" placeholder="password" autoComplete="current-password" />

        <div className="flex items-center justify-between gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="border border-stone-900 py-2 px-5 hover:bg-stone-900 hover:text-stone-50 transition disabled:opacity-40"
          >
            {loading ? 'signing in…' : 'sign in'}
          </button>
          <Link
            href="/forgot"
            className="text-stone-500 hover:text-stone-900 underline underline-offset-4 decoration-stone-300"
          >
            forgot password?
          </Link>
        </div>

        {err && <p className="text-red-700">{err}</p>}
        {info && <p className="text-stone-600">{info}</p>}
      </form>

      <p className="mt-12 text-stone-500">
        no account?{' '}
        <Link
          href="/signup"
          className="text-stone-900 underline underline-offset-4 decoration-stone-300 hover:decoration-stone-900"
        >
          sign up
        </Link>
      </p>

      <footer className="mt-20 text-center text-xs text-stone-400 sm:fixed sm:bottom-8 sm:left-0 sm:right-0 sm:mt-0">
        a tribute to morning pages by Julia Cameron
        <br />
        and 750words.com by Buster Benson
      </footer>
    </main>
  )
}

function Field({
  name,
  type,
  placeholder,
  autoComplete,
  autoFocus,
}: {
  name: string
  type: string
  placeholder: string
  autoComplete?: string
  autoFocus?: boolean
}) {
  return (
    <input
      name={name}
      type={type}
      required
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      placeholder={placeholder}
      className="w-full border-b border-stone-300 bg-transparent py-2 focus:outline-none focus:border-stone-900 transition placeholder:text-stone-400"
    />
  )
}
