'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/home/ProductCard';
import { Product } from '@/types/product';

type SortOrder = 'default' | 'ascending' | 'descending';

export default function CategoryProducts({ products }: { products: Product[] }) {
  const [sortOrder, setSortOrder] = useState<SortOrder>('default');
  const sortedProducts = useMemo(() => {
    if (sortOrder === 'default') {
      return products;
    }

    return [...products].sort((first, second) =>
      sortOrder === 'ascending' ? first.today - second.today : second.today - first.today,
    );
  }, [products, sortOrder]);

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
        <p className="font-semibold text-gray-700">এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।</p>
        <Link href="/" className="mt-4 inline-flex rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800">
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500">{products.length}টি পণ্য</p>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <span>সাজান:</span>
          <select
            value={sortOrder}
            onChange={(event) => {
              const value = event.target.value;
              if (value === 'default' || value === 'ascending' || value === 'descending') {
                setSortOrder(value);
              }
            }}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-800 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="default">ডিফল্ট</option>
            <option value="ascending">দাম: কম থেকে বেশি</option>
            <option value="descending">দাম: বেশি থেকে কম</option>
          </select>
        </label>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {sortedProducts.map((product) => <ProductCard key={product.slug} product={product} />)}
      </div>
    </>
  );
}