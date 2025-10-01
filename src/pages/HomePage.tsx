import { Trophy, DollarSign, Car as CarIcon, BadgeCheck } from 'lucide-react';
import { HeroSection } from '../components/HeroSection';
import { CarCard } from '../components/CarCard';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { collection, query, orderBy, limit, where, addDoc, serverTimestamp, getDocs, getDoc, doc } from 'firebase/firestore';
import { db, COLLECTIONS } from '../firebase/firebase';
import type { Car } from '@/types/car';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { normalizeImageUrls } from '@/utils/images';

const whyChooseUsFeatures = [
  {
    icon: Trophy,
    title: "Trusted Dealers",
    description: "Over 20 years of experience in the automotive industry with thousands of satisfied customers."
  },
  {
    icon: DollarSign,
    title: "Affordable Pricing",
    description: "Competitive prices and flexible financing options to help you get your dream car."
  },
  {
    icon: BadgeCheck,
    title: "Verified Listings",
    description: "Every listing is reviewed for accuracy so you can shop with confidence."
  },
  {
    icon: CarIcon,
    title: "Easy Financing",
    description: "We connect you with flexible financing options tailored to your needs."
  }
] as const;

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
  const [addingTestData, setAddingTestData] = useState(false);
  const [brands, setBrands] = useState<string[]>([]);
  const [brandsLoading, setBrandsLoading] = useState<boolean>(true);

  const addTestCars = async () => {
    setAddingTestData(true);
    
    const testCars = [
      {
        brand: "Ferrari",
        model: "488 GTB",
        year: 2023,
        price: 285000,
        mileage: "2500",
        fuelType: "Gasoline",
        condition: "New",
        transmission: "Automatic",
        description: "Stunning Ferrari 488 GTB in pristine condition",
        features: ["Carbon Fiber Interior", "Sport Package", "Navigation", "Premium Sound"],
        imageUrls: [
          "https://images.unsplash.com/photo-1653047256226-5abbfa82f1d7?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1614013719401-6b8e63f5e64d?w=800&h=600&fit=crop"
        ],
        status: "published",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        brand: "Tesla",
        model: "Model S",
        year: 2024,
        price: 89000,
        mileage: "1200",
        fuelType: "Electric",
        condition: "New",
        transmission: "Automatic",
        description: "Latest Tesla Model S with full self-driving capability",
        features: ["Autopilot", "Premium Sound", "Extended Range", "Heated Seats"],
        imageUrls: [
          "https://images.unsplash.com/photo-1610470850940-27b52ca7c0fe?w=800&h=600&fit=crop"
        ],
        status: "published",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        brand: "BMW",
        model: "M3 Competition",
        year: 2023,
        price: 75000,
        mileage: "5000",
        fuelType: "Gasoline",
        condition: "Used",
        transmission: "Automatic",
        description: "High-performance BMW M3 with sport package",
        features: ["M Performance Package", "Carbon Fiber Trim", "Adaptive Suspension"],
        imageUrls: [
          "https://images.unsplash.com/photo-1553416204-ba45ce9a8aad?w=800&h=600&fit=crop"
        ],
        status: "published",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
    ];

    try {
      for (const car of testCars) {
        await addDoc(collection(db, COLLECTIONS.CARS), car);
      }
      console.log('✅ Test cars added successfully!');
    } catch (error) {
      console.error('❌ Error adding test cars:', error);
    }
    
    setAddingTestData(false);
  };

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
        console.log('HomePage: Final fallback loaded cars:', cars.length);
        setFeaturedCars(cars);
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

  const handleExploreClick = () => {
    navigate('/explore');
  };

  return (
    <>
      <HeroSection
        title="Discover Your Dream Car"
        subtitle="Explore our curated collection of luxury and performance vehicles"
        buttonText="Browse Collection"
        onButtonClick={handleExploreClick}
        overlayOpacity={0.55}
      />

      {/* Featured Cars Section */}
      <section id="featured-cars" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Cars</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium vehicles, featuring the latest models and best deals.
            </p>

          </div>

          {loading ? (
            // Loading state
            <>
              {/* Mobile carousel loading */}
              <div className="md:hidden -mx-4 px-4">
                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                  {Array(4).fill(null).map((_, idx) => (
                    <div key={idx} className="snap-center shrink-0 w-[80%]">
                      <div className="animate-pulse">
                        <div className="h-80 bg-gray-200 rounded-lg" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop grid loading */}
              <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array(8).fill(null).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="h-80 bg-gray-200 rounded-lg" />
                  </div>
                ))}
              </div>
            </>
          ) : featuredCars.length === 0 ? (
            // No cars state
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-gray-400">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Featured Cars Available</h3>
              <p className="text-gray-600 mb-6">We're currently updating our inventory. Check back soon for amazing deals!</p>
              <div className="space-y-4">
                <Button
                  onClick={addTestCars}
                  disabled={addingTestData}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
                >
                  {addingTestData ? 'Adding Cars...' : 'Add Sample Cars'}
                </Button>
                <br />
                <button
                  onClick={() => navigate('/explore')}
                  className="inline-flex items-center rounded-full bg-slate-900 text-white px-6 py-3 text-sm font-medium shadow hover:bg-slate-800 transition-colors"
                >
                  Browse All Cars
                </button>
              </div>
            </div>
          ) : (
            // Cars available
            <>
              {/* Desktop grid 4x2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredCars.slice(0, 8).map((car: Car) => (
                  <CarCard key={car.id} {...car} />
                ))}
              </div>


              {/* Show More button */}
              {featuredCars.length > 0 && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => navigate('/explore')}
                    className="inline-flex items-center rounded-full bg-slate-900 text-white px-6 py-3 text-sm font-medium shadow hover:bg-slate-800 transition-colors"
                  >
                    View All Cars ({featuredCars.length > 8 ? `${featuredCars.length - 8}+ more` : 'Show More'})
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Browse by Brand */}
      <section id="browse-by-brand" className="py-14 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">Browse by Brand</h2>
            <Button variant="ghost" onClick={() => navigate('/explore')} className="hidden md:inline-flex">View all</Button>
          </div>
          <div className="-mx-4 px-4">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide py-2">
              {brandsLoading ? (
                Array(8).fill(null).map((_, i) => (
                  <div key={i} className="shrink-0 h-10 w-28 rounded-full bg-gray-200 animate-pulse" />
                ))
              ) : (
                brands.map((brand: string) => (
                  <button
                    key={brand}
                    onClick={() => navigate(`/explore?brand=${encodeURIComponent(brand)}`)}
                    className="shrink-0 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                    aria-label={`Filter by ${brand}`}
                  >
                    <span className="inline-block h-6 w-6 rounded-full bg-gray-100 text-gray-500 grid place-items-center text-[10px]">{brand[0]}</span>
                    {brand}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Recommendations */}
      {/* Removed Best Value/Recommendations section */}
      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {whyChooseUsFeatures.map((feature, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-50 rounded-full group">
                      <feature.icon className="w-8 h-8 text-blue-600 group-hover:scale-105 transition-transform" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-center">{feature.title}</h3>
                  <p className="text-gray-600 text-center">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_#60a5fa,_transparent_40%),_radial-gradient(circle_at_bottom_left,_#34d399,_transparent_40%)]" />
            <div className="relative px-6 py-12 md:px-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-2">Ready to Find Your Perfect Car?</h3>
                <p className="text-slate-200/90 max-w-2xl">Browse our full inventory, compare options, and connect with trusted sellers in minutes.</p>
              </div>
              <Button onClick={() => navigate('/explore')} className="bg-white text-slate-900 hover:bg-slate-100 px-6 py-6 rounded-full font-semibold">Explore Cars</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}