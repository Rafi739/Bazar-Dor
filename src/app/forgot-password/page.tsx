'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<{ subject: string; url?: string; createdAt: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const requestedEmail = String(formData.get('email') ?? '').trim();

    if (!requestedEmail) {
      toast.error('ইমেইল লিখুন।');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/request-password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: requestedEmail,
          redirectTo: `${window.location.origin}/reset-password`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'রিসেট লিংক পাঠানো যায়নি।');
      }

      const previewResponse = await fetch(`/api/mock-email?email=${encodeURIComponent(requestedEmail)}`);
      const previewData = await previewResponse.json();
      const nextPreview = previewData?.email
        ? {
            subject: String(previewData.email.subject ?? 'Password Reset'),
            url: typeof previewData.email.url === 'string' ? previewData.email.url : undefined,
            createdAt: String(previewData.email.createdAt ?? new Date().toISOString()),
          }
        : null;

      setEmail(requestedEmail);
      setPreview(nextPreview);
      toast.success('রিসেট লিংক পাঠানো হয়েছে। আপনার ইমেইল চেক করুন।');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'রিসেট লিংক পাঠানো যায়নি।');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white px-6 py-8 shadow-sm sm:px-10">
        <h1 className="text-2xl font-bold text-gray-900">পাসওয়ার্ড ভুলে গেছেন?</h1>
        <p className="mt-2 text-sm text-gray-600">
          আপনার অ্যাকাউন্টের ইমেইল দিন। আমরা রিসেট লিংক পাঠাব।
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="mb-1 block text-xs font-semibold text-gray-700">ইমেইল</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {isLoading ? 'পাঠানো হচ্ছে...' : 'রিসেট লিংক পাঠান'}
          </button>
        </form>

        {preview && (
          <div className="mt-6 rounded-xl border border-gray-200 bg-[#f8faf9] p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.12em] text-gray-500">
              <span>Gmail preview</span>
              <span>{new Date(preview.createdAt).toLocaleString('bn-BD')}</span>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-700">From:</span>
                <span className="text-xs text-gray-500">no-reply@bazardor.app</span>
              </div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-700">To:</span>
                <span className="max-w-[180px] truncate text-xs text-gray-500">{email}</span>
              </div>
              <div className="mb-2 text-sm font-semibold text-gray-900">{preview.subject}</div>
              <p className="text-xs leading-5 text-gray-600">
                আপনার পাসওয়ার্ড রিসেট লিংকটি নিচে দেওয়া হয়েছে। এই লিঙ্কটি ব্যবহার করে নতুন পাসওয়ার্ড সেট করুন।
              </p>
              {preview.url ? (
                <a
                  href={preview.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex break-all text-xs font-medium text-emerald-700 underline"
                >
                  {preview.url}
                </a>
              ) : (
                <p className="mt-3 text-xs text-gray-500">রিসেট লিঙ্কটি প্রস্তুত হয়েছে।</p>
              )}
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          <Link href="/signin" className="font-semibold text-emerald-600 hover:underline">সাইন ইন-এ ফিরে যান</Link>
        </p>
      </div>
    </main>
  );
}

