'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { Category } from '@/types/product';

function getInitials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toLocaleUpperCase();
}

export default function Navbar({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const [currentDate, setCurrentDate] = useState('');
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
    try {
      const result = await authClient.signOut();
      if (result.error) {
        toast.error(result.error.message || 'সাইন আউট করা যায়নি। আবার চেষ্টা করুন।');
      } else {
        toast.success('সাইন আউট হয়েছে।');
      }
    } catch {
      toast.error('সাইন আউট করা যায়নি। সার্ভারের সঙ্গে যোগাযোগ করে আবার চেষ্টা করুন।');
    }
  }

  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/assets/logo-icon.png" alt="বাজার দর" width={36} height={36} className="rounded-xl" priority />
          <div>
            <h1 className="text-xl font-bold leading-tight text-gray-900">বাজার দর</h1>
            <p className="text-xs text-gray-500">{currentDate || 'লোড হচ্ছে...'}</p>
          </div>
        </Link>

        {session ? (
          <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full py-1 pl-1 pr-2 text-sm text-gray-800 hover:bg-gray-50">
              {session.user.image ? (
                <Image src={session.user.image} alt="" width={34} height={34} unoptimized className="h-[34px] w-[34px] rounded-full object-cover" />
              ) : (
                <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
                  {getInitials(session.user.name)}
                </span>
              )}
              <span className="hidden max-w-28 truncate sm:inline">{session.user.name}</span>
              <span aria-hidden="true" className="text-xs text-gray-500 transition group-open:rotate-180">⌄</span>
            </summary>
            <div className="absolute right-0 top-full z-30 mt-2 w-64 rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
              <div className="border-b border-gray-100 px-3 py-2">
                <p className="truncate text-sm font-semibold text-gray-900">{session.user.name}</p>
                <p className="truncate text-xs text-gray-500">{session.user.email}</p>
              </div>
              <Link href="/profile" className="mt-1 block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                আমার প্রোফাইল
              </Link>
              <button type="button" onClick={handleSignOut}
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50">
                সাইন আউট
              </button>
            </div>
          </details>
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
      <nav aria-label="পণ্যের ক্যাটাগরি" className="border-t border-gray-100">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
          {categories.map((category) => {
            const isActive = pathname === `/category/${category.slug}`;

            return (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                aria-current={isActive ? 'page' : undefined}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span aria-hidden="true">{category.icon}</span>
                {category.nameBn}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}