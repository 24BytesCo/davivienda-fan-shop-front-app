import { Product } from './product.model';

export interface CartItem {
  id?: string | number;
  productId: string | number;
  quantity: number;
  product?: Product;
}

export interface Cart {
  id?: string | number;
  items: CartItem[];
  totalItems?: number;
  totalPoints?: number;
  summary?: { totalPoints: number; items: number };
}
