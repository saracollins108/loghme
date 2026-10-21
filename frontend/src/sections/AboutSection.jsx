import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import { ArrowIcon } from '../components/Icons.jsx';

export default function AboutSection() {
  return (
    <section className="section about" id="about">
      <div className="container about-grid">
        <Reveal className="about-text">
          <p className="section-label">درباره لقمه</p>
          <h2 className="section-title">قصه لقمه، قصه غذای خونگیه</h2>
          <p className="about-lead">
            در لقمه، باور داریم غذای خوب فقط یک وعده نیست؛ بخشی از حس خوب زندگیه. برای همین به کیفیت
            مواد اولیه، طعم غذا و جزئیاتی که یک غذای ساده رو دوست‌داشتنی می‌کنن، اهمیت می‌دیم.
          </p>
          <Link to="/about" className="btn btn-outline">
            بیشتر درباره لقمه
          </Link>
        </Reveal>
        <Reveal className="about-media" delay={120}>
          <div className="about-main">
            <img src="/images/about-main.jpg" alt="غذای خانگی تازه روی میز شام" loading="lazy" />
          </div>
          <div className="about-side">
            <img src="/images/about-side.jpg" alt="مواد اولیه تازه روی تخته آشپزخانه" loading="lazy" />
          </div>
          <Link to="/about" className="about-arrow" aria-label="بیشتر درباره لقمه">
            <ArrowIcon />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
