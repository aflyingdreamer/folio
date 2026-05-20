import { updateSession } from '@/lib/supabase/middleware'

export const middleware = updateSession
export const config = { matcher: ['/today/:path*', '/archive/:path*', '/settings/:path*', '/auth/:path*'] }
