import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, Gauge, Fuel, Cog, BadgeCheck } from 'lucide-react';
import { formatPrice, formatMileage } from '@utils/format';
import type { Car } from '@/types/car';

interface VehicleCardProps {
  car: Car;
}

export function VehicleCard({ car }: VehicleCardProps) {
  const navigate = useNavigate();
  const images = car.imageUrls ?? [];
  const [index, setIndex] = useState(0);
  const hasMultiple = images.length > 1;

  const step = (event: React.MouseEvent, delta: number) => {
    event.stopPropagation();
    setIndex((prev) => (prev + delta + images.length) % images.length);
  };

  const mileage = formatMileage(car.mileage);

  const specs = [
    { Icon: Gauge, value: /km|mi\b/i.test(mileage) ? mileage : `${mileage} km` },
    { Icon: Fuel, value: car.fuelType ?? 'Petrol' },
    { Icon: Cog, value: car.transmission ?? 'Automatic' },
    { Icon: BadgeCheck, value: car.condition },
  ];

  return (
    <article
      onClick={() => navigate(`/car/${car.id}`)}
      className="group cursor-pointer border border-[var(--hairline)] bg-white transition-colors duration-300 hover:border-[var(--accent-solid)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#E6E8EA]">
        <span className="absolute left-0 top-4 z-10 bg-ink px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
          {car.condition === 'New' ? 'New' : 'Used'}
        </span>

        {hasMultiple && (
          <span className="absolute right-3 top-3 z-10 bg-ink/75 px-2.5 py-1 text-[11px] font-semibold text-white">
            {index + 1} / {images.length}
          </span>
        )}

        <img
          src={images[index]}
          alt={`${car.year} ${car.brand} ${car.model}`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
        />

        {hasMultiple && (
          <>
            <button
              onClick={(event) => step(event, -1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center bg-ink/60 text-white opacity-0 transition-opacity hover:bg-ink group-hover:opacity-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={(event) => step(event, 1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center bg-ink/60 text-white opacity-0 transition-opacity hover:bg-ink group-hover:opacity-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <span className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {images.map((_, dot) => (
                <button
                  key={dot}
                  onClick={(event) => {
                    event.stopPropagation();
                    setIndex(dot);
                  }}
                  aria-label={`Image ${dot + 1}`}
                  className={`h-[3px] w-5 transition-colors ${
                    dot === index ? 'bg-[var(--accent-solid)]' : 'bg-white/50'
                  }`}
                />
              ))}
            </span>
          </>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="eyebrow text-ink/40">{car.year}</p>
            <h3 className="mt-1.5 font-display text-lg uppercase leading-tight tracking-[0.03em] text-ink">
              {car.brand} {car.model}
            </h3>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-ink/50">
              <MapPin className="h-3.5 w-3.5" />
              {typeof car.location === 'string'
                ? car.location
                : car.location?.name ?? 'Nabus Motors'}
            </p>
          </div>

          <div className="shrink-0 bg-ink px-4 py-2.5 text-right">
            <div className="font-display text-base font-medium text-white">
              {formatPrice(car.price ?? 0)}
            </div>
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[var(--hairline)] pt-4">
          {specs.map(({ Icon, value }) => (
            <div key={value} className="flex items-center gap-2 text-[13px] text-ink/65">
              <Icon className="h-4 w-4 shrink-0 text-ink/35" />
              <span className="truncate">{value}</span>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}

export default VehicleCard;
