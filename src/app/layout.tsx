import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "نمشیران - فروشگاه آنلاین محصولات فشن",
  description: "فروشگاه آنلاین نمشیران با هزاران محصول فشن از برندهای معتبر جهان",
  icons: {
    icon: [
      { url: '/N.png', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
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
