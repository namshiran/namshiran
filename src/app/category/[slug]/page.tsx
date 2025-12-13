'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { categories, Category } from '@/types/category';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

interface Product {
  sku: string;
  name: string;
  brand: string;
  image_key: string;
  price: number;
  sale_price: number | null;
  url: string;
  offer_code: string;
}

interface ApiResponse {
  hits: Product[];
  nbHits: number;
  nbPages: number;
}

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const foundCategory = categories.find((c) => c.slug === slug) || null;
    if (!foundCategory) {
      router.replace('/');
      return;
    }

    setCategory(foundCategory);
    setCurrentPage(1);
    void fetchProducts(foundCategory.apiEndpoint, 1);
  }, [slug, router]);

  const fetchProducts = async (categoryEndpoint: string, page: number) => {
    
    setLoading(true);
    try {
      const response = await fetch(
        `/api/products?page=${page}&category=${encodeURIComponent(categoryEndpoint)}`
      );
      const data: ApiResponse = await response.json();
      
      setProducts(data.hits || []);
      setTotalPages(data.nbPages || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (!category) return;
    void fetchProducts(category.apiEndpoint, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getImageUrl = (imageKey: string) => {
    if (!imageKey) return '/placeholder.png';
    return `/api/image?key=${encodeURIComponent(imageKey)}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  if (!category) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />

      {/* Category Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex items-end justify-center p-4 sm:p-6">
          <div className="w-full max-w-4xl rounded-3xl border border-white/50 bg-white/85 backdrop-blur px-6 py-5 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                  {category.name}
                </h1>
                <p className="mt-1 text-sm sm:text-base text-gray-600">{category.nameEn}</p>
              </div>
              <p className="text-sm sm:text-base text-gray-700 leading-7">{category.description}</p>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
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

        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-blue-600">خانه</Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">{category.name}</li>
          </ol>
        </nav>

        {/* Products Count */}
        {!loading && products.length > 0 && (
          <div className="mb-6 text-gray-700">
            <p className="text-lg">
              <span className="font-bold">{formatPrice(products.length)}</span> محصول در این صفحه
            </p>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-4 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {products.map((product) => {
              const discount = product.sale_price && product.sale_price < product.price
                ? Math.round((1 - product.sale_price / product.price) * 100)
                : 0;

              return (
                <Link
                  key={product.sku}
                  href={`/product/${product.sku}?url=${product.url}&offerCode=${product.offer_code}`}
                  className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105"
                >
                  <div className="relative h-64 sm:h-60 md:h-64 lg:h-72 bg-gray-100">
                    <Image
                      src={getImageUrl(product.image_key)}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    />
                    {discount > 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
                        {discount}%
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-blue-600 font-semibold mb-1">
                      {product.brand}
                    </p>
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem] group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex flex-col gap-1">
                      {product.sale_price ? (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-green-600">
                              {formatPrice(product.sale_price)}
                            </span>
                            <span className="text-xs text-gray-600">درهم</span>
                          </div>
                          <div className="text-xs text-gray-500 line-through">
                            {formatPrice(product.price)}
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900">
                            {formatPrice(product.price)}
                          </span>
                          <span className="text-xs text-gray-600">درهم</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500">محصولی یافت نشد</p>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-12 flex flex-wrap justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            >
              قبلی
            </button>

            <div className="flex gap-2 flex-wrap justify-center">
              {currentPage > 3 && (
                <>
                  <button
                    onClick={() => handlePageChange(1)}
                    className="px-4 py-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-all"
                  >
                    ۱
                  </button>
                  {currentPage > 4 && <span className="px-2 py-2">...</span>}
                </>
              )}

              {[...Array(5)].map((_, i) => {
                const page = currentPage - 2 + i;
                if (page < 1 || page > totalPages) return null;
                
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg transition-all font-medium ${
                      currentPage === page
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white shadow-md hover:shadow-lg'
                    }`}
                  >
                    {new Intl.NumberFormat('en-US').format(page)}
                  </button>
                );
              })}

              {currentPage < totalPages - 2 && (
                <>
                  {currentPage < totalPages - 3 && <span className="px-2 py-2">...</span>}
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className="px-4 py-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-all"
                  >
                    {new Intl.NumberFormat('en-US').format(totalPages)}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            >
              بعدی
            </button>
          </div>
        )}
      </main>

      <div className="mt-auto">
        <SiteFooter />
      </div>
    </div>
  );
}
