import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'nodejs';

// Image metadata
export const alt = 'AZLAAN - Bangladeshi Premium Clothing Brand';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: '#000000',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Background Image */}
        <img
          src="https://azlaan.com.bd/media-pro/Cover/616795496_122112085989151981_2801687860027277426_n.webp"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.6,
          }}
        />

        {/* Brand Overlay Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '60px 80px',
            border: '2px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div
            style={{
              fontSize: '84px',
              fontWeight: '900',
              color: 'white',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            AZLAAN
          </div>
          <div
            style={{
              fontSize: '24px',
              color: 'rgba(255, 255, 255, 0.7)',
              letterSpacing: '0.5em',
              textTransform: 'uppercase',
            }}
          >
            Premium Clothing Brand
          </div>
        </div>

        {/* Live Indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '40px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              marginRight: '12px',
            }}
          />
          <div
            style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: '600',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Live Collection
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
