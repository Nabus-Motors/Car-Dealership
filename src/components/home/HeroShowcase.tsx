import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Car } from '@/types/car';

const SLIDE_MS = 7000;

export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  caption?: string;
  image?: string;
  href: string;
}

const FALLBACK_SLIDES: HeroSlide[] = [
  {
    id: 'fallback-inventory',
    eyebrow: 'Nabus Motors',
    title: 'The Collection',
    caption: 'Certified vehicles, ready for Ghana',
    href: '/explore',
  },
  {
    id: 'fallback-finance',
    eyebrow: 'Ownership',
    title: 'Drive Sooner',
    caption: 'Flexible finance built around you',
    href: '/contact',
  },
  {
    id: 'fallback-tradein',
    eyebrow: 'Trade-In',
    title: 'Know Your Value',
    caption: 'A fair valuation in under an hour',
    href: '/contact',
  },
];

export function carsToSlides(cars: Car[]): HeroSlide[] {
  return cars
    .filter((car) => car.imageUrls?.length)
    .slice(0, 5)
    .map((car) => ({
      id: car.id,
      eyebrow: car.brand,
      title: car.model,
      caption: `${car.year} · ${car.condition}`,
      image: car.imageUrls[car.primaryImageIndex ?? 0] ?? car.imageUrls[0],
      href: `/car/${car.id}`,
    }));
}

interface HeroShowcaseProps {
  cars: Car[];
}

export default function HeroShowcase({ cars }: HeroShowcaseProps) {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const derived = carsToSlides(cars);
  const slides = derived.length ? derived : FALLBACK_SLIDES;
  const total = slides.length;

  const goTo = useCallback((index: number) => {
    setActive(((index % total) + total) % total);
  }, [total]);

  useEffect(() => {
    setActive(0);
  }, [total]);

  useEffect(() => {
    if (paused || total <= 1) return;
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % total);
    }, SLIDE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, total]);

  const current = slides[active];

  return (
    <section
      className="chamfer-tl relative w-full overflow-hidden bg-charcoal-black"
      style={{ height: 'clamp(560px, 82vh, 900px)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-[900ms] ease-out ${
            index === active ? 'hero-slide-active opacity-100' : 'opacity-0'
          }`}
          aria-hidden={index !== active}
        >
          {slide.image ? (
            <img
              src={slide.image}
              alt={`${slide.eyebrow} ${slide.title}`}
              className="h-full w-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={index === 0 ? 'high' : 'low'}
            />
          ) : (
            <div className="h-full w-full bg-[radial-gradient(120%_100%_at_75%_35%,#3A4247_0%,#1C2124_55%,#111_100%)]" />
          )}
        </div>
      ))}

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,17,17,0.95)_0%,rgba(17,17,17,0.88)_26%,rgba(17,17,17,0.58)_50%,rgba(17,17,17,0.18)_76%,rgba(17,17,17,0.45)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(to_top,rgba(17,17,17,0.55),transparent)]" />

      <div className="relative z-10 flex h-full items-center">
        <div className="shell w-full">
          <div className="max-w-[52rem]">
            <p className="eyebrow mb-4 text-white/70">{current.eyebrow}</p>

            <h1 className="font-display display-hero uppercase text-white">
              {current.title}
            </h1>

            {current.caption && (
              <p className="mt-5 text-[15px] tracking-[0.02em] text-white/65">
                {current.caption}
              </p>
            )}

            <button
              onClick={() => navigate(current.href)}
              className="arrow-link mt-9 group"
            >
              Discover
              <span className="arrow-rule" />
            </button>
          </div>
        </div>
      </div>

      {total > 1 && (
        <div className="absolute inset-x-0 bottom-8 z-10 hidden md:block">
          <div className="shell">
            <div className="flex justify-end gap-8">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => goTo(index)}
                  className="group w-[76px] text-left"
                  aria-label={`Go to slide ${index + 1}: ${slide.title}`}
                  aria-current={index === active}
                >
                  <span
                    className={`block text-[13px] font-semibold tracking-[0.12em] transition-colors ${
                      index === active ? 'text-white' : 'text-white/45 group-hover:text-white/80'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="mt-2 block h-[2px] w-full bg-white/25">
                    <span
                      key={`${index}-${active}-${paused}`}
                      className="block h-full bg-[var(--accent-solid)]"
                      style={
                        index === active
                          ? {
                              animation: paused
                                ? 'none'
                                : `heroProgress ${SLIDE_MS}ms linear forwards`,
                              width: paused ? '100%' : undefined,
                            }
                          : { width: 0 }
                      }
                    />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {total > 1 && (
        <div className="absolute bottom-6 left-0 right-0 z-10 md:hidden">
          <div className="shell flex gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => goTo(index)}
                className={`h-[2px] flex-1 transition-colors ${
                  index === active ? 'bg-[var(--accent-solid)]' : 'bg-white/30'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
