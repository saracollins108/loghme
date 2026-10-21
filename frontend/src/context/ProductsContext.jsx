import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const ProductsContext = createContext({
  products: [],
  categories: [],
  deliveryFee: 0,
  loading: true,
  error: null,
  retry: () => {},
  bySlug: () => null,
});

export function ProductsProvider({ children }) {
  const [state, setState] = useState({
    products: [],
    categories: [],
    deliveryFee: 0,
    loading: true,
    error: null,
  });

  const load = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    fetch('/api/products')
      .then((res) => {
        if (!res.ok) throw new Error('bad status');
        return res.json();
      })
      .then((data) =>
        setState({
          products: data.products ?? [],
          categories: data.categories ?? [],
          deliveryFee: data.deliveryFee ?? 0,
          loading: false,
          error: null,
        })
      )
      .catch(() =>
        setState((prev) => ({
          ...prev,
          loading: false,
          error: 'بارگذاری منو با مشکل مواجه شد؛ دوباره تلاش کنید.',
        }))
      );
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const bySlug = (slug) => state.products.find((product) => product.slug === slug) ?? null;

  return <ProductsContext.Provider value={{ ...state, retry: load, bySlug }}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  return useContext(ProductsContext);
}
