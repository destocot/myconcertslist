import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
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
          backgroundColor: '#3d52a1',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 96, marginBottom: 24 }}>🎟</div>
        <div style={{ fontSize: 72, fontWeight: 'bold', letterSpacing: '-1px' }}>
          MyConcertList
        </div>
        <div style={{ fontSize: 32, opacity: 0.75, marginTop: 20 }}>
          Track every concert you&apos;ve ever been to
        </div>
      </div>
    ),
    { ...size },
  )
}
