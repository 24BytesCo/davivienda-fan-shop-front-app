export interface ProductImage {
  id?: string;
  url: string;
}

export interface Product {
  id: string | number;
  title: string;
  description?: string;
  points: number;
  stock: number;
  category?: string;
  sizes?: string[];
  images?: ProductImage[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total?: number;
  page?: number;
  lastPage?: number;
  limit?: number;
  offset?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}
