import { NextRequest, NextResponse } from 'next/server';
import { mockProducts } from './mockData';

// Use Edge Runtime for faster response
export const runtime = 'edge';
export const maxDuration = 10; // Reduce to 10 seconds

const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true';

// Timeout helper function
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number = 8000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page') || '1';
  const category = searchParams.get('category') || 'fashion';

  console.log(`[API] Fetching products - Page: ${page}, Category: ${category}`);

  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    console.log('[API] Using mock data (USE_MOCK_DATA=true)');
    return NextResponse.json(mockProducts, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  }

  try {
    const apiUrl = `https://www.noon.com/_vs/nc/mp-customer-catalog-api/api/v3/u/${category}/p-3001/?page=${page}`;
    console.log(`[API] Requesting: ${apiUrl}`);

    const response = await fetchWithTimeout(
      apiUrl,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': 'https://www.noon.com/',
        },
      },
      8000 // 8 second timeout
    );

    console.log(`[API] Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API] Error response: ${errorText}`);
      throw new Error(`API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log(`[API] Success - Found ${data.nbHits} products`);
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('[API] Error fetching products:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isTimeout = errorMessage.includes('abort') || errorMessage.includes('timeout');
    
    // Fallback to mock data on error
    console.log('[API] Falling back to mock data due to error');
    return NextResponse.json(mockProducts, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'X-Fallback': 'true',
        'X-Error': errorMessage,
      },
    });
  }
}
