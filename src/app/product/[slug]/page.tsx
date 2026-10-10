import { getSingleProduct } from "@/lib/api";
import { notFound } from "next/navigation";
import ProductDetails from "@/components/product/ProductDetails";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const product = await getSingleProduct(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}