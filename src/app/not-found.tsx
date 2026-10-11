import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="max-w-md rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mb-4 text-5xl" aria-hidden="true">📭</div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">404</p>
        <h1 className="mt-3 text-3xl font-black text-gray-900">পাতা খুঁজে পাওয়া যায়নি</h1>
        <p className="mt-3 text-sm text-gray-600">
          এই ঠিকানা সঠিক নয় অথবা পণ্য/ক্যাটাগরি এখন উপলব্ধ নেই।
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}

