import { NextRequest, NextResponse } from 'next/server';

// Use Node.js runtime for better compatibility
export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

// Free proxy services - same as in products route
const PROXY_SERVICES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest=',
];

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

// Try fetching through multiple proxies
async function fetchThroughProxy(targetUrl: string, timeoutMs: number = 25000) {
  let lastError: Error | null = null;

  // Try direct fetch first
  try {
    console.log('[API Product] Trying direct fetch...');
    const response = await fetchWithTimeout(
      targetUrl,
      {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9,ar;q=0.8',
          'Referer': 'https://www.noon.com/',
          'Origin': 'https://www.noon.com',
        },
        cache: 'no-store',
      },
      timeoutMs
    );
    
    if (response.ok) {
      console.log('[API Product] Direct fetch succeeded');
      return response;
    }
  } catch (error) {
    console.log('[API Product] Direct fetch failed:', error instanceof Error ? error.message : 'Unknown error');
    lastError = error instanceof Error ? error : new Error('Direct fetch failed');
  }

  // Try each proxy service
  for (let i = 0; i < PROXY_SERVICES.length; i++) {
    const proxyUrl = PROXY_SERVICES[i];
    try {
      console.log(`[API Product] Trying proxy ${i + 1}/${PROXY_SERVICES.length}: ${proxyUrl}`);
      const fullUrl = proxyUrl + encodeURIComponent(targetUrl);
      
      const response = await fetchWithTimeout(
        fullUrl,
        {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json, text/plain, */*',
          },
          cache: 'no-store',
        },
        timeoutMs
      );

      if (response.ok) {
        console.log(`[API Product] Proxy ${i + 1} succeeded`);
        return response;
      }
      
      console.log(`[API Product] Proxy ${i + 1} returned status: ${response.status}`);
    } catch (error) {
      console.log(`[API Product] Proxy ${i + 1} failed:`, error instanceof Error ? error.message : 'Unknown error');
      lastError = error instanceof Error ? error : new Error(`Proxy ${i + 1} failed`);
    }
  }

  throw lastError || new Error('All proxy attempts failed');
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sku: string }> }
) {
  const { sku } = await params;
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url') || '';
  const offerCode = searchParams.get('offerCode') || '';

  console.log(`[API Product] Fetching product details - SKU: ${sku}, URL: ${url}, Offer: ${offerCode}`);

  try {
    // Try to fetch product details from the product detail API
    // Format: https://www.noon.com/_vs/nc/mp-customer-catalog-api/api/v3/u/{url}/{sku}/p/?o={offerCode}
    let apiUrl = '';
    
    if (url && offerCode) {
      apiUrl = `https://www.noon.com/_vs/nc/mp-customer-catalog-api/api/v3/u/${url}/${sku}/p/?o=${offerCode}`;
    } else {
      // Fallback: try to get from the general catalog
      apiUrl = `https://www.noon.com/_vs/np/api/v2.0/catalog_product?sku=${sku}`;
    }

    console.log(`[API Product] Target URL: ${apiUrl}`);

    const response = await fetchThroughProxy(apiUrl, 25000);

    console.log(`[API Product] Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API Product] Error response:`, errorText.substring(0, 500));
      throw new Error(`API returned ${response.status}`);
    }

    // Get response text first to check content
    const responseText = await response.text();
    console.log(`[API Product] Response length: ${responseText.length} chars`);

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error(`[API Product] Failed to parse JSON:`, parseError);
      console.error(`[API Product] Response preview:`, responseText.substring(0, 1000));
      throw new Error('Response is not valid JSON');
    }

    console.log(`[API Product] Success - Product: ${data.product?.product_title || 'N/A'}`);

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    console.error('[API Product] Error fetching product details:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch product details',
        message: errorMessage,
        details: 'Unable to retrieve product through proxy services'
      },
      { status: 503 }
    );
  }
}
