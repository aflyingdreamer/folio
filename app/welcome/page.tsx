import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { pickQuote } from '@/lib/welcome/quotes'
import { WelcomeScene } from '@/components/welcome/welcome-scene'

export default async function Welcome({
  searchParams,
}: {
  searchParams: { first?: string }
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: meta } = await supabase
    .from('user_meta')
    .select('display_name')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!meta?.display_name) redirect('/welcome/name')

  const first = searchParams.first === '1'
  const quote = pickQuote()

  return (
    <WelcomeScene
      name={meta.display_name}
      first={first}
      quote={quote}
    />
  )
}
