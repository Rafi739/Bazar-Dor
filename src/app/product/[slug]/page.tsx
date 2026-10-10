import { getSingleProduct } from "@/lib/api";
import { notFound } from "next/navigation";
import { Product, Market } from "@/types/product";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const product: Product | null = await getSingleProduct(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  
  const allMins: number[] = product.markets?.map((m: Market) => m.min) || [product.today];
  const allMaxs: number[] = product.markets?.map((m: Market) => m.max) || [product.today];

  const minPrice = Math.min(...allMins);
  const maxPrice = Math.max(...allMaxs);
  
  const totalSum = product.markets?.reduce((acc: number, m: Market) => acc + (m.min + m.max) / 2, 0) || product.today;
  const avgPrice = Math.round(totalSum / (product.markets?.length || 1));

  const unitMap: { [key: string]: string } = {
    kg: 'কেজি',
    litre: 'লিটার',
    pcs: 'পিস',
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 min-h-screen">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 pb-6 border-b border-gray-100">
          <span className="text-7xl bg-emerald-50 p-4 rounded-2xl">{product.image || "📦"}</span>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge bg-emerald-100 text-emerald-800 font-semibold px-3 py-1 rounded-full text-xs">
                {product.categoryNameBn || product.category}
              </span>
              <span className="text-xs text-gray-400 font-medium">প্রতি {unitMap[product.unit] || product.unit}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900">{product.nameBn}</h1>
          </div>
        </div>

       
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-emerald-50/70 border border-emerald-100 p-5 rounded-2xl text-center">
            <span className="text-xs text-emerald-700 font-bold uppercase tracking-wider block mb-1">সর্বনিম্ন দাম</span>
            <span className="text-2xl font-black text-emerald-900">৳{minPrice}</span>
          </div>
          <div className="bg-rose-50/70 border border-rose-100 p-5 rounded-2xl text-center">
            <span className="text-xs text-rose-700 font-bold uppercase tracking-wider block mb-1">সর্বোচ্চ দাম</span>
            <span className="text-2xl font-black text-rose-900">৳{maxPrice}</span>
          </div>
          <div className="bg-teal-50/70 border border-teal-100 p-5 rounded-2xl text-center">
            <span className="text-xs text-teal-700 font-bold uppercase tracking-wider block mb-1">গড় দাম</span>
            <span className="text-2xl font-black text-teal-900">৳{avgPrice}</span>
          </div>
        </div>

      
        <h3 className="text-xl font-extrabold text-gray-900 mb-4">বাজারভিত্তিক আজকের দাম</h3>
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
          <table className="table w-full">
            <thead>
              <tr className="bg-gray-50 text-gray-700 font-bold">
                <th className="p-4 text-left">বাজারের নাম</th>
                <th className="p-4 text-left">অঞ্চল / বিভাগ</th>
                <th className="p-4 text-right">সর্বনিম্ন - সর্বোচ্চ দাম (টাকা)</th>
              </tr>
            </thead>
            <tbody>
              {product.markets && product.markets.length > 0 ? (
                product.markets.map((m: Market, idx: number) => (
                  <tr key={idx} className="border-t border-gray-100 hover:bg-gray-50/50 transition">
                    <td className="p-4 font-semibold text-gray-800">{m.market}</td>
                    <td className="p-4 text-gray-500">{m.division}</td>
                    <td className="p-4 text-right font-extrabold text-emerald-800">
                      ৳{m.min} - ৳{m.max}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-gray-400 font-medium">বাজারভিত্তিক তথ্য পাওয়া যায়নি</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}