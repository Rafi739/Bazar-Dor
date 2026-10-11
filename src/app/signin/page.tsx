'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import SocialSignInButtons from '@/components/auth/SocialSignInButtons';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);

    try {
      const result = await authClient.signIn.email({
        email: String(formData.get('email')),
        password: String(formData.get('password')),
        callbackURL: redirectTo,
      });
      if (result.error) {
        toast.error(result.error.message || 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।');
      } else {
        toast.success('সাইন ইন সফল হয়েছে।');
        router.replace(redirectTo);
      }
    } catch {
      toast.error('সার্ভারের সঙ্গে যোগাযোগ করা যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50/50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">আপনার অ্যাকাউন্টে সাইন ইন করুন</h1>
        <p className="mt-1 text-sm text-gray-600">আপনার অ্যাকাউন্টে প্রবেশ করতে তথ্য দিন।</p>
      </div>

      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white px-6 py-8 shadow-sm sm:px-10">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="mb-1 block text-xs font-semibold text-gray-700">ইমেইল</label>
            <input id="email" name="email" type="email" autoComplete="email" required
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-600" />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-xs font-semibold text-gray-700">পাসওয়ার্ড</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required
              placeholder="আপনার পাসওয়ার্ড"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-600" />
          </div>
          <div className="text-right">
            <Link href="/forgot-password" className="text-xs font-semibold text-emerald-600 hover:underline">পাসওয়ার্ড ভুলে গেছেন?</Link>
          </div>
          <button disabled={isLoading} type="submit"
            className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
            {isLoading ? 'সাইন ইন হচ্ছে...' : 'সাইন ইন'}
          </button>
        </form>
        <SocialSignInButtons />

        <p className="mt-6 text-center text-xs text-gray-600">
          অ্যাকাউন্ট নেই?{' '}
          <Link href="/signup" className="font-semibold text-emerald-600 hover:underline">সাইন আপ করুন</Link>
        </p>
      </div>
      <Link href="/" className="mt-6 text-xs text-gray-500 transition hover:text-gray-800">← হোম পেজে ফিরে যান</Link>
    </main>
  );
}
