import ProductCard from '@/components/home/ProductCard';
import { Product } from '@/types/product';

interface FallingProductsProps {
  products: Product[];
}

export default function FallingProducts({ products }: FallingProductsProps) {
  const topFallers = [...products]
    .filter((product) => product.change?.dir === 'down')
    .sort((first, second) => Math.abs(second.change?.pct ?? 0) - Math.abs(first.change?.pct ?? 0))
    .slice(0, 6);

  return (
    <section className="my-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="border-l-4 border-emerald-600 pl-3 text-2xl font-black text-gray-900">
          আজ দাম কমেছে ▼
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
        {topFallers.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
