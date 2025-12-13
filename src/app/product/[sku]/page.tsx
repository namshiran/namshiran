import { Metadata } from 'next';
import { Suspense } from 'react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import ProductClient from './ProductClient';

async function getProductData(sku: string, url?: string, offerCode?: string) {
  try {
    const queryParams = new URLSearchParams();
    if (url) queryParams.append('url', url);
    if (offerCode) queryParams.append('offerCode', offerCode);
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/products/${sku}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const response = await fetch(apiUrl, { 
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.product || null;
  } catch (error) {
    console.error('Error fetching product for metadata:', error);
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

  if (!product) {
    return {
      title: 'محصول یافت نشد | نمشیران',
      description: 'محصول مورد نظر یافت نشد.',
    };
  }

  const imageUrl = product.image_keys?.[0]
    ? `https://f.nooncdn.com/p/${product.image_keys[0]}.jpg`
    : 'https://namshiran.vercel.app/og-image.png';

  const price = product.variants?.[0]?.offers?.[0]?.price || 0;
  const salePrice = product.variants?.[0]?.offers?.[0]?.sale_price;
  const priceText = salePrice 
    ? `${new Intl.NumberFormat('en-US').format(salePrice)} درهم` 
    : `${new Intl.NumberFormat('en-US').format(price)} درهم`;

  const description = `${product.brand ? product.brand + ' - ' : ''}${product.product_title}. قیمت: ${priceText}`;

  return {
    title: `${product.product_title} | نمشیران`,
    description: description.substring(0, 160),
    openGraph: {
      title: product.product_title,
      description: description.substring(0, 160),
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.product_title,
        },
      ],
      type: 'website',
      siteName: 'نمشیران',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.product_title,
      description: description.substring(0, 160),
      images: [imageUrl],
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
