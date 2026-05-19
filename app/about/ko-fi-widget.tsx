'use client'

import Script from 'next/script'

declare global {
  interface Window {
    kofiWidgetOverlay?: {
      draw: (username: string, options: Record<string, string>) => void
    }
  }
}

export default function KoFiWidget() {
  return (
    <Script
      src="https://storage.ko-fi.com/cdn/scripts/overlay-widget.js"
      strategy="afterInteractive"
      onLoad={() => {
        window.kofiWidgetOverlay?.draw('brianfolio', {
          type: 'floating-chat',
          'floating-chat.donateButton.text': 'leave a tip',
          'floating-chat.donateButton.background-color': '#1c1917',
          'floating-chat.donateButton.text-color': '#fafaf9',
        })
      }}
    />
  )
}
