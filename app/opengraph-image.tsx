import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Mornings — a quiet place to write your morning pages'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fafaf9',
          color: '#1c1917',
          fontFamily: 'Georgia, serif',
          padding: 80,
        }}
      >
        <div style={{ fontSize: 180, lineHeight: 1, letterSpacing: -4 }}>
          mornings
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 28,
            color: '#78716c',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            letterSpacing: 0.5,
          }}
        >
          750 words a day, written for yourself
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 56,
            fontSize: 22,
            color: '#a8a29e',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          }}
        >
          mornings.page
        </div>
      </div>
    ),
    { ...size },
  )
}
