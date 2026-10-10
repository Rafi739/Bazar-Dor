import { Product } from '@/types/product';

interface ProductDetailsProps {
  product: Product;
}

type ProductMarket = {
  min: number;
  max: number;
  market: string;
  division: string;
};

export default function ProductDetails({ product }: ProductDetailsProps) {
  const markets = (product as Product & { markets?: ProductMarket[] }).markets ?? [];

  const unitMap: { [key: string]: string } = {
    kg: 'প্রতি কেজি',
    litre: 'প্রতি লিটার',
    pcs: 'প্রতি পিস',
  };

  const allMins = markets.map((m) => m.min);
  const allMaxs = markets.map((m) => m.max);

  const absoluteMin = allMins.length ? Math.min(...allMins) : 0;
  const absoluteMax = allMaxs.length ? Math.max(...allMaxs) : 0;
  
  const totalSum = markets.reduce((acc, m) => acc + (m.min + m.max) / 2, 0);
  const averagePrice = markets.length ? Math.round(totalSum / markets.length) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center gap-4">
          <span className="text-5xl p-3 bg-gray-50 rounded-2xl">{product.image}</span>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full font-medium border border-emerald-100">
                {(product as Product & { categoryNameBn?: string }).categoryNameBn}
              </span>
              <span className="text-xs text-gray-500">
                {unitMap[product.unit] || `প্রতি ${product.unit}`}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.nameBn}</h1>
            <p className="text-sm text-gray-500 mt-1">
              বাজারের বর্তমান অবস্থার ওপর ভিত্তি করে সংগৃহীত সঠিক ও হালনাগাদ মূল্যতালিকা।
            </p>
          </div>
        </div>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm text-center">
          সর্বনিম্ন দাম
          <span className="text-2xl font-bold text-emerald-600 block mt-1">{absoluteMin} টাকা</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm text-center">
          সর্বোচ্চ দাম
          <span className="text-2xl font-bold text-rose-600 block mt-1">{absoluteMax} টাকা</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm text-center">
          গড় দাম
          <span className="text-2xl font-bold text-blue-600 block mt-1">{averagePrice} টাকা</span>
        </div>
      </div>

      
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">বাজারভিত্তিক আজকের দাম</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 text-sm">
                <th className="py-3 px-4 font-medium">বাজারের নাম</th>
                <th className="py-3 px-4 font-medium">অঞ্চল / বিভাগ</th>
                <th className="py-3 px-4 font-medium">সর্বনিম্ন দাম</th>
                <th className="py-3 px-4 font-medium">সর্বোচ্চ দাম</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
              {markets.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-gray-900">{item.market}</td>
                  <td className="py-3 px-4 text-gray-500">{item.division}</td>
                  <td className="py-3 px-4 font-medium text-emerald-600">{item.min} টাকা</td>
                  <td className="py-3 px-4 font-medium text-rose-600">{item.max} টাকা</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}