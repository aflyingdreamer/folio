'use client'
import Link from 'next/link'
import { useState } from 'react'
import { signUp } from '@/lib/auth/actions'
import { GoogleButton } from '@/components/ui/google-button'

export default function SignupPage() {
  const [err, setErr] = useState<string | null>(null)
  const [confirmNotice, setConfirmNotice] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErr(null)
    setLoading(true)
    const res = await signUp(new FormData(e.currentTarget))
    setLoading(false)
    if (res?.error) setErr(res.error)
    else if (res?.needsConfirm) {
      setConfirmNotice(`we sent a confirmation link to ${res.email}. open it to begin.`)
    }
  }

  if (confirmNotice) {
    return (
      <main className="mx-auto max-w-md px-6 mt-20 sm:mt-32 pb-20 font-mono text-sm text-stone-700">
        <h1 className="font-serif text-4xl sm:text-5xl text-stone-900 mb-6">Mornings</h1>
        <p className="font-serif text-xl text-stone-900 leading-relaxed">{confirmNotice}</p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-md px-6 mt-20 sm:mt-32 pb-20 font-mono text-sm text-stone-700">
      <h1 className="font-serif text-4xl sm:text-5xl text-stone-900 mb-3">Mornings</h1>
      <p className="font-serif text-lg text-stone-500 italic mb-12">
        Three pages. Every morning. For yourself.
      </p>

      <GoogleButton label="sign up with google" />

      <div className="flex items-center gap-3 my-6 text-xs text-stone-400">
        <span className="h-px flex-1 bg-stone-200" />
        or
        <span className="h-px flex-1 bg-stone-200" />
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <Field name="name" type="text" placeholder="your name" autoComplete="name" autoFocus />
        <Field name="email" type="email" placeholder="your email" autoComplete="email" />
        <Field
          name="password"
          type="password"
          placeholder="a password (6+ characters, your secret)"
          autoComplete="new-password"
        />

        <button
          type="submit"
          disabled={loading}
          className="border border-stone-900 py-2 px-5 hover:bg-stone-900 hover:text-stone-50 transition disabled:opacity-40 mt-2"
        >
          {loading ? 'creating…' : 'create account →'}
        </button>

        {err && <p className="text-red-700">{err}</p>}
      </form>

      <p className="mt-12 text-stone-500">
        already have an account?{' '}
        <Link
          href="/login"
          className="text-stone-900 underline underline-offset-4 decoration-stone-300 hover:decoration-stone-900"
        >
          sign in
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
