import SectionHeading from '../components/SectionHeading.jsx';
import Reveal from '../components/Reveal.jsx';
import { LeafIcon, BowlIcon, ClockIcon, BasketIcon } from '../components/Icons.jsx';

const ITEMS = [
  {
    icon: LeafIcon,
    title: 'مواد اولیه تازه',
    text: 'هر روز با سبزی، گوشت و ادویه‌های تازه آشپزی می‌کنیم؛ نه انبارِ دیروز.',
  },
  {
    icon: BowlIcon,
    title: 'طعم آشنای خونگی',
    text: 'غذاها با دستورهای ساده و خانگی پخته می‌شن؛ همون طعمی که انتظارش رو داری.',
  },
  {
    icon: BasketIcon,
    title: 'سفارش آسان و شفاف',
    text: 'منو، قیمت و موجودی رو قبل از سفارش می‌بینی؛ بدون سورپرایز و ابهام.',
  },
  {
    icon: ClockIcon,
    title: 'تحویل در سریع‌ترین زمان',
    text: 'سفارشت تازه و گرم، در سریع‌ترین زمان ممکن به دستت می‌رسه.',
  },
];

export default function WhyUs() {
  return (
    <section className="section why" aria-label="چرا لقمه">
      <div className="container">
        <SectionHeading
          label="چرا لقمه"
          title="یه انتخاب راحت برای یه وعده مطمئن"
          subtitle="ما تجربه سفارش غذای خونگی رو ساده، شفاف و دوست‌داشتنی کردیم."
        />
        <div className="why-grid">
          {ITEMS.map((item, index) => (
            <Reveal className="why-item" key={item.title} delay={index * 90}>
              <span className="why-icon">
                <item.icon />
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
