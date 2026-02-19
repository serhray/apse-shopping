export interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  rating: number;
  category: string;
  badge?: string;
}

export interface Category {
  id: number;
  name: string;
  image: string;
  slug: string;
}

export interface Banner {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  link: string;
  bgColor: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
}

export interface QuoteRequest {
  name: string;
  email: string;
  phone: string;
  product: string;
  quantity: number;
  details: string;
}
