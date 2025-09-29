import { HeroSection } from '../components/HeroSection';
import { CarCard } from '../components/CarCard';
import { Card, CardContent } from '../components/ui/card';
import { collection, query, onSnapshot, orderBy, limit, where, Timestamp } from 'firebase/firestore';
import { db, COLLECTIONS } from '../firebase/firebase';
import type { Car } from '@/types/car';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const whyChooseUsFeatures = [
  {
    icon: "🏆",
    title: "Trusted Dealers",
    description: "Over 20 years of experience in the automotive industry with thousands of satisfied customers."
  },
  {
    icon: "💰",
    title: "Affordable Pricing",
    description: "Competitive prices and flexible financing options to help you get your dream car."
  },
  {
    icon: "🚗",
    title: "Wide Selection",
    description: "Extensive inventory of luxury, sports, and family vehicles from top manufacturers."
  }
] as const;

export function HomePage() {
  const navigate = useNavigate();
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Calculate the date 3 months ago
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const threeMonthsAgoTimestamp = Timestamp.fromDate(threeMonthsAgo);

    const carsQuery = query(
      collection(db, COLLECTIONS.CARS),
      where('createdAt', '>=', threeMonthsAgoTimestamp),
      orderBy('createdAt', 'desc'),
      limit(8)
    );

    const unsub = onSnapshot(carsQuery, (snapshot) => {
      console.log('Firestore query result:', snapshot.docs.length, 'documents');
      const list = snapshot.docs.map((d) => {
        const data = d.data();
        console.log('Car data:', { id: d.id, ...data });
        return { id: d.id, ...data };
      }) as Car[];
      console.log('Featured cars:', list);
      setFeaturedCars(list);
      setLoading(false);
    }, (err) => {
      console.error('Error fetching featured cars:', err);
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
          <h2 className="text-3xl font-bold text-center mb-12">Featured Cars</h2>

          {/* Mobile carousel */}
          <div className="md:hidden -mx-4 px-4">
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              {(loading ? Array(4).fill(null) : featuredCars).slice(0, 8).map((car: any, idx: number) => (
                <div key={car?.id ?? idx} className="snap-center shrink-0 w-[80%]">
                  {loading ? (
                    <div className="animate-pulse">
                      <div className="h-48 bg-gray-200 rounded-lg mb-4" />
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  ) : (
                    <CarCard {...car} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Desktop grid 4x2 */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array(8).fill(null).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))
            ) : (
              featuredCars.slice(0,8).map((car: Car) => (
                <CarCard key={car.id} {...car} />
              ))
            )}
          </div>

          {/* Show More button */}
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => navigate('/explore')}
              className="inline-flex items-center rounded-full bg-slate-900 text-white px-6 py-3 text-sm font-medium shadow hover:bg-red-600 transition-colors"
            >
              Show More
            </button>
          </div>
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
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}