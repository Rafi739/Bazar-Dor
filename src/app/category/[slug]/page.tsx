"use client";
import { useEffect, useState, type ComponentProps } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/home/ProductCard";
import { getProductsByCategory } from "@/lib/api";

type Product = ComponentProps<typeof ProductCard>["product"];

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("default");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getProductsByCategory(slug);
      setProducts(Array.isArray(data) ? data : []);
      setLoading(false);
    }
    if (slug) loadData();
  }, [slug]);


  const sortedProducts = [...products].sort((a, b) => {
    const priceA = Number(a.currentPrice) || 0;
    const priceB = Number(b.currentPrice) || 0;
    if (sortOrder === "low-to-high") return priceA - priceB;
    if (sortOrder === "high-to-low") return priceB - priceA;
    return 0; 
  });

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="text-gray-500 mt-4 font-medium">লোড হচ্ছে...</p>
      </div>
    );
  }


  if (!loading && products.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl font-black text-emerald-600 mb-4">৪০৪</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি</h2>
        <p className="text-gray-500 mb-8">অনুগ্রহ করে অন্য ক্যাটাগরি দেখুন অথবা হোম পেজে ফিরে যান।</p>
        <Link href="/" className="btn bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl">
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">ক্যাটাগরি পেজ</span>
          <h1 className="text-2xl font-black text-gray-900 mt-1">ক্যাটাগরি: {slug}</h1>
        </div>

        {/* Sort Control (C1) */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-sm font-semibold text-gray-600">সাজান:</span>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="select select-bordered select-sm border-gray-300 rounded-xl focus:border-emerald-600 w-full md:w-56"
          >
            <option value="default">ডিফল্ট</option>
            <option value="low-to-high">দাম: কম থেকে বেশি</option>
            <option value="high-to-low">দাম: বেশি থেকে কম</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {sortedProducts.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </main>
  );
}