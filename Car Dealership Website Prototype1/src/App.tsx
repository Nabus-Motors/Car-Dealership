import React from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CarDetailSection } from './components/CarDetailSection';
import { DetailsSection } from './components/DetailsSection';
import { SimilarVehicles } from './components/SimilarVehicles';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <CarDetailSection />
      <DetailsSection />
      <SimilarVehicles />
      <Footer />
    </div>
  );
}
