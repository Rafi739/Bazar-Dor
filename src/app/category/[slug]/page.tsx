import { getAllProducts } from "@/lib/api";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const categorySlug = resolvedParams.slug;

  const allProducts = await getAllProducts();
  
  
  const categoryProducts = allProducts.filter(
    (p) => p.category.toLowerCase() === categorySlug.toLowerCase()
  );

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 min-h-screen">
      <h1 className="text-3xl font-black text-gray-900 mb-6 capitalize">
        ক্যাটাগরি: {categorySlug}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categoryProducts.map((product) => (
          <Link 
            href={`/product/${product.slug}`} 
            key={product.id}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition"
          >
            <span className="text-4xl mb-3 block">{product.image || "📦"}</span>
            <h2 className="text-lg font-bold text-gray-800">{product.nameBn}</h2>
            <p className="text-emerald-700 font-extrabold mt-2">৳{product.today} / {product.unit}</p>
          </Link>
        ))}
      </div>

      {categoryProducts.length === 0 && (
        <p className="text-gray-400 text-center py-10">এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।</p>
      )}
    </main>
  );
}