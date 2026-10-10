
export interface Market {
  market: string;
  division: string;
  min: number;
  max: number;
}

export interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

export interface Product {
  id: string | number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn?: string;
  categoryIcon?: string;
  unit: string;
  image?: string;
  today: number;
  yesterday?: number;
  markets?: Market[];
  change?: {
    dir: 'up' | 'down' | 'same' | 'flat';
    pct: number;
  };
}
