'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace('/signin?redirect=%2Fprofile%2Fupdate&reason=auth_required');
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
        router.push('/profile');
      }
    } catch {
      toast.error('সার্ভারের সঙ্গে যোগাযোগ করা যায়নি। আবার চেষ্টা করুন।');
    } finally {
      setIsSaving(false);
    }
  }

  if (isPending || !session) {
    return <main className="min-h-[70vh] bg-[#f1f6f2]" aria-busy="true" />;
  }

  return (
    <main className="min-h-[75vh] bg-[#f1f6f2] px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-xl rounded-2xl border border-[#e4ebe5] bg-[#fbfdfb] p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Profile</p>
          <h1 className="mt-2 text-2xl font-black text-gray-900">তথ্য আপডেট করুন</h1>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">নাম</label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={session.user.name}
              required
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">ইমেইল</label>
            <input
              id="email"
              type="email"
              value={session.user.email}
              readOnly
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500"
            />
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? 'সংরক্ষণ হচ্ছে...' : 'আপডেট তথ্য'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/profile')}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              বাতিল
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
