'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';

type Provider = 'google' | 'github';

const providers: { id: Provider; label: string; icon: string }[] = [
  { id: 'google', label: 'Google দিয়ে চালিয়ে যান', icon: 'G' },
  { id: 'github', label: 'GitHub দিয়ে চালিয়ে যান', icon: '⌘' },
];

export default function SocialSignInButtons({ callbackURL = '/' }: { callbackURL?: string }) {
  const [loadingProvider, setLoadingProvider] = useState<Provider | null>(null);

  async function handleSignIn(provider: Provider) {
    setLoadingProvider(provider);
    try {
      const result = await authClient.signIn.social({ provider, callbackURL });
      if (result.error) {
        const providerName = provider === 'google' ? 'Google' : 'GitHub';
        toast.error(
          result.error.message
            ? `${providerName} login: ${result.error.message}`
            : `${providerName} login চালু নেই। Server environment-এ ${provider === 'google' ? 'GOOGLE_CLIENT_ID ও GOOGLE_CLIENT_SECRET' : 'GITHUB_CLIENT_ID ও GITHUB_CLIENT_SECRET'} সেট করুন।`,
        );
        setLoadingProvider(null);
      }
    } catch {
      toast.error('সার্ভারের সঙ্গে যোগাযোগ করা যায়নি। OAuth configuration যাচাই করে আবার চেষ্টা করুন।');
      setLoadingProvider(null);
    }
  }

  return (
    <div className="mt-5">
      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
        <div className="relative flex justify-center text-xs"><span className="bg-white px-3 text-gray-400">অথবা</span></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {providers.map((provider) => (
          <button
            key={provider.id}
            type="button"
            disabled={loadingProvider !== null}
            onClick={() => void handleSignIn(provider.id)}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-wait disabled:opacity-60"
          >
            <span aria-hidden="true" className="font-bold">{provider.icon}</span>
            {loadingProvider === provider.id ? 'সংযোগ হচ্ছে...' : provider.label}
          </button>
        ))}
      </div>
    </div>
  );
}
