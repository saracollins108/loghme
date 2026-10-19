import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, useApi } from '../api.js';
import ProductCard from '../components/ProductCard.jsx';
import Reveal from '../components/Reveal.jsx';
import { faDigits } from '../format.js';

const SORTS = [
  { value: 'popular', label: 'محبوب‌ترین‌ها' },
  { value: 'price-asc', label: 'قیمت: کم به زیاد' },
  { value: 'price-desc', label: 'قیمت: زیاد به کم' },
  { value: 'newest', label: 'جدیدترین‌ها' },
];

export default function MenuPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const category = params.get('category') || '';
  const sort = params.get('sort') || 'popular';
  const daily = params.get('daily') === '1';
  const featured = params.get('featured') === '1';
  const availableOnly = params.get('available') === '1';

  const [searchText, setSearchText] = useState(q);
  useEffect(() => setSearchText(q), [q]);

  // Debounced sync of the search box into the URL (shared with header search).
  useEffect(() => {
    const t = setTimeout(() => {
      if (searchText === (params.get('q') || '')) return;
      const next = new URLSearchParams(params);
      if (searchText.trim()) next.set('q', searchText.trim());
      else next.delete('q');
      setParams(next, { replace: true });
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  const { data: categories } = useApi(() => api.categories(), []);
  const { data: products, loading } = useApi(
    () =>
      api.products({
        q: q || undefined,
        category: category || undefined,
        sort,
        daily: daily ? '1' : undefined,
        featured: featured ? '1' : undefined,
        available: availableOnly ? '1' : undefined,
      }),
    [q, category, sort, daily, featured, availableOnly]
  );

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  };

  const resetAll = () => {
    setSearchText('');
    setParams(new URLSearchParams());
  };

  const activeFilters = [q, category, daily && 'daily', featured && 'featured', availableOnly && 'available'].filter(Boolean).length;

  return (
    <div className="menu-page">
      <section className="menu-hero">
        <div className="container">
          <span className="section-label light">منوی غذا</span>
          <h1>چی دلت می‌خواد؟</h1>
          <p>غذاهای لقمه را جستجو کن، دسته‌بندی را انتخاب کن و سفارش بده.</p>
        </div>
      </section>

      <div className="menu-toolbar">
        <div className="container menu-toolbar-inner">
          <form
            className="menu-search"
            role="search"
            onSubmit={(e) => e.preventDefault()}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.5" y2="16.5" />
            </svg>
            <input
              type="search"
              className="input"
              placeholder="جستجوی غذا…"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              aria-label="جستجوی غذا در منو"
            />
          </form>

          <label className="sort-field">
            <span>ترتیب:</span>
            <select
              className="input"
              value={sort}
              onChange={(e) => setParam('sort', e.target.value === 'popular' ? '' : e.target.value)}
              aria-label="ترتیب نمایش غذاها"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="container pills-row">
          <div className="category-pills" role="group" aria-label="دسته‌بندی غذاها">
            <button
              className={`pill${!category && !daily && !featured ? ' active' : ''}`}
              onClick={() => setParams(new URLSearchParams(searchText ? { q: searchText.trim() } : {}))}
            >
              همه
            </button>
            {(categories || []).map((c) => (
              <button
                key={c.id}
                className={`pill${category === c.id ? ' active' : ''}`}
                onClick={() => setParam('category', category === c.id ? '' : c.id)}
                aria-pressed={category === c.id}
              >
                {c.name}
              </button>
            ))}
          </div>
          <div className="menu-toggles" role="group" aria-label="فیلترهای تکمیلی">
            <button
              className={`pill pill-toggle${daily ? ' active' : ''}`}
              aria-pressed={daily}
              onClick={() => setParam('daily', daily ? '' : '1')}
            >
              غذاهای امروز
            </button>
            <button
              className={`pill pill-toggle${featured ? ' active' : ''}`}
              aria-pressed={featured}
              onClick={() => setParam('featured', featured ? '' : '1')}
            >
              ویژه
            </button>
            <button
              className={`pill pill-toggle${availableOnly ? ' active' : ''}`}
              aria-pressed={availableOnly}
              onClick={() => setParam('available', availableOnly ? '' : '1')}
            >
              فقط موجود
            </button>
          </div>
        </div>
      </div>

      <section className="section menu-results" aria-label="نتایج منو">
        <div className="container">
          <p className="results-count" aria-live="polite">
            {loading
              ? 'در حال بارگذاری…'
              : `${faDigits(products?.length ?? 0)} غذا پیدا شد${activeFilters ? ' (با فیلترهای فعلی)' : ''}`}
          </p>

          {!loading && products && products.length === 0 && (
            <div className="empty-state">
              <h2>نتیجه‌ای پیدا نشد</h2>
              <p>با این فیلترها غذایی پیدا نشد؛ فیلترها را تغییر بده یا جستجوی دیگری امتحان کن.</p>
              <button className="btn btn-primary" onClick={resetAll}>
                پاک کردن همه فیلترها
              </button>
            </div>
          )}

          <div className="product-grid">
            {(products || []).map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 60}>
                <ProductCard product={p} themeIndex={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
