import { useState } from 'react';
import { api } from '../api.js';
import { useCart } from '../context/CartContext.jsx';
import { pageImages } from '../data/brandImages.js';

const PHONE_RE = /^09\d{9}$/;

export default function ContactPage() {
  const { notify } = useCart();
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const er = {};
    if (form.name.trim().length < 2) er.name = 'نام خود را وارد کنید.';
    if (!PHONE_RE.test(form.phone.trim()))
      er.phone = 'شماره موبایل معتبر وارد کنید (مثلاً ۰۹۱۲۳۴۵۶۷۸۹).';
    if (form.message.trim().length < 10) er.message = 'پیام خود را کامل‌تر بنویسید.';
    setErrors(er);
    if (Object.keys(er).length) return;

    setSending(true);
    try {
      const res = await api.sendMessage({
        name: form.name.trim(),
        phone: form.phone.trim(),
        message: form.message.trim(),
      });
      setDone(res.message);
      setForm({ name: '', phone: '', message: '' });
    } catch (err) {
      if (err.payload?.errors) setErrors(err.payload.errors);
      else notify(err.message || 'ارسال پیام انجام نشد. دوباره تلاش کنید.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contact-page">
      <section className="page-hero">
        <div className="container">
          <span className="section-label light">تماس با ما</span>
          <h1>حرفی داری؟ خوشحال می‌شویم بشنویم</h1>
          <p>
            برای هماهنگی سفارش‌های ویژه، پیشنهادها یا سوال‌هایت برایمان بنویس؛ در اولین فرصت
            پاسخ می‌دهیم.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <div className="contact-media">
            <img src={pageImages.contact} alt="مواد اولیه تازه روی تخته آشپزخانه" loading="lazy" width="560" height="640" />
          </div>

          <div className="contact-form-wrap">
            {done ? (
              <div className="empty-state inline">
                <h2>پیامت رسید!</h2>
                <p>{done}</p>
                <button className="btn btn-outline-dark" onClick={() => setDone(false)}>
                  نوشتن پیام جدید
                </button>
              </div>
            ) : (
              <form className="checkout-form" onSubmit={submit} noValidate>
                <div className="field">
                  <label htmlFor="ct-name">نام</label>
                  <input id="ct-name" className={`input${errors.name ? ' invalid' : ''}`} value={form.name} onChange={set('name')} required />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>
                <div className="field">
                  <label htmlFor="ct-phone">شماره موبایل</label>
                  <input
                    id="ct-phone"
                    className={`input${errors.phone ? ' invalid' : ''}`}
                    value={form.phone}
                    onChange={set('phone')}
                    inputMode="tel"
                    dir="ltr"
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    required
                  />
                  {errors.phone && <span className="field-error">{errors.phone}</span>}
                </div>
                <div className="field">
                  <label htmlFor="ct-message">پیام</label>
                  <textarea id="ct-message" rows="5" className={`input${errors.message ? ' invalid' : ''}`} value={form.message} onChange={set('message')} required />
                  {errors.message && <span className="field-error">{errors.message}</span>}
                </div>
                <button type="submit" className="btn btn-primary btn-lg" disabled={sending}>
                  {sending ? 'در حال ارسال…' : 'ارسال پیام'}
                </button>
                <p className="checkout-disclaimer">
                  شماره تماس و اطلاعات تکمیلی ارتباطی به‌زودی در همین صفحه قرار می‌گیرد.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
