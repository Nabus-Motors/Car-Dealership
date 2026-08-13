import { Link } from 'react-router-dom';
import { VehicleCard } from '@components/VehicleCard';
import type { Car } from '@/types/car';

interface FeaturedVehiclesProps {
  cars: Car[];
  loading?: boolean;
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
