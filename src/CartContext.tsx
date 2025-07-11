import React, { createContext, useContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

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
  userId: string | null;
  addToCart: (item: Omit<CartItem, 'quantity'>, size?: string, color?: string, quantity?: number) => void;
  removeFromCart: (id: string, size?: string, color?: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadUserId = async () => {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserId(user.id ? String(user.id) : null);
      }
    };
    loadUserId();
  }, []);

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
    <CartContext.Provider value={{ cart, userId, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};

// Orders Context
type Order = {
  id: string;
  userId: string;
  items: any[];
  total: number;
  date: string;
};

const OrdersContext = createContext<{
  orders: Order[];
  addOrder: (order: Omit<Order, 'id'>) => Promise<void>;
} | undefined>(undefined);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Load userId from AsyncStorage
  useEffect(() => {
    const loadUserId = async () => {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserId(user.id ? String(user.id) : null);
      }
    };
    loadUserId();
  }, []);

  // Load orders for user from API
  useEffect(() => {
    if (!userId) return;
    const loadOrders = async () => {
      try {
        const res = await fetch(`http://localhost:3001/orders?userId=${userId}`);
        if (res.ok) {
          const data = await res.json();
          setOrders(Array.isArray(data) ? data.filter(order => String(order.userId) === String(userId)) : []);
        } else {
          setOrders([]);
        }
      } catch {
        setOrders([]);
      }
    };
    loadOrders();
  }, [userId]);

  // Add order to API
  const addOrder = async (order: Omit<Order, 'id'>) => {
    try {
      const res = await fetch('http://localhost:3001/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...order, userId: String(order.userId) }),
      });
      if (res.ok) {
        const newOrder = await res.json();
        setOrders(prev => [newOrder, ...prev]);
      }
    } catch {
      // handle error if needed
    }
  };

  return (
    <OrdersContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider');
  return ctx;
}

// Theme Context
type ThemeType = 'light' | 'dark';
const lightColors = {
  background: '#F7F7FC',
  card: '#fff',
  text: '#222',
  textSecondary: '#888',
  accent: '#1769FF',
  danger: '#E53935',
  border: '#F0F0F0',
};
const darkColors = {
  background: '#181A20',
  card: '#23262F',
  text: '#fff',
  textSecondary: '#B0B0B0',
  accent: '#4F8CFF',
  danger: '#FF5A5F',
  border: '#23262F',
};

const ThemeContext = createContext<{
  theme: ThemeType;
  colors: typeof lightColors;
  toggleTheme: () => void;
} | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>('light');
  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));
  const colors = theme === 'light' ? lightColors : darkColors;
  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
} 