import React from 'react';
import { HeroSection } from './HeroSection';
import { CarCard } from './CarCard';
import { Card, CardContent } from './ui/card';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const featuredCars = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1653047256226-5abbfa82f1d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjYXIlMjByZWR8ZW58MXx8fHwxNzU4NjEwNzA4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      brand: "Ferrari",
      model: "488 GTB",
      year: 2023,
      price: 285000,
      mileage: "2,500 miles",
      fuelType: "Gasoline"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1734299388217-2ebc605ef43f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibXclMjBzZWRhbiUyMGJsYWNrfGVufDF8fHx8MTc1ODYyNjczMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      brand: "BMW",
      model: "M5 Sedan",
      year: 2024,
      price: 105000,
      mileage: "500 miles",
      fuelType: "Gasoline"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1728711283509-906e153833ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdWRpJTIwc3V2JTIwd2hpdGV8ZW58MXx8fHwxNzU4NzIxNzI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      brand: "Audi",
      model: "Q7 SUV",
      year: 2024,
      price: 68000,
      mileage: "1,200 miles",
      fuelType: "Gasoline"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1654484521052-c6d2e96c120c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXJjZWRlcyUyMGx1eHVyeSUyMGNhcnxlbnwxfHx8fDE3NTg2MzAyOTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      brand: "Mercedes",
      model: "S-Class",
      year: 2024,
      price: 125000,
      mileage: "800 miles",
      fuelType: "Gasoline"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1610470850940-27b52ca7c0fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXNsYSUyMGVsZWN0cmljJTIwY2FyfGVufDF8fHx8MTc1ODcyMTcyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      brand: "Tesla",
      model: "Model S",
      year: 2024,
      price: 89000,
      mileage: "3,000 miles",
      fuelType: "Electric"
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1734299388217-2ebc605ef43f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibXclMjBzZWRhbiUyMGJsYWNrfGVufDF8fHx8MTc1ODYyNjczMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      brand: "Porsche",
      model: "911 Carrera",
      year: 2023,
      price: 115000,
      mileage: "4,500 miles",
      fuelType: "Gasoline"
    }
  ];

  const whyChooseUsFeatures = [
    {
      icon: "🏆",
      title: "Trusted Dealers",
      description: "Over 20 years of experience in the automotive industry with thousands of satisfied customers."
    },
    {
      icon: "💰",
      title: "Affordable Pricing",
      description: "Competitive prices and flexible financing options to help you get your dream car."
    },
    {
      icon: "🚗",
      title: "Wide Selection",
      description: "Extensive inventory of luxury, sports, and family vehicles from top manufacturers."
    }
  ];

  const scrollToFeatured = () => {
    const element = document.getElementById('featured-cars');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        backgroundImage="https://images.unsplash.com/photo-1705747401901-28363172fe7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBzaG93cm9vbXxlbnwxfHx8fDE3NTg3MTYyMTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        title="Find Your Dream Car"
        subtitle="Discover luxury, performance, and reliability in our premium vehicle collection"
        buttonText="Browse Cars"
        onButtonClick={scrollToFeatured}
      />

      {/* Featured Cars Section */}
      <section id="featured-cars" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Featured Vehicles
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our handpicked selection of premium vehicles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCars.map((car) => (
              <CarCard
                key={car.id}
                image={car.image}
                brand={car.brand}
                model={car.model}
                year={car.year}
                price={car.price}
                mileage={car.mileage}
                fuelType={car.fuelType}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Choose AutoMax?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to providing exceptional service and quality vehicles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyChooseUsFeatures.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-4 text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Perfect Car?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact our expert team today and let us help you drive away in your dream vehicle
          </p>
          <button
            onClick={() => onNavigate('contact')}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
          >
            Contact Us Today
          </button>
        </div>
      </section>
    </div>
  );
}