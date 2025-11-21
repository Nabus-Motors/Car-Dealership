import { ArrowRight, Fuel, Gauge, Calendar, MapPin, Share2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const deals = [
  {
    id: 1,
    name: '2019 Lamborghini Urus',
    year: 2019,
    price: '$85,000',
    msrp: '$89,000',
    image: 'https://images.unsplash.com/photo-1567808291548-fc3ee04dbcf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjYXIlMjBibGFja3xlbnwxfHx8fDE3NjM1NjA0MzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    location: 'Miami, USA',
    fuel: 'Petrol',
    mileage: '20',
    engine: '4.0 cc',
    type: 'SUV',
    date: 'March 26, 2021',
    soldOut: true
  },
  {
    id: 2,
    name: '2019 Ford Ranger Raptor',
    year: 2019,
    price: '$85,000',
    msrp: '$89,000',
    image: 'https://images.unsplash.com/photo-1580959046674-8fc8f92b5fd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHNlZGFuJTIwY2FyfGVufDF8fHx8MTc2MzU2ODczNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    location: 'Miami, USA',
    fuel: 'Petrol',
    mileage: '20',
    engine: '2.0 cc',
    type: 'SUV',
    date: 'March 26, 2021',
    soldOut: false
  },
  {
    id: 3,
    name: '2019 Chevrolet Corvette ZR1',
    year: 2019,
    price: '$85,000',
    msrp: '$89,000',
    image: 'https://images.unsplash.com/photo-1653047256226-5abbfa82f1d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBzcG9ydHMlMjBjYXJ8ZW58MXx8fHwxNzYzNTQ3MTY0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    location: 'Miami, USA',
    fuel: 'Petrol',
    mileage: '5',
    engine: '6.2 cc',
    type: 'Sports car',
    date: 'March 26, 2021',
    soldOut: false
  },
  {
    id: 4,
    name: '2021 Mercedes-AMG E63 S',
    year: 2021,
    price: '$230,000',
    msrp: '$240,000',
    image: 'https://images.unsplash.com/photo-1639280791656-5f8506ff21d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXYlMjBjYXJ8ZW58MXx8fHwxNzYzNTM4NDQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    location: 'Miami, USA',
    fuel: 'Petrol',
    mileage: '0',
    engine: '4.0 cc',
    type: 'Sedan',
    date: 'March 26, 2021',
    soldOut: false,
    special: true
  },
  {
    id: 5,
    name: '2021 Mercedes-Benz S-Class',
    year: 2021,
    price: '$85,000',
    msrp: '$89,000',
    image: 'https://images.unsplash.com/photo-1742056024244-02a093dae0b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzcG9ydHMlMjBjYXJ8ZW58MXx8fHwxNzYzNTY5OTI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    location: 'Miami, USA',
    fuel: 'Petrol',
    mileage: '0',
    engine: '3.0 cc',
    type: 'Sedan',
    date: 'March 26, 2021',
    soldOut: false,
    special: true
  },
  {
    id: 6,
    name: '2016 Mercedes AMG GT S',
    year: 2016,
    price: '$85,000',
    msrp: '$89,000',
    image: 'https://images.unsplash.com/photo-1567808291548-fc3ee04dbcf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjYXIlMjBibGFja3xlbnwxfHx8fDE3NjM1NjA0MzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    location: 'Miami, USA',
    fuel: 'Petrol',
    mileage: '12000',
    engine: '4.0 cc',
    type: 'Convertible',
    date: 'March 26, 2021',
    soldOut: false,
    special: true
  }
];

export function BestDeals() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-4 border-b-4 border-primary pb-4">
          <h2>Zosia Best Deals</h2>
          <button className="text-primary hover:text-primary-dark flex items-center gap-2 transition-colors">
            View All
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {deals.map((deal) => (
            <div key={deal.id} className="bg-white rounded overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow relative">
              {deal.special && (
                <div className="absolute top-0 left-0 z-10">
                  <div className="bg-primary text-white px-8 py-1 text-xs transform -rotate-45 -translate-x-7 translate-y-4">
                    SPECIAL
                  </div>
                </div>
              )}
              
              <div className="relative h-48 bg-gray-100">
                <ImageWithFallback 
                  src={deal.image}
                  alt={deal.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 right-0 bg-navy text-white px-4 py-2 flex items-baseline gap-2">
                  <span className="text-xl">{deal.price}</span>
                  <span className="text-xs text-gray-300">MSRP: {deal.msrp}</span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="mb-1">{deal.name}</h4>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span>{deal.location}</span>
                    </div>
                  </div>
                  {deal.soldOut && (
                    <span className="text-xs px-2 py-1 border-2 border-red-500 text-red-500 rounded">
                      SOLD OUT
                    </span>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="grid grid-cols-4 gap-2 text-xs text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Fuel className="w-3 h-3" />
                      <span>{deal.fuel}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Gauge className="w-3 h-3" />
                      <span>{deal.mileage}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                      <span>{deal.engine}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="10" rx="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      <span>{deal.type}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-200">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{deal.date}</span>
                    </div>
                    <button className="hover:text-primary transition-colors">
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