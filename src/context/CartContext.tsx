import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    wholesalePrice: number | null;
    image: string;
    stock: number;
    category: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  subtotal: number;
  isLoading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Load cart on mount and when user logs in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      refreshCart();
    }
  }, []);

  const refreshCart = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/cart');
      const { items, subtotal: total, itemCount } = response.data;
      
      setCartItems(items);
      setSubtotal(total);
      setCartCount(itemCount);
    } catch (error: any) {
      console.error('Failed to load cart:', error);
      // If unauthorized, clear cart
      if (error.response?.status === 401) {
        setCartItems([]);
        setSubtotal(0);
        setCartCount(0);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      setIsLoading(true);
      await api.post('/cart/items', { productId, quantity });
      await refreshCart();
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      setIsLoading(true);
      await api.put(`/cart/items/${itemId}`, { quantity });
      await refreshCart();
    } catch (error: any) {
      console.error('Failed to update quantity:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      setIsLoading(true);
      await api.delete(`/cart/items/${itemId}`);
      await refreshCart();
    } catch (error: any) {
      console.error('Failed to remove from cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setIsLoading(true);
      await api.delete('/cart');
      setCartItems([]);
      setSubtotal(0);
      setCartCount(0);
    } catch (error: any) {
      console.error('Failed to clear cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        subtotal,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
