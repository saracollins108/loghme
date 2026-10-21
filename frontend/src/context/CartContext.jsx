import { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'loghmeh-cart-v1';
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const add = (meal, qty = 1) => {
    if (!meal || meal.available === false) return;
    setItems((prev) => {
      const existing = prev.find((item) => item.id === meal.id);
      if (existing) {
        return prev.map((item) =>
          item.id === meal.id ? { ...item, qty: Math.min(20, item.qty + qty) } : item
        );
      }
      return [
        ...prev,
        { id: meal.id, slug: meal.slug, name: meal.name, price: meal.price, image: meal.image, qty },
      ];
    });
  };

  const setQty = (id, qty) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: Math.max(1, Math.min(20, qty)) } : item))
    );
  };

  const remove = (id) => setItems((prev) => prev.filter((item) => item.id !== id));
  const clear = () => setItems([]);

  const count = items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <CartContext.Provider value={{ items, add, setQty, remove, clear, count, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
