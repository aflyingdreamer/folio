import type { Metadata } from 'next'
import { Lora, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import '@/components/ui/font-styles.css'

const serif = Lora({ subsets: ['latin'], variable: '--font-serif' })
const mono  = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['400', '500'] })

export const metadata: Metadata = {
  title: 'Folio',
  description: 'A daily writing space. A tribute to morning pages.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-stone-50 text-stone-900 antialiased">{children}</body>
    </html>
  )
}
