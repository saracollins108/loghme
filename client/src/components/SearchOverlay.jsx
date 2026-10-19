import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { formatPrice } from '../format.js';
import { useCart } from '../context/CartContext.jsx';

export default function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useCart();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchOpen) {
      inputRef.current?.focus();
      document.body.classList.add('no-scroll');
    }
    return () => document.body.classList.remove('no-scroll');
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    if (searchOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchOpen, setSearchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(() => {
      api
        .products({ q: query.trim(), available: '1' })
        .then(setResults)
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [query, searchOpen]);

  if (!searchOpen) return null;

  const go = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchOpen(false);
    navigate(`/menu?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label="جستجو در منو">
      <button className="icon-btn search-close" aria-label="بستن جستجو" onClick={() => setSearchOpen(false)}>
        <svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </svg>
      </button>
      <div className="search-panel">
        <form onSubmit={go} className="search-form" role="search">
          <input
            ref={inputRef}
            type="search"
            className="input search-input"
            placeholder="دنبال چه غذایی می‌گردی؟"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="جستجوی غذا"
          />
          <button type="submit" className="btn btn-primary">
            جستجو
          </button>
        </form>

        {loading && <p className="search-status">در حال جستجو…</p>}

        {!loading && query.trim() && results.length === 0 && (
          <p className="search-status">نتیجه‌ای پیدا نشد؛ عبارت دیگری را امتحان کن.</p>
        )}

        {!loading && results.length > 0 && (
          <ul className="search-results">
            {results.slice(0, 6).map((p) => (
              <li key={p.id}>
                <Link to={`/product/${p.slug}`} onClick={() => setSearchOpen(false)}>
                  <img src={p.image} alt="" width="48" height="48" loading="lazy" />
                  <span className="search-result-name">{p.name}</span>
                  <span className="search-result-price">{formatPrice(p.discountPrice ?? p.price)} تومان</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
