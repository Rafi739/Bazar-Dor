'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';

export default function Navbar() {
  const pathname = usePathname();
  const [currentDate, setCurrentDate] = useState('');
  const [authError, setAuthError] = useState('');
  const { data: session } = authClient.useSession();

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    const timeoutId = window.setTimeout(() => {
      setCurrentDate(new Date().toLocaleDateString('bn-BD', options));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const isSignIn = pathname === '/signin';
  const isSignUp = pathname === '/signup';

  async function handleSignOut() {
    setAuthError('');
    try {
      const result = await authClient.signOut();
      if (result.error) {
        setAuthError(result.error.message || 'সাইন আউট করা যায়নি। আবার চেষ্টা করুন।');
      }
    } catch {
      setAuthError('সাইন আউট করা যায়নি। সার্ভারের সঙ্গে যোগাযোগ করে আবার চেষ্টা করুন।');
    }
  }

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2.5 rounded-xl text-white text-xl">
            🛒
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">বাজার দর</h1>
            <p className="text-xs text-gray-500">{currentDate || 'লোড হচ্ছে...'}</p>
          </div>
        </Link>

        {session ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-gray-700 sm:inline">{session.user.name}</span>
            <button type="button" onClick={handleSignOut}
              className="rounded-full bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100">
              সাইন আউট
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-full border border-gray-100 bg-gray-50 p-1.5">
            <Link href="/signin"
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                isSignIn ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-700 hover:text-gray-900'
              }`}>
              সাইন ইন
            </Link>
            <Link href="/signup"
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                isSignUp ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-700 hover:text-gray-900'
              }`}>
              সাইন আপ
            </Link>
          </div>
        )}
      </div>
      {authError && <p role="alert" className="pb-2 text-center text-sm text-red-600">{authError}</p>}
    </header>
  );
}