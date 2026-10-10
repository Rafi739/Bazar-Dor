This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Authentication setup

Authentication uses Better Auth with a local SQLite database stored in `.local/auth.sqlite`.
Copy `.env.example` to `.env.local`, set a private `BETTER_AUTH_SECRET` (at least 32 characters),
and keep `.env.local` out of version control.

Password recovery sends a 6-digit code. In local development, the code is printed
in the server terminal. For deployed environments, set `RESEND_API_KEY` and
`AUTH_EMAIL_FROM` to a sender address verified in Resend; otherwise recovery
emails cannot be delivered. The recovery code expires after 10 minutes.

Google and GitHub sign-in are available on both the sign-in and sign-up pages.
Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`, and/or
`GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`, in `.env.local` and your deployment
environment. These are server-only credentials; do not expose them as
`NEXT_PUBLIC_*` variables. Set `BETTER_AUTH_URL` to the exact site origin
(for example `https://your-domain.example`) in production. Vercel deployments
fall back to the deployment's `VERCEL_URL` when `BETTER_AUTH_URL` is not set.

Register these exact callback URLs in the OAuth provider settings:

- Local Google: `http://localhost:3000/api/auth/callback/google`
- Local GitHub: `http://localhost:3000/api/auth/callback/github`
- Production Google: `https://your-domain.example/api/auth/callback/google`
- Production GitHub: `https://your-domain.example/api/auth/callback/github`

The production domain in each provider must match `BETTER_AUTH_URL`. Restart the
development server after changing `.env.local`, and redeploy after changing
deployment environment variables.

## Product data API

Product and category data is fetched from the Bazar Dor API. The app tries
`https://api.api-store.workers.dev/api/bazardor` first and
`https://api.abcz.workers.dev/api/bazardor` as a backup. If both APIs are
unavailable, it uses the matching JSON files in `public/data/`.
