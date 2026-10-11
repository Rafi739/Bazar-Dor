import Link from 'next/link';
import { Product } from '@/types/product';

interface PriceTickerProps {
  products: Product[];
}

export default function PriceTicker({ products }: PriceTickerProps) {
  const formatPrice = (price: number) => new Intl.NumberFormat('bn-BD').format(price);
  const formatChange = (percentage: number) =>
    new Intl.NumberFormat('bn-BD', { maximumFractionDigits: 1 }).format(percentage);
  const hasProducts = products.length > 0;
  const tickerProducts = hasProducts ? products : [
    { id: 1, slug: 's', nameBn: 'স্বর্ণমাছি চাল', category: 'c', unit: 'কেজি', image: '🍚', today: 148, change: { dir: 'up', pct: 2.1 } },
    { id: 2, slug: 'm', nameBn: 'মিনিকেট চাল', category: 'c', unit: 'কেজি', image: '🍚', today: 99, change: { dir: 'down', pct: 2.9 } },
    { id: 3, slug: 'b', nameBn: 'বাটাম সাইজ চাল', category: 'c', unit: 'কেজি', image: '🍚', today: 66, change: { dir: 'up', pct: 3.1 } },
    { id: 4, slug: 'd', nameBn: 'মসুর ডাল', category: 'd', unit: 'কেজি', image: '🫘', today: 142, change: { dir: 'up', pct: 2.9 } },
  ];

  return (
    <div className="bg-white border-b border-gray-100 py-3 overflow-hidden relative w-full">
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-linear-to-r from-white to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-linear-to-l from-white to-transparent z-10 pointer-events-none"></div>

      <div className="flex w-max animate-marquee-slow items-center">
        {[...tickerProducts, ...tickerProducts, ...tickerProducts].map((product, index) => {
          const isUp = product.change?.dir === 'up';
          const isDown = product.change?.dir === 'down';

          const tickerItem = (
            <>
              <span className="text-lg">{product.image || '🛒'}</span>
              <span className="font-semibold text-gray-800">{product.nameBn}</span>
              <span className="text-gray-900 font-bold">{formatPrice(product.today)} টাকা/{product.unit}</span>
              
              <span className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold ${
                isUp ? 'text-emerald-700 bg-emerald-50' : 
                isDown ? 'text-rose-700 bg-rose-50' : 
                'text-gray-700 bg-gray-50'
              }`}>
                {isUp ? '▲' : isDown ? '▼' : '—'} 
                {formatChange(Math.abs(product.change?.pct || 0))}%
              </span>
            </>
          );

          const className = "flex items-center gap-2.5 px-6 border-r border-gray-100 whitespace-nowrap text-sm";

          return hasProducts ? (
            <Link
              key={index}
              href={`/product/${product.slug}`}
              aria-label={`${product.nameBn} বিস্তারিত দেখুন`}
              className={`${className} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600`}
            >
              {tickerItem}
            </Link>
          ) : (
            <div key={index} className={className}>
              {tickerItem}
            </div>
          );
        })}
      </div>
    </div>
  );
}