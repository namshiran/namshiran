import { NextRequest, NextResponse } from 'next/server';

// Use Node.js runtime for better compatibility
export const runtime = 'nodejs';
export const maxDuration = 30;
export const dynamic = 'force-dynamic';

// Free proxy services - same as in products route
const PROXY_SERVICES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest=',
];

// Timeout helper function
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number = 10000) {
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

// Try fetching through multiple proxies - race them for speed
async function fetchThroughProxy(targetUrl: string, timeoutMs: number = 10000) {
  const fetchAttempts: Promise<Response>[] = [];

  // Direct fetch
  fetchAttempts.push(
    fetchWithTimeout(
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
    ).then(res => {
      if (res.ok) {
        console.log('[API Product] Direct fetch succeeded');
        return res;
      }
      throw new Error(`Direct fetch returned ${res.status}`);
    }).catch(err => {
      console.log('[API Product] Direct fetch failed:', err.message);
      throw err;
    })
  );

  // Add proxy attempts
  PROXY_SERVICES.forEach((proxyUrl, i) => {
    const fullUrl = proxyUrl + encodeURIComponent(targetUrl);
    fetchAttempts.push(
      fetchWithTimeout(
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
      ).then(res => {
        if (res.ok) {
          console.log(`[API Product] Proxy ${i + 1} succeeded`);
          return res;
        }
        throw new Error(`Proxy ${i + 1} returned ${res.status}`);
      }).catch(err => {
        console.log(`[API Product] Proxy ${i + 1} failed:`, err.message);
        throw err;
      })
    );
  });

  // Race all requests - return the first successful one
  return Promise.any(fetchAttempts);
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
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
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
