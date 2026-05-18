import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TzCapture } from '@/lib/tz/capture'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return (
    <>
      <TzCapture />
      {children}
    </>
  )
}
