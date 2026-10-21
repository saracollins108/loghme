import { Link } from 'react-router-dom';
import SectionHeading from '../components/SectionHeading.jsx';
import MealCard from '../components/MealCard.jsx';
import MealCarousel from '../components/MealCarousel.jsx';
import Reveal from '../components/Reveal.jsx';
import { useProducts } from '../context/ProductsContext.jsx';

export default function FeaturedMeals() {
  const { products, loading, error } = useProducts();
  const featured = products.filter((meal) => meal.featured && meal.available).slice(0, 8);

  return (
    <section className="section featured">
      <div className="container">
        <SectionHeading
          label="پیشنهاد لقمه"
          title="غذاهایی که دلت می‌خواد"
          subtitle="از طعم‌های آشنای ایرانی تا انتخاب‌های خوشمزه روز؛ غذای مورد علاقه‌ات رو پیدا کن."
        />
        <Reveal className="featured-carousel" delay={100}>
          {error ? (
            <p className="load-note">{error}</p>
          ) : loading ? (
            <div className="carousel-track featured-track-skeleton" aria-hidden="true">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="card-skeleton" />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <p className="load-note">فعلاً غذای پیشنهادی ثبت نشده؛ به‌زودی برگرد.</p>
          ) : (
            <MealCarousel ariaLabel="غذاهای پیشنهادی لقمه">
              {featured.map((meal, index) => (
                <MealCard key={meal.id} meal={meal} variant="featured" tintIndex={index} />
              ))}
            </MealCarousel>
          )}
        </Reveal>
        <Reveal className="section-more">
          <Link to="/menu" className="btn btn-outline">
            مشاهده همه غذاها
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
