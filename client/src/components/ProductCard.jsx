import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../format.js';

// Alternating card themes echo the reference's olive / orange card rhythm.
const THEMES = ['theme-olive-strong', 'theme-orange'];

export const CATEGORY_NAMES = {
  irani: 'غذاهای ایرانی',
  stews: 'خورشت‌های ایرانی',
  rice: 'غذاهای برنجی',
  daily: 'غذاهای روز',
  light: 'غذاهای سبک',
  sides: 'پیش‌غذا و دورچین',
};

export default function ProductCard({ product, themeIndex = 0 }) {
  const { add } = useCart();
  const price = product.discountPrice ?? product.price;

  return (
    <article className={`product-card ${THEMES[themeIndex % THEMES.length]}`}>
      <div className="card-media">
        <Link to={`/product/${product.slug}`} aria-label={`صفحه ${product.name}`}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width="480"
            height="360"
          />
        </Link>
        <Link
          to={`/product/${product.slug}`}
          className="price-badge"
          aria-label={`قیمت ${formatPrice(price)} تومان`}
        >
          <span className="price-badge-unit">قیمت</span>
          <strong>{formatPrice(price)}</strong>
          <span className="price-badge-unit">تومان</span>
          {product.originalPrice && <del>{formatPrice(product.originalPrice)}</del>}
        </Link>
      </div>

      <div className="card-body">
        <span className="card-script" aria-hidden="true">
          {CATEGORY_NAMES[product.category] || ''}
        </span>
        <h3>
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <span className={`card-status ${product.available ? 'is-available' : 'is-unavailable'}`}>
          <span className="dot" aria-hidden="true" />
          {product.available ? 'موجود' : 'ناموجود'}
        </span>
        <p className="card-desc">{product.description}</p>
        <div className="card-foot">
          <button
            className="btn btn-card"
            disabled={!product.available}
            onClick={() => add(product)}
          >
            {product.available ? 'سفارش غذا' : 'ناموجود'}
          </button>
        </div>
      </div>
    </article>
  );
}
