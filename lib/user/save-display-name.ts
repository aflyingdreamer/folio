'use server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function saveDisplayName(name: string) {
  const trimmed = name.trim().slice(0, 60)
  if (!trimmed) return { error: 'please enter a name' }
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { error } = await supabase
    .from('user_meta')
    .update({ display_name: trimmed })
    .eq('user_id', user.id)
  if (error) return { error: error.message.toLowerCase() }
  redirect('/welcome?first=1')
}
