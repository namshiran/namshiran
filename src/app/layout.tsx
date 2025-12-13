import type { Metadata } from 'next';
import './globals.css';

const baseUrl = 'https://namshiran.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "نمشیران - فروشگاه آنلاین محصولات فشن",
    template: "%s | نمشیران",
  },
  description: "فروشگاه آنلاین نمشیران با هزاران محصول فشن از برندهای معتبر جهان. خرید آنلاین لباس، کفش، کیف و لوازم جانبی با بهترین قیمت",
  keywords: ['نمشیران', 'فروشگاه آنلاین', 'فشن', 'لباس', 'کفش', 'خرید آنلاین', 'مد'],
  authors: [{ name: 'نمشیران' }],
  creator: 'نمشیران',
  publisher: 'نمشیران',
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: baseUrl,
    siteName: 'نمشیران',
    title: 'نمشیران - فروشگاه آنلاین محصولات فشن',
    description: 'فروشگاه آنلاین نمشیران با هزاران محصول فشن از برندهای معتبر جهان',
    images: [
      {
        url: `${baseUrl}/api/og?title=${encodeURIComponent('نمشیران')}&description=${encodeURIComponent('فروشگاه آنلاین فشن')}`,
        width: 1200,
        height: 630,
        alt: 'نمشیران - فروشگاه آنلاین فشن',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'نمشیران - فروشگاه آنلاین محصولات فشن',
    description: 'فروشگاه آنلاین نمشیران با هزاران محصول فشن از برندهای معتبر جهان',
    creator: '@namshiran',
    images: [`${baseUrl}/api/og?title=${encodeURIComponent('نمشیران')}&description=${encodeURIComponent('فروشگاه آنلاین فشن')}`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/N.png', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/N.png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
