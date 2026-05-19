'use client'
import { usePathname } from 'next/navigation'
import { SoundControls } from './SoundControls'
import { FirstVisitAsk } from './FirstVisitAsk'

const HIDDEN_PREFIXES = ['/login', '/signup', '/forgot', '/reset', '/auth']

export function SoundChrome() {
  const pathname = usePathname() ?? ''
  const hidden = HIDDEN_PREFIXES.some(p => pathname === p || pathname.startsWith(p + '/'))
  if (hidden) return null

  return (
    <>
      <FirstVisitAsk />
      <SoundControls />
    </>
  )
}
