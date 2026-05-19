import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { TzCapture } from '@/lib/tz/capture'
import { ArchiveDrawer } from '@/components/archive/archive-drawer'
import { signOut } from '@/lib/auth/sign-out'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return (
    <>
      <TzCapture />
      <nav data-folio-nav className="fixed top-6 right-6 font-mono text-xs text-stone-400 flex items-center gap-4 z-40">
        <Link href="/today" className="hover:text-stone-700">today</Link>
        <ArchiveDrawer />
        <form action={signOut}>
          <button
            type="submit"
            className="hover:text-stone-700 transition"
          >
            sign out
          </button>
        </form>
      </nav>
      <div id="folio-main">{children}</div>
    </>
  )
}
