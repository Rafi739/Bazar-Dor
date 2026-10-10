import Navbar from "@/components/shared/Navbar";
import PriceTicker from "@/components/shared/PriceTicker";
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
      <body className="bg-gray-50/50">
        <Navbar />
        <PriceTicker products={products} />
        
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}