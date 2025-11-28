import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { StorageImage } from '@/components/figma/StorageImage';
import { useNavigate } from 'react-router-dom';
import type { Car } from '@/types/car';

interface HeroCarouselProps {
  cars: Car[];
  autoPlayInterval?: number;
  onCarSelect?: (car: Car) => void;
}

export function HeroCarousel({ cars, autoPlayInterval = 6000, onCarSelect }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const navigate = useNavigate();

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index % Math.max(cars.length, 1));
    if (onCarSelect && cars.length > 0) {
      onCarSelect(cars[index % cars.length]);
    }
  }, [cars, onCarSelect]);

  const nextSlide = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentIndex - 1 + Math.max(cars.length, 1));
  }, [currentIndex, goToSlide]);

  // Auto-play effect
  useEffect(() => {
    if (!isAutoPlaying || cars.length === 0) return;

    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isAutoPlaying, cars.length, autoPlayInterval, nextSlide]);

  if (cars.length === 0) {
    return null;
  }

  const currentCar = cars[currentIndex];

  const handleCarClick = () => {
    if (currentCar.id) {
      navigate(`/car/${currentCar.id}`);
    }
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden group"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Carousel Container */}
      <div className="relative w-full h-full">
        {/* Image Display */}
        {currentCar.imageUrls && currentCar.imageUrls.length > 0 ? (
          <StorageImage
            src={currentCar.imageUrls[0]}
            alt={`${currentCar.year} ${currentCar.brand} ${currentCar.model}`}
            className="w-full h-full object-cover cursor-pointer"
            onClick={handleCarClick}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <p className="text-lg">No Image Available</p>
            </div>
          </div>
        )}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Car Name Overlay - Center Bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 sm:p-8">
          <div className="max-w-md">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              {currentCar.year} {currentCar.brand}
            </h3>
            <p className="text-lg sm:text-xl text-[#FFD700] font-semibold">
              {currentCar.model}
            </p>
          </div>
        </div>

        {/* Navigation Buttons */}
        {cars.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 sm:p-3 transition-all duration-300 opacity-0 group-hover:opacity-100 z-20 backdrop-blur-sm"
              aria-label="Previous car"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 sm:p-3 transition-all duration-300 opacity-0 group-hover:opacity-100 z-20 backdrop-blur-sm"
              aria-label="Next car"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Slide Indicators */}
        {cars.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-20">
            {cars.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'bg-[#FFD700] w-3 h-2 sm:w-4 sm:h-2.5'
                    : 'bg-white/50 hover:bg-white/70 w-2 h-2 sm:w-3 sm:h-3'
                }`}
                aria-label={`Go to car ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Counter */}
        {cars.length > 1 && (
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-black/60 text-white px-3 py-1 sm:px-4 sm:py-2 rounded text-xs sm:text-sm font-medium backdrop-blur-sm">
            {currentIndex + 1} / {cars.length}
          </div>
        )}
      </div>
    </div>
  );
}
