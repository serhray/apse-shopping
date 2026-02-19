import type { Product, Category } from '../types';

// Placeholder images using picsum for prototype
const img = (id: number) => `https://picsum.photos/seed/${id}/400/400`;

export const sampleProducts: Product[] = [
  { id: 1, name: 'SONY Alpha ILCE-6600M APS-C Mirrorless Camera', price: 13000, oldPrice: 15000, image: img(101), rating: 5, category: 'electronics', badge: 'New' },
  { id: 2, name: 'Canon R100 Mirrorless Camera RF', price: 8000, oldPrice: 10000, image: img(102), rating: 5, category: 'electronics', badge: 'New' },
  { id: 3, name: 'Casio Classic Black Watch MQ-24', price: 1500, oldPrice: 2000, image: img(103), rating: 4, category: 'watches' },
  { id: 4, name: 'Porto Luxury Watches Collection', price: 3500, oldPrice: 5000, image: img(104), rating: 5, category: 'watches', badge: '30% OFF' },
  { id: 5, name: 'Premium Leather Handbag', price: 4500, oldPrice: 6000, image: img(105), rating: 4, category: 'handbags', badge: '40% OFF' },
  { id: 6, name: 'Designer Tote Bag Women', price: 3200, oldPrice: 4200, image: img(106), rating: 4, category: 'handbags' },
  { id: 7, name: 'Gold Plated Necklace Set', price: 1200, oldPrice: 1800, image: img(107), rating: 5, category: 'imitation' },
  { id: 8, name: 'Diamond Style Earrings', price: 800, oldPrice: 1200, image: img(108), rating: 4, category: 'imitation' },
  { id: 9, name: 'Oak Wood Dining Table Set', price: 25000, oldPrice: 32000, image: img(109), rating: 5, category: 'furnitures' },
  { id: 10, name: 'Modern Sofa Set 3-Seater', price: 18000, oldPrice: 24000, image: img(110), rating: 4, category: 'furnitures' },
  { id: 11, name: 'Men Cotton Formal Shirt', price: 999, oldPrice: 1499, image: img(111), rating: 4, category: 'mens-garments' },
  { id: 12, name: 'Men Slim Fit Jeans Blue', price: 1200, oldPrice: 1800, image: img(112), rating: 4, category: 'mens-garments' },
  { id: 13, name: 'Women Kurta Set Floral', price: 1500, oldPrice: 2200, image: img(113), rating: 5, category: 'womens' },
  { id: 14, name: 'Women Designer Saree Collection', price: 2800, oldPrice: 3500, image: img(114), rating: 5, category: 'womens' },
  { id: 15, name: 'Bluetooth Speaker Portable', price: 2500, oldPrice: 3500, image: img(115), rating: 4, category: 'electronics' },
  { id: 16, name: 'Wireless Earbuds Pro Max', price: 3200, oldPrice: 4500, image: img(116), rating: 5, category: 'electronics' },
];

export const sampleCategories: Category[] = [
  { id: 1, name: 'Furnitures', image: img(201), slug: 'furnitures' },
  { id: 2, name: 'Imitation Jewellery', image: img(202), slug: 'imitation' },
  { id: 3, name: "Women's", image: img(203), slug: 'womens' },
  { id: 4, name: "Men's Garments", image: img(204), slug: 'mens-garments' },
  { id: 5, name: 'Electronics', image: img(205), slug: 'electronics' },
  { id: 6, name: 'Watches', image: img(206), slug: 'watches' },
  { id: 7, name: 'Handbags', image: img(207), slug: 'handbags' },
  { id: 8, name: 'Home & Kitchen', image: img(208), slug: 'home-kitchen' },
  { id: 9, name: 'Sports & Fitness', image: img(209), slug: 'sports' },
  { id: 10, name: 'Books & Stationery', image: img(210), slug: 'books' },
];

export const wholesaleProducts: Product[] = sampleProducts.map((p) => ({
  ...p,
  id: p.id + 100,
  price: Math.round(p.price * 0.7),
  oldPrice: p.price,
  badge: 'Wholesale',
}));
