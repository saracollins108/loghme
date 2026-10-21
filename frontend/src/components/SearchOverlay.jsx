import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext.jsx';
import { CloseIcon, SearchIcon } from './Icons.jsx';
import { formatPrice } from '../utils/format.js';

export default function SearchOverlay({ open, onClose }) {
  const { products, categories } = useProducts();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return undefined;
    document.body.classList.add('no-scroll');
    const timer = setTimeout(() => inputRef.current?.focus(), 120);
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('no-scroll');
      clearTimeout(timer);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const normalized = query.trim();
  const categoryName = (categoryId) => categories.find((c) => c.id === categoryId)?.name ?? '';
  const results = normalized
    ? products
        .filter(
          (meal) =>
            meal.name.includes(normalized) ||
            meal.description.includes(normalized) ||
            categoryName(meal.categoryId).includes(normalized)
        )
        .slice(0, 8)
    : [];

  const openMeal = (slug) => {
    onClose();
    navigate(`/meal/${slug}`);
  };

  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label="جستجو در منو">
      <button type="button" className="icon-btn search-close" aria-label="بستن جستجو" onClick={onClose}>
        <CloseIcon />
      </button>
      <div className="container search-inner">
        <div className="search-field">
          <SearchIcon />
          <input
            ref={inputRef}
            type="search"
            value={query}
            placeholder="نام غذا را بنویس… مثل قورمه‌سبزی"
            aria-label="جستجو در منو"
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        {normalized ? (
          results.length > 0 ? (
            <ul className="search-results">
              {results.map((meal) => (
                <li key={meal.id}>
                  <button type="button" className="search-result" onClick={() => openMeal(meal.slug)}>
                    <img src={meal.image} alt="" />
                    <span className="search-result__text">
                      <strong>{meal.name}</strong>
                      <small>{categoryName(meal.categoryId)}</small>
                    </span>
                    <span className="search-result__price">
                      {meal.available ? formatPrice(meal.price) : 'ناموجود'}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="search-empty">
              چیزی برای «{normalized}» پیدا نشد. یه اسم دیگه امتحان کن یا منوی غذا رو ببین.
            </p>
          )
        ) : (
          <p className="search-hint">نام غذا، دسته‌بندی یا بخشی از توضیحات را جستجو کن.</p>
        )}
      </div>
    </div>
  );
}
