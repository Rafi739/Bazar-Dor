'use client';

import Link from 'next/link';
import { FormEvent, Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

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
  const invalidToken = searchParams.get('error');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (invalidToken) {
      toast.error('রিসেট লিংকটি অবৈধ বা মেয়াদোত্তীর্ণ। নতুন লিংক নিন.', { id: 'invalid-reset-token' });
    }
  }, [invalidToken]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get('password'));
    if (password !== formData.get('confirmPassword')) {
      toast.error('দুটি পাসওয়ার্ড মিলছে না।');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'পাসওয়ার্ড পরিবর্তন করা যায়নি।');
      }

      toast.success('পাসওয়ার্ড পরিবর্তন হয়েছে। এখন নতুন পাসওয়ার্ড দিয়ে সাইন ইন করুন।');
      setIsSuccess(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'রিসেট লিংক ভুল বা মেয়াদোত্তীর্ণ।');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white px-6 py-8 shadow-sm sm:px-10">
        <h1 className="text-2xl font-bold text-gray-900">নতুন পাসওয়ার্ড সেট করুন</h1>
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
          <button disabled={!token || isLoading || isSuccess} type="submit"
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
