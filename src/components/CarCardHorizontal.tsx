import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import OptimizedImage from './OptimizedImage';
import type { Car } from '@/types/car';

interface CarCardHorizontalProps {
  car: Car;
}

export function CarCardHorizontal({ car }: CarCardHorizontalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = car.imageUrls ?? [];
  const hasMultipleImages = images.length > 1;

  const fmt = (num: number) => new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    maximumFractionDigits: 0
  }).format(num);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <Link to={`/car/${car.id}`} className="block group">
      <div className="flex bg-white rounded-lg border border-[#E8E8E8] overflow-hidden
                      transition-all duration-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]
                      hover:border-[#C9A84C]/30 sm:flex-col">

        {/* Image — fixed width left side with carousel */}
        <div className="relative w-[240px] shrink-0 bg-[#F0EFE9] overflow-hidden
                        lg:w-[200px] sm:w-full sm:h-[180px]">
          {/* Ribbon badge */}
          <div className={`absolute top-[14px] left-[-24px] w-[100px] py-[4px] z-10
                          text-[9px] font-black tracking-[2px] uppercase text-center
                          rotate-[-45deg] pointer-events-none
                          ${car.condition === 'New' ? 'bg-[#C9A84C] text-[#0A0A0A]'   :
                                                     'bg-[#1C1C1E] text-white'}`}>
            {car.condition === 'New' ? 'NEW' : 'USED'}
          </div>

          {/* Image Counter */}
          {hasMultipleImages && (
            <div className="absolute top-2 right-2 z-20 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-semibold">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}

          <OptimizedImage
            src={images[currentImageIndex]}
            alt={`${car.year} ${car.brand} ${car.model}`}
            aspectRatio="3/2"
            priority={false}
            className="transition-transform duration-500 group-hover:scale-[1.04]"
          />

          {/* Navigation Chevrons */}
          {hasMultipleImages && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-1 top-1/2 -translate-y-1/2 z-10 
                           bg-black/60 hover:bg-black/90 transition-all duration-200
                           p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100
                           sm:opacity-70 sm:hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleNextImage}
                className="absolute right-1 top-1/2 -translate-y-1/2 z-10
                           bg-black/60 hover:bg-black/90 transition-all duration-200
                           p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100
                           sm:opacity-70 sm:hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Image Dots */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentImageIndex(idx);
                    }}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      idx === currentImageIndex
                        ? "bg-white w-2"
                        : "bg-white/50 hover:bg-white/70"
                    }`}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between flex-1 p-5 sm:p-4">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h3 className="text-[17px] font-bold text-[#1C1C1E] leading-[1.2] mb-1">
                {car.year} {car.brand} {car.model}
              </h3>
              <p className="flex items-center gap-1 text-[12px] text-[#888]">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" className="shrink-0">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                {typeof car.location === 'string' ? car.location : car.location?.name ?? 'Accra, Ghana'}
              </p>
            </div>
            {/* Price */}
            <div className="shrink-0 bg-[#0A0A0A] rounded px-4 py-2 text-right">
              <div className="text-[18px] font-black text-white whitespace-nowrap">
                {fmt(car.price ?? 0)}
              </div>
            </div>
          </div>

          {/* Specs — horizontal row in list view */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 py-3
                          border-t border-b border-[#F0F0F0] mb-3">
            {[
              { label: 'Fuel',     val: car.fuelType    ?? 'Petrol' },
              { label: 'Mileage',  val: `${(typeof car.mileage === 'number' ? car.mileage : parseInt(car.mileage as string) || 0).toLocaleString()} km` },
              { label: 'Trans.',   val: car.transmission ?? '—' },
            ].map(({ label, val }) => (
              <div key={label} className="text-[12px]">
                <span className="text-[#aaa] uppercase text-[10px] font-bold">{label}: </span>
                <span className="text-[#333] font-semibold">{val}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#aaa]">
              {car.createdAt
                ? new Date(car.createdAt as unknown as string).toLocaleDateString('en-GB',{
                    day:'numeric', month:'long', year:'numeric'})
                : 'Recently listed'}
            </span>
            <div className="flex gap-2">
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                className="px-4 py-2 bg-[#C9A84C] text-[#0A0A0A] rounded text-[11px] 
                           font-bold uppercase tracking-[0.8px]
                           hover:bg-[#b8943e] transition-colors">
                View Car
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
