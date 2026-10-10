
export interface Product {
  id: string | number;
  slug: string;
  nameBn: string;
  category: string;
  unit: string;
  image?: string;
  today: number;
  change?: {
    dir: 'up' | 'down' | 'same';
    pct: number;
  };
}
