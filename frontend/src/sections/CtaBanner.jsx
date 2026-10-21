import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import { PlateIcon } from '../components/Icons.jsx';

export default function CtaBanner() {
  return (
    <section className="cta" aria-label="سفارش غذا">
      <div className="container">
        <Reveal className="cta-box">
          <span className="cta-icon" aria-hidden="true">
            <PlateIcon width="58" height="58" />
          </span>
          <h2>برای یه وعده خوشمزه آماده‌ای؟</h2>
          <p>منوی لقمه رو ببین و غذای مورد علاقه‌ات رو برای وعده بعدی انتخاب کن.</p>
          <Link to="/menu" className="btn btn-primary btn-lg">
            مشاهده منوی غذا
            <span aria-hidden="true">←</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
