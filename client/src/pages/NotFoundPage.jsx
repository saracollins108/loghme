import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container page-pad empty-state">
      <h2>این صفحه پیدا نشد</h2>
      <p>شاید آدرس را اشتباه وارد کرده‌ای یا صفحه جابه‌جا شده است.</p>
      <Link to="/" className="btn btn-primary">
        بازگشت به صفحه اصلی
      </Link>
    </div>
  );
}
