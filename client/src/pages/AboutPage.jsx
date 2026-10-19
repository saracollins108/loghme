import { useState } from 'react';
import { Link } from 'react-router-dom';
import { pageImages } from '../data/brandImages.js';
import Reveal from '../components/Reveal.jsx';
import SectionHeading from '../components/SectionHeading.jsx';

const FAQ = [
  {
    q: 'چطور از لقمه سفارش بدهم؟',
    a: 'از منوی غذا، غذاهای مورد علاقه‌ات را انتخاب و به سبد خرید اضافه کن؛ سپس اطلاعات تماس و آدرس را تکمیل و سفارش را ثبت کن. کد پیگیری سفارش برای پیگیری در اختیارت قرار می‌گیرد.',
  },
  {
    q: 'هزینه ارسال چقدر است؟',
    a: 'هزینه ارسال پیش از ثبت نهایی سفارش، شفاف در خلاصه سفارش نمایش داده می‌شود و برای سفارش‌های بالای حد مشخص، ارسال رایگان است.',
  },
  {
    q: 'آیا می‌توانم تعداد پرس را انتخاب کنم؟',
    a: 'بله؛ در صفحه هر غذا و در سبد خرید می‌توانی تعداد پرس را بین ۱ تا ۲۰ تغییر دهی و مبلغ، به‌صورت خودکار به‌روز می‌شود.',
  },
  {
    q: 'از موجود بودن غذاها چطور مطمئن شوم؟',
    a: 'وضعیت موجودی هر غذا در منو و در صفحه همان غذا مشخص است؛ غذاهای ناموجود قابل افزودن به سبد نیستند.',
  },
];

export default function AboutPage() {
  const [open, setOpen] = useState(0);

  return (
    <div className="about-page">
      <section className="page-hero">
        <div className="container">
          <span className="section-label light">درباره لقمه</span>
          <h1>قصه لقمه، قصه غذای خونگیه</h1>
          <p>
            در لقمه، باور داریم غذای خوب فقط یک وعده نیست؛ بخشی از حس خوب زندگیه. برای همین به
            کیفیت مواد اولیه، طعم غذا و جزئیاتی که یک غذای ساده رو دوست‌داشتنی می‌کنن، اهمیت
            می‌دیم.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container story-grid">
          <Reveal className="story-text">
            <span className="section-label">قصه لقمه</span>
            <h2 className="section-title">غذای خوب، از توجه به جزئیات شروع می‌شه</h2>
            <p>
              از انتخاب غذا تا لحظه‌ای که سفارش به دستت می‌رسه، تجربه‌ای ساده، خوشمزه و
              قابل‌اعتماد باید در اولویت باشه.
            </p>
            <p>
              هر روز منو را تازه می‌چینیم، مواد را با دقت انتخاب می‌کنیم و غذا را همان‌طور آماده
              می‌کنیم که برای خانواده‌مان آماده می‌کنیم.
            </p>
            <Link to="/menu" className="btn btn-primary">
              دیدن منوی غذا
            </Link>
          </Reveal>
          <Reveal className="story-media" delay={100}>
            <img className="story-img-lg" src={pageImages.storyPrimary} alt="غذای خانگی سرو شده" loading="lazy" width="520" height="640" />
            <div className="story-col">
              <img src={pageImages.storySecondary} alt="طبخ غذا در تابه" loading="lazy" width="360" height="300" />
              <img src={pageImages.aboutSecondary} alt="آشپزخانه و آماده‌سازی مواد اولیه" loading="lazy" width="360" height="300" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section faq" id="faq" aria-labelledby="faq-title">
        <div className="container faq-inner">
          <SectionHeading
            label="سوالات متداول"
            title="پاسخ چند سوال پرتکرار"
            sub="اگر پاسخ سوالت اینجا نبود، از صفحه تماس با ما برایمان بنویس."
          />
          <div className="faq-list">
            {FAQ.map((item, i) => (
              <Reveal key={item.q} delay={i * 60}>
                <div className={`faq-item${open === i ? ' open' : ''}`}>
                  <button
                    className="faq-question"
                    aria-expanded={open === i}
                    onClick={() => setOpen(open === i ? -1 : i)}
                  >
                    {item.q}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <path d={open === i ? 'M5 12h14' : 'M12 5v14M5 12h14'} />
                    </svg>
                  </button>
                  {open === i && <p className="faq-answer">{item.a}</p>}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
