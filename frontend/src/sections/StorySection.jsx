import Reveal from '../components/Reveal.jsx';

export default function StorySection() {
  return (
    <section className="section story" aria-label="قصه لقمه">
      <div className="container story-grid">
        <Reveal className="story-media" delay={80}>
          <div className="story-main">
            <img src="/images/story-1.jpg" alt="آشپزخانه خانگی، لحظه پخت غذا" loading="lazy" />
          </div>
          <div className="story-side">
            <img src="/images/story-2.jpg" alt="میز صبحانه یا ناهار خانگی با بشقاب‌های تازه" loading="lazy" />
          </div>
        </Reveal>
        <Reveal className="story-text" delay={160}>
          <p className="section-label">قصه لقمه</p>
          <h2 className="section-title">غذای خوب، از توجه به جزئیات شروع می‌شه</h2>
          <p className="story-lead">
            از انتخاب غذا تا لحظه‌ای که سفارش به دستت می‌رسه، تجربه‌ای ساده، خوشمزه و قابل‌اعتماد باید
            در اولویت باشه.
          </p>
          <p className="story-lead">
            برای همین هر غذا رو با مواد اولیه تازه، حوصله و همون دستورهای آشنا می‌پزیم؛ از خورشت‌های
            معطر ایرانی تا غذاهای برنجی خوش‌عطر.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
