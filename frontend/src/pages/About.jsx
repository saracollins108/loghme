import { Link } from 'react-router-dom';
import SectionHeading from '../components/SectionHeading.jsx';
import Reveal from '../components/Reveal.jsx';
import HowItWorks from '../sections/HowItWorks.jsx';
import CtaBanner from '../sections/CtaBanner.jsx';

export default function About() {
  return (
    <div className="page about-page">
      <div className="container">
        <header className="page-hero">
          <p className="section-label">درباره لقمه</p>
          <h1>قصه لقمه، قصه غذای خونگیه</h1>
          <p>
            در لقمه، باور داریم غذای خوب فقط یک وعده نیست؛ بخشی از حس خوب زندگیه. برای همین به کیفیت
            مواد اولیه، طعم غذا و جزئیاتی که یک غذای ساده رو دوست‌داشتنی می‌کنن، اهمیت می‌دیم.
          </p>
        </header>
        <Reveal className="about-page-media">
          <img src="/images/story-2.jpg" alt="میز غذای خانگی با بشقاب‌های تازه" loading="lazy" />
          <img src="/images/story-1.jpg" alt="آشپزخانه خانگی، لحظه پخت غذا" loading="lazy" />
        </Reveal>
        <Reveal className="about-page-story">
          <p className="section-label">قصه لقمه</p>
          <h2 className="section-title">غذای خوب، از توجه به جزئیات شروع می‌شه</h2>
          <p>
            از انتخاب غذا تا لحظه‌ای که سفارش به دستت می‌رسه، تجربه‌ای ساده، خوشمزه و قابل‌اعتماد باید
            در اولویت باشه. هر غذا رو با مواد اولیه تازه، حوصله و همون دستورهای آشنا می‌پزیم؛ از
            خورشت‌های معطر ایرانی تا غذاهای برنجی خوش‌عطر.
          </p>
          <p>
            باور داریم سفارش آنلاین غذا نباید پیچیده باشه؛ قیمت و موجودی رو قبل از سفارش می‌بینی،
            سفارشت شفاف ثبت می‌شه و هزینه رو هنگام تحویل پرداخت می‌کنی.
          </p>
        </Reveal>
      </div>
      <HowItWorks />
      <div className="container">
        <SectionHeading
          label="سفارش آنلاین غذا"
          title="هر چیزی که برای یه سفارش راحت لازم داری"
          subtitle="مشاهده منوی روز، انتخاب تعداد پرس، اطلاع از مواد تشکیل‌دهنده و دیدن قیمت پیش از سفارش؛ همه در یک جای ساده."
        />
        <Reveal className="category-cloud">
          <Link to="/menu" className="category-chip">منوی غذا</Link>
          <Link to="/daily" className="category-chip">غذاهای امروز</Link>
          <Link to="/specials" className="category-chip">غذاهای ویژه</Link>
          <Link to="/faq" className="category-chip">سوالات متداول</Link>
        </Reveal>
      </div>
      <CtaBanner />
    </div>
  );
}
