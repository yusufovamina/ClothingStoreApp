import React, { createContext, useContext, useState, ReactNode } from 'react';

export type CartItem = {
  id: string;
  title: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  image: any;
  size?: string;
  color?: string;
  quantity: number;
  description?: string;
  sizes?: string[];
  colors?: string[];
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, size?: string, color?: string, quantity?: number) => void;
  removeFromCart: (id: string, size?: string, color?: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: Omit<CartItem, 'quantity'>, size?: string, color?: string, quantity: number = 1) => {
    setCart(prev => {
      // Check if item with same id, size, color exists
      const idx = prev.findIndex(
        ci => ci.id === item.id && ci.size === size && ci.color === color
      );
      if (idx > -1) {
        // Update quantity
        const updated = [...prev];
        updated[idx].quantity += quantity;
        return updated;
      }
      return [...prev, { ...item, size, color, quantity }];
    });
  };

  const removeFromCart = (id: string, size?: string, color?: string) => {
    setCart(prev => prev.filter(ci => !(ci.id === id && ci.size === size && ci.color === color)));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}; 