import { Trophy, DollarSign, Car as CarIcon } from 'lucide-react';
import { HeroSection } from '../components/HeroSection';
import { CarCard } from '../components/CarCard';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { collection, query, onSnapshot, orderBy, limit, where, addDoc, serverTimestamp } from 'firebase/firestore';
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
    icon: CarIcon,
    title: "Wide Selection",
    description: "Extensive inventory of luxury, sports, and family vehicles from top manufacturers."
  }
] as const;

export function HomePage() {
  const navigate = useNavigate();
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingTestData, setAddingTestData] = useState(false);

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
    console.log('HomePage: Setting up featured cars query...');
    console.log('HomePage: Using collection:', COLLECTIONS.CARS);
    
    // First try to get featured cars marked as such
    const featuredQuery = query(
      collection(db, COLLECTIONS.CARS),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc'),
      limit(8)
    );

    const unsub = onSnapshot(featuredQuery, (snapshot) => {
      console.log('HomePage: Firestore query result:', snapshot.docs.length, 'documents');
      console.log('HomePage: Snapshot metadata:', snapshot.metadata);
      
      if (snapshot.docs.length === 0) {
        console.log('HomePage: No published cars found, trying fallback query...');
        // Fallback: get any cars in the database
        const fallbackQuery = query(
          collection(db, COLLECTIONS.CARS),
          orderBy('createdAt', 'desc'),
          limit(8)
        );
        
        onSnapshot(fallbackQuery, (fallbackSnapshot) => {
          console.log('HomePage: Fallback query result:', fallbackSnapshot.docs.length, 'documents');
          
          if (fallbackSnapshot.docs.length === 0) {
            console.log('HomePage: No cars found even in fallback. Trying without orderBy...');
            // Second fallback: just get any cars without ordering
            const simpleQuery = query(
              collection(db, COLLECTIONS.CARS),
              limit(8)
            );
            
            onSnapshot(simpleQuery, (simpleSnapshot) => {
              console.log('HomePage: Simple query result:', simpleSnapshot.docs.length, 'documents');
              const cars = simpleSnapshot.docs.map((d) => {
                const data = d.data();
                console.log('HomePage: Raw car data:', data);
                const car = { id: d.id, ...data } as Car;
                // Normalize image URLs
                car.imageUrls = normalizeImageUrls(car);
                console.log('HomePage: Processed car:', { id: car.id, imageCount: car.imageUrls.length });
                return car;
              });
              setFeaturedCars(cars);
              setLoading(false);
            });
          } else {
            const cars = fallbackSnapshot.docs.map((d) => {
              const data = d.data();
              console.log('HomePage: Fallback car data:', data);
              const car = { id: d.id, ...data } as Car;
              // Normalize image URLs
              car.imageUrls = normalizeImageUrls(car);
              console.log('HomePage: Fallback car processed:', { id: car.id, imageCount: car.imageUrls.length });
              return car;
            });
            console.log('HomePage: Fallback cars loaded:', cars.length);
            setFeaturedCars(cars);
            setLoading(false);
          }
        });
      } else {
        const cars = snapshot.docs.map((d) => {
          const data = d.data();
          console.log('HomePage: Published car data:', data);
          const car = { id: d.id, ...data } as Car;
          // Normalize image URLs
          car.imageUrls = normalizeImageUrls(car);
          console.log('HomePage: Featured car processed:', { id: car.id, imageCount: car.imageUrls.length });
          return car;
        });
        console.log('HomePage: Featured cars loaded:', cars.length);
        setFeaturedCars(cars);
        setLoading(false);
      }
    }, (err) => {
      console.error('HomePage: Error fetching featured cars:', err);
      console.error('HomePage: Error details:', err.message);
      setLoading(false);
    });

    return () => unsub();
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
              {/* Mobile carousel */}
              <div className="md:hidden -mx-4 px-4">
                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                  {featuredCars.slice(0, 8).map((car: Car) => (
                    <div key={car.id} className="snap-center shrink-0 w-[80%]">
                      <CarCard {...car} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop grid 4x2 */}
              <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredCars.slice(0, 8).map((car: Car) => (
                  <CarCard key={car.id} {...car} />
                ))}
              </div>

              {/* Show More button */}
              {featuredCars.length > 0 && (
                <div className="mt-10 flex justify-center">
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
      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyChooseUsFeatures.map((feature, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-50 rounded-full">
                      <feature.icon className="w-8 h-8 text-blue-600" />
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
    </>
  );
}