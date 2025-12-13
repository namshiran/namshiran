import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page') || '1';
  const category = searchParams.get('category') || 'fashion';

  console.log(`[API] Fetching products - Page: ${page}, Category: ${category}`);

  try {
    const apiUrl = `https://www.noon.com/_vs/nc/mp-customer-catalog-api/api/v3/u/${category}/p-3001/?page=${page}`;
    console.log(`[API] Requesting: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Referer': 'https://www.noon.com/',
      },
      cache: 'no-store', // Disable caching for debugging
    });

    console.log(`[API] Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API] Error response: ${errorText}`);
      throw new Error(`API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log(`[API] Success - Found ${data.nbHits} products`);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('[API] Error fetching products:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch products', 
        message: errorMessage,
        hits: [], 
        nbPages: 0, 
        nbHits: 0 
      },
      { status: 500 }
    );
  }
}
