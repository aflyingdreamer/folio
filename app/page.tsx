import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Root() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  redirect(user ? '/today' : '/login')
}
