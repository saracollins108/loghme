import { Link } from 'react-router-dom';
import SectionHeading from '../components/SectionHeading.jsx';
import Reveal from '../components/Reveal.jsx';
import { useProducts } from '../context/ProductsContext.jsx';
import { faNum } from '../utils/format.js';

export default function CategoriesSection() {
  const { products, categories } = useProducts();

  return (
    <section className="section categories" aria-label="دسته‌بندی غذاها">
      <div className="container">
        <SectionHeading
          label="منوی لقمه"
          title="دنبال چه غذایی هستی؟"
          subtitle="از خورشت‌های ایرانی تا دورچین‌های خوشمزه؛ دسته‌بندی مورد علاقه‌ات رو انتخاب کن."
        />
        <Reveal className="category-cloud" delay={100}>
          {categories.map((category) => {
            const count = products.filter((meal) => meal.categoryId === category.id).length;
            return (
              <Link key={category.id} to={`/menu?cat=${category.id}`} className="category-chip">
                {category.name}
                <span className="category-count">{faNum(count)}</span>
              </Link>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
