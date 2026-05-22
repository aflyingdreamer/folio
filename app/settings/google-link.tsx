'use client'
import { useEffect, useState } from 'react'
import type { UserIdentity } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

export function GoogleLink() {
  const supabase = createClient()
  const [identities, setIdentities] = useState<UserIdentity[] | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUserIdentities().then(({ data }) => {
      setIdentities(data?.identities ?? [])
    })
  }, [supabase])

  const google = identities?.find((i) => i.provider === 'google')
  const canUnlink = (identities?.length ?? 0) > 1

  async function link() {
    setErr(null)
    setBusy(true)
    const { error } = await supabase.auth.linkIdentity({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/settings` },
    })
    if (error) {
      setErr(error.message)
      setBusy(false)
    }
  }

  async function unlink() {
    if (!google || !canUnlink) return
    setErr(null)
    setBusy(true)
    const { error } = await supabase.auth.unlinkIdentity(google)
    if (error) setErr(error.message)
    else setIdentities((prev) => prev?.filter((i) => i.identity_id !== google.identity_id) ?? null)
    setBusy(false)
  }

  if (identities === null) {
    return <p className="font-mono text-xs text-stone-400">loading…</p>
  }

  return (
    <div className="space-y-2 font-mono text-sm">
      {google ? (
        <>
          <p className="text-stone-700">
            linked as <span className="text-stone-900">{google.identity_data?.email ?? 'google account'}</span>
          </p>
          <button
            type="button"
            onClick={unlink}
            disabled={busy || !canUnlink}
            title={canUnlink ? '' : 'set a password first so you can still sign in'}
            className="text-stone-500 hover:text-stone-900 underline underline-offset-4 decoration-stone-300 disabled:opacity-40 disabled:no-underline"
          >
            {busy ? 'unlinking…' : 'unlink'}
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={link}
          disabled={busy}
          className="border border-stone-300 hover:border-stone-900 transition py-2 px-4 disabled:opacity-40"
        >
          {busy ? 'redirecting…' : 'link google account'}
        </button>
      )}
      {err && <p className="text-red-700 text-xs">{err}</p>}
    </div>
  )
}
