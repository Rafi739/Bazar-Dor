export interface Product {
  id: string | number;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  unit: string;
  currentPrice: number;
  minPrice?: number;
  maxPrice?: number;
  avgPrice?: number;
  changePercentage: number;
  emoji: string;
  markets?: {
    bazarName: string;
    price: number;
  }[];
}

export interface Category {
  name: string;
  slug: string;
  icon?: string;
}