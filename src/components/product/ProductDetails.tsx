import { Product } from '@/types/product';
import Link from 'next/link';

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const markets = product.markets ?? [];

  const unitMap: { [key: string]: string } = {
    kg: 'কেজি',
    litre: 'লিটার',
    pcs: 'পিস',
  };

  const lowestMarket = markets.reduce<(typeof markets)[number] | null>(
    (lowest, market) => (!lowest || market.min < lowest.min ? market : lowest),
    null,
  );
  const highestMarket = markets.reduce<(typeof markets)[number] | null>(
    (highest, market) => (!highest || market.max > highest.max ? market : highest),
    null,
  );
  const averagePrice = markets.length
    ? Math.round(markets.reduce((total, market) => total + (market.min + market.max) / 2, 0) / markets.length)
    : product.today;
  const change = product.change;
  const changeLabel = change
    ? `${change.dir === 'up' ? '▲' : change.dir === 'down' ? '▼' : '—'} ${new Intl.NumberFormat('bn-BD', { maximumFractionDigits: 1 }).format(Math.abs(change.pct))}%`
    : '—';
  const changeColor = change?.dir === 'up'
    ? 'text-emerald-700 bg-emerald-50'
    : change?.dir === 'down'
      ? 'text-rose-600 bg-rose-50'
      : 'text-gray-500 bg-gray-100';
  const unit = unitMap[product.unit] || product.unit;
  const formatPrice = (price: number) => new Intl.NumberFormat('bn-BD').format(price);

  return (
    <main className="min-h-screen bg-[#f1f5f2]">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <nav aria-label="ব্রেডক্রাম্ব" className="mb-4 flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-emerald-700">হোম</Link>
          <span aria-hidden="true">›</span>
          <Link href={`/category/${product.category}`} className="hover:text-emerald-700">
            {product.categoryNameBn || product.category}
          </Link>
          <span aria-hidden="true">›</span>
          <span className="font-medium text-gray-700">{product.nameBn}</span>
        </nav>

        <section className="mb-4 flex flex-col justify-between gap-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">
          <div className="flex min-w-0 items-center gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-4xl">
              {product.image || product.categoryIcon || '📦'}
            </span>
            <div className="min-w-0">
              <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-800">
                  {product.categoryNameBn || product.category}
                </span>
                <span>প্রতি {unit}</span>
              </div>
              <h1 className="text-xl font-extrabold text-gray-900 sm:text-2xl">{product.nameBn}</h1>
              <p className="mt-1 text-sm text-gray-500">বিভিন্ন বাজারের আজকের দামের তুলনা</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-between gap-6 rounded-xl bg-emerald-50 px-5 py-3 sm:min-w-48 sm:flex-col sm:items-start sm:gap-1">
            <div>
              <span className="block text-xs font-medium text-gray-500">আজকের দাম</span>
              <span className="text-xl font-extrabold text-gray-900">৳{formatPrice(product.today)} <span className="text-xs font-medium text-gray-500">/ {unit}</span></span>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${changeColor}`}>{changeLabel}</span>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="mb-3 text-base font-bold text-gray-900">পণ্যের বাজারদর</h2>
          <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <SummaryCard
              label="সর্বনিম্ন দাম"
              price={lowestMarket?.min ?? product.today}
              detail={lowestMarket ? `${lowestMarket.division} · ${lowestMarket.market}` : 'বাজারের তথ্য নেই'}
              color="emerald"
              unit={unit}
            />
            <SummaryCard
              label="সর্বোচ্চ দাম"
              price={highestMarket?.max ?? product.today}
              detail={highestMarket ? `${highestMarket.division} · ${highestMarket.market}` : 'বাজারের তথ্য নেই'}
              color="rose"
              unit={unit}
            />
            <SummaryCard
              label="গড় দাম"
              price={averagePrice}
              detail={markets.length ? `${markets.length}টি বাজারের গড় মূল্য` : 'বাজারের তথ্য নেই'}
              color="teal"
              unit={unit}
            />
          </div>

          <h2 className="mb-3 text-base font-bold text-gray-900">বাজারভিত্তিক আজকের দাম</h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full min-w-160 border-collapse text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-600">
                  <th scope="col" className="px-3 py-3 sm:px-4">বাজার</th>
                  <th scope="col" className="px-3 py-3 sm:px-4">বিভাগ</th>
                  <th scope="col" className="px-3 py-3 text-right sm:px-4">সর্বনিম্ন</th>
                  <th scope="col" className="px-3 py-3 text-right sm:px-4">সর্বোচ্চ</th>
                  <th scope="col" className="px-3 py-3 text-right sm:px-4">গড়</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {markets.length > 0 ? markets.map((market) => (
                  <tr key={`${market.division}-${market.market}`} className="transition-colors hover:bg-emerald-50/40">
                    <td className="px-3 py-3 font-medium text-gray-900 sm:px-4">{market.market}</td>
                    <td className="px-3 py-3 text-gray-500 sm:px-4">{market.division}</td>
                    <td className="px-3 py-3 text-right font-semibold text-emerald-700 sm:px-4">৳{formatPrice(market.min)}</td>
                    <td className="px-3 py-3 text-right font-semibold text-rose-600 sm:px-4">৳{formatPrice(market.max)}</td>
                    <td className="px-3 py-3 text-right font-semibold text-gray-800 sm:px-4">৳{formatPrice(Math.round((market.min + market.max) / 2))}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">এই পণ্যের বাজারভিত্তিক তথ্য পাওয়া যায়নি।</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  price,
  detail,
  color,
  unit,
}: {
  label: string;
  price: number;
  detail: string;
  color: 'emerald' | 'rose' | 'teal';
  unit: string;
}) {
  const styles = {
    emerald: 'border-emerald-100 bg-emerald-50/40 text-emerald-700',
    rose: 'border-rose-100 bg-rose-50/40 text-rose-600',
    teal: 'border-teal-100 bg-teal-50/40 text-teal-700',
  };

  return (
    <div className={`rounded-xl border p-3.5 ${styles[color]}`}>
      <p className="text-xs font-semibold">{label}</p>
      <p className="mt-1 text-lg font-extrabold text-gray-900">৳{new Intl.NumberFormat('bn-BD').format(price)} <span className="text-xs font-medium text-gray-500">/ {unit}</span></p>
      <p className="mt-1 truncate text-[11px] text-gray-500" title={detail}>{detail}</p>
    </div>
  );
}