export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  compare_price: string | null;
  sku: string | null;
  barcode: string | null;
  quantity: number;
  is_active: boolean;
  is_featured: boolean;
  category_id: number | null;
  image: string | null;
  images: string[] | null;
  category?: Category;
  discount_percentage?: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  is_active: boolean;
  parent_id: number | null;
}

