import Navbar from "@/components/shared/Navbar";
import PriceTicker from "@/components/shared/PriceTicker";
import Footer from "@/components/shared/Footer";
import { getAllProducts, getCategories } from "@/lib/api";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Toaster } from "sonner";
import './globals.css';

async function SiteHeader() {
  const [products, categories] = await Promise.all([getAllProducts(), getCategories()]);

  return (
    <>
      <Navbar categories={categories} />
      <PriceTicker products={products} />
    </>
  );
}

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
  return (
    <html lang="bn">
      <body className="bg-gray-50/50 flex flex-col min-h-screen" suppressHydrationWarning={true}>
        <Suspense fallback={
          <div aria-hidden="true">
            <header className="h-28 animate-pulse border-b border-gray-100 bg-white" />
            <div className="h-12 animate-pulse border-b border-gray-100 bg-gray-50" />
          </div>
        }>
          <SiteHeader />
        </Suspense>
        
        <main className="grow">
          {children}
        </main>

        <Footer />
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}