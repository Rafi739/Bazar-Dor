import Navbar from "@/components/shared/Navbar";
import PriceTicker from "@/components/shared/PriceTicker";
import Footer from "@/components/shared/Footer";
import { getAllProducts } from "@/lib/api";
import type { Metadata } from "next";
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
  const products = await getAllProducts();

  return (
    <html lang="bn">
      <body className="bg-gray-50/50 flex flex-col min-h-screen" suppressHydrationWarning={true}>
        <Navbar />
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