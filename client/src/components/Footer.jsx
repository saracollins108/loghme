import { Fragment } from 'react';
import { Link } from 'react-router-dom';

const LINKS = [
  { to: '/', label: 'صفحه اصلی' },
  { to: '/menu', label: 'منوی غذا' },
  { to: '/menu?daily=1', label: 'غذاهای امروز' },
  { to: '/menu?featured=1', label: 'غذاهای ویژه' },
  { to: '/about', label: 'درباره لقمه' },
  { to: '/about#faq', label: 'سوالات متداول' },
  { to: '/contact', label: 'تماس با ما' },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <Link to="/" className="brand footer-logo" aria-label="لقمه — صفحه اصلی">
          <span className="brand-text">
            لقمه<span className="brand-dot" aria-hidden="true">.</span>
          </span>
        </Link>
        <p className="footer-tag">
          لقمه؛ انتخابی دوست‌داشتنی برای روزهایی که دلت غذای خونگی می‌خواد.
        </p>

        <nav className="footer-links" aria-label="پیوندهای فوتر">
          {LINKS.map((l, i) => (
            <Fragment key={l.label}>
              <Link to={l.to}>{l.label}</Link>
              {i < LINKS.length - 1 && (
                <span className="sep" aria-hidden="true">
                  /
                </span>
              )}
            </Fragment>
          ))}
        </nav>

        <p className="footer-copy">© تمامی حقوق این وب‌سایت برای لقمه محفوظ است.</p>
        <p className="footer-note">
          این نسخه نمایشی است؛ سفارش‌ها ذخیره می‌شوند اما به آشپزخانه ارسال نمی‌گردند.
        </p>
      </div>
    </footer>
  );
}
