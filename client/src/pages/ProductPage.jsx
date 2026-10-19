import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../format.js';
import QuantitySelector from '../components/QuantitySelector.jsx';
import ProductCard from '../components/ProductCard.jsx';
import Reveal from '../components/Reveal.jsx';
import SectionHeading from '../components/SectionHeading.jsx';

export default function ProductPage() {
  const { slug } = useParams();
  const { add, toggleFavorite, isFavorite } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [state, setState] = useState({ loading: true, error: null });
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    let alive = true;
    setState({ loading: true, error: null });
    setProduct(null);
    setQty(1);
    setActiveImage(0);
    Promise.all([api.product(slug), api.products()])
      .then(([p, all]) => {
        if (!alive) return;
        setProduct(p);
        setRelated(
          all.filter((x) => x.category === p.category && x.id !== p.id && x.available).slice(0, 4)
        );
        setState({ loading: false, error: null });
      })
      .catch((e) => alive && setState({ loading: false, error: e.message }));
    return () => {
      alive = false;
    };
  }, [slug]);

  if (state.loading) {
    return <div className="container page-pad loading-note">در حال بارگذاری…</div>;
  }
  if (state.error || !product) {
    return (
      <div className="container page-pad empty-state">
        <h2>این غذا پیدا نشد</h2>
        <p>شاید آدرس تغییر کرده یا غذا از منو حذف شده است.</p>
        <Link to="/menu" className="btn btn-primary">
          بازگشت به منو
        </Link>
      </div>
    );
  }

  const price = product.discountPrice ?? product.price;
  const images = product.images?.length ? product.images : [product.image];
  const fav = isFavorite(product.slug);
  const categoryName = { irani: 'غذاهای ایرانی', stews: 'خورشت‌های ایرانی', rice: 'غذاهای برنجی', daily: 'غذاهای روز', light: 'غذاهای سبک', sides: 'پیش‌غذا و دورچین' }[product.category] || product.category;

  return (
    <div className="pdp-page">
      <div className="container page-pad">
        <nav className="breadcrumbs" aria-label="مسیر صفحه">
          <Link to="/">خانه</Link>
          <span aria-hidden="true">/</span>
          <Link to="/menu">منوی غذا</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{product.name}</span>
        </nav>

        <div className="pdp-grid">
          <div className="pdp-media">
            <button
              className="pdp-main-image"
              onClick={() => setZoom(true)}
              aria-label={`نمایش بزرگ‌تر تصویر ${product.name}`}
            >
              <img src={images[activeImage]} alt={product.name} width="880" height="720" />
            </button>
            {images.length > 1 && (
              <div className="pdp-thumbs" role="group" aria-label="تصاویر غذا">
                {images.map((src, i) => (
                  <button
                    key={i}
                    className={`pdp-thumb${i === activeImage ? ' active' : ''}`}
                    onClick={() => setActiveImage(i)}
                    aria-label={`تصویر ${i + 1}`}
                    aria-pressed={i === activeImage}
                  >
                    <img src={src} alt="" width="80" height="80" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pdp-info">
            <Link to={`/menu?category=${product.category}`} className="pdp-category">
              {categoryName}
            </Link>
            <h1 className="pdp-title">{product.name}</h1>

            <div className="pdp-price-row">
              <span className="pdp-price">
                {formatPrice(price)}
                <small> تومان</small>
              </span>
              {product.discountPrice && <del>{formatPrice(product.originalPrice)} تومان</del>}
            </div>

            <p className="pdp-desc">{product.longDescription || product.description}</p>

            <ul className="pdp-meta">
              <li>
                <span>وضعیت:</span>
                <span className={`availability ${product.available ? 'is-available' : 'is-unavailable'}`}>
                  <span className="dot" aria-hidden="true" />
                  {product.available ? 'موجود' : 'ناموجود'}
                </span>
              </li>
              <li>
                <span>حجم سرو:</span> {product.serving}
              </li>
              {product.ingredients?.length > 0 && (
                <li>
                  <span>مواد تشکیل‌دهنده:</span> {product.ingredients.join('، ')}
                </li>
              )}
            </ul>

            <div className="pdp-actions">
              <QuantitySelector value={qty} onChange={setQty} productLabel={product.name} />
              <button
                className="btn btn-primary btn-lg pdp-add"
                disabled={!product.available}
                onClick={() => add(product, qty)}
              >
                {product.available
                  ? `اضافه کردن به سبد خرید — ${formatPrice(price * qty)} تومان`
                  : 'در حال حاضر ناموجود'}
              </button>
              <button
                className={`fav-btn large${fav ? ' active' : ''}`}
                aria-pressed={fav}
                aria-label={fav ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
                onClick={() => toggleFavorite(product.slug)}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill={fav ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M12 21s-7.5-4.7-10-9.5C.5 8 2.5 4.5 6 4.5c2.2 0 3.8 1.2 4.7 2.6L12 8.6l1.3-1.5c.9-1.4 2.5-2.6 4.7-2.6 3.5 0 5.5 3.5 4 7C19.5 16.3 12 21 12 21Z" />
                </svg>
              </button>
            </div>

            {product.available && (
              <p className="pdp-hint">موجودی و قیمت در لحظه ثبت سفارش بررسی می‌شود.</p>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <section className="pdp-related" aria-labelledby="related-title">
            <SectionHeading label="کنارش خوبه" title="غذاهای مشابه" center={false} />
            <div className="related-grid">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={i * 60}>
                  <ProductCard product={p} themeIndex={i} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky mobile ordering bar */}
      <div className="pdp-mobile-bar">
        <div className="pdp-mobile-price">
          <span>{formatPrice(price)}</span>
          <small>تومان / {product.serving}</small>
        </div>
        <button
          className="btn btn-primary"
          disabled={!product.available}
          onClick={() => add(product, qty)}
        >
          {product.available ? `افزودن (${formatPrice(price * qty)} تومان)` : 'ناموجود'}
        </button>
      </div>

      {zoom && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={`تصویر ${product.name}`} onClick={() => setZoom(false)}>
          <img src={images[activeImage]} alt={product.name} />
          <button className="icon-btn lightbox-close" aria-label="بستن تصویر">
            <svg width="26" height="26" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
