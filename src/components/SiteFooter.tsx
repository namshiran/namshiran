import Link from 'next/link';
import Image from 'next/image';
import { categories } from '@/types/category';
import { Icons } from './Icons';

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-gray-300 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 text-xl font-extrabold text-white">
              <div className="relative h-9 w-9 shrink-0">
                <Image
                  src="/N.png"
                  alt="نمشیران"
                  fill
                  className="object-contain brightness-0 invert"
                />
              </div>
              <span>نمشیران</span>
            </div>
            <p className="mt-3 text-sm leading-7 text-gray-300">
              فروشگاه آنلاین نمشیران با تجربه‌ای سریع، ریسپانسیو و کاربرپسند.
            </p>
          </div>

          <div>
            <div className="text-sm font-bold text-white mb-3">دسته‌بندی‌ها</div>
            <div className="flex flex-col gap-2 text-sm text-gray-300">
              {categories.map((c) => (
                <Link key={c.id} href={`/category/${c.slug}`} className="hover:text-blue-400 transition-colors">
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-bold text-white mb-3">لینک‌های سریع</div>
            <div className="flex flex-col gap-2 text-sm text-gray-300">
              <Link href="/" className="hover:text-blue-400 transition-colors">خانه</Link>
              <Link href="/products" className="hover:text-blue-400 transition-colors">محصولات</Link>
            </div>
          </div>

          <div>
            <div className="text-sm font-bold text-white mb-3">پشتیبانی</div>
            <div className="flex flex-col gap-2 text-sm text-gray-300">
              <a href="#" className="hover:text-blue-400 transition-colors">سوالات متداول</a>
              <a href="#" className="hover:text-blue-400 transition-colors">تماس با ما</a>
              <a href="#" className="hover:text-blue-400 transition-colors">قوانین و مقررات</a>
            </div>
            <div className="mt-6">
              <div className="text-sm font-bold text-white mb-3">شبکه‌های اجتماعی</div>
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Icons.Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <Icons.Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  aria-label="Telegram"
                >
                  <Icons.Telegram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-700 flex flex-col md:flex-row gap-3 items-center justify-between text-xs text-gray-400">
          <div>© {new Date().getFullYear()} نمشیران — تمامی حقوق محفوظ است.</div>
          <div className="flex items-center gap-4">
            <a className="hover:text-gray-200 transition-colors" href="#">حریم خصوصی</a>
            <a className="hover:text-gray-200 transition-colors" href="#">شرایط استفاده</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
