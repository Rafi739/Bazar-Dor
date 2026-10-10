
export interface Category {
  id: string;
  nameBn: string;
  icon: string; 
}

export interface Product {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  unit: string;
  image: string; 
  today: number;
  change: {
    dir: 'up' | 'down' | 'flat';
    pct: number;
  };
}