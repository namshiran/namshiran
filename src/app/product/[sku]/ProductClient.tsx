'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface Specification {
  code: string;
  name: string;
  value: string;
  value_code: string;
}

interface Offer {
  offer_code: string;
  price: number;
  sale_price: number | null;
  stock: number;
  is_buyable: boolean;
}

interface Variant {
  sku: string;
  variant: string;
  offers: Offer[];
}

interface ProductDetail {
  sku: string;
  product_title: string;
  brand: string;
  brand_code: string;
  image_keys: string[];
  long_description?: string;
  specifications?: Specification[];
  product_rating?: {
    value: number;
    count: number;
  };
  variants?: Variant[];
  breadcrumbs?: Array<{ name: string; code: string }>;
}

interface Props {
  sku: string;
}

export default function ProductClient({ sku }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get('url') || '';
  const offerCode = searchParams.get('offerCode') || '';

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const fetchProductDetails = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const queryParams = new URLSearchParams();
      if (url) queryParams.append('url', url);
      if (offerCode) queryParams.append('offerCode', offerCode);
      
      const apiUrl = `/api/products/${sku}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      if (data.error) {
        setError('محصول یافت نشد');
        return;
      }

      if (!data.product) {
        setError('محصول یافت نشد');
        return;
      }
      
      setProduct(data.product);
    } catch (err) {
      setError('خطا در بارگذاری اطلاعات محصول');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  }, [offerCode, sku, url]);

  useEffect(() => {
    if (!sku) return;
    void fetchProductDetails();
  }, [sku, fetchProductDetails]);

  const getImageUrl = (imageKey: string) => {
    if (!imageKey) return '/placeholder.png';
    return `https://f.nooncdn.com/p/${imageKey}.jpg`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  if (loading) {
    return (
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
              <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-red-600 mb-4">{error || 'محصول یافت نشد'}</p>
        <Link href="/products" className="text-blue-600 hover:underline">
          بازگشت به لیست محصولات
        </Link>
      </div>
    );
  }

  const images = product.image_keys || [];
  const selectedVariant = product.variants?.[selectedVariantIndex];
  const selectedOffer = selectedVariant?.offers?.[0];
  const price = selectedOffer?.price || 0;
  const salePrice = selectedOffer?.sale_price;
  const stock = selectedOffer?.stock || 0;
  const isBuyable = selectedOffer?.is_buyable || false;
  
  const discount = salePrice && salePrice < price
    ? Math.round((1 - salePrice / price) * 100)
    : 0;

  return (
    <>
      <div className="mb-5">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-800 shadow-sm hover:bg-gray-50"
        >
          <span>بازگشت</span>
          <span aria-hidden>→</span>
        </button>
      </div>

      {product.breadcrumbs && product.breadcrumbs.length > 0 && (
        <nav className="mb-4 text-sm">
          <ol className="flex items-center gap-2 text-gray-600">
            {product.breadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center gap-2">
                {index > 0 && <span>/</span>}
                <span className={index === product.breadcrumbs!.length - 1 ? 'text-gray-900 font-medium' : ''}>
                  {crumb.name}
                </span>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-10">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative h-[32rem] md:h-[38rem] lg:h-[44rem] bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={getImageUrl(images[selectedImage] || product.image_keys?.[0])}
                alt={product.product_title}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {discount > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg text-lg font-bold shadow-lg">
                  {discount}% تخفیف
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-6 gap-2">
                {images.slice(0, 6).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    title={`نمایش تصویر ${index + 1}`}
                    className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-blue-500'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={getImageUrl(image)}
                      alt={`${product.product_title} - تصویر ${index + 1}`}
                      fill
                      className="object-cover object-center"
                      sizes="100px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {product.brand && (
              <div>
                <span className="text-sm text-gray-500 uppercase">برند:</span>
                <p className="text-lg font-semibold text-blue-600">{product.brand}</p>
              </div>
            )}

            <h1 className="text-3xl font-bold text-gray-900">{product.product_title}</h1>

            {product.product_rating && (
              <div className="flex items-center gap-3 py-3 border-y border-gray-200">
                <div className="flex items-center gap-1">
                  <span className="text-2xl text-yellow-500">★</span>
                  <span className="text-xl font-bold text-gray-900">
                    {product.product_rating.value.toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-500">
                  ({formatPrice(product.product_rating.count)} نظر)
                </span>
              </div>
            )}

            <div className="py-4">
              {salePrice ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-bold text-green-600">
                      {formatPrice(salePrice)}
                    </span>
                    <span className="text-xl text-gray-600">درهم</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(price)}
                    </span>
                    <span className="text-lg text-red-600 font-semibold">
                      ({discount}% تخفیف)
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold text-gray-900">
                    {formatPrice(price)}
                  </span>
                  <span className="text-xl text-gray-600">درهم</span>
                </div>
              )}
            </div>

            {product.variants && product.variants.length > 1 && (
              <div className="py-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  انتخاب {product.variants[0].variant ? 'سایز' : 'گزینه'}
                </h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {product.variants.map((variant, index) => {
                    const variantOffer = variant.offers?.[0];
                    const isOutOfStock = !variantOffer?.stock || variantOffer.stock === 0;
                    const isSelected = selectedVariantIndex === index;
                    
                    return (
                      <button
                        key={variant.sku}
                        onClick={() => !isOutOfStock && setSelectedVariantIndex(index)}
                        disabled={isOutOfStock}
                        className={`
                          relative px-4 py-3 text-center rounded-lg border-2 font-medium transition-all
                          ${isSelected 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : isOutOfStock
                              ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'border-gray-300 bg-white text-gray-900 hover:border-blue-400'
                          }
                        `}
                      >
                        {variant.variant}
                        {isOutOfStock && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="w-full h-0.5 bg-red-500 rotate-[-20deg]"></span>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="py-2">
              {stock > 0 ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  ✓ موجود در انبار ({formatPrice(stock)} عدد)
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  ناموجود
                </span>
              )}
            </div>

            <div className="space-y-3 pt-4">
              {isBuyable && stock > 0 && (
                <>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg text-lg font-bold transition-colors shadow-lg">
                    افزودن به سبد خرید
                  </button>
                  <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 py-4 rounded-lg text-lg font-semibold transition-colors">
                    افزودن به لیست علاقه‌مندی
                  </button>
                </>
              )}
            </div>

            {product.long_description && (
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">توضیحات محصول</h3>
                <div 
                  className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.long_description }}
                />
              </div>
            )}

            {product.specifications && product.specifications.length > 0 && (
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">مشخصات فنی</h3>
                <dl className="space-y-3">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="flex py-2 border-b border-gray-100">
                      <dt className="w-1/3 text-gray-600 font-medium">{spec.name}:</dt>
                      <dd className="w-2/3 text-gray-900">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">شناسه محصول:</dt>
                  <dd className="text-gray-900 font-mono">{product.sku}</dd>
                </div>
                {selectedVariant && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">شناسه گزینه انتخابی:</dt>
                    <dd className="text-gray-900 font-mono text-xs">{selectedVariant.sku}</dd>
                  </div>
                )}
                {product.brand_code && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">کد برند:</dt>
                    <dd className="text-gray-900">{product.brand_code}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          ← مشاهده محصولات بیشتر
        </Link>
      </div>
    </>
  );
}
