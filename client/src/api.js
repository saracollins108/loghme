import { useEffect, useState } from 'react';

async function request(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    let payload = null;
    try {
      payload = await res.json();
    } catch {
      /* non-JSON error */
    }
    const err = new Error(payload?.error || 'خطایی رخ داد. دوباره تلاش کنید.');
    err.status = res.status;
    err.payload = payload;
    throw err;
  }
  return res.json();
}

const jsonBody = (body) => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

export const api = {
  categories: () => request('/api/categories'),
  products: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false)
    ).toString();
    return request(`/api/products${qs ? `?${qs}` : ''}`);
  },
  product: (slug) => request(`/api/products/${slug}`),
  createOrder: (body) => request('/api/orders', jsonBody(body)),
  order: (code) => request(`/api/orders/${code}`),
  sendMessage: (body) => request('/api/messages', jsonBody(body)),
};

// Small data-fetching hook with loading/error state.
export function useApi(fetcher, deps) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    fetcher()
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return { data, loading, error };
}
