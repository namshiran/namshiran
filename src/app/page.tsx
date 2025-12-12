'use client';

import { categories } from '@/types/category';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import type { CarouselProduct } from '@/components/ProductCarousel';
import { Icons } from '@/components/Icons';

export default function HomePage() {
  const [latestProducts, setLatestProducts] = useState<CarouselProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestProducts();
  }, []);

  const fetchLatestProducts = async () => {
    try {
      const response = await fetch('/api/products?page=1');
      const data = await response.json();
      
      if (data.hits) {
        setLatestProducts(data.hits.slice(0, 12));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Hero Section */}
        <section className="mb-10">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-10 shadow-sm">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">نمشیران</h1>
                <p className="mt-3 text-base sm:text-lg text-gray-600 leading-8">
                  دسته‌بندی‌ها را انتخاب کنید و جدیدترین محصولات را ببینید.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-white font-bold shadow-sm hover:bg-blue-700 transition-colors"
                >
                  مشاهده همه محصولات
                </Link>
                <a
                  href="#latest"
                  className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-5 py-3 text-gray-800 font-bold shadow-sm hover:bg-gray-50 transition-colors"
                >
                  جدیدترین‌ها
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="mb-20">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">دسته‌بندی‌ها</h2>
              <p className="mt-2 text-gray-600">هر دسته را انتخاب کنید تا محصولات همان دسته نمایش داده شود.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all"
              >
                <div className="relative h-72 sm:h-80 lg:h-96">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority
                  />
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-extrabold text-gray-900 leading-6">
                        {category.name}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">{category.nameEn}</p>
                    </div>
                    <span
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 shadow-sm group-hover:bg-gray-50 transition-colors"
                      aria-hidden
                    >
                      <Icons.ArrowLeft className="w-5 h-5" />
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-gray-600 leading-6 line-clamp-2 min-h-[3rem]">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Latest Products Section */}
        <section id="latest" className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-8 sm:p-10 pt-10 pb-12 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
                جدیدترین محصولات
              </h2>
              <p className="text-base text-gray-700 leading-relaxed">
                محصولات تازه وارد شده به فروشگاه با کیفیت برتر
              </p>
            </div>
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-extrabold text-gray-900 shadow-md hover:shadow-lg transition-all hover:scale-105"
            >
              مشاهده همه
              <Icons.ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl border border-gray-100 shadow-md p-4 animate-pulse">
                  <div className="h-56 bg-gray-200 rounded-2xl mb-3" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {latestProducts.map((product) => {
                const discount = product.sale_price && product.sale_price < product.price
                  ? Math.round((1 - product.sale_price / product.price) * 100)
                  : 0;

                return (
                  <Link
                    key={product.sku}
                    href={`/product/${product.sku}?url=${product.url}&offerCode=${product.offer_code}`}
                    className="group bg-white rounded-3xl border border-gray-200 shadow-md hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-3xl overflow-hidden">
                      <Image
                        src={`https://f.nooncdn.com/p/${product.image_key}.jpg`}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                      />
                      {discount > 0 && (
                        <div className="absolute top-3 right-3 bg-gradient-to-br from-red-600 to-red-700 text-white px-3 py-1.5 rounded-xl text-sm font-extrabold shadow-lg">
                          {discount}%
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <div className="text-xs font-bold text-blue-600 mb-2 line-clamp-1 uppercase tracking-wide">
                        {product.brand}
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 line-clamp-2 min-h-[2.75rem] mb-4 group-hover:text-blue-600 transition-colors leading-snug">
                        {product.name}
                      </h3>

                      <div className="flex items-end justify-between border-t border-gray-100 pt-4">
                        {product.sale_price ? (
                          <div className="flex flex-col gap-1">
                            <div className="text-xl font-extrabold text-green-600">
                              {new Intl.NumberFormat('en-US').format(product.sale_price)}
                              <span className="text-xs text-gray-600 font-normal mr-1">درهم</span>
                            </div>
                            <div className="text-xs text-gray-500 line-through">
                              {new Intl.NumberFormat('en-US').format(product.price)}
                            </div>
                          </div>
                        ) : (
                          <div className="text-xl font-extrabold text-gray-900">
                            {new Intl.NumberFormat('en-US').format(product.price)}
                            <span className="text-xs text-gray-600 font-normal mr-1">درهم</span>
                          </div>
                        )}
                        <div className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-blue-600 text-white group-hover:bg-blue-700 transition-colors">
                          <Icons.ShoppingCart className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icons.Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">تضمین اصالت کالا</h3>
            <p className="text-gray-600">تمامی محصولات اورجینال و با ضمانت</p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icons.CreditCard className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">پرداخت امن</h3>
            <p className="text-gray-600">پرداخت آنلاین با درگاه معتبر</p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icons.Truck className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">ارسال سریع</h3>
            <p className="text-gray-600">ارسال به تمام نقاط کشور</p>
          </div>
        </section>
      </main>

      <div className="mt-auto">
        <SiteFooter />
      </div>
    </div>
  );
}
