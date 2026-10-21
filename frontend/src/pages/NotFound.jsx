import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page notfound-page">
      <div className="container">
        <div className="menu-empty">
          <h1>۴۰۴</h1>
          <h2>این صفحه پیدا نشد</h2>
          <p>به‌نظر می‌رسه مسیر اشتباهه؛ بیا از اول شروع کنیم.</p>
          <Link to="/" className="btn btn-primary">
            صفحه اصلی
          </Link>
        </div>
      </div>
    </div>
  );
}
