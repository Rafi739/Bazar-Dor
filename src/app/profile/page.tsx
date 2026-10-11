'use client';

import { FormEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';

function getInitials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toLocaleUpperCase();
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace('/signin');
    }
  }, [isPending, router, session]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const trimmedName = String(formData.get('name')).trim();
    if (!trimmedName) {
      toast.error('নাম লিখুন।');
      return;
    }

    setIsSaving(true);
    try {
      const result = await authClient.updateUser({ name: trimmedName });
      if (result.error) {
        toast.error(result.error.message || 'প্রোফাইল আপডেট করা যায়নি।');
      } else {
        toast.success('প্রোফাইল আপডেট হয়েছে।');
      }
    } catch {
      toast.error('সার্ভারের সঙ্গে যোগাযোগ করা যায়নি। আবার চেষ্টা করুন।');
    } finally {
      setIsSaving(false);
    }
  }

  if (isPending || !session) {
    return <main className="min-h-[60vh] bg-[#f1f6f2]" aria-busy="true" />;
  }

  return (
    <main className="min-h-[75vh] bg-[#f1f6f2] px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#26332c]">আমার প্রোফাইল</h1>
          <p className="mt-1 text-sm text-gray-500">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন ও পরিবর্তন করুন।</p>
        </div>

        <section className="flex items-center gap-4 rounded-xl border border-[#e4ebe5] bg-[#fbfdfb] p-4 sm:p-5">
          {session.user.image ? (
            <Image src={session.user.image} alt="" width={56} height={56} unoptimized className="h-14 w-14 rounded-xl object-cover" />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-lg font-bold text-white">
              {getInitials(session.user.name)}
            </div>
          )}
          <div className="min-w-0">
            <h2 className="truncate font-semibold text-gray-900">{session.user.name}</h2>
            <p className="truncate text-sm text-gray-500">{session.user.email}</p>
          </div>
        </section>

        <section className="mt-4 rounded-xl border border-[#e4ebe5] bg-[#fbfdfb] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-gray-900">তথ্য</h2>
            <button
              type="button"
              onClick={() => router.push('/profile/update')}
              className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
            >
              আপডেট করুন
            </button>
          </div>
          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="profile-name" className="mb-1.5 block text-sm font-medium text-gray-700">নাম</label>
              <input
                id="profile-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                defaultValue={session.user.name}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            <div>
              <label htmlFor="profile-email" className="mb-1.5 block text-sm font-medium text-gray-700">ইমেইল</label>
              <input
                id="profile-email"
                type="email"
                value={session.user.email}
                readOnly
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500"
              />
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="w-full rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? 'সংরক্ষণ হচ্ছে...' : 'পরিবর্তন সংরক্ষণ করুন'}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}