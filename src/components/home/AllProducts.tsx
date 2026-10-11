import ProductCard from '@/components/home/ProductCard';
import { Product } from '@/types/product';

interface AllProductsProps {
  products: Product[];
}

export default function AllProducts({ products }: AllProductsProps) {
  return (
    <section id="shob-ponno" className="my-12 pt-4">
      <div className="mb-6">
        <h2 className="border-l-4 border-teal-700 pl-3 text-2xl font-black text-gray-900">
          সকল নিত্যপ্রয়োজনীয় পণ্য
        </h2>
        <p className="mt-1 pl-4 text-sm text-gray-500">বাজারে উপলব্ধ সমস্ত পণ্যের বর্তমান তালিকা ও দাম</p>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
