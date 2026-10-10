'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import SocialSignInButtons from '@/components/auth/SocialSignInButtons';

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);

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
      const result = await authClient.signUp.email({
        name: String(formData.get('name')),
        email: String(formData.get('email')),
        password,
        callbackURL: '/',
      });

      if (result.error) {
        toast.error(result.error.message || 'অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।');
      } else {
        toast.success('অ্যাকাউন্ট তৈরি হয়েছে। স্বাগতম!');
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
        <h1 className="text-2xl font-bold text-gray-900">অ্যাকাউন্ট তৈরি করুন</h1>
        <p className="mt-1 text-sm text-gray-600">বিনামূল্যে সাইন আপ করে সব বিস্তারিত দর দেখুন।</p>
      </div>

      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white px-6 py-8 shadow-sm sm:px-10">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="mb-1 block text-xs font-semibold text-gray-700">নাম</label>
            <input id="name" name="name" type="text" autoComplete="name" required
              placeholder="আপনার নাম"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-600" />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-xs font-semibold text-gray-700">ইমেইল</label>
            <input id="email" name="email" type="email" autoComplete="email" required
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-600" />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-xs font-semibold text-gray-700">পাসওয়ার্ড</label>
            <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required
              placeholder="কমপক্ষে ৮ অক্ষর"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-600" />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="mb-1 block text-xs font-semibold text-gray-700">পাসওয়ার্ড নিশ্চিত করুন</label>
            <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required
              placeholder="আবার লিখুন"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-600" />
          </div>
          <button disabled={isLoading} type="submit"
            className="mt-2 w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
            {isLoading ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'অ্যাকাউন্ট তৈরি করুন'}
          </button>
        </form>

        <SocialSignInButtons />

        <p className="mt-6 text-center text-xs text-gray-600">
          অ্যাকাউন্ট আছে?{' '}
          <Link href="/signin" className="font-semibold text-emerald-600 hover:underline">সাইন ইন করুন</Link>
        </p>
      </div>
      <Link href="/" className="mt-6 text-xs text-gray-500 transition hover:text-gray-800">← হোম পেজে ফিরে যান</Link>
    </main>
  );
}
