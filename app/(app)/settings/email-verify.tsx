'use client'
import { useEffect, useState } from 'react'
import { resendEmailConfirmation } from '@/lib/settings/actions'

export function EmailVerify({ email, verified }: { email: string; verified: boolean }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (state !== 'sent') return
    const t = setTimeout(() => setState('idle'), 60_000)
    return () => clearTimeout(t)
  }, [state])

  async function onResend() {
    setState('sending')
    setErr(null)
    const res = await resendEmailConfirmation()
    if (res?.error) {
      setState('error')
      setErr(res.error)
      return
    }
    setState('sent')
  }

  return (
    <div className="space-y-2">
      <p className="font-serif text-base text-stone-700">{email}</p>
      {verified ? (
        <p className="font-mono text-xs text-stone-400">verified</p>
      ) : (
        <>
          <p className="font-mono text-xs text-stone-400">
            not verified yet{' '}
            {state === 'idle' && (
              <button onClick={onResend} className="ml-1 hover:text-stone-700 underline decoration-stone-300 underline-offset-4">
                send verification email
              </button>
            )}
            {state === 'sending' && <span className="ml-1">sending…</span>}
            {state === 'sent' && <span className="ml-1 text-stone-600">check your inbox</span>}
            {state === 'error' && (
              <button onClick={onResend} className="ml-1 text-rose-500 hover:text-rose-700">try again</button>
            )}
          </p>
          {err && <p className="font-mono text-xs text-rose-500">{err}</p>}
          <p className="font-serif text-sm text-stone-500 leading-relaxed">
            Verifying your email lets you recover your account if you forget your password. Optional.
          </p>
        </>
      )}
    </div>
  )
}
