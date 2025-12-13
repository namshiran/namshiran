import { NextRequest, NextResponse } from 'next/server';

// Use Node.js runtime for better compatibility
export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds for Vercel Pro
export const dynamic = 'force-dynamic';

// Timeout helper function
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number = 25000) {
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

  try {
    const apiUrl = `https://www.noon.com/_vs/nc/mp-customer-catalog-api/api/v3/u/${category}/p-3001/?page=${page}`;
    console.log(`[API] Requesting: ${apiUrl}`);

    const response = await fetchWithTimeout(
      apiUrl,
      {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9,ar;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Referer': 'https://www.noon.com/',
          'Origin': 'https://www.noon.com',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
          'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
        cache: 'no-store',
      },
      25000 // 25 second timeout
    );

    console.log(`[API] Response status: ${response.status}`);
    console.log(`[API] Response headers:`, Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API] Error response body:`, errorText);
      throw new Error(`API returned ${response.status}: ${errorText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error(`[API] Non-JSON response:`, text.substring(0, 200));
      throw new Error(`Expected JSON but got: ${contentType}`);
    }

    const data = await response.json();
    console.log(`[API] Success - Found ${data.nbHits} products, ${data.nbPages} pages`);
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    console.error('[API] Error fetching products:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch products from external API', 
        message: errorMessage,
        details: 'The external API (noon.com) may be blocking requests or is unavailable',
        hits: [], 
        nbPages: 0, 
        nbHits: 0 
      },
      { status: 503 }
    );
  }
}
