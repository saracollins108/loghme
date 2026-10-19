import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice } from '../format.js';
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from '../config.js';

const PHONE_RE = /^09\d{9}$/;

export default function CheckoutPage() {
  const { items, subtotal, clear, notify } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', address: '', note: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0 && !submitting) {
    return (
      <div className="container page-pad empty-state">
        <h2>سبد خریدت خالیه</h2>
        <p>برای ثبت سفارش، اول از منوی غذا چند غذا انتخاب کن.</p>
        <Link to="/menu" className="btn btn-primary">
          دیدن منوی غذا
        </Link>
      </div>
    );
  }

  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (form.name.trim().length < 2) er.name = 'نام و نام خانوادگی را وارد کنید.';
    if (!PHONE_RE.test(form.phone.trim()))
      er.phone = 'شماره موبایل معتبر وارد کنید (مثلاً ۰۹۱۲۳۴۵۶۷۸۹).';
    if (form.address.trim().length < 10) er.address = 'آدرس کامل را وارد کنید (حداقل ۱۰ کاراکتر).';
    return er;
  };

  const submit = async (e) => {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) {
      notify('لطفاً خطاهای فرم را برطرف کن.');
      return;
    }
    setSubmitting(true);
    try {
      const order = await api.createOrder({
        customer: { name: form.name.trim(), phone: form.phone.trim(), address: form.address.trim() },
        note: form.note.trim(),
        items: items.map((it) => ({ productId: it.id, qty: it.qty })),
      });
      clear();
      navigate(`/order/${order.code}`, { state: { order } });
    } catch (err) {
      setSubmitting(false);
      if (err.payload?.errors) {
        setErrors(err.payload.errors);
        notify('ثبت سفارش انجام نشد؛ خطاهای فرم را برطرف کن.');
      } else {
        notify(err.message || 'خطایی رخ داد. دوباره تلاش کنید.');
      }
    }
  };

  return (
    <div className="checkout-page">
      <div className="container page-pad">
        <h1 className="page-title">ثبت سفارش</h1>
        <div className="checkout-grid">
          <form className="checkout-form" onSubmit={submit} noValidate>
            <div className="field">
              <label htmlFor="co-name">نام و نام خانوادگی</label>
              <input
                id="co-name"
                className={`input${errors.name ? ' invalid' : ''}`}
                value={form.name}
                onChange={set('name')}
                autoComplete="name"
                required
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="field">
              <label htmlFor="co-phone">شماره موبایل</label>
              <input
                id="co-phone"
                className={`input${errors.phone ? ' invalid' : ''}`}
                value={form.phone}
                onChange={set('phone')}
                inputMode="tel"
                autoComplete="tel"
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                dir="ltr"
                required
              />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </div>

            <div className="field">
              <label htmlFor="co-address">آدرس تحویل</label>
              <textarea
                id="co-address"
                rows="3"
                className={`input${errors.address ? ' invalid' : ''}`}
                value={form.address}
                onChange={set('address')}
                autoComplete="street-address"
                placeholder="محله، خیابان، کوچه، پلاک و واحد"
                required
              />
              {errors.address && <span className="field-error">{errors.address}</span>}
            </div>

            <div className="field">
              <label htmlFor="co-note">یادداشت سفارش (اختیاری)</label>
              <textarea
                id="co-note"
                rows="2"
                className="input"
                value={form.note}
                onChange={set('note')}
                placeholder="مثلاً: بدون تند، زنگ نزنید، تحویل بعد از ساعت ۷"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={submitting}>
              {submitting ? 'در حال ثبت سفارش…' : 'ثبت نهایی سفارش'}
            </button>
            <p className="checkout-disclaimer">
              این نسخه نمایشی است؛ سفارش با کد پیگیری ذخیره می‌شود اما پرداخت آنلاین و ارسال به
              آشپزخانه هنوز فعال نیست.
            </p>
          </form>

          <aside className="order-summary" aria-label="خلاصه سفارش">
            <h2>خلاصه سفارش</h2>
            <ul>
              {items.map((it) => (
                <li key={it.id}>
                  <img src={it.image} alt="" width="52" height="52" loading="lazy" />
                  <div>
                    <span className="sum-name">{it.name}</span>
                    <span className="sum-qty">{it.qty.toLocaleString('fa-IR')} پرس × {formatPrice(it.price)}</span>
                  </div>
                  <strong>{formatPrice(it.price * it.qty)}</strong>
                </li>
              ))}
            </ul>
            <div className="summary-rows">
              <div>
                <span>جمع غذاها</span>
                <span>{formatPrice(subtotal)} تومان</span>
              </div>
              <div>
                <span>هزینه ارسال</span>
                <span>{deliveryFee === 0 ? 'رایگان' : `${formatPrice(deliveryFee)} تومان`}</span>
              </div>
              {deliveryFee > 0 && (
                <p className="free-hint">
                  با سفارش بالای {formatPrice(FREE_DELIVERY_THRESHOLD)} تومان، ارسال رایگان می‌شود.
                </p>
              )}
              <div className="summary-total">
                <span>مبلغ نهایی</span>
                <strong>{formatPrice(total)} تومان</strong>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
