import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'MyConcertList'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: '#f5f6fa',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* blue accent bar left */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 8,
            backgroundColor: '#3d52a1',
          }}
        />

        {/* blue glow blob bottom-right */}
        <div
          style={{
            position: 'absolute',
            bottom: -150,
            right: -150,
            width: 550,
            height: 550,
            borderRadius: '50%',
            backgroundColor: '#3d52a1',
            opacity: 0.08,
          }}
        />

        {/* content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingLeft: 80,
            paddingBottom: 20,
            gap: 16,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 72,
              height: 48,
              borderRadius: 10,
              border: '2px solid #3d52a1',
              color: '#3d52a1',
              fontSize: 18,
              fontWeight: 'bold',
              letterSpacing: 2,
              fontFamily: 'sans-serif',
              marginBottom: 8,
            }}
          >
            MCL
          </div>
          <div
            style={{
              fontSize: 80,
              fontWeight: 'bold',
              color: '#1a1f36',
              fontFamily: 'sans-serif',
              lineHeight: 1,
            }}
          >
            MyConcertList
          </div>
          <div
            style={{
              fontSize: 32,
              color: 'rgba(26,31,54,0.45)',
              fontFamily: 'sans-serif',
            }}
          >
            Track every concert you have ever been to
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
