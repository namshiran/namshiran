import { Metadata } from 'next';
import { Suspense } from 'react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import ProductClient from './ProductClient';

// Force dynamic rendering for metadata
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getProductData(sku: string, url?: string, offerCode?: string) {
  try {
    const queryParams = new URLSearchParams();
    if (url) queryParams.append('url', url);
    if (offerCode) queryParams.append('offerCode', offerCode);
    
    // Use localhost in development, production URL otherwise
    const isDev = process.env.NODE_ENV === 'development';
    const baseUrl = isDev 
      ? 'http://localhost:3000' 
      : (process.env.VERCEL_URL 
          ? `https://${process.env.VERCEL_URL}` 
          : 'https://namshiran.vercel.app');
    
    const apiUrl = `${baseUrl}/api/products/${sku}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    console.log('[Metadata] Fetching product from:', apiUrl);
    
    // Set shorter timeout for metadata fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
    
    try {
      const response = await fetch(apiUrl, { 
        signal: controller.signal,
        cache: 'no-store',
        next: { revalidate: 0 }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.error('[Metadata] API responded with:', response.status);
        return null;
      }
      
      const data = await response.json();
      
      if (data.error || !data.product) {
        console.error('[Metadata] No product in response:', data.error || 'No product field');
        return null;
      }
      
      console.log('[Metadata] Product fetched:', data.product?.product_title || 'No title');
      return data.product;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Metadata] Error fetching product:', errorMsg);
    return null;
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ sku: string }>;
  searchParams: Promise<{ url?: string; offerCode?: string }>;
}): Promise<Metadata> {
  const { sku } = await params;
  const { url, offerCode } = await searchParams;
  
  const product = await getProductData(sku, url, offerCode);

  // Always use production URL for OG images (important for link previews)
  const baseUrl = 'https://namshiran.vercel.app';

  // Default metadata if product not found - use URL slug to create a better title
  if (!product) {
    console.log(`[Metadata] Product not found for SKU: ${sku}, URL: ${url || 'none'}`);
    
    // Try to create a readable title from the URL slug
    const productName = url 
      ? url.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      : `محصول ${sku.substring(0, 10)}`;
    
    const defaultTitle = productName;
    const defaultDesc = 'خرید محصول فشن با بهترین قیمت از فروشگاه آنلاین نمشیران';
    const defaultOgUrl = `${baseUrl}/api/og?title=${encodeURIComponent(defaultTitle)}&description=${encodeURIComponent('نمشیران')}`;
    
    return {
      title: `${defaultTitle} | نمشیران`,
      description: defaultDesc,
      metadataBase: new URL(baseUrl),
      openGraph: {
        title: `${defaultTitle} | نمشیران`,
        description: defaultDesc,
        url: `${baseUrl}/product/${sku}${url ? `?url=${url}` : ''}`,
        siteName: 'نمشیران',
        locale: 'fa_IR',
        type: 'website',
        images: [
          {
            url: defaultOgUrl,
            width: 1200,
            height: 630,
            alt: `${defaultTitle} | نمشیران`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${defaultTitle} | نمشیران`,
        description: defaultDesc,
        images: [defaultOgUrl],
        creator: '@namshiran',
      },
    };
  }

  console.log(`[Metadata] Product found: ${product.product_title}`);

  const price = product.variants?.[0]?.offers?.[0]?.price || 0;
  const salePrice = product.variants?.[0]?.offers?.[0]?.sale_price;
  const priceText = salePrice 
    ? `${new Intl.NumberFormat('fa-IR').format(salePrice)} درهم` 
    : price > 0 
      ? `${new Intl.NumberFormat('fa-IR').format(price)} درهم`
      : '';

  const shortDesc = product.brand 
    ? `${product.brand} | ${priceText}` 
    : priceText;
  
  const longDesc = product.long_description 
    ? product.long_description.substring(0, 160) 
    : `${product.brand ? product.brand + ' - ' : ''}${product.product_title}${priceText ? ' | قیمت: ' + priceText : ''}`;

  // Use actual product image if available, otherwise use dynamic OG generation
  const productImageKey = product.image_keys?.[0];
  const ogImageUrl = productImageKey
    ? `${baseUrl}/api/image?key=${encodeURIComponent(productImageKey)}`
    : `${baseUrl}/api/og?title=${encodeURIComponent(product.product_title)}&description=${encodeURIComponent(shortDesc)}&price=${encodeURIComponent(priceText)}`;
  
  const productUrl = `${baseUrl}/product/${sku}${url ? `?url=${url}` : ''}${offerCode ? `&offerCode=${offerCode}` : ''}`;

  return {
    title: `${product.product_title} | نمشیران`,
    description: longDesc,
    metadataBase: new URL(baseUrl),
    keywords: [
      product.product_title,
      product.brand,
      'خرید آنلاین',
      'فشن',
      'لباس',
      'نمشیران',
    ].filter(Boolean),
    openGraph: {
      title: product.product_title,
      description: longDesc,
      url: productUrl,
      siteName: 'نمشیران',
      locale: 'fa_IR',
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: product.product_title,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.product_title,
      description: longDesc,
      images: [ogImageUrl],
      creator: '@namshiran',
    },
    alternates: {
      canonical: productUrl,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ sku: string }>;
}) {
  const { sku } = await params;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Suspense
          fallback={
            <div className="space-y-4">
              <div className="h-10 w-24 bg-gray-200 rounded-2xl animate-pulse"></div>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden p-6 lg:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="h-[32rem] md:h-[38rem] lg:h-[44rem] bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="grid grid-cols-6 gap-2">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          }
        >
          <ProductClient sku={sku} />
        </Suspense>
      </main>
      <div className="mt-auto">
        <SiteFooter />
      </div>
    </div>
  );
}
