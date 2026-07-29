import { Link } from 'react-router-dom';
import type { Car } from '@/types/car';

interface TileRowProps {
  cars: Car[];
}

const TILE_META = [
  { label: 'Inspected', copy: 'Every car, 120 checkpoints' },
  { label: 'Road-proven', copy: 'Tested on Ghanaian roads' },
  { label: 'Warranted', copy: 'Cover that outlasts the drive' },
];

export default function TileRow({ cars }: TileRowProps) {
  const tiles = cars.filter((car) => car.imageUrls?.length).slice(0, 3);
  if (tiles.length < 3) return null;

  return (
    <section className="w-full bg-white py-14 md:py-20">
      <div className="shell">
        <div
          className="grid grid-cols-1 gap-1 sm:grid-cols-3 sm:[grid-template-columns:1.35fr_1fr_1fr]"
          style={{ gridAutoRows: 'clamp(220px, 26vw, 340px)' }}
        >
          {tiles.map((car, index) => (
            <Link
              key={car.id}
              to={`/car/${car.id}`}
              className="group relative block h-full overflow-hidden"
            >
              <img
                src={car.imageUrls[car.primaryImageIndex ?? 0] ?? car.imageUrls[0]}
                alt={`${car.brand} ${car.model}`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(17,17,17,0.78),rgba(17,17,17,0.05)_55%)]" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="eyebrow text-[var(--accent-light)]">
                  {TILE_META[index].label}
                </p>
                <p className="mt-2 font-display text-lg uppercase tracking-[0.04em] text-white">
                  {TILE_META[index].copy}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
