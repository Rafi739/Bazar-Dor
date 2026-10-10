'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function requestResetCode(requestedEmail: string) {
    const result = await authClient.emailOtp.requestPasswordReset({ email: requestedEmail });
    if (result.error) {
      toast.error(result.error.message || 'ইমেইলে কোড পাঠানো যায়নি।');
      return;
    }

    setEmail(requestedEmail);
    setCodeSent(true);
    toast.success('রিসেট কোড পাঠানো হয়েছে। Local development হলে terminal-এ কোড দেখুন।');
  }

  async function handleResendCode() {
    setIsLoading(true);
    try {
      await requestResetCode(email);
    } catch {
      toast.error('রিসেট কোড পাঠানো যায়নি। ইমেইল সার্ভারের configuration যাচাই করে আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    try {
      if (!codeSent) {
        const requestedEmail = String(formData.get('email')).trim();
        await requestResetCode(requestedEmail);
      } else {
        const password = String(formData.get('password'));
        if (password !== formData.get('confirmPassword')) {
          toast.error('দুটি পাসওয়ার্ড মিলছে না।');
          return;
        }

        const result = await authClient.emailOtp.resetPassword({
          email,
          otp: String(formData.get('otp')).trim(),
          password,
        });
        if (result.error) {
          toast.error(result.error.message || 'কোডটি ভুল বা মেয়াদোত্তীর্ণ।');
        } else {
          toast.success('পাসওয়ার্ড পরিবর্তন হয়েছে। এখন সাইন ইন করুন।');
        }
      }
    } catch {
      toast.error('রিসেট কোড পাঠানো যায়নি। Resend API key ও verified sender address কনফিগার করা আছে কি না যাচাই করুন।');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white px-6 py-8 shadow-sm sm:px-10">
        <h1 className="text-2xl font-bold text-gray-900">পাসওয়ার্ড ভুলে গেছেন?</h1>
        <p className="mt-2 text-sm text-gray-600">
          {codeSent ? `${email}-এ পাঠানো ৬ সংখ্যার কোড ও নতুন পাসওয়ার্ড দিন।` : 'আপনার অ্যাকাউন্টের ইমেইল দিন। আমরা ৬ সংখ্যার কোড পাঠাব।'}
        </p>
        {!codeSent && (
          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">
            ইমেইল পাঠাতে Resend-এর verified sender এবং server-এ RESEND_API_KEY ও AUTH_EMAIL_FROM লাগবে। Local development-এ কোড terminal-এ দেখা যায়।
          </p>
        )}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {!codeSent ? (
            <div>
              <label htmlFor="email" className="mb-1 block text-xs font-semibold text-gray-700">ইমেইল</label>
              <input id="email" name="email" type="email" autoComplete="email" required
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-600" />
            </div>
          ) : (
            <>
              <div>
                <label htmlFor="otp" className="mb-1 block text-xs font-semibold text-gray-700">ইমেইলে পাওয়া ৬ সংখ্যার কোড</label>
                <input id="otp" name="otp" type="text" inputMode="numeric" pattern="[0-9]{6}" minLength={6} maxLength={6} autoComplete="one-time-code" required
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm tracking-[0.4em] text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-600" />
              </div>
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
          <button disabled={isLoading} type="submit"
            className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60">
            {isLoading ? 'প্রসেস হচ্ছে...' : codeSent ? 'কোড দিয়ে পাসওয়ার্ড পরিবর্তন করুন' : 'ইমেইলে কোড পাঠান'}
          </button>
        </form>
        {codeSent && (
          <div className="mt-3 flex flex-col gap-2">
            <button type="button" disabled={isLoading} onClick={() => void handleResendCode()}
              className="w-full text-sm font-medium text-emerald-700 hover:underline disabled:opacity-60">
              কোড পাননি? আবার পাঠান
            </button>
            <button type="button" onClick={() => setCodeSent(false)}
              className="w-full text-sm font-medium text-gray-500 hover:underline">
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
