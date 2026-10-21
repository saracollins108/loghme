import { Link } from 'react-router-dom';
import Price from './Price.jsx';
import { PlusIcon, HeartIcon } from './Icons.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { faNum } from '../utils/format.js';

const CARD_TINTS = ['var(--sage)', 'var(--beige)', 'var(--blush)'];

export default function MealCard({ meal, variant = 'default', tintIndex = 0 }) {
  const { add } = useCart();
  const { isFavorite, toggle } = useFavorites();
  const toast = useToast();
  const favorite = isFavorite(meal.id);

  const handleAdd = () => {
    add(meal);
    toast(`«${meal.name}» به سبد خرید اضافه شد.`);
  };

  const handleFavorite = () => {
    toggle(meal.id);
    toast(favorite ? 'از علاقه‌مندی‌ها حذف شد.' : 'به علاقه‌مندی‌ها اضافه شد.');
  };

  const style = variant === 'featured' ? { '--card-tint': CARD_TINTS[tintIndex % CARD_TINTS.length] } : undefined;

  return (
    <article className={`meal-card meal-card--${variant}`} style={style}>
      {variant === 'featured' ? (
        <div className="price-bubble" aria-label={`قیمت: ${meal.price} تومان`}>
          <strong>{faNum(meal.price)}</strong>
          <span>تومان</span>
        </div>
      ) : null}
      {meal.originalPrice ? (
        <span className="discount-badge">٪{faNum(Math.round((1 - meal.price / meal.originalPrice) * 100))} تخفیف</span>
      ) : null}
      <button
        type="button"
        className={`fav-btn ${favorite ? 'is-active' : ''}`}
        aria-label={favorite ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
        aria-pressed={favorite}
        onClick={handleFavorite}
      >
        <HeartIcon filled={favorite} />
      </button>
      <Link to={`/meal/${meal.slug}`} className="meal-card__media" aria-label={meal.name}>
        <img src={meal.image} alt={meal.name} loading="lazy" />
      </Link>
      <div className="meal-card__body">
        <h3 className="meal-card__name">
          <Link to={`/meal/${meal.slug}`}>{meal.name}</Link>
        </h3>
        <p className="meal-card__desc">{meal.description}</p>
        <div className="meal-card__footer">
          {variant === 'default' ? (
            <Price price={meal.price} originalPrice={meal.originalPrice} size="sm" />
          ) : (
            <span className="meal-card__serving">{meal.serving}</span>
          )}
          {meal.available ? (
            <button type="button" className="btn btn-ink btn-sm" onClick={handleAdd}>
              <PlusIcon width="15" height="15" />
              افزودن
            </button>
          ) : (
            <span className="badge-unavailable">ناموجود</span>
          )}
        </div>
      </div>
    </article>
  );
}
