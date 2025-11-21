import { HeroSection } from '../components/HeroSection';
import { IntroSection } from '../components/IntroSection';
import { BestDeals } from '../components/BestDeals';
import { DreamSection } from '../components/DreamSection';
import { GreatestSection } from '../components/GreatestSection';
import { ValuesSection } from '../components/ValuesSection';
import { PremiumSection } from '../components/PremiumSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { StatsSection } from '../components/StatsSection';
import { CTASection } from '../components/CTASection';
import { CarCard } from '../components/CarCard';
import { Button } from '../components/ui/button';
import { CarCardSkeleton } from '../components/ui/skeleton';
import { collection, query, orderBy, limit, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { db, COLLECTIONS } from '../firebase/firebase';
import type { Car } from '@/types/car';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { normalizeImageUrls } from '@/utils/images';

// Fallback list used when Firestore doesn't return any brands
const fallbackBrands = [
  'Toyota',
  'BMW',
  'Mercedes',
  'Audi',
  'Honda',
  'Nissan',
  'Kia',
  'Hyundai',
  'Tesla',
  'Ford'
]

export function HomePage() {
  const navigate = useNavigate();
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<string[]>([]);
  const [brandsLoading, setBrandsLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log('HomePage: Initializing featured cars...');
  let unsub: (() => void) | undefined;

    (async () => {
      // Attempt 1: dedicated FEATURED collection
      try {
        console.log('HomePage: Trying FEATURED collection first...');
        const featSnap = await getDocs(query(collection(db, COLLECTIONS.FEATURED), limit(8)));
        if (!featSnap.empty) {
          const cars = await Promise.all(featSnap.docs.map(async (d) => {
            const data = d.data() as any;
            try {
              // Supported shapes: { carId }, or the doc.id is the carId, or inline car fields
              const carId: string | undefined = data?.carId || d.id;
              if (data && data.brand && data.model && data.price) {
                const inlineCar = { id: d.id, ...data } as Car;
                inlineCar.imageUrls = normalizeImageUrls(inlineCar);
                return inlineCar;
              }
              if (carId) {
                const ref = doc(db as any, COLLECTIONS.CARS, carId);
                const carDoc = await getDoc(ref);
                if (carDoc.exists()) {
                  const car = { id: carDoc.id, ...carDoc.data() } as Car;
                  car.imageUrls = normalizeImageUrls(car);
                  return car;
                }
              }
            } catch (e) {
              console.warn('HomePage: Error resolving featured car reference:', e);
            }
            return null;
          }));
          const resolved = cars.filter(Boolean) as Car[];
          if (resolved.length > 0) {
            console.log('HomePage: Loaded featured cars from FEATURED collection:', resolved.length);
            setFeaturedCars(resolved);
            setLoading(false);
            return; // Success, don't set up fallbacks
          }
        }
      } catch (e) {
        console.warn('HomePage: FEATURED collection unavailable or error:', e);
      }

      console.log('HomePage: Falling back to cars collection queries...');
      const baseCol = collection(db, COLLECTIONS.CARS);

      // Try published + createdAt desc first with getDocs; if index is required, gracefully retry
      try {
        const publishedOrdered = await getDocs(
          query(baseCol, where('status', '==', 'published'), orderBy('createdAt', 'desc'), limit(8))
        );
        if (!publishedOrdered.empty) {
          const cars = publishedOrdered.docs.map((d) => {
            const data = d.data();
            const car = { id: d.id, ...data } as Car;
            car.imageUrls = normalizeImageUrls(car);
            return car;
          });
          setFeaturedCars(cars);
          setLoading(false);
          return;
        }
      } catch (err: any) {
        console.warn('HomePage: Published+ordered query failed (likely missing index). Retrying without orderBy...', err?.message || err);
      }

      // Retry: published only, no orderBy (no index required)
      try {
        console.log('HomePage: Trying published-only query (no orderBy)...');
        const publishedOnly = await getDocs(query(baseCol, where('status', '==', 'published'), limit(8)));
        console.log('HomePage: Published-only query result:', publishedOnly.docs.length, 'documents');
        if (!publishedOnly.empty) {
          const cars = publishedOnly.docs.map((d) => {
            const data = d.data();
            const car = { id: d.id, ...data } as Car;
            car.imageUrls = normalizeImageUrls(car);
            return car;
          });
          setFeaturedCars(cars);
          setLoading(false);
          return;
        }
        console.log('HomePage: No published cars found, trying next fallback...');
      } catch (err) {
        console.warn('HomePage: Published-only query failed, proceeding to general fallbacks...', err);
      }

      // Fallback: any cars ordered by createdAt desc
      try {
        console.log('HomePage: Trying recent cars with orderBy...');
        const recent = await getDocs(query(baseCol, orderBy('createdAt', 'desc'), limit(8)));
        console.log('HomePage: Recent cars query result:', recent.docs.length, 'documents');
        if (!recent.empty) {
          const cars = recent.docs.map((d) => {
            const data = d.data();
            const car = { id: d.id, ...data } as Car;
            car.imageUrls = normalizeImageUrls(car);
            return car;
          });
          console.log('HomePage: Successfully loaded recent cars:', cars.length);
          setFeaturedCars(cars);
          setLoading(false);
          return;
        }
        console.log('HomePage: No recent cars found, trying final fallback...');
      } catch (err) {
        console.warn('HomePage: Recent cars ordered query failed, trying simple limit...', err);
      }

      // Last resort: any cars, no order
      try {
        console.log('HomePage: Trying any cars (no filters, no order)...');
        const anyDocs = await getDocs(query(baseCol, limit(8)));
        console.log('HomePage: Any cars query result:', anyDocs.docs.length, 'documents');
        const cars = anyDocs.docs.map((d) => {
          const data = d.data();
          const car = { id: d.id, ...data } as Car;
          car.imageUrls = normalizeImageUrls(car);
          return car;
        });
        const visible = cars.filter(c => ['published','new','sold'].includes((c.status || 'draft') as string));
        console.log('HomePage: Final fallback loaded cars:', visible.length);
        setFeaturedCars(visible);
        setLoading(false);
      } catch (err) {
        console.error('HomePage: Final fallback failed:', err);
        setLoading(false);
      }
    })();

    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  // Load distinct brands for Browse by Brand
  useEffect(() => {
    const loadBrands = async () => {
      try {
        setBrandsLoading(true);
        const snap = await getDocs(
          query(collection(db, COLLECTIONS.CARS), where('status', '==', 'published'), limit(200))
        );
        const brandSet = new Set<string>();
        snap.forEach((d) => {
          const data = d.data() as any;
          const b: string | undefined = data?.brand || data?.Brand || data?.make;
          if (b && typeof b === 'string') brandSet.add(b.trim());
        });
        const list = Array.from(brandSet).sort((a, b) => a.localeCompare(b));
        setBrands(list.length ? list : fallbackBrands);
      } catch (e) {
        console.warn('HomePage: Failed to load brands, using fallback.', e);
        setBrands(fallbackBrands);
      } finally {
        setBrandsLoading(false);
      }
    };
    loadBrands();
  }, []);

  return (
    <>
      <HeroSection />
      <IntroSection />
      <BestDeals />
      <DreamSection />
      <GreatestSection />
      <ValuesSection />
      <PremiumSection />
      <TestimonialsSection />
      <StatsSection />
      <CTASection />

      {/* Legacy Featured Cars Section - kept for existing data */}
      <section id="featured-cars" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">New Arrivals</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our latest additions to the collection
            </p>
          </div>

          {loading ? (
            <>
              <div className="md:hidden -mx-4 px-4">
                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                  {Array(4).fill(null).map((_, idx) => (
                    <div key={idx} className="snap-center shrink-0 w-[80%]">
                      <CarCardSkeleton />
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
                {Array(8).fill(null).map((_, index) => (
                  <CarCardSkeleton key={index} />
                ))}
              </div>
            </>
          ) : featuredCars.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-gray-400">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Featured Cars Available</h3>
              <p className="text-gray-600 mb-6">Check back soon for amazing deals!</p>
              <button
                onClick={() => navigate('/explore')}
                className="inline-flex items-center rounded-full bg-amber-600 text-white px-6 py-3 text-sm font-medium shadow hover:bg-amber-700 transition-colors"
              >
                Browse All Cars
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
                {featuredCars.slice(0, 8).map((car: Car) => (
                  <div key={car.id} className="h-full">
                    <CarCard {...car} />
                  </div>
                ))}
              </div>

              {featuredCars.length > 0 && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => navigate('/explore')}
                    className="inline-flex items-center rounded-full bg-amber-600 text-white px-6 py-3 text-sm font-medium shadow hover:bg-amber-700 transition-colors"
                  >
                    Show More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Browse by Brand */}
      <section id="browse-by-brand" className="py-14 border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">Browse by Brand</h2>
            <Button variant="ghost" onClick={() => navigate('/explore')} className="hidden md:inline-flex">View all</Button>
          </div>
          <div className="md:hidden -mx-4 px-4">
            <div className="flex gap-3.5 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-2">
              {brandsLoading ? (
                Array(10).fill(null).map((_, i) => (
                  <div key={i} className="snap-start shrink-0 h-10 w-28 rounded-full bg-gray-200 animate-pulse" />
                ))
              ) : (
                brands.map((brand: string) => (
                  <button
                    key={brand}
                    onClick={() => navigate(`/explore?brand=${encodeURIComponent(brand)}`)}
                    className="snap-start shrink-0 inline-flex items-center gap-2 rounded-full ring-1 ring-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:ring-gray-300 hover:bg-gray-50 shadow-sm transition-colors"
                    aria-label={`Filter by ${brand}`}
                  >
                    <span className="inline-grid place-items-center h-6 w-6 rounded-full bg-gray-100 text-gray-500 text-[10px] font-semibold">{brand[0]}</span>
                    {brand}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="hidden md:block">
            <div className="flex flex-wrap gap-3.5">
              {brandsLoading ? (
                Array(14).fill(null).map((_, i) => (
                  <div key={i} className="h-10 w-28 rounded-full bg-gray-200 animate-pulse" />
                ))
              ) : (
                brands.map((brand: string) => (
                  <button
                    key={brand}
                    onClick={() => navigate(`/explore?brand=${encodeURIComponent(brand)}`)}
                    className="inline-flex items-center gap-2 rounded-full ring-1 ring-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:ring-gray-300 hover:bg-gray-50 shadow-sm transition-colors"
                    aria-label={`Filter by ${brand}`}
                  >
                    <span className="inline-grid place-items-center h-6 w-6 rounded-full bg-gray-100 text-gray-500 text-[10px] font-semibold">{brand[0]}</span>
                    {brand}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}