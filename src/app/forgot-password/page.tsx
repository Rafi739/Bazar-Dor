'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';

type ResetStep = 'email' | 'code' | 'password';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<ResetStep>('email');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);

    try {
      if (step === 'email') {
        const requestedEmail = String(formData.get('email') ?? '').trim();
        const result = await authClient.emailOtp.requestPasswordReset({ email: requestedEmail });
        if (result.error) {
          throw new Error(result.error.message || 'কোড পাঠানো যায়নি।');
        }

        setEmail(requestedEmail);
        setStep('code');
        toast.success('আপনার ইমেইলে ৬ সংখ্যার কোড পাঠানো হয়েছে।');
      } else if (step === 'code') {
        const enteredOtp = String(formData.get('otp') ?? '').trim();
        const response = await fetch('/api/auth/email-otp/check-verification-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, type: 'forget-password', otp: enteredOtp }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.message || 'কোডটি ভুল বা মেয়াদোত্তীর্ণ।');
        }

        setOtp(enteredOtp);
        setStep('password');
        toast.success('কোড মিলে গেছে। এখন নতুন পাসওয়ার্ড দিন।');
      } else {
        const password = String(formData.get('password') ?? '');
        if (password !== formData.get('confirmPassword')) {
          throw new Error('দুটি পাসওয়ার্ড মিলছে না।');
        }

        const result = await authClient.emailOtp.resetPassword({ email, otp, password });
        if (result.error) {
          throw new Error(result.error.message || 'পাসওয়ার্ড পরিবর্তন করা যায়নি।');
        }

        setStep('email');
        setOtp('');
        setEmail('');
        toast.success('পাসওয়ার্ড পরিবর্তন হয়েছে। এখন নতুন পাসওয়ার্ড দিয়ে সাইন ইন করুন।');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'অনুরোধটি সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  }

  async function resendCode() {
    setIsLoading(true);
    try {
      const result = await authClient.emailOtp.requestPasswordReset({ email });
      if (result.error) {
        throw new Error(result.error.message || 'কোড আবার পাঠানো যায়নি।');
      }
      setOtp('');
      setStep('code');
      toast.success('নতুন কোড আপনার ইমেইলে পাঠানো হয়েছে।');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'কোড আবার পাঠানো যায়নি।');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white px-6 py-8 shadow-sm sm:px-10">
        <h1 className="text-2xl font-bold text-gray-900">পাসওয়ার্ড ভুলে গেছেন?</h1>
        <p className="mt-2 text-sm text-gray-600">
          {step === 'email' && 'আপনার অ্যাকাউন্টের ইমেইল দিন। আমরা ৬ সংখ্যার কোড পাঠাব।'}
          {step === 'code' && `${email}-এ পাঠানো ৬ সংখ্যার কোড লিখুন।`}
          {step === 'password' && 'কোড মিলে গেছে। এখন নতুন পাসওয়ার্ড সেট করুন।'}
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {step === 'email' && (
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
          )}

          {step === 'code' && (
            <div>
              <label htmlFor="otp" className="mb-1 block text-xs font-semibold text-gray-700">ইমেইলে পাওয়া ৬ সংখ্যার কোড</label>
              <input
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                minLength={6}
                maxLength={6}
                autoComplete="one-time-code"
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm tracking-[0.4em] text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          )}

          {step === 'password' && (
            <>
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
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {isLoading ? 'প্রসেস হচ্ছে...' : step === 'email' ? 'কোড পাঠান' : step === 'code' ? 'কোড যাচাই করুন' : 'পাসওয়ার্ড পরিবর্তন করুন'}
          </button>
        </form>

        {step === 'code' && (
          <div className="mt-3 flex flex-col gap-2">
            <button type="button" disabled={isLoading} onClick={() => void resendCode()}
              className="w-full text-sm font-medium text-emerald-700 hover:underline disabled:opacity-60">
              কোড পাননি? আবার পাঠান
            </button>
            <button type="button" disabled={isLoading} onClick={() => setStep('email')}
              className="w-full text-sm font-medium text-gray-500 hover:underline disabled:opacity-60">
              অন্য ইমেইল ব্যবহার করুন
            </button>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          <Link href="/signin" className="font-semibold text-emerald-600 hover:underline">সাইন ইন-এ ফিরে যান</Link>
        </p>
      </div>
    </main>
  );
}
