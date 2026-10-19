import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../format.js';
import QuantitySelector from './QuantitySelector.jsx';

export default function CartDrawer() {
  const { items, cartOpen, setCartOpen, setQty, remove, subtotal, count } = useCart();
  const closeRef = useRef(null);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', cartOpen);
    if (cartOpen) closeRef.current?.focus();
    return () => document.body.classList.remove('no-scroll');
  }, [cartOpen]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setCartOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setCartOpen]);

  if (!cartOpen) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={() => setCartOpen(false)} aria-hidden="true" />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="سبد خرید">
        <div className="drawer-head">
          <h2>
            سبد خرید
            {count > 0 && <span className="drawer-count"> {count.toLocaleString('fa-IR')} غذا</span>}
          </h2>
          <button ref={closeRef} className="icon-btn" aria-label="بستن سبد خرید" onClick={() => setCartOpen(false)}>
            <svg width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="drawer-empty">
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 7h12l-1.2 11a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8L6 7Z" />
              <path d="M9 9V6a3 3 0 0 1 6 0v3" />
            </svg>
            <p>سبد خریدت خالیه.</p>
            <Link to="/menu" className="btn btn-primary" onClick={() => setCartOpen(false)}>
              دیدن منوی غذا
            </Link>
          </div>
        ) : (
          <>
            <div className="drawer-body">
              {items.map((it) => (
                <div className="drawer-item" key={it.id}>
                  <img src={it.image} alt={it.name} width="68" height="68" loading="lazy" />
                  <div className="drawer-item-info">
                    <Link to={`/product/${it.slug}`} onClick={() => setCartOpen(false)}>
                      {it.name}
                    </Link>
                    <span className="drawer-item-price">{formatPrice(it.price)} تومان</span>
                    <div className="drawer-item-controls">
                      <QuantitySelector
                        value={it.qty}
                        onChange={(q) => setQty(it.id, q)}
                        small
                        productLabel={it.name}
                      />
                      <button className="remove-btn" onClick={() => remove(it.id)}>
                        حذف
                      </button>
                    </div>
                  </div>
                  <strong className="drawer-item-total">{formatPrice(it.price * it.qty)}</strong>
                </div>
              ))}
            </div>
            <div className="drawer-foot">
              <div className="drawer-total">
                <span>جمع سبد</span>
                <strong>{formatPrice(subtotal)} تومان</strong>
              </div>
              <p className="drawer-note">هزینه ارسال در مرحله ثبت سفارش محاسبه می‌شود.</p>
              <Link to="/checkout" className="btn btn-primary btn-block" onClick={() => setCartOpen(false)}>
                ثبت سفارش
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
