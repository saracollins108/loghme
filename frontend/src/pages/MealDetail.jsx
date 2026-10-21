import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Price from '../components/Price.jsx';
import QuantitySelector from '../components/QuantitySelector.jsx';
import MealCard from '../components/MealCard.jsx';
import Reveal from '../components/Reveal.jsx';
import { CheckIcon, ChevronIcon, HeartIcon } from '../components/Icons.jsx';
import { useProducts } from '../context/ProductsContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { formatPrice } from '../utils/format.js';

export default function MealDetail() {
  const { slug } = useParams();
  const { products, categories, deliveryFee, loading, bySlug } = useProducts();
  const { add } = useCart();
  const { isFavorite, toggle } = useFavorites();
  const toast = useToast();
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const meal = bySlug(slug);

  useEffect(() => {
    setQty(1);
    setActiveImage(0);
  }, [slug]);

  const related = useMemo(() => {
    if (!meal) return [];
    return products.filter((item) => item.categoryId === meal.categoryId && item.id !== meal.id).slice(0, 4);
  }, [products, meal]);

  const accompaniments = useMemo(
    () => products.filter((item) => item.categoryId === 'pish' && item.available).slice(0, 3),
    [products]
  );

  if (loading) {
    return (
      <div className="page detail-page">
        <div className="container">
          <p className="load-note">در حال بارگذاری…</p>
        </div>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="page detail-page">
        <div className="container">
          <div className="menu-empty">
            <h2>این غذا پیدا نشد</h2>
            <p>شاید از منو حذف شده باشه یا آدرس اشتباه باشه.</p>
            <Link to="/menu" className="btn btn-primary">
              بازگشت به منو
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const category = categories.find((item) => item.id === meal.categoryId);
  const gallery = meal.gallery?.length ? meal.gallery : [meal.image];
  const favorite = isFavorite(meal.id);

  const handleAdd = () => {
    add(meal, qty);
    toast(`«${meal.name}» به سبد خرید اضافه شد.`);
  };

  return (
    <div className="page detail-page">
      <div className="container detail-grid">
        <div className="detail-gallery">
          <div className="gallery-main">
            <img src={gallery[activeImage]} alt={meal.name} />
          </div>
          {gallery.length > 1 ? (
            <div className="gallery-thumbs" role="tablist" aria-label="تصاویر غذا">
              {gallery.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  className={`gallery-thumb ${index === activeImage ? 'is-active' : ''}`}
                  aria-label={`تصویر ${index + 1}`}
                  onClick={() => setActiveImage(index)}
                >
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="detail-info">
          {category ? (
            <Link to={`/menu?cat=${category.id}`} className="category-link">
              {category.name}
            </Link>
          ) : null}
          <h1 className="detail-title">{meal.name}</h1>
          <div className="detail-meta">
            <span className={`avail-dot ${meal.available ? 'is-available' : ''}`} aria-hidden="true" />
            <span>{meal.available ? 'موجود' : 'ناموجود'}</span>
            <span aria-hidden="true">·</span>
            <span>{meal.serving}</span>
          </div>
          <p className="detail-desc">{meal.longDescription || meal.description}</p>
          {meal.ingredients?.length ? (
            <div className="detail-block">
              <h3>مواد تشکیل‌دهنده</h3>
              <p>{meal.ingredients.join('، ')}</p>
            </div>
          ) : null}
          {meal.allergens?.length ? (
            <div className="detail-block">
              <h3>مواد حساسیت‌زا</h3>
              <p>{meal.allergens.join('، ')}</p>
            </div>
          ) : null}
          <div className="detail-divider" role="presentation" />
          <Price price={meal.price} originalPrice={meal.originalPrice} size="lg" />
          <div className="detail-actions">
            <QuantitySelector value={qty} onChange={setQty} />
            {meal.available ? (
              <button type="button" className="btn btn-primary btn-lg" onClick={handleAdd}>
                اضافه کردن به سبد خرید
              </button>
            ) : (
              <button type="button" className="btn btn-lg" disabled>
                فعلاً موجود نیست
              </button>
            )}
            <button
              type="button"
              className={`fav-btn fav-btn--standalone ${favorite ? 'is-active' : ''}`}
              aria-label={favorite ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
              aria-pressed={favorite}
              onClick={() => toggle(meal.id)}
            >
              <HeartIcon filled={favorite} />
            </button>
          </div>
          <ul className="detail-notes">
            <li>
              <CheckIcon width="16" height="16" />
              پرداخت در محل، هنگام تحویل سفارش
            </li>
            <li>
              <CheckIcon width="16" height="16" />
              هزینه ارسال: {formatPrice(deliveryFee)}
            </li>
          </ul>
        </div>
      </div>

      {accompaniments.length ? (
        <section className="section detail-accompaniments" aria-label="دورچین‌های پیشنهادی">
          <div className="container">
            <h2 className="detail-subheading">پیشنهاد دورچین</h2>
            <div className="accompaniment-row">
              {accompaniments.map((item) => (
                <div key={item.id} className="accompaniment-card">
                  <img src={item.image} alt={item.name} loading="lazy" />
                  <div>
                    <Link to={`/meal/${item.slug}`}>{item.name}</Link>
                    <span>{formatPrice(item.price)}</span>
                  </div>
                  <button
                    type="button"
                    className="icon-btn add-side-btn"
                    aria-label={`افزودن ${item.name} به سبد`}
                    onClick={() => {
                      add(item);
                      toast(`«${item.name}» به سبد خرید اضافه شد.`);
                    }}
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {related.length ? (
        <section className="section detail-related" aria-label="غذاهای مشابه">
          <div className="container">
            <h2 className="detail-subheading">غذاهای مشابه</h2>
            <div className="menu-grid">
              {related.map((item, index) => (
                <MealCard key={item.id} meal={item} tintIndex={index} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <div className="container">
        <Link to="/menu" className="back-link">
          <ChevronIcon direction="right" width="16" height="16" />
          بازگشت به منو
        </Link>
      </div>

      {meal.available ? (
        <div className="detail-stickybar">
          <Price price={meal.price * qty} size="sm" />
          <button type="button" className="btn btn-primary" onClick={handleAdd}>
            اضافه به سبد
          </button>
        </div>
      ) : null}
    </div>
  );
}
