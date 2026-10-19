import { Link, useLocation, useParams } from 'react-router-dom';
import { api, useApi } from '../api.js';
import { formatPrice, faDate } from '../format.js';

export default function OrderPage() {
  const { code } = useParams();
  const location = useLocation();
  const passed = location.state?.order;

  const { data: fetched, loading, error } = useApi(
    () => api.order(code),
    passed ? [] : [code]
  );
  const order = passed || fetched;

  return (
    <div className="order-page">
      <div className="container page-pad">
        {loading && !order && <p className="loading-note">در حال بارگذاری سفارش…</p>}

        {error && !order && (
          <div className="empty-state">
            <h2>سفارش پیدا نشد</h2>
            <p>کد پیگیری را بررسی کن یا با پشتیبانی تماس بگیر.</p>
            <Link to="/menu" className="btn btn-primary">
              بازگشت به منو
            </Link>
          </div>
        )}

        {order && (
          <div className="order-success">
            <div className="success-badge" aria-hidden="true">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h1>سفارش شما ثبت شد!</h1>
            <p className="order-code">
              کد پیگیری: <strong>{order.code}</strong>
            </p>
            <p className="order-date">تاریخ ثبت: {faDate(order.createdAt)}</p>

            <div className="order-card">
              <ul>
                {order.items.map((it) => (
                  <li key={it.productId}>
                    <img src={it.image} alt="" width="52" height="52" loading="lazy" />
                    <div>
                      <span>{it.name}</span>
                      <span className="sum-qty">{it.qty.toLocaleString('fa-IR')} پرس × {formatPrice(it.unitPrice)}</span>
                    </div>
                    <strong>{formatPrice(it.lineTotal)}</strong>
                  </li>
                ))}
              </ul>
              <div className="summary-rows">
                <div>
                  <span>جمع غذاها</span>
                  <span>{formatPrice(order.subtotal)} تومان</span>
                </div>
                <div>
                  <span>هزینه ارسال</span>
                  <span>{order.deliveryFee === 0 ? 'رایگان' : `${formatPrice(order.deliveryFee)} تومان`}</span>
                </div>
                <div className="summary-total">
                  <span>مبلغ نهایی</span>
                  <strong>{formatPrice(order.total)} تومان</strong>
                </div>
              </div>
              <div className="order-customer">
                <h3>اطلاعات تحویل</h3>
                <p>
                  {order.customer.name} — <span dir="ltr">{order.customer.phone}</span>
                </p>
                <p>{order.customer.address}</p>
                {order.customer.note && <p className="order-note">یادداشت: {order.customer.note}</p>}
              </div>
            </div>

            <p className="order-demo-note">
              این نسخه نمایشی است: سفارش با همین کد پیگیری ذخیره شده اما به آشپزخانه ارسال و
              پرداخت آنلاین هنوز فعال نیست.
            </p>

            <div className="order-actions">
              <Link to="/menu" className="btn btn-primary">
                ادامه سفارش
              </Link>
              <Link to="/" className="btn btn-outline-dark">
                بازگشت به صفحه اصلی
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
