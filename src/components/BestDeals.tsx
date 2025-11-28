// Define the Deal interface
interface Deal {
  id: string;
  soldOut: boolean;
  image: string;
  name: string;
  price: string;
  msrp: string;
  location: string;
  fuel: string;
  mileage: string;
  engine: string;
  type: string;
  date: string;
}

// Replace hardcoded deals with database fetching logic
import { ArrowRight, Share2, MapPin, Settings, Car as CarIcon, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, COLLECTIONS } from '@/firebase/firebase';

export function BestDeals() {
  const [deals, setDeals] = useState<Deal[]>([]);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const dealsCollection = collection(db, COLLECTIONS.CARS);
        const dealsSnapshot = await getDocs(dealsCollection);
        const dealsData = dealsSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as Deal))
          .slice(0, 3); // Limit to 3 recommended items
        setDeals(dealsData);
      } catch (error) {
        console.error('Error fetching deals:', error);
      }
    };

    fetchDeals();
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-4 border-b-4 border-[#FFD700] pb-4">
          <h2 className="text-4xl md:text-5xl font-bold text-[#001F3F]">Nabus Best Deals</h2>
          <button className="text-[#FFD700] hover:text-[#FFC700] flex items-center gap-2 transition-colors duration-300 hidden md:flex">
            View All
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {deals.map((deal) => (
            <div key={deal.id} className="bg-white rounded overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 relative hover:border-[#FFD700]">
              {deal.soldOut && (
                <div className="absolute top-0 left-0 z-10">
                  <div className="bg-[#FFD700] text-[#001F3F] px-8 py-1 text-xs transform -rotate-45 -translate-x-7 translate-y-4 font-semibold">
                    SPECIAL
                  </div>
                </div>
              )}

              <div className="relative h-48 bg-gray-100">
                {deal.image ? (
                  <img 
                    src={deal.image}
                    alt={deal.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1552821206-9ff0f4ff2a0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                    <CarIcon className="w-12 h-12 text-gray-500" />
                  </div>
                )}
                <div className="absolute bottom-0 right-0 bg-[#001F3F] text-white px-4 py-2 flex items-baseline gap-2">
                  <span className="text-xl font-bold">{deal.price}</span>
                  <span className="text-xs text-gray-300">MSRP: {deal.msrp}</span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-lg mb-1 text-[#001F3F]">{deal.name}</h4>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" /> {deal.location}
                    </div>
                  </div>
                  {deal.soldOut && (
                    <span className="text-xs px-2 py-1 border-2 border-[#FFD700] text-[#FFD700] rounded font-semibold">
                      SOLD OUT
                    </span>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="grid grid-cols-4 gap-2 text-xs text-gray-600 mb-3">
                    <div className="flex items-center gap-1"><Settings className="w-4 h-4 flex-shrink-0" /><span>{deal.fuel || 'N/A'}</span></div>
                    <div className="flex items-center gap-1"><CarIcon className="w-4 h-4 flex-shrink-0" /><span>{deal.mileage || 'N/A'}</span></div>
                    <div className="flex items-center gap-1"><Settings className="w-4 h-4 flex-shrink-0" /><span>{deal.engine || 'N/A'}</span></div>
                    <div className="flex items-center gap-1"><CarIcon className="w-4 h-4 flex-shrink-0" /><span>{deal.type || 'N/A'}</span></div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-200">
                    <div className="flex items-center gap-1"><Clock className="w-4 h-4 flex-shrink-0" /><span>{deal.date || 'N/A'}</span></div>
                    <button className="hover:text-amber-500 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
