import Hero from "@/components/home/Hero";
import ProductCard from "@/components/home/ProductCard";
import PriceTicker from "@/components/shared/PriceTicker";
import { getAllProducts } from "@/lib/api";

export default async function HomePage() {
  const products = await getAllProducts();

  const sortedByChange = [...products].sort((a, b) => b.changePercentage - a.changePercentage);
  const topRisers = sortedByChange.slice(0, 6);
  const topFallers = [...products].sort((a, b) => a.changePercentage - b.changePercentage).slice(0, 6);

  return (
    <main className="min-h-screen bg-gray-50/50 pb-16">
      <PriceTicker products={products} />
      <div className="max-w-6xl mx-auto px-4">
        <Hero />

        {/* Section A: আজ দাম বেড়েছে ▲ */}
        <section className="my-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-gray-900 border-l-4 border-rose-500 pl-3">
              আজ দাম বেড়েছে ▲
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {topRisers.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>

        {/* Section B: আজ দাম কমেছে ▼ */}
        <section className="my-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-gray-900 border-l-4 border-emerald-600 pl-3">
              আজ দাম কমেছে ▼
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {topFallers.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>

        {/* Section C: সব পণ্য */}
        <section id="shob-ponno" className="my-12 pt-4">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-gray-900 border-l-4 border-teal-700 pl-3">
              সকল নিত্যপ্রয়োজনীয় পণ্য
            </h2>
            <p className="text-sm text-gray-500 mt-1 pl-4">বাজারে উপলব্ধ সমস্ত পণ্যের বর্তমান তালিকা ও দাম</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {products.map((p: Parameters<typeof ProductCard>[0]["product"]) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}