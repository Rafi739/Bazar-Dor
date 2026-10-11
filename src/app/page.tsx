import AllProducts from '@/components/home/AllProducts';
import FallingProducts from '@/components/home/FallingProducts';
import Hero from '@/components/home/Hero';
import RisingProducts from '@/components/home/RisingProducts';
import { getAllProducts } from '@/lib/api';

export default async function HomePage() {
  const products = await getAllProducts();

  return (
    <main className="min-h-screen bg-gray-50/50 pb-16">
      <div className="mx-auto max-w-6xl px-4">
        <Hero />
        <RisingProducts products={products} />
        <FallingProducts products={products} />
        <AllProducts products={products} />
      </div>
    </main>
  );
}