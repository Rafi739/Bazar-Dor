# বাজার দর / BazarDor

বাজার দর হলো একটি আধুনিক বাজারদর ট্র্যাকিং ও নিত্যপ্রয়োজনীয় পণ্যের মূল্য দেখার Next.js অ্যাপ্লিকেশন। ব্যবহারকারীরা প্রতিদিনের বাজারদর, ক্যাটাগরি অনুযায়ী পণ্য, দাম পরিবর্তন, এবং পণ্যের বিস্তারিত তথ্য এক নজরে দেখতে পারে।

## Short Description

BazarDor is a responsive marketplace price tracker for daily essentials. It helps users compare current prices across categories, see price trends, and access a protected product details page with authentication.

## Technologies Used

- Next.js 16
- App Router
- TypeScript
- Tailwind CSS
- BetterAuth
- Sonner (toast notifications)
- Local JSON + API fallback data layer

## Key Features

1. Responsive home page with hero banner and product sections
2. Category-based filtering and sorting by price
3. Protected product detail page with login requirement
4. Email/password + social authentication with BetterAuth
5. Profile management, update information, and 404-friendly UX
6. Price ticker and market comparison tables
7. Mobile, tablet, and desktop friendly layout

## Project Highlights

- `আজ দাম বেড়েছে ▲` and `আজ দাম কমেছে ▼` sections
- Full product list in a responsive grid
- Product detail page with min/max/average price summary
- Sort options: Default, Low to High, High to Low
- Sign in, sign up, profile, and update profile flows
- Friendly fallback loading and not-found screens

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Add your environment values before running the app, especially:

- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- social OAuth credentials if using Google/GitHub

## Run Production Build

```bash
npm run build
npm run start
```

## Notes

This project fetches product and category data from the Bazar Dor API with local JSON fallback for offline reliability.
