import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../format.js';
import QuantitySelector from './QuantitySelector.jsx';
import { useState } from 'react';

export default function QuickMealCard({ product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const price = product.discountPrice ?? product.price;

  return (
    <article className="quick-card">
      <Link to={`/product/${product.slug}`} className="quick-card-media" aria-label={product.name}>
        <img src={product.image} alt={product.name} loading="lazy" width="360" height="270" />
      </Link>
      <div className="quick-card-body">
        <h3>
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <p>{product.description}</p>
        <div className="quick-card-foot">
          <QuantitySelector value={qty} onChange={setQty} small productLabel={product.name} />
          <button
            className="btn btn-dark btn-sm"
            disabled={!product.available}
            onClick={() => add(product, qty)}
          >
            {product.available ? `افزودن — ${formatPrice(price * qty)}` : 'ناموجود'}
          </button>
        </div>
      </div>
    </article>
  );
}
