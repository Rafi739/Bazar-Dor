export default function CategoryLoading() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-10 sm:px-6 lg:px-8" aria-label="ক্যাটাগরি পণ্য লোড হচ্ছে">
      <div className="mb-6 flex items-center gap-4">
        <div className="h-14 w-14 animate-pulse rounded-2xl bg-gray-200" />
        <div className="space-y-2">
          <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
          <div className="h-8 w-36 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
      <div className="mb-5 flex justify-end">
        <div className="h-10 w-48 animate-pulse rounded-lg bg-gray-200" />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="h-44 animate-pulse rounded-2xl border border-gray-100 bg-white" />
        ))}
      </div>
    </main>
  );
}