import { Link } from 'react-router-dom';
import { formatPrice } from '@/utils/format';
import type { Car } from '@/types/car';

interface ModelShowcaseProps {
  car: Car;
  tagline: string;
  align?: 'left' | 'right';
}

export default function ModelShowcase({ car, tagline, align = 'left' }: ModelShowcaseProps) {
  const image = car.imageUrls?.[car.primaryImageIndex ?? 0] ?? car.imageUrls?.[0];

  return (
    <section className="relative w-full overflow-hidden bg-charcoal-black" style={{ height: 'clamp(520px, 76vh, 820px)' }}>
      {image ? (
        <img
          src={image}
          alt={`${car.brand} ${car.model}`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_70%_40%,#3A4247,#111)]" />
      )}

      <div
        className={`absolute inset-0 ${
          align === 'right'
            ? 'bg-[linear-gradient(270deg,rgba(17,17,17,0.94)_0%,rgba(17,17,17,0.86)_26%,rgba(17,17,17,0.55)_52%,rgba(17,17,17,0.12)_78%)]'
            : 'bg-[linear-gradient(90deg,rgba(17,17,17,0.94)_0%,rgba(17,17,17,0.86)_26%,rgba(17,17,17,0.55)_52%,rgba(17,17,17,0.12)_78%)]'
        }`}
      />

      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(17,17,17,0.88)_0%,rgba(17,17,17,0.45)_45%,transparent_75%)] md:hidden" />

      <div className="relative z-10 flex h-full items-center">
        <div className="shell w-full">
          <div className={`max-w-[46rem] ${align === 'right' ? 'ml-auto text-right' : ''}`}>
            <p className="eyebrow mb-4 text-white/70">{tagline}</p>

            <h2 className="font-display display-section uppercase leading-[1.04] text-white">
              <span className="block">{car.brand}</span>
              <span className="block">{car.model}</span>
            </h2>

            <p className="mt-6 text-sm tracking-[0.06em] text-white/70">
              {car.year} · {car.condition} · {formatPrice(car.price ?? 0)}
            </p>

            <div
              className={`mt-9 flex flex-wrap gap-3 ${
                align === 'right' ? 'justify-end' : ''
              }`}
            >
              <Link to={`/car/${car.id}`} className="btn-light">
                Discover
              </Link>
              <Link to="/contact" className="btn-ghost">
                Enquire
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
