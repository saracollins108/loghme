import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';

export default function Hero() {
  return (
    <section className="hero" aria-label="معرفی لقمه">
      <img
        className="hero-bg"
        src="/images/hero.jpg"
        alt="بشقاب غذای خانگی ایرانی با برنج و ادویه‌های تازه"
        fetchpriority="high"
      />
      <div className="hero-overlay" aria-hidden="true" />
      <div className="container hero-content">
        <Reveal as="p" className="hero-eyebrow">
          غذای خانگی، تازه و گرم
        </Reveal>
        <Reveal as="h1" className="hero-title" delay={80}>
          طعم خونه،
          <br />
          درست همین‌جاست
        </Reveal>
        <Reveal as="p" className="hero-sub" delay={160}>
          غذای خونگی تازه، با عطر و طعمی آشنا؛ برای لحظه‌هایی که دلت یه غذای درست‌وحسابی می‌خواد.
        </Reveal>
        <Reveal className="hero-actions" delay={240}>
          <Link to="/menu" className="btn btn-primary btn-lg">
            دیدن منوی غذا
          </Link>
          <Link to="/daily" className="btn btn-ghost-light btn-lg">
            سفارش غذای امروز
          </Link>
        </Reveal>
      </div>
      <Reveal as="p" className="hero-stamp" delay={320}>
        ۱۰۰٪
        <span>خونگی و تازه</span>
      </Reveal>
      <svg className="hero-wave" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M0,46 C220,88 460,4 720,28 C980,52 1220,18 1440,50 L1440,90 L0,90 Z"
          fill="var(--ivory)"
        />
      </svg>
    </section>
  );
}
