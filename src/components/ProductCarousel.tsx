'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Icons } from './Icons';

export interface CarouselProduct {
  sku: string;
  name: string;
  brand: string;
  image_key: string;
  price: number;
  sale_price: number | null;
  url: string;
  offer_code: string;
}

function getNoonImageUrl(imageKey: string) {
  if (!imageKey) return '/placeholder.png';
  return `https://f.nooncdn.com/p/${imageKey}.jpg`;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('fa-IR').format(price);
}

export function ProductCarousel({
  products,
  loading,
}: {
  products: CarouselProduct[];
  loading: boolean;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const cards = useMemo(() => {
    if (loading) {
      return [...Array(10)].map((_, i) => (
        <div
          key={i}
          className="snap-start shrink-0 w-[280px] sm:w-[240px] md:w-[260px] lg:w-[280px] xl:w-[300px] bg-white rounded-3xl border border-gray-100 shadow-md p-4 animate-pulse"
        >
          <div className="aspect-square bg-gray-200 rounded-2xl mb-3" />
          <div className="h-4 bg-gray-200 rounded mb-2" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
        </div>
      ));
    }

    return products.map((product) => {
      const discount = product.sale_price && product.sale_price < product.price
        ? Math.round((1 - product.sale_price / product.price) * 100)
        : 0;

      return (
        <Link
          key={product.sku}
          href={`/product/${product.sku}?url=${product.url}&offerCode=${product.offer_code}`}
          className="snap-start shrink-0 w-[280px] sm:w-[240px] md:w-[260px] lg:w-[280px] xl:w-[300px] group bg-white rounded-3xl border border-gray-200 shadow-md hover:shadow-2xl transition-all duration-300"
        >
          <div className="relative h-72 sm:h-64 md:h-72 lg:h-80 xl:h-[22rem] bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-3xl overflow-hidden">
            <Image
              src={getNoonImageUrl(product.image_key)}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="300px"
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
                    {formatPrice(product.sale_price)}
                    <span className="text-xs text-gray-600 font-normal mr-1">درهم</span>
                  </div>
                  <div className="text-xs text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </div>
                </div>
              ) : (
                <div className="text-xl font-extrabold text-gray-900">
                  {formatPrice(product.price)}
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
    });
  }, [loading, products]);

  const updateScrollButtons = () => {
    const el = scrollerRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scrollByAmount = (dir: 'prev' | 'next') => {
    const el = scrollerRef.current;
    if (!el) return;

    const amount = Math.round(el.clientWidth * 0.85);
    const left = dir === 'next' ? amount : -amount;
    el.scrollBy({ left, behavior: 'smooth' });
    
    setTimeout(updateScrollButtons, 300);
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    updateScrollButtons();
    el.addEventListener('scroll', updateScrollButtons);

    return () => el.removeEventListener('scroll', updateScrollButtons);
  }, [products]);

  useEffect(() => {
    if (loading) return;
    if (!products.length) return;
    if (paused) return;

    const id = window.setInterval(() => {
      const el = scrollerRef.current;
      if (!el) return;

      const max = el.scrollWidth - el.clientWidth;
      const next = el.scrollLeft + el.clientWidth * 0.85;
      el.scrollTo({ left: next >= max - 5 ? 0 : next, behavior: 'smooth' });
    }, 4000);

    return () => window.clearInterval(id);
  }, [loading, paused, products.length]);

  return (
    <div className="relative group">
      {/* Side Navigation Buttons */}
      {!loading && products.length > 0 && (
        <>
          <button
            type="button"
            disabled={!canScrollRight}
            className={`absolute -right-5 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center h-14 w-14 rounded-full bg-white shadow-xl border-2 border-gray-200 transition-all ${
              canScrollRight 
                ? 'hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:scale-110 text-gray-900 opacity-100' 
                : 'opacity-30 cursor-not-allowed'
            }`}
            onClick={() => scrollByAmount('next')}
            aria-label="بعدی"
          >
            <Icons.ChevronLeft className="w-7 h-7" />
          </button>
          <button
            type="button"
            disabled={!canScrollLeft}
            className={`absolute -left-5 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center h-14 w-14 rounded-full bg-white shadow-xl border-2 border-gray-200 transition-all ${
              canScrollLeft 
                ? 'hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:scale-110 text-gray-900 opacity-100' 
                : 'opacity-30 cursor-not-allowed'
            }`}
            onClick={() => scrollByAmount('prev')}
            aria-label="قبلی"
          >
            <Icons.ChevronRight className="w-7 h-7" />
          </button>
        </>
      )}

      <div
        ref={scrollerRef}
        className="flex gap-4 md:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden touch-pan-x"
        style={{ 
          scrollbarWidth: 'none', 
          WebkitOverflowScrolling: 'touch',
          scrollSnapType: 'x mandatory',
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        {cards}
      </div>

      {!loading && products.length === 0 && (
        <div className="py-10 text-center text-gray-500">محصولی برای نمایش نیست</div>
      )}
    </div>
  );
}
