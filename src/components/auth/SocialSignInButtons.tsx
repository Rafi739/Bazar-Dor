'use client';

import { type ReactNode, useState } from 'react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';

type Provider = 'google' | 'github';

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.3-1.5 3.8-5.4 3.8-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.7-2.7C16.9 3.2 14.7 2.2 12 2.2 6.8 2.2 2.5 6.5 2.5 11.7S6.8 21.2 12 21.2c6.9 0 11.5-4.8 11.5-11.6 0-.8-.1-1.4-.2-2H12Z" />
      <path fill="#34A853" d="M3.5 7.3l3.6 2.6c1-1.9 3.1-3.2 5.9-3.2 1.9 0 3.2.8 3.9 1.5l2.7-2.7C16.9 3.2 14.7 2.2 12 2.2c-3.9 0-7.4 2.2-8.5 5.1Z" />
      <path fill="#FBBC05" d="M3.5 16.2c1.1 2.9 4.6 5.1 8.5 5.1 2.5 0 4.5-.8 6-2.2l-2.9-2.5c-.8.6-1.8 1-3.1 1-2.7 0-4.9-1.8-5.4-4.1l-3.1 2.7Z" />
      <path fill="#4285F4" d="M12 21.2c2.7 0 5-.9 6.7-2.5l-3.1-2.5c-.8.5-1.8.9-3.6.9-2.7 0-4.9-1.8-5.4-4.1l-3.1 2.7C.9 17.2 5.8 21.2 12 21.2Z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M12 .5C5.7.5.7 5.5.7 11.8c0 5 3.2 9.3 7.7 10.8.6.1.8-.3.8-.6v-2.1c-3.1.7-3.8-1.3-3.8-1.3-.5-1.2-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1 1.7 1.2 1.7 1.2.9 1.5 2.4 1.1 3 .9.1-.7.4-1.2.7-1.4-2.5-.3-5.1-1.2-5.1-5.4 0-1.2.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.2-1.5 3.2-1.2 3.2-1.2.7 1.6.3 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.2-2.6 5.1-5.1 5.4.4.4.7 1 .7 2.1v3.1c0 .3.2.7.8.6 4.5-1.5 7.7-5.8 7.7-10.8C23.3 5.5 18.3.5 12 .5Z" />
    </svg>
  );
}

const providers: { id: Provider; label: string; icon: ReactNode }[] = [
  { id: 'google', label: 'Google', icon: <GoogleIcon /> },
  { id: 'github', label: 'GitHub', icon: <GitHubIcon /> },
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
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-wait disabled:opacity-60"
          >
            <span aria-hidden="true" className="flex h-4 w-4 items-center justify-center text-gray-800">
              {provider.icon}
            </span>
            {loadingProvider === provider.id ? 'সংযোগ হচ্ছে...' : provider.label}
          </button>
        ))}
      </div>
    </div>
  );
}
