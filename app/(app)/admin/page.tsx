import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

type Row = {
  user_id: string
  email: string
  display_name: string | null
  timezone: string
  theme: string
  palette_interest: boolean
  first_source: string | null
  first_medium: string | null
  first_campaign: string | null
  first_referrer: string | null
  first_landing_path: string | null
  first_landing_at: string | null
  joined_at: string
  last_sign_in_at: string | null
  email_confirmed_at: string | null
  entry_count: number
  total_words: number
  first_entry_date: string | null
  last_entry_date: string | null
  days_since_last_entry: number | null
}

function locationFromTz(tz: string): string {
  if (!tz || tz === 'UTC') return '—'
  const parts = tz.split('/')
  const city = parts[parts.length - 1]?.replace(/_/g, ' ') ?? tz
  const region = parts.length > 1 ? parts[0] : ''
  return region ? `${city}, ${region}` : city
}

function ymd(d: string | null): string {
  if (!d) return '—'
  return new Date(d).toISOString().slice(0, 10)
}

export default async function AdminPage() {
  const supabase = createClient()
  const { data, error } = await supabase.rpc('admin_list_users')
  if (error || !data) notFound()
  const rows = data as Row[]

  const totalUsers = rows.length
  const writers = rows.filter((r) => r.entry_count > 0).length
  const totalEntries = rows.reduce((s, r) => s + r.entry_count, 0)
  const totalWords = rows.reduce((s, r) => s + r.total_words, 0)
  const palette = rows.filter((r) => r.palette_interest).length

  return (
    <main className="mx-auto max-w-7xl px-6 py-16 font-mono text-sm text-stone-700">
      <h1 className="text-xs uppercase tracking-widest text-stone-400 mb-6">user board</h1>

      <dl className="grid grid-cols-2 sm:grid-cols-5 gap-6 mb-10 text-xs">
        <Stat label="users" value={totalUsers} />
        <Stat label="writers" value={`${writers} / ${totalUsers}`} />
        <Stat label="entries" value={totalEntries} />
        <Stat label="words" value={totalWords.toLocaleString()} />
        <Stat label="palette interest" value={palette} />
      </dl>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="text-left uppercase tracking-wider text-stone-400 border-b border-stone-200">
              <Th>email</Th>
              <Th>name</Th>
              <Th>location</Th>
              <Th>theme</Th>
              <Th className="text-right">entries</Th>
              <Th className="text-right">words</Th>
              <Th>last entry</Th>
              <Th className="text-right">days idle</Th>
              <Th>joined</Th>
              <Th>last seen</Th>
              <Th>palette?</Th>
              <Th>source</Th>
              <Th>medium</Th>
              <Th>referrer / landing</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.user_id} className="border-b border-stone-100 align-top">
                <Td>{r.email}</Td>
                <Td>{r.display_name ?? <span className="text-stone-400">—</span>}</Td>
                <Td>
                  <div>{locationFromTz(r.timezone)}</div>
                  <div className="text-stone-400">{r.timezone}</div>
                </Td>
                <Td>{r.theme}</Td>
                <Td className="text-right tabular-nums">{r.entry_count}</Td>
                <Td className="text-right tabular-nums">{r.total_words.toLocaleString()}</Td>
                <Td>{ymd(r.last_entry_date)}</Td>
                <Td className="text-right tabular-nums">
                  {r.days_since_last_entry ?? <span className="text-stone-400">—</span>}
                </Td>
                <Td>{ymd(r.joined_at)}</Td>
                <Td>{ymd(r.last_sign_in_at)}</Td>
                <Td>{r.palette_interest ? 'yes' : <span className="text-stone-400">no</span>}</Td>
                <Td>{r.first_source ?? <span className="text-stone-400">direct</span>}</Td>
                <Td>{r.first_medium ?? <span className="text-stone-400">—</span>}</Td>
                <Td>
                  {r.first_referrer ? (
                    <div className="max-w-xs truncate" title={r.first_referrer}>{r.first_referrer}</div>
                  ) : (
                    <span className="text-stone-400">—</span>
                  )}
                  <div className="text-stone-400">{r.first_landing_path ?? '—'}</div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt className="uppercase tracking-wider text-stone-400">{label}</dt>
      <dd className="text-2xl text-stone-800 tabular-nums mt-1">{value}</dd>
    </div>
  )
}

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <th className={`py-2 pr-4 font-normal ${className}`}>{children}</th>
}

function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`py-2 pr-4 ${className}`}>{children}</td>
}
