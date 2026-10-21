import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';
import { PhoneIcon } from './Icons.jsx';
import { useProducts } from '../context/ProductsContext.jsx';
import { faNum, formatPrice } from '../utils/format.js';

export default function Footer() {
  const { deliveryFee } = useProducts();
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo light />
          <p>لقمه؛ انتخابی دوست‌داشتنی برای روزهایی که دلت غذای خونگی می‌خواد.</p>
        </div>
        <nav className="footer-nav" aria-label="ناوبری فوتر">
          <h3>دسترسی سریع</h3>
          <ul>
            <li><Link to="/">صفحه اصلی</Link></li>
            <li><Link to="/menu">منوی غذا</Link></li>
            <li><Link to="/daily">غذاهای امروز</Link></li>
            <li><Link to="/specials">غذاهای ویژه</Link></li>
            <li><Link to="/about">درباره لقمه</Link></li>
            <li><Link to="/faq">سوالات متداول</Link></li>
            <li><Link to="/contact">تماس با ما</Link></li>
          </ul>
        </nav>
        <div className="footer-service">
          <h3>خدمات مشتریان</h3>
          <p className="footer-phone">
            <PhoneIcon />
            <a href="tel:+982191009100" dir="ltr">۰۲۱-۹۱۰۰ ۹۱۰۰</a>
          </p>
          <p>پرداخت در محل، هنگام تحویل سفارش</p>
          <p>هزینه ارسال: {formatPrice(deliveryFee)}</p>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>تمامی حقوق این وب‌سایت محفوظ است. © لقمه {faNum(1405)}</p>
        </div>
      </div>
    </footer>
  );
}
