import Navbar from "@/components/shared/Navbar";
import PriceTicker from "@/components/shared/PriceTicker";
import Footer from "@/components/shared/Footer";
import { getAllProducts, getCategories } from "@/lib/api";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Toaster } from "sonner";
import './globals.css';

export const metadata: Metadata = {
  title: "বাজার দর",
  description: "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বাজারদর এক নজরে দেখুন।",
  icons: {
    icon: "/assets/logo-icon.png",
    shortcut: "/assets/logo-icon.png",
    apple: "/assets/logo-icon.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [products, categories] = await Promise.all([getAllProducts(), getCategories()]);

  return (
    <html lang="bn">
      <body className="bg-gray-50/50 flex flex-col min-h-screen" suppressHydrationWarning={true}>
        <Suspense fallback={<header aria-hidden="true" className="h-28 border-b border-gray-100 bg-white" />}>
          <Navbar categories={categories} />
        </Suspense>
        <PriceTicker products={products} />
        
        <main className="grow">
          {children}
        </main>

        <Footer />
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}