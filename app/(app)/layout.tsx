import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TzCapture } from '@/lib/tz/capture'
import { ArchiveDrawer } from '@/components/archive/archive-drawer'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return (
    <>
      <TzCapture />
      <nav data-folio-nav className="fixed top-6 right-6 font-mono text-xs text-stone-400 flex gap-4 z-40">
        <a href="/today" className="hover:text-stone-700">today</a>
        <ArchiveDrawer />
      </nav>
      <div id="folio-main">{children}</div>
    </>
  )
}
