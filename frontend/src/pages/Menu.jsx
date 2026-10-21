import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MealCard from '../components/MealCard.jsx';
import Reveal from '../components/Reveal.jsx';
import { SearchIcon, BasketIcon } from '../components/Icons.jsx';
import { useProducts } from '../context/ProductsContext.jsx';
import { faNum } from '../utils/format.js';

const SORT_OPTIONS = [
  { value: 'popular', label: 'محبوب‌ترین‌ها' },
  { value: 'price-asc', label: 'قیمت: کم به زیاد' },
  { value: 'price-desc', label: 'قیمت: زیاد به کم' },
  { value: 'new', label: 'جدیدترین‌ها' },
];

const PRESETS = {
  daily: { title: 'غذاهای امروز', subtitle: 'برنامه امروز آشپزخونه لقمه؛ هر روز با انتخاب‌های تازه و خونگی.', key: 'daily' },
  featured: { title: 'غذاهای ویژه', subtitle: 'انتخاب‌های شاخص لقمه؛ غذاهایی که طرفدارهای خودشون رو دارن.', key: 'featured' },
};

export default function Menu({ preset = null }) {
  const { products, categories, loading, error, retry } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryInput, setQueryInput] = useState(searchParams.get('q') ?? '');

  const q = searchParams.get('q') ?? '';
  const cat = searchParams.get('cat') ?? '';
  const sort = searchParams.get('sort') ?? 'popular';
  const onlyAvailable = searchParams.get('avail') === '1';
  const presetInfo = preset ? PRESETS[preset] : null;

  const updateParams = (patch) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    setSearchParams(next, { replace: true });
  };

  const setQuery = (value) => {
    setQueryInput(value);
    updateParams({ q: value });
  };

  const activeCategories = presetInfo
    ? categories.filter((category) => category.id !== 'special')
    : categories;

  const filtered = useMemo(() => {
    const categoryName = (id) => categories.find((category) => category.id === id)?.name ?? '';
    let list = [...products];
    if (presetInfo) list = list.filter((meal) => meal[presetInfo.key]);
    if (cat === 'special') list = list.filter((meal) => meal.featured);
    else if (cat) list = list.filter((meal) => meal.categoryId === cat);
    if (q.trim()) {
      const needle = q.trim();
      list = list.filter(
        (meal) =>
          meal.name.includes(needle) ||
          meal.description.includes(needle) ||
          categoryName(meal.categoryId).includes(needle)
      );
    }
    if (onlyAvailable) list = list.filter((meal) => meal.available);
    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'new':
        list.reverse();
        break;
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured) || Number(b.daily) - Number(a.daily));
    }
    return list;
  }, [products, categories, presetInfo, cat, q, sort, onlyAvailable]);

  const hasFilters = Boolean(q || cat || onlyAvailable || presetInfo);

  return (
    <div className="page menu-page">
      <div className="container">
        <header className="page-hero">
          <h1>{presetInfo ? presetInfo.title : 'منوی غذا'}</h1>
          <p>{presetInfo ? presetInfo.subtitle : 'همه غذاهای خونگی لقمه؛ با فیلتر و جستجو، سریع‌تر پیدا کن.'}</p>
        </header>

        <div className="menu-toolbar">
          <div className="search-field search-field--inline">
            <SearchIcon />
            <input
              type="search"
              value={queryInput}
              placeholder="جستجو در منو…"
              aria-label="جستجو در منو"
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <label className="avail-toggle">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(event) => updateParams({ avail: event.target.checked ? '1' : '' })}
            />
            فقط غذاهای موجود
          </label>
          <label className="sort-field">
            <span>مرتب‌سازی:</span>
            <select value={sort} onChange={(event) => updateParams({ sort: event.target.value })} aria-label="مرتب‌سازی غذاها">
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="menu-chips" role="group" aria-label="دسته‌بندی غذاها">
          {!presetInfo ? (
            <button
              type="button"
              className={`chip ${!cat ? 'is-active' : ''}`}
              onClick={() => updateParams({ cat: '' })}
            >
              همه
            </button>
          ) : null}
          {activeCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`chip ${cat === category.id ? 'is-active' : ''}`}
              aria-pressed={cat === category.id}
              onClick={() => updateParams({ cat: cat === category.id ? '' : category.id })}
            >
              {category.name}
            </button>
          ))}
        </div>

        {error ? (
          <div className="load-note load-note--error">
            <p>{error}</p>
            <button type="button" className="btn btn-outline" onClick={retry}>
              تلاش دوباره
            </button>
          </div>
        ) : loading ? (
          <div className="grid-skeleton" aria-hidden="true">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="card-skeleton" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="menu-empty">
            <BasketIcon width="46" height="46" />
            <h2>چیزی پیدا نشد</h2>
            <p>با این فیلترها غذایی پیدا نشد؛ فیلترها رو تغییر بده یا جستجوی دیگه‌ای امتحان کن.</p>
            {hasFilters ? (
              <button type="button" className="btn btn-primary" onClick={() => setSearchParams({}, { replace: true })}>
                حذف فیلترها
              </button>
            ) : null}
          </div>
        ) : (
          <>
            <Reveal as="p" className="menu-count">
              {faNum(filtered.length)} غذا پیدا شد
            </Reveal>
            <div className="menu-grid">
              {filtered.map((meal, index) => (
                <MealCard key={meal.id} meal={meal} tintIndex={index} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
