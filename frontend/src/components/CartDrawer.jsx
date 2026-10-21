import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useProducts } from '../context/ProductsContext.jsx';
import { CloseIcon, TrashIcon, BasketIcon } from './Icons.jsx';
import { faNum, formatPrice } from '../utils/format.js';

export default function CartDrawer({ open, onClose }) {
  const { items, setQty, remove, subtotal, count } = useCart();
  const { deliveryFee } = useProducts();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.toggle('no-scroll', open);
    return () => document.body.classList.remove('no-scroll');
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const goCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <div className={`cart-drawer ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <div className="drawer-overlay" onClick={onClose} />
      <aside className="drawer-panel" role="dialog" aria-modal="true" aria-label="سبد خرید">
        <header className="drawer-head">
          <h2>سبد خرید {count > 0 ? `(${faNum(count)} قلم)` : ''}</h2>
          <button type="button" className="icon-btn" aria-label="بستن سبد خرید" onClick={onClose}>
            <CloseIcon />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="drawer-empty">
            <BasketIcon width="46" height="46" />
            <p>سبد خریدت خالیه؛ یه غذای خوشمزه انتخاب کن!</p>
            <Link to="/menu" className="btn btn-primary" onClick={onClose}>
              مشاهده منو
            </Link>
          </div>
        ) : (
          <>
            <ul className="drawer-list">
              {items.map((item) => (
                <li key={item.id} className="drawer-item">
                  <img src={item.image} alt={item.name} />
                  <div className="drawer-item__info">
                    <Link to={`/meal/${item.slug ?? ''}`} onClick={onClose} className="drawer-item__name">
                      {item.name}
                    </Link>
                    <span className="drawer-item__price">{formatPrice(item.price)}</span>
                    <div className="drawer-item__row">
                      <div className="qty-selector qty-selector--small" role="group" aria-label={`تعداد ${item.name}`}>
                        <button type="button" className="qty-btn" aria-label="افزایش" onClick={() => setQty(item.id, item.qty + 1)}>
                          +
                        </button>
                        <span className="qty-value">{faNum(item.qty)}</span>
                        <button type="button" className="qty-btn" aria-label="کاهش" onClick={() => setQty(item.id, item.qty - 1)}>
                          −
                        </button>
                      </div>
                      <button type="button" className="icon-btn remove-btn" aria-label={`حذف ${item.name}`} onClick={() => remove(item.id)}>
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                  <strong className="drawer-item__total">{formatPrice(item.price * item.qty)}</strong>
                </li>
              ))}
            </ul>
            <footer className="drawer-footer">
              <div className="drawer-total-row">
                <span>جمع سبد خرید</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <div className="drawer-total-row">
                <span>هزینه ارسال</span>
                <strong>{formatPrice(deliveryFee)}</strong>
              </div>
              <div className="drawer-total-row drawer-total-row--grand">
                <span>مبلغ قابل پرداخت</span>
                <strong>{formatPrice(subtotal + deliveryFee)}</strong>
              </div>
              <p className="drawer-note">پرداخت در محل، هنگام تحویل سفارش</p>
              <button type="button" className="btn btn-primary btn-lg btn-block" onClick={goCheckout}>
                ادامه و ثبت سفارش
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
