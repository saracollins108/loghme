import { useState } from 'react';
import { PhoneIcon } from '../components/Icons.jsx';
import { useToast } from '../context/ToastContext.jsx';

const toEnglishDigits = (value = '') =>
  value.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

export default function Contact() {
  const toast = useToast();
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [done, setDone] = useState(false);

  const setField = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setServerError('');
  };

  const submit = async (event) => {
    event.preventDefault();
    const next = {};
    if (form.name.trim().length < 3) next.name = 'نام را کامل وارد کنید.';
    if (!/^09\d{9}$/.test(toEnglishDigits(form.phone).replace(/[\s-]/g, ''))) {
      next.phone = 'شماره موبایل معتبر وارد کنید؛ مثل ۰۹۱۲۳۴۵۶۷۸۹.';
    }
    if (form.message.trim().length < 10) next.message = 'متن پیام کوتاه است؛ کمی بیشتر بنویسید.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSubmitting(true);
    setServerError('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: toEnglishDigits(form.phone).replace(/[\s-]/g, ''),
          message: form.message.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        setServerError(data.message ?? 'ارسال پیام انجام نشد؛ دوباره تلاش کنید.');
        return;
      }
      setDone(true);
      toast(data.message);
    } catch {
      setServerError('ارتباط با سرور برقرار نشد؛ اتصال اینترنت را بررسی کن.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page contact-page">
      <div className="container">
        <header className="page-hero">
          <h1>تماس با ما</h1>
          <p>سوالی درباره سفارش یا منو داری؟ برامون بنویس؛ به‌زودی پاسخ می‌دیم.</p>
        </header>
        <div className="contact-grid">
          <div className="contact-info">
            <p className="contact-phone">
              <PhoneIcon />
              <a href="tel:+982191009100" dir="ltr">۰۲۱-۹۱۰۰ ۹۱۰۰</a>
            </p>
            <p className="contact-hint">در ساعات کاری پاسخ‌گوی شما هستیم.</p>
            <p className="contact-note">
              اطلاعات تماس فعلاً نمونه است و پیش از انتشار نهایی با اطلاعات واقعی لقمه جایگزین می‌شود.
            </p>
          </div>
          <form className="contact-form" onSubmit={submit} noValidate>
            {done ? (
              <p className="alert-success">پیام شما ثبت شد؛ ممنون که با لقمه در ارتباطی.</p>
            ) : null}
            <div className={`field ${errors.name ? 'field--error' : ''}`}>
              <label htmlFor="c-name">نام و نام خانوادگی</label>
              <input id="c-name" value={form.name} onChange={setField('name')} placeholder="مثلاً سارا محمدی" />
              {errors.name ? <p className="error-msg">{errors.name}</p> : null}
            </div>
            <div className={`field ${errors.phone ? 'field--error' : ''}`}>
              <label htmlFor="c-phone">شماره موبایل</label>
              <input id="c-phone" type="tel" inputMode="tel" dir="ltr" value={form.phone} onChange={setField('phone')} placeholder="09123456789" />
              {errors.phone ? <p className="error-msg">{errors.phone}</p> : null}
            </div>
            <div className={`field ${errors.message ? 'field--error' : ''}`}>
              <label htmlFor="c-message">پیام شما</label>
              <textarea id="c-message" rows="4" value={form.message} onChange={setField('message')} placeholder="سوال یا پیام خودت را بنویس…" />
              {errors.message ? <p className="error-msg">{errors.message}</p> : null}
            </div>
            {serverError ? <p className="alert-error">{serverError}</p> : null}
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'در حال ارسال…' : 'ارسال پیام'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
