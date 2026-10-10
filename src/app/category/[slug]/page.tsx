import { getCategoryBySlug, getProductsByCategory } from "@/lib/api";
import { notFound } from "next/navigation";
import CategoryProducts from "@/components/category/CategoryProducts";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const categorySlug = resolvedParams.slug;

  const [category, categoryProducts] = await Promise.all([
    getCategoryBySlug(categorySlug),
    getProductsByCategory(categorySlug),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50/50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-3xl">{category.icon}</span>
          <div>
            <p className="text-sm font-medium text-gray-500">ক্যাটাগরি</p>
            <h1 className="text-3xl font-black text-gray-900">{category.nameBn}</h1>
          </div>
        </div>
        <CategoryProducts products={categoryProducts} />
      </div>
    </main>
  );
}