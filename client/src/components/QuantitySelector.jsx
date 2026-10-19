export default function QuantitySelector({ value, onChange, small = false, productLabel = 'غذا', min = 1, max = 20 }) {
  const clamp = (n) => Math.min(max, Math.max(min, n));
  return (
    <div className={`qty${small ? ' qty-sm' : ''}`}>
      <button
        type="button"
        aria-label={`کاهش تعداد ${productLabel}`}
        disabled={value <= min}
        onClick={() => onChange(clamp(value - 1))}
      >
        −
      </button>
      <span className="qty-value" aria-live="polite" aria-label={`تعداد ${productLabel}`}>
        {value.toLocaleString('fa-IR')}
      </span>
      <button
        type="button"
        aria-label={`افزایش تعداد ${productLabel}`}
        disabled={value >= max}
        onClick={() => onChange(clamp(value + 1))}
      >
        +
      </button>
    </div>
  );
}
