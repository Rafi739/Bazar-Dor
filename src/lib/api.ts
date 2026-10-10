import 'server-only'; 
import { Product } from '@/types/product';
import fs from 'fs';
import path from 'path';


export async function getAllProducts(): Promise<Product[]> {
  try {
    const filePath = path.join(process.cwd(), 'public/data/products.json');
    const fileData = fs.readFileSync(filePath, 'utf-8');
    const data: Product[] = JSON.parse(fileData);
    return data;
  } catch (error) {
    console.error('Error reading local products:', error);
    return [];
  }
}


export const fetchProducts = getAllProducts;


export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const products = await getAllProducts();
    const product = products.find((p) => p.slug === slug);
    return product || null;
  } catch (error) {
    console.error(`Error fetching product ${slug}:`, error);
    return null;
  }
}


export const getSingleProduct = fetchProductBySlug;