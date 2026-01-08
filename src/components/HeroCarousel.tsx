import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { StorageImage } from '@components/figma/StorageImage';
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
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const goToSlide = useCallback((index: number) => {
    setImageLoaded(false);
    setCurrentIndex(index % Math.max(cars.length, 1));
    if (onCarSelect && cars.length > 0) {
      onCarSelect(cars[index % cars.length]);
    }
  }, [cars, onCarSelect]);

  // Touch handling for mobile swipe
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0].clientX;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return; // ignore small moves
    if (delta > 0) {
      prevSlide();
    } else {
      nextSlide();
    }
  };

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
  const primaryImageIndex = currentCar.primaryImageIndex ?? 0;
  const displayImageUrl = currentCar.imageUrls?.[primaryImageIndex] || currentCar.imageUrls?.[0];

  const handleCarClick = () => {
    if (currentCar.id) {
      navigate(`/car/${currentCar.id}`);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden group touch-pan-y"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Carousel Container */}
      <div className="relative w-full h-full">
        {/* Image Display */}
        {currentCar.imageUrls && currentCar.imageUrls.length > 0 ? (
          <div onClick={handleCarClick} className="cursor-pointer h-full">
            <StorageImage
              src={displayImageUrl}
              alt={`${currentCar.year} ${currentCar.brand} ${currentCar.model}`}
              className="w-full h-full object-cover object-center select-none\"
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <p className="text-lg">No Image Available</p>
            </div>
          </div>
        )}

        {/* Premium Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>

        {/* Featured Badge (hidden on very small screens) */}
        <div className="hidden sm:flex absolute top-6 left-6 z-20 flex items-center gap-2 bg-[#FFD700]/95 backdrop-blur-sm px-4 py-2 rounded-full">
          <Sparkles className="w-4 h-4 text-[#001F3F]" />
          <span className="text-xs font-bold text-[#001F3F] uppercase tracking-wider">Featured</span>
        </div>

        {/* Car Info Overlay - Premium Design */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent pt-20 pb-8 px-6 sm:px-8">
          <div className="max-w-xl">
            {/* Year & Brand */}
            <div className="mb-2">
              <p className="text-xs sm:text-sm font-bold text-[#FFD700] uppercase tracking-widest">
                {currentCar.year} • {currentCar.condition}
              </p>
            </div>

            {/* Model Name */}
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight">
              {currentCar.brand}
            </h3>
            <p className="text-lg sm:text-2xl text-gray-300 mb-4 font-semibold">
              {currentCar.model}
            </p>

            {/* Price & Key Info */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4">
              <div className="bg-[#FFD700] text-[#001F3F] px-3 py-2 rounded-lg font-bold text-xs sm:text-sm whitespace-nowrap">
                {formatPrice(currentCar.price)}
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-300">
                <span className="flex items-center gap-1">
                  <span className="font-semibold">{currentCar.mileage?.toLocaleString().substring(0, 6) || 'N/A'}</span> km
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline text-xs">{currentCar.transmission?.substring(0, 10)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        {cars.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 sm:p-4 transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100 z-50 backdrop-blur-md rounded-full hover:scale-110 touch-manipulation"
              aria-label="Previous car"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 sm:p-4 transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100 z-50 backdrop-blur-md rounded-full hover:scale-110 touch-manipulation"
              aria-label="Next car"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Premium Slide Indicators - hidden on mobile to avoid blocking details */}
        {cars.length > 1 && (
          <div className="hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20 bg-black/40 px-4 py-3 rounded-full backdrop-blur-md">
            {cars.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'bg-[#FFD700] w-3 h-3 shadow-lg shadow-[#FFD700]/50'
                    : 'bg-white/40 hover:bg-white/70 w-2 h-2'
                }`}
                aria-label={`Go to car ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Counter Badge - Premium Style */}
        {cars.length > 1 && (
          <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest border border-white/20">
            {currentIndex + 1} / {cars.length}
          </div>
        )}
      </div>
    </div>
  );
}
