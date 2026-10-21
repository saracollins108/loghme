import { faNum } from '../utils/format.js';
import { MinusIcon, PlusIcon } from './Icons.jsx';

export default function QuantitySelector({ value, onChange, min = 1, max = 20, small = false }) {
  return (
    <div className={`qty-selector ${small ? 'qty-selector--small' : ''}`} role="group" aria-label="تعداد پرس">
      <button
        type="button"
        className="qty-btn"
        aria-label="افزایش تعداد"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <PlusIcon />
      </button>
      <span className="qty-value" aria-live="polite">
        {faNum(value)}
      </span>
      <button
        type="button"
        className="qty-btn"
        aria-label="کاهش تعداد"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <MinusIcon />
      </button>
    </div>
  );
}
