'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { useSearchParams } from 'next/navigation';
import { categories } from '@/types/category';

interface Product {
  offer_code: string;
  sku: string;
  brand: string;
  name: string;
  price: number;
  sale_price: number | null;
  url: string;
  image_key: string;
  product_rating?: {
    value: number;
    count: number;
  };
  is_buyable: boolean;
  catalog_sku?: string;
}

interface ApiResponse {
  hits: Product[];
  nbPages: number;
  nbHits: number;
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [error, setError] = useState('');
  const [category, setCategory] = useState<string>('');
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    const q = (searchParams.get('q') || '').trim();
    const c = (searchParams.get('category') || '').trim();
    setQuery(q);
    setCategory(c);
    setCurrentPage(1);
  }, [searchParams]);

  const fetchProducts = useCallback(async (page: number, categoryEndpoint?: string) => {
    setLoading(true);
    setError('');
    try {
      const url = categoryEndpoint
        ? `/api/products?page=${page}&category=${encodeURIComponent(categoryEndpoint)}`
        : `/api/products?page=${page}`;
      const response = await fetch(url);
      const data: ApiResponse = await response.json();

      if (data.hits) {
        setProducts(data.hits);
        setTotalPages(data.nbPages);
        setTotalProducts(data.nbHits);
      }
    } catch (err) {
      setError('خطا در بارگذاری محصولات');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProducts(currentPage, category);
  }, [currentPage, category, fetchProducts]);

  const filteredProducts = query
    ? products.filter((p) => (p.name || '').toLowerCase().includes(query.toLowerCase()))
    : products;

  const getImageUrl = (imageKey: string) => {
    if (!imageKey) return '/placeholder.png';
    return `https://f.nooncdn.com/p/${imageKey}.jpg`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">در حال بارگذاری محصولات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">محصولات</h1>
            <div className="mt-2 text-sm text-gray-600">
              {formatPrice(totalProducts)} محصول
              {category && (
                <span className="mr-2 text-gray-500">
                  — دسته: {categories.find((c) => c.apiEndpoint === category)?.name || category}
                </span>
              )}
              {query && (
                <span className="mr-2 text-gray-500">— جستجو: «{query}»</span>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
              aria-label="انتخاب دسته‌بندی"
            >
              <option value="">همه دسته‌ها</option>
              {categories.map((c) => (
                <option key={c.id} value={c.apiEndpoint}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="فیلتر نام محصول…"
              className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none placeholder:text-gray-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredProducts.map((product) => (
            <Link
              key={product.offer_code}
              href={`/product/${product.sku}?url=${product.url}&offerCode=${product.offer_code}`}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="relative h-72 sm:h-64 md:h-72 lg:h-80 bg-gray-100">
                <Image
                  src={getImageUrl(product.image_key)}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                />
                {product.sale_price && product.sale_price < product.price && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                    {Math.round((1 - product.sale_price / product.price) * 100)}% تخفیف
                  </div>
                )}
              </div>
              
              <div className="p-4">
                {product.brand && (
                  <p className="text-xs text-gray-500 mb-1 uppercase">{product.brand}</p>
                )}
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 min-h-10">
                  {product.name}
                </h3>
                
                {product.product_rating && (
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm text-gray-700">
                      {product.product_rating.value.toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({formatPrice(product.product_rating.count)})
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {product.sale_price ? (
                    <>
                      <span className="text-lg font-bold text-green-600">
                        {formatPrice(product.sale_price)} درهم
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(product.price)} درهم
                    </span>
                  )}
                </div>

                {product.is_buyable && (
                  <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                    مشاهده جزئیات
                  </button>
                )}
              </div>
            </Link>
          ))}
        </div>

        {!loading && filteredProducts.length === 0 && (
          <div className="py-16 text-center text-gray-600">
            محصولی مطابق فیلتر شما پیدا نشد.
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || loading}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              قبلی
            </button>
            
            <div className="flex items-center gap-1">
              {[...Array(Math.min(10, totalPages))].map((_, i) => {
                const page = i + 1;
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 2 && page <= currentPage + 2)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      disabled={loading}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-300 hover:bg-gray-50'
                      } disabled:opacity-50`}
                    >
                      {page}
                    </button>
                  );
                }
                if (page === currentPage - 3 || page === currentPage + 3) {
                  return <span key={page} className="px-2">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || loading}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              بعدی
            </button>
          </div>
        )}

        <div className="text-center mt-4 text-sm text-gray-600">
          صفحه {formatPrice(currentPage)} از {formatPrice(totalPages)}
        </div>
      </main>

      <div className="mt-auto">
        <SiteFooter />
      </div>
    </div>
  );
}
