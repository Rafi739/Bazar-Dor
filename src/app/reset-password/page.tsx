'use client';

import Link from 'next/link';
import { FormEvent, Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-gray-50/50" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get('password'));
    if (password !== formData.get('confirmPassword')) {
      setError('দুটি পাসওয়ার্ড মিলছে না।');
      setIsLoading(false);
      return;
    }

    try {
      const result = await authClient.resetPassword({ newPassword: password, token });
      if (result.error) {
        setError(result.error.message || 'পাসওয়ার্ড পরিবর্তন করা যায়নি। নতুন রিসেট লিংক নিন।');
      } else {
        setMessage('পাসওয়ার্ড পরিবর্তন হয়েছে। এখন নতুন পাসওয়ার্ড দিয়ে সাইন ইন করুন।');
      }
    } catch {
      setError('সার্ভারের সঙ্গে যোগাযোগ করা যায়নি। নতুন রিসেট লিংক নিয়ে আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white px-6 py-8 shadow-sm sm:px-10">
        <h1 className="text-2xl font-bold text-gray-900">নতুন পাসওয়ার্ড সেট করুন</h1>
        {searchParams.get('error') && (
          <p role="alert" className="mt-4 text-sm text-red-600">রিসেট লিংকটি অবৈধ বা মেয়াদোত্তীর্ণ। নতুন লিংক নিন।</p>
        )}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="mb-1 block text-xs font-semibold text-gray-700">নতুন পাসওয়ার্ড</label>
            <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-600" />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="mb-1 block text-xs font-semibold text-gray-700">পাসওয়ার্ড নিশ্চিত করুন</label>
            <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-600" />
          </div>
          {message && <p role="status" className="text-sm text-emerald-700">{message}</p>}
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <button disabled={!token || isLoading || Boolean(message)} type="submit"
            className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60">
            {isLoading ? 'পরিবর্তন হচ্ছে...' : 'পাসওয়ার্ড পরিবর্তন করুন'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          <Link href="/signin" className="font-semibold text-emerald-600 hover:underline">সাইন ইন-এ ফিরে যান</Link>
        </p>
      </div>
    </main>
  );
}
