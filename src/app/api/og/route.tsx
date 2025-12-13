import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'نمشیران';
    const description = searchParams.get('description') || 'خرید آنلاین محصولات فشن';
    const price = searchParams.get('price') || '';

    // Truncate long titles
    const displayTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;
    const displayDesc = description.length > 80 ? description.substring(0, 77) + '...' : description;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Decorative circles */}
          <div style={{
            position: 'absolute',
            top: '-100px',
            left: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            display: 'flex',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-150px',
            right: '-150px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            display: 'flex',
          }} />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 80px',
              background: 'rgba(255, 255, 255, 0.98)',
              borderRadius: '32px',
              boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
              maxWidth: '1000px',
              width: '90%',
              position: 'relative',
            }}
          >
            {/* Logo/Brand */}
            <div
              style={{
                fontSize: 32,
                fontWeight: 'bold',
                color: '#667eea',
                marginBottom: 30,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 48, marginLeft: 12 }}>🛍️</span>
              نمشیران
            </div>

            {/* Product Title */}
            <div
              style={{
                fontSize: 56,
                fontWeight: 'bold',
                color: '#1e293b',
                textAlign: 'center',
                marginBottom: 24,
                lineHeight: 1.2,
                maxWidth: '900px',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              {displayTitle}
            </div>
            
            {/* Description/Brand */}
            {description && (
              <div
                style={{
                  fontSize: 28,
                  color: '#64748b',
                  textAlign: 'center',
                  marginBottom: 24,
                  display: 'flex',
                }}
              >
                {displayDesc}
              </div>
            )}
            
            {/* Price */}
            {price && (
              <div
                style={{
                  fontSize: 44,
                  fontWeight: 'bold',
                  color: '#ffffff',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  padding: '16px 40px',
                  borderRadius: '16px',
                  marginTop: 24,
                  display: 'flex',
                  boxShadow: '0 10px 30px rgba(102,126,234,0.3)',
                }}
              >
                {price}
              </div>
            )}
            
            {/* Footer */}
            <div
              style={{
                marginTop: 40,
                fontSize: 22,
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              namshiran.vercel.app
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error('[OG Image] Error:', e.message);
    
    // Fallback error image
    return new ImageResponse(
      (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#667eea',
          color: 'white',
          fontSize: 48,
          fontWeight: 'bold',
        }}>
          🛍️ نمشیران
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}
