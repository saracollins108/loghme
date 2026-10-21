import { faNum, formatPrice } from '../utils/format.js';

export default function Price({ price, originalPrice, size = 'md' }) {
  return (
    <p className={`price price--${size}`}>
      <span className="price-current">{formatPrice(price)}</span>
      {originalPrice ? <del className="price-original">{faNum(originalPrice)}</del> : null}
    </p>
  );
}
