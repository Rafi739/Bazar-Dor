'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { authClient } from '@/lib/auth-client';

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setError('');
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    try {
      const result = await authClient.requestPasswordReset({
        email: String(formData.get('email')),
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (result.error) {
        setError(result.error.message || 'পাসওয়ার্ড রিসেটের অনুরোধ পাঠানো যায়নি।');
      } else {
        setMessage('ইমেইলটি থাকলে পাসওয়ার্ড রিসেটের নির্দেশনা পাঠানো হয়েছে। ইনবক্স ও স্প্যাম ফোল্ডার দেখুন।');
      }
    } catch {
      setError('সার্ভারের সঙ্গে যোগাযোগ করা যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white px-6 py-8 shadow-sm sm:px-10">
        <h1 className="text-2xl font-bold text-gray-900">পাসওয়ার্ড ভুলে গেছেন?</h1>
        <p className="mt-2 text-sm text-gray-600">আপনার অ্যাকাউন্টের ইমেইল দিন। আমরা রিসেট লিংক পাঠাব।</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="mb-1 block text-xs font-semibold text-gray-700">ইমেইল</label>
            <input id="email" name="email" type="email" autoComplete="email" required
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-600" />
          </div>
          {message && <p role="status" className="text-sm text-emerald-700">{message}</p>}
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <button disabled={isLoading} type="submit"
            className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60">
            {isLoading ? 'পাঠানো হচ্ছে...' : 'রিসেট লিংক পাঠান'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          <Link href="/signin" className="font-semibold text-emerald-600 hover:underline">সাইন ইন-এ ফিরে যান</Link>
        </p>
      </div>
    </main>
  );
}
