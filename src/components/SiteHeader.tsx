'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from './Icons';

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-3 group shrink-0"
          >
            <Image
              src="/N.png"
              alt="نمشیران"
              width={40}
              height={40}
              className="object-contain group-hover:scale-110 transition-transform"
            />
            <span className="text-xl font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors">
              نمشیران
            </span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-2xl">
            <form
              className="w-full"
              onSubmit={(e) => {
                e.preventDefault();
                const q = query.trim();
                router.push(q ? `/products?q=${encodeURIComponent(q)}` : '/products');
              }}
            >
              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجو در محصولات…"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 pl-14 text-sm text-gray-900 shadow-sm outline-none placeholder:text-gray-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                />
                <button
                  type="submit"
                  className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                  aria-label="جستجو"
                >
                  <Icons.Search className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>



          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-700 shadow-sm"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'بستن منو' : 'باز کردن منو'}
          >
            {open ? <Icons.X className="w-5 h-5" /> : <Icons.Menu className="w-5 h-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-3">
              <div className="flex flex-col gap-2">
                <form
                  className="px-1"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const q = query.trim();
                    setOpen(false);
                    router.push(q ? `/products?q=${encodeURIComponent(q)}` : '/products');
                  }}
                >
                  <div className="relative">
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="جستجو…"
                      className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 pl-14 text-sm text-gray-900 shadow-sm outline-none placeholder:text-gray-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                    />
                    <button
                      type="submit"
                      className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900 text-white"
                      aria-label="جستجو"
                    >
                      <Icons.Search className="w-5 h-5" />
                    </button>
                  </div>
                </form>


              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
