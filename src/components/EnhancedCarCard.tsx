import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import OptimizedImage from './OptimizedImage';
import type { Car } from '@/types/car';

interface EnhancedCarCardProps {
  car: Car;
  onSave?: (carId: string) => void;
}

export function EnhancedCarCard({ car, onSave: _onSave }: EnhancedCarCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = car.imageUrls ?? [];
  const hasMultipleImages = images.length > 1;

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
    <Link to={`/car/${car.id}`}
      className="block group focus:outline-none focus-visible:ring-2 
                 focus-visible:ring-[#C9A84C]">
      <article className="bg-white rounded-lg border border-[#E8E8E8] overflow-hidden
                          transition-all duration-200
                          hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.10)]">

        {/* ── IMAGE ── */}
        <div className="relative h-[200px] bg-[#F0EFE9] overflow-hidden">

          {/* Diagonal ribbon badge */}
          <div className={`
            absolute top-[18px] left-[-28px] w-[108px] py-[5px] z-10
            text-[10px] font-black tracking-[2px] uppercase text-center
            rotate-[-45deg] pointer-events-none
            ${car.condition === 'New' ? 'bg-[#C9A84C] text-[#0A0A0A]' : 'bg-[#1C1C1E] text-white'}
          `}>
            {car.condition === 'New' ? 'NEW' : 'USED'}
          </div>

          <OptimizedImage
            src={car.imageUrls?.[0]}
            alt={`${car.year ?? ''} ${car.brand ?? ''} ${car.model ?? ''}`}
            aspectRatio="3/2"
            priority={false}
            className="transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>

        {/* ── BODY ── */}
        <div className="p-4">

          {/* Title row: name+location LEFT | price box RIGHT */}
          <div className="flex items-start justify-between gap-3 mb-3">

            <div className="flex-1 min-w-0">
              <h3 className="text-[17px] font-bold text-[#1C1C1E] leading-[1.2] 
                             mb-[3px] truncate">
                {car.year} {car.brand} {car.model}
              </h3>
              <p className="flex items-center gap-1 text-[12px] text-[#888] m-0">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2" className="shrink-0">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span className="truncate">{car.location?.name ?? 'Accra, Ghana'}</span>
              </p>
            </div>

            {/* Price box — dark pill */}
            <div className="shrink-0 bg-[#0A0A0A] rounded px-3 py-2 text-right">
              <div className="text-[17px] font-black text-white whitespace-nowrap leading-tight">
                {new Intl.NumberFormat('en-GH', {
                  style: 'currency', currency: 'GHS', maximumFractionDigits: 0
                }).format(car.price ?? 0)}
              </div>
            </div>
          </div>

          {/* Specs — 2x2 grid with icons */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-[6px] py-3
                          border-t border-b border-[#F0F0F0] mb-3">
            {[
              { icon: 'fuel',     label: car.fuelType    ?? 'Petrol' },
              { icon: 'gauge',    label: `${(typeof car.mileage === 'number' ? car.mileage : parseInt(car.mileage as string) || 0).toLocaleString()} km` },
              { icon: 'settings', label: car.transmission ?? 'Auto' },
              { icon: 'car',      label: car.condition ?? 'Used' },
            ].map(({ icon, label }) => (
              <div key={icon} className="flex items-center gap-[5px] text-[12px] text-[#555]">
                {/* Inline SVG icon per type */}
                {icon === 'fuel' && (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                       stroke="#999" strokeWidth="1.8" className="shrink-0">
                    <path d="M3 22V8l6-6h6l6 6v14M9 22V12h6v10"/>
                    <path d="M15 2v4h4"/>
                  </svg>
                )}
                {icon === 'gauge' && (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                       stroke="#999" strokeWidth="1.8" className="shrink-0">
                    <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/>
                    <path d="M12 12l4-4"/>
                  </svg>
                )}
                {icon === 'settings' && (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                       stroke="#999" strokeWidth="1.8" className="shrink-0">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 
                             2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 
                             1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 
                             0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 
                             01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 
                             0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a
                             1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83
                             l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3
                             a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 
                             001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 
                             1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4
                             h-.09a1.65 1.65 0 00-1.51 1z"/>
                  </svg>
                )}
                {icon === 'car' && (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                       stroke="#999" strokeWidth="1.8" className="shrink-0">
                    <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l3-4h10l3 4h1a2 
                             2 0 012 2v6a2 2 0 01-2 2h-2"/>
                    <circle cx="7" cy="17" r="2"/>
                    <circle cx="17" cy="17" r="2"/>
                  </svg>
                )}
                <span className="truncate">{label}</span>
              </div>
            ))}
          </div>

          {/* Footer: date LEFT | share RIGHT */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-[11px] text-[#aaa]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8"  y1="2" x2="8"  y2="6"/>
                <line x1="3"  y1="10" x2="21" y2="10"/>
              </svg>
              <span>Recently listed</span>
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const url = `${window.location.origin}/car/${car.id}`;
                navigator.share
                  ? navigator.share({ title: `${car.year} ${car.brand} ${car.model}`, url })
                      .catch(() => {})
                  : navigator.clipboard?.writeText(url);
              }}
              aria-label="Share this car"
              className="w-[28px] h-[28px] rounded-full border border-[#E8E8E8]
                         flex items-center justify-center text-[#aaa]
                         hover:border-[#C9A84C] hover:text-[#C9A84C]
                         transition-colors shrink-0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3"/>
                <circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51"  x2="8.59"  y2="10.49"/>
              </svg>
            </button>
          </div>

        </div>
      </article>
    </Link>
  );
}
