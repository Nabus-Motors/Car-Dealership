import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, Gauge, Fuel, Cog, BadgeCheck } from 'lucide-react';
import { formatPrice, formatMileage } from '@utils/format';
import type { Car } from '@/types/car';

interface FeaturedVehiclesProps {
  cars: Car[];
  loading?: boolean;
}

function VehicleCard({ car }: { car: Car }) {
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

export default function FeaturedVehicles({ cars, loading = false }: FeaturedVehiclesProps) {
  const items = cars.slice(0, 6);

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="shell">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-[var(--accent-deep)]">Suggested by Dealer</p>
            <h2 className="mt-4 font-display display-lead uppercase text-ink">
              Featured Vehicles
            </h2>
          </div>
          <Link
            to="/explore"
            className="shrink-0 text-[12px] font-semibold uppercase tracking-[0.16em] text-ink/70 underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            View All
          </Link>
        </div>

        {loading && !items.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="border border-[var(--hairline)]">
                <div className="aspect-[16/10] animate-pulse bg-[#E6E8EA]" />
                <div className="space-y-3 p-5">
                  <div className="h-3 w-14 animate-pulse bg-[#E6E8EA]" />
                  <div className="h-5 w-44 animate-pulse bg-[#E6E8EA]" />
                  <div className="h-10 w-full animate-pulse bg-[#E6E8EA]" />
                </div>
              </div>
            ))}
          </div>
        ) : !items.length ? (
          <div className="border border-[var(--hairline)] p-16 text-center">
            <h3 className="font-display text-xl uppercase text-ink">No vehicles available</h3>
            <p className="mt-3 text-sm text-ink/55">Check back soon for new arrivals.</p>
            <Link to="/explore" className="btn-accent mt-8">
              Browse Inventory
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((car) => (
              <VehicleCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
