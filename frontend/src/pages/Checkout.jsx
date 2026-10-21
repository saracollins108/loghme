import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useProducts } from '../context/ProductsContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { CheckIcon, BasketIcon } from '../components/Icons.jsx';
import { faNum, formatPrice } from '../utils/format.js';

const toEnglishDigits = (value = '') =>
  value.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const { deliveryFee, products } = useProducts();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', phone: '', address: '', note: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [serverError, setServerError] = useState('');

  const unavailable = items.filter((item) => {
    const product = products.find((meal) => meal.id === item.id);
    return product ? !product.available : true;
  });

  const setField = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setServerError('');
  };

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 3) next.name = 'نام و نام خانوادگی را کامل وارد کنید.';
    const phone = toEnglishDigits(form.phone).replace(/[\s-]/g, '');
    if (!/^09\d{9}$/.test(phone)) next.phone = 'شماره موبایل معتبر وارد کنید؛ مثل ۰۹۱۲۳۴۵۶۷۸۹.';
    if (form.address.trim().length < 10) next.address = 'آدرس دقیق را وارد کنید تا سفارش به درستی تحویل شود.';
    return next;
  };

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setSubmitting(true);
    setServerError('');
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({ id: item.id, qty: item.qty })),
          customer: {
            name: form.name.trim(),
            phone: toEnglishDigits(form.phone).replace(/[\s-]/g, ''),
            address: form.address.trim(),
          },
          note: form.note.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        setServerError(data.message ?? 'ثبت سفارش انجام نشد؛ لطفاً دوباره تلاش کنید.');
        return;
      }
      setPlacedOrder(data.order);
      clear();
    } catch {
      setServerError('ارتباط با سرور برقرار نشد؛ اتصال اینترنت را بررسی کن.');
    } finally {
      setSubmitting(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="page checkout-page">
        <div className="container">
          <div className="order-success">
            <span className="success-icon">
              <CheckIcon width="30" height="30" />
            </span>
            <h1>سفارش شما ثبت شد!</h1>
            <p>
              کد سفارش شما: <strong dir="ltr">{placedOrder.code}</strong>
            </p>
            <div className="success-summary">
              <div>
                <span>تعداد پرس</span>
                <strong>{faNum(placedOrder.itemsCount)}</strong>
              </div>
              <div>
                <span>هزینه ارسال</span>
                <strong>{formatPrice(placedOrder.deliveryFee)}</strong>
              </div>
              <div>
                <span>مبلغ قابل پرداخت</span>
                <strong>{formatPrice(placedOrder.total)}</strong>
              </div>
            </div>
            <p className="success-note">
              سفارشت در سیستم لقمه ثبت شد؛ پرداخت در محل و هنگام تحویل انجام می‌شه.
            </p>
            <Link to="/menu" className="btn btn-primary">
              بازگشت به منو
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page checkout-page">
        <div className="container">
          <div className="menu-empty">
            <BasketIcon width="46" height="46" />
            <h2>سبد خریدت خالیه</h2>
            <p>برای ثبت سفارش، اول یه غذای خوشمزه به سبد اضافه کن.</p>
            <Link to="/menu" className="btn btn-primary">
              مشاهده منو
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page checkout-page">
      <div className="container">
        <header className="page-hero">
          <h1>ثبت سفارش</h1>
          <p>اطلاعات تماس و آدرس رو وارد کن؛ سفارشت ثبت می‌شه و هزینه رو هنگام تحویل پرداخت می‌کنی.</p>
        </header>
        <div className="checkout-grid">
          <form className="checkout-form" onSubmit={submit} noValidate>
            {unavailable.length > 0 ? (
              <p className="alert-error">
                «{unavailable[0].name}» فعلاً موجود نیست؛ آن را از سبد خرید حذف کن و دوباره تلاش کن.
              </p>
            ) : null}
            <div className={`field ${errors.name ? 'field--error' : ''}`}>
              <label htmlFor="name">نام و نام خانوادگی</label>
              <input id="name" name="name" autoComplete="name" value={form.name} onChange={setField('name')} placeholder="مثلاً سارا محمدی" />
              {errors.name ? <p className="error-msg">{errors.name}</p> : null}
            </div>
            <div className={`field ${errors.phone ? 'field--error' : ''}`}>
              <label htmlFor="phone">شماره موبایل</label>
              <input id="phone" name="phone" type="tel" inputMode="tel" dir="ltr" autoComplete="tel" value={form.phone} onChange={setField('phone')} placeholder="09123456789" />
              {errors.phone ? <p className="error-msg">{errors.phone}</p> : null}
            </div>
            <div className={`field ${errors.address ? 'field--error' : ''}`}>
              <label htmlFor="address">آدرس دقیق تحویل</label>
              <textarea
                id="address"
                name="address"
                rows="3"
                autoComplete="street-address"
                value={form.address}
                onChange={setField('address')}
                placeholder="شهر، محله، خیابان، پلاک و واحد"
              />
              {errors.address ? <p className="error-msg">{errors.address}</p> : null}
            </div>
            <div className="field">
              <label htmlFor="note">یادداشت سفارش (اختیاری)</label>
              <textarea id="note" name="note" rows="2" value={form.note} onChange={setField('note')} placeholder="مثلاً زنگ نزنید، پیام بفرستید" />
            </div>
            {serverError ? <p className="alert-error">{serverError}</p> : null}
            <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={submitting || unavailable.length > 0}>
              {submitting ? 'در حال ثبت سفارش…' : 'ثبت سفارش'}
            </button>
            <button type="button" className="btn btn-ghost btn-block" onClick={() => navigate('/menu')}>
              بازگشت به منو
            </button>
          </form>

          <aside className="checkout-summary" aria-label="خلاصه سفارش">
            <h2>خلاصه سفارش</h2>
            <ul className="summary-items">
              {items.map((item) => (
                <li key={item.id}>
                  <img src={item.image} alt="" />
                  <span className="summary-item__name">
                    {item.name}
                    <small>
                      {faNum(item.qty)} × {formatPrice(item.price)}
                    </small>
                  </span>
                  <strong>{formatPrice(item.price * item.qty)}</strong>
                </li>
              ))}
            </ul>
            <div className="summary-row">
              <span>جمع سبد خرید</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <div className="summary-row">
              <span>هزینه ارسال</span>
              <strong>{formatPrice(deliveryFee)}</strong>
            </div>
            <div className="summary-row summary-row--grand">
              <span>مبلغ قابل پرداخت</span>
              <strong>{formatPrice(subtotal + deliveryFee)}</strong>
            </div>
            <p className="summary-note">پرداخت در محل، هنگام تحویل سفارش</p>
            <button
              type="button"
              className="link-btn"
              onClick={() => {
                toast('برای تغییر سبد خرید، از سبد خرید بالای صفحه استفاده کن.', 'info');
              }}
            >
              ویرایش سبد خرید
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
