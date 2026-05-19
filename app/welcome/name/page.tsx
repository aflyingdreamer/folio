import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { NameForm } from '@/components/welcome/name-form'

export default async function ChooseName() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-stone-50 folio-paper-grain">
      <div className="w-full max-w-md text-center">
        <p className="font-serif text-3xl sm:text-4xl text-stone-900 mb-3 text-balance">
          What should we call you?
        </p>
        <p className="font-mono text-xs text-stone-400 mb-10">
          you can change this later
        </p>
        <NameForm />
      </div>
    </main>
  )
}
