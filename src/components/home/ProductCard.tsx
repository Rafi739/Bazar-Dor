import Link from "next/link";

type Product = {
  slug: string;
  emoji?: string;
  name: string;
  unit: string;
  currentPrice: number;
  changePercentage: number;
};

export default function ProductCard({ product }: { product: Product }) {
  const isUp = product.changePercentage >= 0;

  return (
    <Link 
      href={`/product/${product.slug}`} 
      className="card bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 p-5 rounded-2xl flex flex-col justify-between group"
    >
      <div>
        <div className="text-5xl mb-3 transform group-hover:scale-110 transition duration-300 inline-block">
          {product.emoji || "📦"}
        </div>
        <h3 className="font-bold text-gray-800 text-lg group-hover:text-emerald-700 transition">
          {product.name}
        </h3>
        <p className="text-xs text-gray-400 font-medium mt-0.5">প্রতি {product.unit}</p>
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-end">
        <div>
          <span className="text-[11px] text-gray-400 font-semibold block uppercase tracking-wider">আজকের দাম</span>
          <span className="font-extrabold text-emerald-800 text-xl">৳{product.currentPrice}</span>
        </div>
        <span className={`badge text-xs font-bold px-2.5 py-1 rounded-lg border ${
          isUp 
            ? 'bg-rose-50 text-rose-600 border-rose-100' 
            : 'bg-emerald-50 text-emerald-700 border-emerald-100'
        }`}>
          {isUp ? "▲" : "▼"} {Math.abs(product.changePercentage)}%
        </span>
      </div>
    </Link>
  );
}