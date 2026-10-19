import { Link } from 'react-router-dom';
import { api, useApi } from '../api.js';
import { formatPrice } from '../format.js';
import { pageImages } from '../data/brandImages.js';
import SectionHeading from '../components/SectionHeading.jsx';
import Reveal from '../components/Reveal.jsx';
import FeaturedCarousel from '../components/FeaturedCarousel.jsx';
import QuickMealCard from '../components/QuickMealCard.jsx';

const CATEGORIES = [
  { id: 'irani', name: 'غذاهای ایرانی', image: pageImages.catIrani },
  { id: 'stews', name: 'خورشت‌های ایرانی', image: pageImages.catStews },
  { id: 'rice', name: 'غذاهای برنجی', image: pageImages.catRice },
  { id: 'daily', name: 'غذاهای روز', image: pageImages.catDaily },
  { id: 'light', name: 'غذاهای سبک', image: pageImages.catLight },
  { id: 'sides', name: 'پیش‌غذا و دورچین', image: pageImages.catSides },
];

const WHY = [
  {
    title: 'مواد اولیه تازه',
    text: 'برای هر وعده از سبزیجات، گوشت و لبنیات تازه استفاده می‌کنیم؛ نه چیز دیگری.',
    icon: 'leaf',
  },
  {
    title: 'آشپزی خانگی',
    text: 'غذاها در آشپزخانه‌ای کوچک و با حوصله طبخ می‌شوند؛ همان‌طور که در خانه طبخ می‌شود.',
    icon: 'pot',
  },
  {
    title: 'طعم آشنا و اصیل',
    text: 'دستورهای ساده و ماندگار ایرانی؛ طعمی که با چشیدنش یاد خونه می‌افتی.',
    icon: 'flame',
  },
  {
    title: 'قیمت شفاف',
    text: 'قیمت و تعداد پرس هر غذا را قبل از سفارش می‌بینی؛ بدون هزینه پنهان.',
    icon: 'tag',
  },
];

const STEPS = [
  { num: '۱', title: 'انتخاب غذا', text: 'از منوی غذا، غذای مورد علاقه‌ات را پیدا کن.' },
  { num: '۲', title: 'افزودن به سبد', text: 'تعداد پرس را انتخاب کن و به سبد خرید اضافه کن.' },
  { num: '۳', title: 'ثبت سفارش', text: 'اطلاعات تماس و آدرس را تکمیل و سفارش را ثبت کن.' },
  { num: '۴', title: 'تحویل سفارش', text: 'سفارش تازه و داغ به دستت می‌رسد؛ با کد پیگیری مشخص.' },
];

const Wave = ({ fill, className }) => (
  <svg
    className={className}
    viewBox="0 0 1440 90"
    preserveAspectRatio="none"
    aria-hidden="true"
    style={{ fill }}
  >
    <path d="M0,48 C240,90 480,10 720,42 C960,74 1200,20 1440,52 L1440,90 L0,90 Z" />
  </svg>
);

export default function HomePage() {
  const { data: featured } = useApi(() => api.products({ featured: '1' }), []);
  const { data: daily } = useApi(() => api.products({ daily: '1' }), []);
  const hero = featured?.[0];

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            {hero ? (
              <>
                <span className="hero-script">غذای ویژه امروز</span>
                <h1 className="hero-title">{hero.name}</h1>
                <div className="hero-price-row">
                  <span
                    className="scribble-price"
                    role="img"
                    aria-label={`قیمت ${formatPrice(hero.discountPrice ?? hero.price)} تومان`}
                  >
                    <svg viewBox="0 0 120 120" aria-hidden="true">
                      <ellipse
                        cx="60"
                        cy="60"
                        rx="53"
                        ry="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        transform="rotate(-9 60 60)"
                      />
                      <ellipse
                        cx="60"
                        cy="60"
                        rx="50"
                        ry="42"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        opacity="0.5"
                        transform="rotate(7 60 60)"
                      />
                    </svg>
                    <span className="scribble-label">قیمت</span>
                    <strong>{formatPrice(hero.discountPrice ?? hero.price)}</strong>
                    {hero.originalPrice && <del>{formatPrice(hero.originalPrice)}</del>}
                  </span>
                  <div className="hero-meta">
                    <span className={`availability ${hero.available ? 'is-available' : 'is-unavailable'}`}>
                      <span className="dot" aria-hidden="true" />
                      {hero.available ? 'امروز موجود' : 'امروز ناموجود'}
                    </span>
                    <span className="hero-serving">{hero.serving}</span>
                  </div>
                </div>
                <div className="hero-desc-card">
                  <p>{hero.longDescription || hero.description}</p>
                </div>
                <div className="hero-cta">
                  <Link to={`/product/${hero.slug}`} className="btn btn-primary btn-lg">
                    سفارش غذا
                  </Link>
                  <Link to="/menu" className="btn btn-outline-orange btn-lg">
                    دیدن منوی غذا
                  </Link>
                </div>
              </>
            ) : (
              <>
                <span className="hero-script">غذای خانگی، تازه و داغ</span>
                <h1 className="hero-title">طعم خونه، درست همین‌جاست</h1>
                <p className="hero-sub">
                  غذای خونگی تازه، با عطر و طعمی آشنا؛ برای لحظه‌هایی که دلت یه غذای
                  درست‌وحسابی می‌خواد.
                </p>
                <div className="hero-cta">
                  <Link to="/menu" className="btn btn-primary btn-lg">
                    دیدن منوی غذا
                  </Link>
                  <Link to="/menu?daily=1" className="btn btn-outline-orange btn-lg">
                    سفارش غذای امروز
                  </Link>
                </div>
              </>
            )}
          </div>
          <div className="hero-figure">
            <img
              src={hero ? hero.image : pageImages.hero}
              alt={hero ? hero.name : 'یک وعده غذای خانگی تازه و داغ روی میز'}
              fetchpriority="high"
              width="520"
              height="520"
            />
          </div>
        </div>
        <Wave fill="var(--white)" className="hero-wave" />
      </section>

      {/* ---------- About ---------- */}
      <section className="section about" aria-labelledby="about-title">
        <div className="container about-grid">
          <Reveal className="about-text">
            <span className="section-label">درباره لقمه</span>
            <h2 id="about-title" className="section-title">
              قصه لقمه، قصه غذای خونگیه
            </h2>
            <p className="about-body">
              در لقمه، باور داریم غذای خوب فقط یک وعده نیست؛ بخشی از حس خوب زندگیه. برای همین به
              کیفیت مواد اولیه، طعم غذا و جزئیاتی که یک غذای ساده رو دوست‌داشتنی می‌کنن، اهمیت
              می‌دیم.
            </p>
            <Link to="/about" className="btn btn-primary about-cta">
              بیشتر درباره لقمه
            </Link>
          </Reveal>

          <Reveal className="about-media" delay={120}>
            <img
              className="img-main"
              src={pageImages.aboutMain}
              alt="میز شام با غذاهای خانگی آماده شده"
              loading="lazy"
              width="640"
              height="480"
            />
            <img
              className="img-secondary"
              src={pageImages.aboutSecondary}
              alt="آشپزخانه و آماده‌سازی مواد اولیه"
              loading="lazy"
              width="420"
              height="480"
            />
            <Link to="/about" className="about-arrow" aria-label="بیشتر درباره لقمه">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5" />
                <path d="M11 18l-6-6 6-6" />
              </svg>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------- Featured meals ---------- */}
      <section className="section featured" aria-labelledby="featured-title">
        <div className="container">
          <SectionHeading
            label="پیشنهاد لقمه"
            title="غذاهایی که دلت می‌خواد"
            sub="از طعم‌های آشنای ایرانی تا انتخاب‌های خوشمزه روز؛ غذای مورد علاقه‌ات رو پیدا کن."
          />
          {featured && featured.length > 0 ? (
            <FeaturedCarousel products={featured} />
          ) : (
            <p className="loading-note">در حال بارگذاری غذاهای ویژه…</p>
          )}
        </div>
        <Wave fill="var(--page)" className="section-wave" />
      </section>

      {/* ---------- Categories ---------- */}
      <section className="section categories" aria-labelledby="categories-title">
        <div className="container">
          <SectionHeading
            label="منوی لقمه"
            title="چه غذایی حالتو خوب می‌کنه؟"
            sub="دسته‌بندی مورد علاقه‌ات را انتخاب کن و از منوی همان دسته شروع کن."
          />
          <div className="category-grid">
            {CATEGORIES.map((c, i) => (
              <Reveal key={c.id} delay={i * 70}>
                <Link to={`/menu?category=${c.id}`} className="category-tile">
                  <img src={c.image} alt="" loading="lazy" width="300" height="200" />
                  <span className="category-name">{c.name}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Daily menu ---------- */}
      <section className="section daily" aria-labelledby="daily-title">
        <div className="container">
          <SectionHeading
            label="منوی امروز"
            title="غذاهای امروز لقمه"
            sub="امروز این غذاها برای شما پخته شده؛ تا پایان موجودی."
          />
          <div className="daily-grid">
            {(daily || []).map((p) => (
              <QuickMealCard key={p.id} product={p} />
            ))}
            {!daily && <p className="loading-note">در حال بارگذاری منوی امروز…</p>}
            {daily && daily.length === 0 && (
              <p className="loading-note">امروز منوی ویژه‌ای نداریم؛ اما منوی کامل در دسترس است.</p>
            )}
          </div>
          <div className="daily-more">
            <Link to="/menu?daily=1" className="btn btn-outline-dark">
              مشاهده غذاهای امروز
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Why choose ---------- */}
      <section className="section why" aria-labelledby="why-title">
        <div className="container">
          <SectionHeading
            label="چرا لقمه"
            title="تجربه‌ای راحت از سفارش غذای خونگی"
            sub="هر چیزی که برای یک سفارش ساده و مطمئن لازم داری، یک‌جا جمع شده."
          />
          <div className="why-grid">
            {WHY.map((w, i) => (
              <Reveal key={w.title} className="why-item" delay={i * 80}>
                <span className="why-icon" aria-hidden="true">
                  <WhyIcon name={w.icon} />
                </span>
                <h3>{w.title}</h3>
                <p>{w.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Brand story ---------- */}
      <section className="section story" aria-labelledby="story-title">
        <div className="container story-grid">
          <Reveal className="story-text">
            <span className="section-label">قصه لقمه</span>
            <h2 id="story-title" className="section-title">
              غذای خوب، از توجه به جزئیات شروع می‌شه
            </h2>
            <p>
              از انتخاب غذا تا لحظه‌ای که سفارش به دستت می‌رسه، تجربه‌ای ساده، خوشمزه و
              قابل‌اعتماد باید در اولویت باشه.
            </p>
            <p>
              ما در لقمه هر روز منو را تازه می‌چینیم، مواد را با دقت انتخاب می‌کنیم و غذا را
              همان‌طور آماده می‌کنیم که برای خانواده‌مان آماده می‌کنیم.
            </p>
            <Link to="/about" className="btn btn-outline-dark">
              ادامه قصه لقمه
            </Link>
          </Reveal>
          <Reveal className="story-media" delay={100}>
            <img className="story-img-lg" src={pageImages.storyPrimary} alt="غذای خانگی سرو شده در ظرف زیبا" loading="lazy" width="520" height="640" />
            <div className="story-col">
              <img src={pageImages.storySecondary} alt="طبخ غذا در تابه" loading="lazy" width="360" height="300" />
              <img src={pageImages.storyTertiary} alt="سبزیجات تازه و مواد اولیه" loading="lazy" width="360" height="300" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- How ordering works ---------- */}
      <section className="section steps" aria-labelledby="steps-title">
        <div className="container">
          <SectionHeading
            label="سفارش در لقمه"
            title="از منو تا میز شام، چهار قدم"
            sub="سفارش دادن از لقمه ساده است؛ همین چند قدم کافی است."
          />
          <div className="steps-grid">
            {STEPS.map((s, i) => (
              <Reveal key={s.num} className="step" delay={i * 80}>
                <span className="step-num" aria-hidden="true">{s.num}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="section cta" aria-labelledby="cta-title">
        <div className="container cta-inner">
          <img className="cta-img" src={pageImages.cta} alt="" loading="lazy" width="120" height="120" />
          <h2 id="cta-title">برای یه وعده خوشمزه آماده‌ای؟</h2>
          <p>منوی لقمه رو ببین و غذای مورد علاقه‌ات رو برای وعده بعدی انتخاب کن.</p>
          <Link to="/menu" className="btn btn-primary btn-lg">
            مشاهده منوی غذا ←
          </Link>
        </div>
      </section>
    </>
  );
}

function WhyIcon({ name }) {
  const common = {
    width: 26,
    height: 26,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };
  switch (name) {
    case 'leaf':
      return (
        <svg {...common}>
          <path d="M5 19c0-8 5-13 14-14 1 9-4 15-11 15-1.2 0-2.2-.3-3-1Z" />
          <path d="M5 19c3-4 6-7 10-9" />
        </svg>
      );
    case 'pot':
      return (
        <svg {...common}>
          <path d="M4 10h16v2a7 7 0 0 1-7 7h-2a7 7 0 0 1-7-7v-2Z" />
          <path d="M8 10c0-2 1.5-3.5 4-3.5S16 8 16 10" />
          <path d="M2 13h2m16 0h2" />
        </svg>
      );
    case 'flame':
      return (
        <svg {...common}>
          <path d="M12 3c2 3 6 5.5 6 10a6 6 0 0 1-12 0c0-2 1-3.5 2-5 0 2 1 3 2.5 3C10 8 10.5 5 12 3Z" />
        </svg>
      );
    case 'tag':
      return (
        <svg {...common}>
          <path d="M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9-9-9Z" />
          <circle cx="8" cy="8" r="1.4" />
        </svg>
      );
    default:
      return null;
  }
}
