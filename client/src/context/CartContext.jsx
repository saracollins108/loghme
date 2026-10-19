import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const CartContext = createContext(null);
const CART_KEY = 'loghmeh_cart_v1';
const FAV_KEY = 'loghmeh_favs_v1';
const MAX_QTY = 20;

const readStorage = (key, fallback) => {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return Array.isArray(v) ? v : fallback;
  } catch {
    return fallback;
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => readStorage(CART_KEY, []));
  const [favorites, setFavorites] = useState(() => readStorage(FAV_KEY, []));
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);
  useEffect(() => {
    localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const notify = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const add = useCallback(
    (product, qty = 1) => {
      if (!product?.available) return;
      setItems((prev) => {
        const idx = prev.findIndex((it) => it.id === product.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], qty: Math.min(MAX_QTY, next[idx].qty + qty) };
          return next;
        }
        return [
          ...prev,
          {
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.discountPrice ?? product.price,
            image: product.image,
            qty: Math.min(MAX_QTY, Math.max(1, qty)),
          },
        ];
      });
      notify(`«${product.name}» به سبد خرید اضافه شد.`);
    },
    [notify]
  );

  const setQty = useCallback((id, qty) => {
    setItems((prev) =>
      prev
        .map((it) => (it.id === id ? { ...it, qty: Math.min(MAX_QTY, Math.max(1, qty)) } : it))
        .filter((it) => it.qty > 0)
    );
  }, []);

  const remove = useCallback((id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const toggleFavorite = useCallback((slug) => {
    setFavorites((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }, []);

  const count = items.reduce((s, it) => s + it.qty, 0);
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const isFavorite = useCallback((slug) => favorites.includes(slug), [favorites]);

  const value = useMemo(
    () => ({
      items,
      add,
      setQty,
      remove,
      clear,
      count,
      subtotal,
      cartOpen,
      setCartOpen,
      searchOpen,
      setSearchOpen,
      toast,
      notify,
      favorites,
      toggleFavorite,
      isFavorite,
    }),
    [items, add, setQty, remove, clear, count, subtotal, cartOpen, searchOpen, toast, notify, favorites, toggleFavorite, isFavorite]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
