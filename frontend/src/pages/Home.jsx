import Hero from '../sections/Hero.jsx';
import AboutSection from '../sections/AboutSection.jsx';
import FeaturedMeals from '../sections/FeaturedMeals.jsx';
import CategoriesSection from '../sections/CategoriesSection.jsx';
import DailyMenu from '../sections/DailyMenu.jsx';
import WhyUs from '../sections/WhyUs.jsx';
import StorySection from '../sections/StorySection.jsx';
import HowItWorks from '../sections/HowItWorks.jsx';
import CtaBanner from '../sections/CtaBanner.jsx';

export default function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
      <FeaturedMeals />
      <CategoriesSection />
      <DailyMenu />
      <WhyUs />
      <StorySection />
      <HowItWorks />
      <CtaBanner />
    </>
  );
}
