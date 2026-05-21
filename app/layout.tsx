import type { Metadata } from 'next'
import { Lora, JetBrains_Mono } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { cookies } from 'next/headers'
import { THEME_COOKIE, isThemeChoice } from '@/lib/settings/theme'
import './globals.css'
import '@/components/ui/font-styles.css'

const serif = Lora({ subsets: ['latin'], variable: '--font-serif' })
const mono  = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['400', '500'] })

export const metadata: Metadata = {
  title: 'Mornings',
  description: 'A daily writing space. A tribute to morning pages.',
}

// Inline, runs before paint. Resolves 'system' against matchMedia so we set
// a concrete data-theme on <html> and avoid a light/dark flash.
const themeScript = `
(function(){try{
  var c=document.cookie.match(/(?:^|; )folio-theme=([^;]+)/);
  var v=c?decodeURIComponent(c[1]):'system';
  if(v!=='light'&&v!=='dark'&&v!=='system')v='system';
  var resolved=v==='system'
    ?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')
    :v;
  document.documentElement.setAttribute('data-theme',resolved);
  document.documentElement.setAttribute('data-theme-pref',v);
}catch(e){}})();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieVal = cookies().get(THEME_COOKIE)?.value
  const pref = isThemeChoice(cookieVal) ? cookieVal : 'system'
  // Server-side default for the very first paint: light. The inline script
  // immediately upgrades to the user's resolved choice. data-theme-pref carries
  // the unresolved choice so the settings UI knows what's selected.
  return (
    <html
      lang="en"
      className={`${serif.variable} ${mono.variable}`}
      data-theme={pref === 'dark' ? 'dark' : 'light'}
      data-theme-pref={pref}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-stone-50 text-stone-900 antialiased">
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
