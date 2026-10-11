function ProductCardSkeleton() {
  return (
    <div className="h-40 animate-pulse rounded-xl border border-gray-100 bg-white p-4" aria-hidden="true">
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 rounded-lg bg-gray-100" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-gray-100" />
          <div className="h-3 w-1/2 rounded bg-gray-100" />
        </div>
      </div>
      <div className="mt-5 border-t border-gray-100 pt-3">
        <div className="h-4 w-2/3 rounded bg-gray-100" />
      </div>
    </div>
  );
}

function ProductSectionSkeleton({ count }: { count: number }) {
  return (
    <div className="my-10" aria-hidden="true">
      <div className="mb-6 h-7 w-48 animate-pulse rounded bg-gray-200" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: count }, (_, index) => <ProductCardSkeleton key={index} />)}
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50/50 pb-16" aria-busy="true" aria-label="পণ্য লোড হচ্ছে">
      <div className="mx-auto max-w-6xl px-4">
        <div className="my-4 flex min-h-44 animate-pulse items-center justify-between rounded-2xl bg-gray-100 p-6">
          <div className="w-2/3 space-y-3">
            <div className="h-4 w-36 rounded bg-gray-200" />
            <div className="h-7 w-full max-w-md rounded bg-gray-200" />
            <div className="h-4 w-full max-w-sm rounded bg-gray-200" />
            <div className="h-9 w-28 rounded bg-gray-200" />
          </div>
          <div className="hidden h-28 w-36 rounded-xl bg-gray-200 sm:block" />
        </div>
        <ProductSectionSkeleton count={6} />
        <ProductSectionSkeleton count={6} />
        <ProductSectionSkeleton count={8} />
      </div>
    </main>
  );
}