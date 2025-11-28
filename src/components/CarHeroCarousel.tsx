import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { StorageImage } from '@components/figma/StorageImage';
import type { Car } from '@types/car';

interface CarHeroCarouselProps {
  cars: Car[];
  autoPlayInterval?: number;
}

export function CarHeroCarousel({ cars, autoPlayInterval = 5000 }: CarHeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index % Math.max(cars.length, 1));
  }, [cars.length]);

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
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <p className="text-lg">No Image Available</p>
            </div>
          </div>
        )}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Car Info Overlay - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8 sm:p-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
              {currentCar.year} {currentCar.brand} {currentCar.model}
            </h2>
            {currentCar.description && (
              <p className="text-gray-200 text-base sm:text-lg mb-4 line-clamp-2">
                {currentCar.description}
              </p>
            )}
            <div className="flex flex-wrap gap-4">
              {currentCar.fuelType && (
                <span className="px-3 py-1 bg-[#FFD700]/20 text-[#FFD700] rounded text-sm font-medium">
                  {currentCar.fuelType}
                </span>
              )}
              {currentCar.transmission && (
                <span className="px-3 py-1 bg-[#FFD700]/20 text-[#FFD700] rounded text-sm font-medium">
                  {currentCar.transmission}
                </span>
              )}
              {currentCar.condition && (
                <span className="px-3 py-1 bg-[#FFD700]/20 text-[#FFD700] rounded text-sm font-medium">
                  {currentCar.condition}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        {cars.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 transition-all duration-300 opacity-0 group-hover:opacity-100 z-20"
              aria-label="Previous car"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 transition-all duration-300 opacity-0 group-hover:opacity-100 z-20"
              aria-label="Next car"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Slide Indicators */}
        {cars.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {cars.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-[#FFD700] w-8 sm:w-12' : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Counter */}
        {cars.length > 1 && (
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-black/60 text-white px-3 py-1 sm:px-4 sm:py-2 rounded text-xs sm:text-sm font-medium">
            {currentIndex + 1} / {cars.length}
          </div>
        )}
      </div>
    </div>
  );
}
