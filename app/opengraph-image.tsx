import { ImageResponse } from 'next/og';
import { getAllProducts } from '@/lib/data';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'AZLAAN - Bangladeshi Premium Clothing Brand';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  // Fetch latest products to show in the background
  const products = await getAllProducts();
  const latestProducts = products.slice(0, 3);

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #000000, #1a1a1a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '40px',
        }}
      >
        {/* Background product images with low opacity */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            opacity: 0.3,
          }}
        >
          {latestProducts.map((p, i) => (
            <img
              key={i}
              src={p.images[0]}
              style={{
                width: '33.33%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ))}
        </div>

        {/* Brand Overlay */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.6)',
            padding: '60px 80px',
            border: '2px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <h1
            style={{
              fontSize: '84px',
              fontWeight: '900',
              color: 'white',
              letterSpacing: '0.2em',
              margin: 0,
              textTransform: 'uppercase',
            }}
          >
            AZLAAN
          </h1>
          <p
            style={{
              fontSize: '24px',
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: '0.5em',
              marginTop: '20px',
              textTransform: 'uppercase',
            }}
          >
            Bangladeshi Premium Clothing Brand
          </p>
        </div>

        {/* Status indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#10b981',
            }}
          />
          <span
            style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: '600',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Live Collection
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
