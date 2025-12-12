import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sku: string }> }
) {
  const { sku } = await params;
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url') || '';
  const offerCode = searchParams.get('offerCode') || '';

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

    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching product details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product details' },
      { status: 500 }
    );
  }
}
