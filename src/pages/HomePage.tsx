import { CarCard } from '../components/CarCard';
import { HeroCarousel } from '../components/HeroCarousel';
import { ContactFormDialog } from '../components/ContactFormDialog';
import { TestDriveDialog } from '../components/TestDriveDialog';
import { Button } from '../components/ui/button';
import { collection, query, orderBy, limit, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { db, COLLECTIONS } from '../firebase/firebase';
import type { Car } from '@/types/car';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { normalizeImageUrls } from '@utils/images';

// Marketing texts for hero section
const marketingTexts = [
  'Premium vehicles for the discerning driver',
  'Your journey to luxury starts here',
  'Excellence in every mile',
  'Drive with confidence and style',
  'Where quality meets affordability',
  'Your dream car awaits',
  'Premium selection, exceptional service',
  'Unleash your automotive passion',
];

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
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const [testDriveOpen, setTestDriveOpen] = useState(false);
  const [currentMarketingText, setCurrentMarketingText] = useState(0);

  // Rotate marketing text every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMarketingText((prev) => (prev + 1) % marketingTexts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Load featured cars
  useEffect(() => {
    let unsub: (() => void) | undefined;

    (async () => {
      // Attempt 1: dedicated FEATURED collection
      try {
        console.log('HomePage: Trying FEATURED collection first...');
        const featSnap = await getDocs(query(collection(db, COLLECTIONS.FEATURED), limit(6)));
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
          query(baseCol, where('status', '==', 'published'), orderBy('createdAt', 'desc'), limit(6))
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
        const publishedOnly = await getDocs(query(baseCol, where('status', '==', 'published'), limit(6)));
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
        const recent = await getDocs(query(baseCol, orderBy('createdAt', 'desc'), limit(6)));
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
        const anyDocs = await getDocs(query(baseCol, limit(6)));
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
      {/* Premium Hero Section - starts right below fixed navbar */}
      <section className="relative w-full overflow-hidden bg-black text-white mt-16">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#001F3F] via-black to-[#0a0e27]" />

        <div className="relative w-full flex flex-col lg:flex-row">
          {/* Left - Carousel (Mobile shows on top, stacks on desktop) */}
          <div className="w-full lg:w-3/5 h-[60vh] sm:h-[55vh] md:h-[50vh] lg:h-[80vh] order-first lg:order-none">
            {loading ? (
              <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 animate-pulse flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-400 mb-2">Curating premium selection...</p>
                </div>
              </div>
            ) : featuredCars.length > 0 ? (
              <HeroCarousel 
                cars={featuredCars.slice(0, 8)} 
                autoPlayInterval={5000}
                onCarSelect={setSelectedCar}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                <p className="text-gray-400">No vehicles available</p>
              </div>
            )}
          </div>

          {/* Right - Premium Content */}
          <div className="w-full lg:w-2/5 h-auto lg:h-[80vh] flex flex-col justify-center px-6 sm:px-8 lg:px-10 py-8 lg:py-16 bg-gradient-to-b lg:bg-gradient-to-r from-[#001F3F]/50 to-transparent overflow-y-auto lg:overflow-y-visible">
            <div className="w-full max-w-xl space-y-8">
              {/* Premium Badge */}
              <div className="inline-flex items-center gap-2 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-full px-4 py-2 w-fit">
                <span className="text-[#FFD700] text-xs font-bold uppercase tracking-widest">Premium Selection</span>
              </div>

              {/* Main Heading */}
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black leading-tight mb-4 text-white drop-shadow-lg">
                  Luxury Awaits
                </h1>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-lg font-medium min-h-[3rem] transition-all duration-500">
                  {marketingTexts[currentMarketingText]}
                </p>
              </div>

              {/* Premium CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={() => setContactFormOpen(true)}
                  className="bg-[#FFD700] hover:bg-[#FFC700] text-[#001F3F] px-8 py-4 font-bold uppercase tracking-widest transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-[#FFD700]/30 group flex items-center justify-center gap-2 rounded-lg"
                >
                  Reserve Now
                  <span className="text-lg group-hover:translate-x-1 transition-transform duration-300">→</span>
                </button>
                <button
                  onClick={() => setTestDriveOpen(true)}
                  className="bg-transparent hover:bg-white/10 text-white px-8 py-4 font-bold uppercase tracking-widest border-2 border-[#FFD700] transition-all duration-300 rounded-lg hover:shadow-lg hover:shadow-[#FFD700]/20"
                >
                  Test Drive
                </button>
              </div>

              {/* Secondary CTA */}
              <button
                onClick={() => navigate('/explore')}
                className="text-gray-400 hover:text-white font-semibold text-sm uppercase tracking-widest transition-colors duration-300 flex items-center gap-2 group"
              >
                <span>Explore All Vehicles</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </button>

              {/* Trust Indicators - Mobile optimized */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-black text-[#FFD700] mb-1">50+</div>
                  <div className="text-xs text-slate-400">Cars Listed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-black text-[#FFD700] mb-1">24/7</div>
                  <div className="text-xs text-slate-400">Support</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-black text-[#FFD700] mb-1">100%</div>
                  <div className="text-xs text-slate-400">Verified</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Order by Body Style - Inspired by ZosiaZureau */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold mb-12">Order by Body Style</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {['Coupe', 'Convertible', 'SUV', 'Sedan', 'Hatchback', 'Pickup', 'Van'].map((style) => (
              <button
                key={style}
                onClick={() => navigate(`/explore?bodyStyle=${encodeURIComponent(style)}`)}
                className="py-8 px-4 border border-slate-200 text-center font-semibold text-slate-900 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
              >
                {style}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles - Inspired by ZosiaZureau */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Vehicles</h2>
            <p className="text-gray-600">Suggested by Dealer</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6).fill(null).map((_, index) => (
                <div key={index} className="bg-gray-100 animate-pulse aspect-square" />
              ))}
            </div>
          ) : featuredCars.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Featured Cars Available</h3>
              <p className="text-gray-600 mb-6">Check back soon for amazing deals!</p>
              <button
                onClick={() => navigate('/explore')}
                className="inline-flex items-center bg-slate-900 text-white px-8 py-3 font-semibold hover:bg-slate-800 transition-colors"
              >
                Browse All Cars
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredCars.slice(0, 6).map((car: Car) => (
                  <CarCard key={car.id} {...car} />
                ))}
              </div>

              {featuredCars.length > 6 && (
                <div className="mt-12 flex justify-center">
                  <button
                    onClick={() => navigate('/explore')}
                    className="bg-slate-900 text-white px-8 py-3 font-semibold hover:bg-slate-800 transition-colors"
                  >
                    View All Inventory
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Dream Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Services</h2>
            <p className="text-gray-600 text-lg">How can we help to make your dream come true</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Inventory', desc: 'Browse our extensive collection' },
              { title: 'VIP Appointment', desc: 'Schedule a personal viewing' },
              { title: 'Auto Finance', desc: 'Flexible financing options' },
              { title: 'Auto Services', desc: 'Complete maintenance & support' }
            ].map((service, idx) => (
              <div key={idx} className="bg-white p-8 border border-slate-200 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold mb-3 text-slate-900">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.desc}</p>
                <button className="text-slate-900 font-semibold hover:underline">
                  Learn More →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold mb-16">Why Choose Us</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { stat: '1200+', label: 'Vehicles in stock' },
              { stat: '20k', label: 'Happy Customers' },
              { stat: '15', label: 'Showrooms' },
              { stat: '30', label: 'Awards' }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">{item.stat}</div>
                <div className="text-slate-300">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Brand */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Browse by Brand</h2>
            <Button variant="outline" onClick={() => navigate('/explore')} className="hidden md:inline-flex">
              View all →
            </Button>
          </div>

          <div className="flex flex-wrap gap-3">
            {brandsLoading ? (
              Array(14).fill(null).map((_, i) => (
                <div key={i} className="h-10 w-24 bg-gray-200 animate-pulse" />
              ))
            ) : (
              brands.map((brand: string) => (
                <button
                  key={brand}
                  onClick={() => navigate(`/explore?brand=${encodeURIComponent(brand)}`)}
                  className="px-6 py-2 border border-slate-300 text-slate-900 font-medium hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
                >
                  {brand}
                </button>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to find your next vehicle?</h2>
          <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
            Explore our complete inventory and discover the perfect car for your lifestyle.
          </p>
          <button
            onClick={() => navigate('/explore')}
            className="bg-white text-slate-900 px-8 py-3 font-semibold hover:bg-slate-100 transition-colors shadow-lg"
          >
            Explore All Cars
          </button>
        </div>
      </section>

      {/* Contact Form Dialog */}
      <ContactFormDialog 
        open={contactFormOpen} 
        onOpenChange={setContactFormOpen}
        carTitle={selectedCar ? `${selectedCar.year} ${selectedCar.brand} ${selectedCar.model}` : undefined}
      />

      {/* Test Drive Dialog */}
      <TestDriveDialog 
        open={testDriveOpen} 
        onOpenChange={setTestDriveOpen}
        carTitle={selectedCar ? `${selectedCar.year} ${selectedCar.brand} ${selectedCar.model}` : undefined}
      />
    </>
  );
}
