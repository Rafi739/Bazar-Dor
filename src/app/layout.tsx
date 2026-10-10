import Navbar from "@/components/shared/Navbar";
import PriceTicker from "@/components/shared/PriceTicker";
import Footer from "@/components/shared/Footer";
import { getAllProducts } from "@/lib/api";
import './globals.css';

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
      </body>
    </html>
  );
}