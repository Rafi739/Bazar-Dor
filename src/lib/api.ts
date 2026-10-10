import fs from 'fs';
import path from 'path';
import { Category, Product } from '@/types/product';

const API_BASE_URLS = [
  'https://api.api-store.workers.dev/api/bazardor',
  'https://api.abcz.workers.dev/api/bazardor',
];

async function fetchFromApi<T>(endpoint: string): Promise<T | null> {
  const errors: unknown[] = [];

  for (const baseUrl of API_BASE_URLS) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        next: { revalidate: 300 },
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status} for ${endpoint}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      errors.push(error);
    }
  }

  console.error(`All Bazar Dor API endpoints failed for ${endpoint}:`, errors);
  return null;
}

function readLocalJson<T>(fileName: string): T | null {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', fileName);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Local data file not found: ${filePath}`);
    }

    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
  } catch (error) {
    console.error(`Error reading local ${fileName}:`, error);
    return null;
  }
}

export async function getAllProducts(): Promise<Product[]> {
  const products = await fetchFromApi<Product[]>('/products');
  return products ?? readLocalJson<Product[]>('products.json') ?? [];
}

export async function getCategories(): Promise<Category[]> {
  const categories = await fetchFromApi<Category[]>('/categories');
  return categories ?? readLocalJson<Category[]>('categories.json') ?? [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const category = await fetchFromApi<Category>(`/categories/${encodeURIComponent(slug)}`);
  if (category) {
    return category;
  }

  const categories = readLocalJson<Category[]>('categories.json');
  return categories?.find((item) => item.slug === slug) ?? null;
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const products = await fetchFromApi<Product[]>(`/products?category=${encodeURIComponent(slug)}`);
  if (products) {
    return products;
  }

  const localProducts = readLocalJson<Product[]>('products.json');
  return localProducts?.filter((product) => product.category.toLowerCase() === slug.toLowerCase()) ?? [];
}

export const fetchProducts = getAllProducts;

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const products = await getAllProducts();
  const product = products.find((item) => item.slug === slug);
  if (!product) {
    return null;
  }

  return await fetchFromApi<Product>(`/products/${encodeURIComponent(String(product.id))}`) ?? product;
}

export const getSingleProduct = fetchProductBySlug;