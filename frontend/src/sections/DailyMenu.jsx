import { Link } from 'react-router-dom';
import SectionHeading from '../components/SectionHeading.jsx';
import MealCard from '../components/MealCard.jsx';
import Reveal from '../components/Reveal.jsx';
import { useProducts } from '../context/ProductsContext.jsx';

export default function DailyMenu() {
  const { products, loading, error } = useProducts();
  const daily = products.filter((meal) => meal.daily).slice(0, 8);

  return (
    <section className="section daily" aria-label="غذاهای امروز">
      <div className="container">
        <SectionHeading
          label="آشپزخونه امروز"
          title="غذاهای امروز"
          subtitle="برنامه امروز آشپزخونه لقمه؛ هر روز با انتخاب‌های تازه و خونگی."
        />
        {error ? (
          <p className="load-note">{error}</p>
        ) : loading ? (
          <div className="grid-skeleton" aria-hidden="true">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="card-skeleton" />
            ))}
          </div>
        ) : daily.length === 0 ? (
          <p className="load-note">امروز برنامه‌ای ثبت نشده؛ منوی کامل رو ببین.</p>
        ) : (
          <Reveal className="daily-grid" delay={100}>
            {daily.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </Reveal>
        )}
        <Reveal className="section-more">
          <Link to="/menu" className="btn btn-outline">
            مشاهده منوی کامل
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
