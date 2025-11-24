import React, { useRef } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function SimilarVehicles() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const vehicles = [
    {
      id: 1,
      name: 'Lamborghini Aventador',
      year: 2023,
      price: '$425,000',
      image: 'https://images.unsplash.com/photo-1753899762863-af6e21e86438?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwbGFtYm9yZ2hpbmklMjBzcG9ydHMlMjBjYXJ8ZW58MXx8fHwxNzYzOTk5MzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      specs: {
        mileage: '8,200 miles',
        engine: '6.5L V12',
        transmission: '7-Speed Auto',
      },
    },
    {
      id: 2,
      name: 'Porsche 911 Turbo S',
      year: 2024,
      price: '$235,000',
      image: 'https://images.unsplash.com/photo-1748944187123-70b412d834e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWx2ZXIlMjBwb3JzY2hlJTIwY2FyfGVufDF8fHx8MTc2Mzk5OTMyNnww&ixlib=rb-4.1.0&q=80&w=1080',
      specs: {
        mileage: '3,500 miles',
        engine: '3.8L Twin-Turbo',
        transmission: '8-Speed PDK',
      },
    },
    {
      id: 3,
      name: 'McLaren 720S',
      year: 2023,
      price: '$315,000',
      image: 'https://images.unsplash.com/photo-1710823367826-02e38b3c9f67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGx1eHVyeSUyMGNhcnxlbnwxfHx8fDE3NjM5Mjc4ODN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      specs: {
        mileage: '5,800 miles',
        engine: '4.0L V8 Twin-Turbo',
        transmission: '7-Speed Auto',
      },
    },
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl mb-2">Similar Vehicles</h2>
            <p className="text-gray-600">Explore other premium vehicles that might interest you</p>
          </div>
          
          {/* Navigation Arrows */}
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 border border-gray-300 hover:bg-white hover:border-[#2563eb] hover:text-[#2563eb] transition-all duration-200"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 border border-gray-300 hover:bg-white hover:border-[#2563eb] hover:text-[#2563eb] transition-all duration-200"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Scrollable Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-white overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200 snap-start group"
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <ImageWithFallback
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-[#2563eb] text-white px-3 py-1 text-sm clip-corner-bl">
                  {vehicle.year}
                </div>
              </div>

              {/* Details */}
              <div className="p-6">
                <h3 className="text-xl mb-1">{vehicle.name}</h3>
                <div className="text-2xl text-[#2563eb] mb-4">{vehicle.price}</div>

                {/* Specs */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Mileage:</span>
                    <span>{vehicle.specs.mileage}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Engine:</span>
                    <span>{vehicle.specs.engine}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Transmission:</span>
                    <span>{vehicle.specs.transmission}</span>
                  </div>
                </div>

                {/* CTA Button */}
                <button className="w-full bg-[#0a1628] text-white py-3 hover:bg-[#1e293b] transition-colors duration-200 clip-corner-tr">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}