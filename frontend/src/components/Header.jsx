import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from './Logo.jsx';
import { SearchIcon, UserIcon, CartIcon, BurgerIcon, CloseIcon } from './Icons.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { faNum } from '../utils/format.js';

const NAV_LINKS = [
  { to: '/', label: 'صفحه اصلی' },
  { to: '/menu', label: 'منوی غذا' },
  { to: '/daily', label: 'غذاهای امروز' },
  { to: '/specials', label: 'غذاهای ویژه' },
  { to: '/about', label: 'درباره لقمه' },
  { to: '/contact', label: 'تماس با ما' },
];

export default function Header({ onOpenCart, onOpenSearch }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useCart();
  const toast = useToast();
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', menuOpen);
    return () => document.body.classList.remove('no-scroll');
  }, [menuOpen]);

  const solid = scrolled || !isHome || menuOpen;

  return (
    <header className={`site-header ${solid ? 'is-solid' : ''}`}>
      <div className="container header-inner">
        <Link to="/" className="header-logo" aria-label="لقمه، صفحه اصلی">
          <Logo />
        </Link>
        <nav className="main-nav" aria-label="ناوبری اصلی">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <button type="button" className="icon-btn" aria-label="جستجو در منو" onClick={onOpenSearch}>
            <SearchIcon />
          </button>
          <button
            type="button"
            className="icon-btn header-login"
            aria-label="ورود به حساب کاربری"
            onClick={() => toast('ورود و ثبت‌نام آنلاین به‌زودی فعال می‌شود.', 'info')}
          >
            <UserIcon />
            <span className="header-login__label">ورود</span>
          </button>
          <button type="button" className="icon-btn cart-btn" aria-label={`سبد خرید، ${faNum(count)} قلم`} onClick={onOpenCart}>
            <CartIcon />
            {count > 0 ? <span className="cart-count">{faNum(count)}</span> : null}
          </button>
          <Link to="/menu" className="btn btn-primary btn-sm header-cta">
            سفارش غذا
          </Link>
          <button
            type="button"
            className="icon-btn hamburger"
            aria-label={menuOpen ? 'بستن منو' : 'باز کردن منو'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <CloseIcon /> : <BurgerIcon />}
          </button>
        </div>
      </div>
      <div className={`mobile-menu ${menuOpen ? 'is-open' : ''}`} id="mobile-menu">
        <nav aria-label="ناوبری موبایل">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'}>
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/faq">سوالات متداول</NavLink>
        </nav>
        <Link to="/menu" className="btn btn-primary">
          سفارش غذا
        </Link>
      </div>
    </header>
  );
}
