import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'نمشیران';
    const description = searchParams.get('description') || 'خرید آنلاین محصولات فشن';
    const price = searchParams.get('price') || '';

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
            backgroundColor: '#f8fafc',
            backgroundImage: 'linear-gradient(to bottom right, #f8fafc, #e2e8f0)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 80px',
              background: 'white',
              borderRadius: '24px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              maxWidth: '1000px',
            }}
          >
            <div
              style={{
                fontSize: 72,
                fontWeight: 'bold',
                color: '#1e293b',
                textAlign: 'center',
                marginBottom: 20,
                lineHeight: 1.2,
              }}
            >
              {title}
            </div>
            
            {description && (
              <div
                style={{
                  fontSize: 32,
                  color: '#64748b',
                  textAlign: 'center',
                  marginBottom: 20,
                }}
              >
                {description}
              </div>
            )}
            
            {price && (
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 'bold',
                  color: '#3b82f6',
                  marginTop: 20,
                }}
              >
                {price}
              </div>
            )}
            
            <div
              style={{
                marginTop: 40,
                fontSize: 28,
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span style={{ 
                fontSize: 40, 
                marginRight: 12,
                color: '#3b82f6' 
              }}>
                🛍️
              </span>
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
    console.error(e.message);
    return new Response('Failed to generate image', { status: 500 });
  }
}
