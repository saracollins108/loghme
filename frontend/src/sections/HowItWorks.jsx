import Reveal from '../components/Reveal.jsx';
import { faNum } from '../utils/format.js';

const STEPS = [
  {
    title: 'انتخاب غذا',
    text: 'از منوی لقمه، غذای موردعلاقه‌ات و تعداد پرس‌ها رو انتخاب کن.',
  },
  {
    title: 'ثبت سفارش',
    text: 'اطلاعات تماس و آدرس رو وارد کن؛ سفارشت در سیستم لقمه ثبت می‌شه.',
  },
  {
    title: 'تحویل در محل',
    text: 'سفارش تازه و گرم به آدرس تو می‌رسه و هزینه رو هنگام تحویل پرداخت می‌کنی.',
  },
];

export default function HowItWorks() {
  return (
    <section className="section how" aria-label="چطور سفارش بدهیم">
      <div className="container">
        <Reveal className="section-heading section-heading--center">
          <p className="section-label">سفارش آنلاین غذا</p>
          <h2 className="section-title">تجربه‌ای راحت از سفارش غذای خونگی</h2>
        </Reveal>
        <ol className="how-steps">
          {STEPS.map((step, index) => (
            <Reveal as="li" className="how-step" key={step.title} delay={index * 100}>
              <span className="how-number">{faNum(index + 1).padStart(2, '۰')}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
