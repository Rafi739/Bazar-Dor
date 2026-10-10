import Link from 'next/link';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const unitMap: { [key: string]: string } = {
    kg: 'প্রতি কেজি',
    litre: 'প্রতি লিটার',
    pcs: 'প্রতি পিস',
  };

  const direction = product.change?.dir;
  const badgeColor =
    direction === 'up'
      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
      : direction === 'down'
        ? 'text-rose-600 bg-rose-50 border-rose-200'
        : 'text-gray-600 bg-gray-50 border-gray-200';

  const arrowSymbol =
    direction === 'up'
      ? `▲ ${Math.abs(product.change?.pct ?? 0)}%`
      : direction === 'down'
        ? `▼ ${Math.abs(product.change?.pct ?? 0)}%`
        : `— ${Math.abs(product.change?.pct ?? 0)}%`;
  const formattedPrice = new Intl.NumberFormat('bn-BD').format(product.today);

  return (
    <Link href={`/product/${product.slug}`} className="block">
      <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col justify-between h-full">
        <div className="flex items-center gap-3">
          <span className="text-3xl p-2 bg-gray-50 rounded-lg">{product.image}</span>
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">{product.nameBn}</h3>
            <p className="text-xs text-gray-500">{unitMap[product.unit] || `প্রতি ${product.unit}`}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t pt-3 border-gray-50">
          <div>
            <span className="text-xs text-gray-400 block">আজকের দাম</span>
            <span className="text-lg font-bold text-gray-900">{formattedPrice} টাকা</span>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${badgeColor}`}>
            {arrowSymbol}
          </span>
        </div>
      </div>
    </Link>
  );
}