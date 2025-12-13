import { Suspense } from 'react';
import ProductsClient from './ProductsClient';

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-700">در حال بارگذاری محصولات...</p>
          </div>
        </div>
      }
    >
      <ProductsClient />
    </Suspense>
  );
}
