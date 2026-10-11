import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import ProductDetails from '@/components/product/ProductDetails';
import { getSingleProduct } from '@/lib/api';
import { auth } from '@/lib/auth';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect(`/signin?redirect=${encodeURIComponent(`/product/${resolvedParams.slug}`)}`);
  }

  const product = await getSingleProduct(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}