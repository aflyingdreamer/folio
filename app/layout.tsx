import type { Metadata } from 'next'
import { Lora, JetBrains_Mono } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/next'
import { cookies } from 'next/headers'
import { THEME_COOKIE, isThemeChoice } from '@/lib/settings/theme'
import { FirstTouchCapture } from '@/components/attribution/first-touch-capture'
import './globals.css'
import '@/components/ui/font-styles.css'

const serif = Lora({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['400', '500'],
})
const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500'],
  preload: false,
})

export const metadata: Metadata = {
  metadataBase: new URL('https://mornings.page'),
  title: {
    default: 'Mornings — a quiet place to write your morning pages',
    template: '%s · Mornings',
  },
  description:
    'A small, calm web app for the morning pages ritual — 750 words a day, written for yourself. A tribute to Julia Cameron and Buster Benson.',
  applicationName: 'Mornings',
  keywords: [
    'morning pages',
    'morning pages online',
    'morning pages app',
    'daily writing',
    'journaling',
    'julia cameron',
    'the artist\u2019s way',
    '750 words',
  ],
  authors: [{ name: 'Brian (Duc Anh)' }],
  creator: 'Brian (Duc Anh)',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: 'https://mornings.page',
    siteName: 'Mornings',
    title: 'Mornings — a quiet place to write your morning pages',
    description:
      'Show up, write 750 words, close the tab. A tribute to morning pages.',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mornings — a quiet place to write your morning pages',
    description:
      'Show up, write 750 words, close the tab. A tribute to morning pages.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebSite',
                  '@id': 'https://mornings.page/#website',
                  url: 'https://mornings.page',
                  name: 'Mornings',
                  description:
                    'A quiet place to write your morning pages — 750 words a day, for yourself.',
                  inLanguage: 'en',
                },
                {
                  '@type': 'SoftwareApplication',
                  '@id': 'https://mornings.page/#app',
                  name: 'Mornings',
                  applicationCategory: 'LifestyleApplication',
                  operatingSystem: 'Web',
                  url: 'https://mornings.page',
                  description:
                    'A small web app for the morning pages ritual. A tribute to Julia Cameron and Buster Benson.',
                  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
                },
              ],
            }),
          }}
        />
        <FirstTouchCapture />
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
