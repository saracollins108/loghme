import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

const NAV = [
  { to: '/', label: 'صفحه اصلی', end: true },
  { to: '/menu', label: 'منوی غذا' },
  { to: '/menu?daily=1', label: 'غذاهای امروز' },
  { to: '/menu?featured=1', label: 'غذاهای ویژه' },
  { to: '/about', label: 'درباره لقمه' },
  { to: '/contact', label: 'تماس با ما' },
];

export default function Header() {
  const { count, setCartOpen, setSearchOpen, notify } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while the menu overlay is open; close it on navigation or Esc.
  useEffect(() => {
    document.body.classList.toggle('no-scroll', menuOpen);
    return () => document.body.classList.remove('no-scroll');
  }, [menuOpen]);
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.search]);
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const isActive = (item) => {
    if (item.end) return location.pathname === '/';
    const [path, query] = item.to.split('?');
    if (location.pathname !== path) return false;
    if (!query) return true;
    return new URLSearchParams(location.search).get(query.split('=')[0]) === query.split('=')[1];
  };

  return (
    <header className={`site-header${scrolled || menuOpen ? ' scrolled' : ''}`}>
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label="لقمه — صفحه اصلی">
          <span className="brand-text">
            لقمه<span className="brand-dot" aria-hidden="true">.</span>
          </span>
          <span className="brand-tag">غذای خانگی، تازه و داغ</span>
        </Link>

        <div className="header-actions">
          <button
            className="cart-pill"
            aria-label={`سبد خرید${count ? ` — ${count} آیتم` : ''}`}
            onClick={() => setCartOpen(true)}
          >
            <CartIcon />
            <span className="cart-pill-label">سبد خرید</span>
            {count > 0 && (
              <span className="cart-pill-count" aria-hidden="true">
                {count.toLocaleString('fa-IR')}
              </span>
            )}
          </button>
          <button
            className="btn btn-primary btn-sm login-btn"
            onClick={() => notify('ورود آنلاین در نسخه نمایشی فعال نیست؛ سفارش بدون ثبت‌نام انجام می‌شود.')}
          >
            ورود
          </button>
          <button
            className="icon-btn hamburger"
            aria-label={menuOpen ? 'بستن منو' : 'باز کردن منو'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <nav aria-label="ناوبری اصلی">
          {NAV.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={`mobile-link${isActive(item) ? ' active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          className="mobile-search"
          onClick={() => {
            setMenuOpen(false);
            setSearchOpen(true);
          }}
        >
          <SearchIcon />
          <span>جستجو در منو</span>
        </button>
        <Link to="/menu" className="btn btn-primary mobile-cta">
          سفارش غذا
        </Link>
        <button
          className="mobile-login"
          onClick={() => {
            setMenuOpen(false);
            notify('ورود آنلاین در نسخه نمایشی فعال نیست؛ سفارش بدون ثبت‌نام انجام می‌شود.');
          }}
        >
          ورود به حساب
        </button>
      </div>
    </header>
  );
}

export const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.5" y2="16.5" />
  </svg>
);

export const CartIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 7h12l-1.2 11a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8L6 7Z" />
    <path d="M9 9V6a3 3 0 0 1 6 0v3" />
  </svg>
);

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
    <line x1="4" y1="7" x2="20" y2="7" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="17" x2="20" y2="17" />
  </svg>
);

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
);
