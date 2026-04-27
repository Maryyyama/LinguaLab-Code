import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import MainImage from '../components/home/MainImage';
import CoursesSection from '../components/home/CoursesSection';
import FastLearningSection from '../components/home/FastLearningSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import RegistrationSection from '../components/home/RegistrationSection';
import NewsSection from '../components/home/NewsSection';
import FAQSection from '../components/home/FAQSection';

function HomePage() {
  return (
    <div>
      <Header />
      <main>
        <MainImage />
        <CoursesSection />
        <FastLearningSection />
        <HowItWorksSection />
        <RegistrationSection />
        <NewsSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;