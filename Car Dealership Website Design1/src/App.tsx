import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { IntroSection } from './components/IntroSection';
import { BestDeals } from './components/BestDeals';
import { DreamSection } from './components/DreamSection';
import { GreatestSection } from './components/GreatestSection';
import { ValuesSection } from './components/ValuesSection';
import { PremiumSection } from './components/PremiumSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { StatsSection } from './components/StatsSection';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <IntroSection />
        <BestDeals />
        <DreamSection />
        <GreatestSection />
        <ValuesSection />
        <PremiumSection />
        <TestimonialsSection />
        <StatsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
