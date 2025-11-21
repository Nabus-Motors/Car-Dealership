import { ArrowRight, Share2 } from 'lucide-react';

const deals = [
  {
    id: 1,
    name: '2019 Lamborghini Urus',
    price: '$85,000',
    msrp: '$89,000',
    image: 'https://images.unsplash.com/photo-1567808291548-fc3ee04dbcf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjYXIlMjBibGFja3xlbnwxfHx8fDE3NjM1NjA0MzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    location: 'Miami, USA',
    fuel: 'Petrol',
    mileage: '20k',
    engine: '4.0 cc',
    type: 'SUV',
    date: 'March 26, 2021',
    soldOut: true
  },
  {
    id: 2,
    name: '2019 Ford Ranger Raptor',
    price: '$85,000',
    msrp: '$89,000',
    image: 'https://images.unsplash.com/photo-1580959046674-8fc8f92b5fd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHNlZGFuJTIwY2FyfGVufDF8fHx8MTc2MzU2ODczNXww&ixlib=rb-4.1.0&q=80&w=1080',
    location: 'Miami, USA',
    fuel: 'Petrol',
    mileage: '20k',
    engine: '2.0 cc',
    type: 'SUV',
    date: 'March 26, 2021',
    soldOut: false
  },
  {
    id: 3,
    name: '2019 Chevrolet Corvette ZR1',
    price: '$85,000',
    msrp: '$89,000',
    image: 'https://images.unsplash.com/photo-1653047256226-5abbfa82f1d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBzcG9ydHMlMjBjYXJ8ZW58MXx8fHwxNzYzNTQ3MTY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    location: 'Miami, USA',
    fuel: 'Petrol',
    mileage: '5k',
    engine: '6.2 cc',
    type: 'Sports car',
    date: 'March 26, 2021',
    soldOut: false
  },
];

export function BestDeals() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-4 border-b-4 border-amber-500 pb-4">
          <h2 className="text-4xl md:text-5xl font-bold">Nabus Best Deals</h2>
          <button className="text-amber-500 hover:text-amber-600 flex items-center gap-2 transition-colors hidden md:flex">
            View All
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {deals.map((deal) => (
            <div key={deal.id} className="bg-white rounded overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow relative">
              {deal.soldOut && (
                <div className="absolute top-0 left-0 z-10">
                  <div className="bg-amber-500 text-white px-8 py-1 text-xs transform -rotate-45 -translate-x-7 translate-y-4 font-semibold">
                    SPECIAL
                  </div>
                </div>
              )}
              
              <div className="relative h-48 bg-gray-100">
                <img 
                  src={deal.image}
                  alt={deal.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 right-0 bg-slate-800 text-white px-4 py-2 flex items-baseline gap-2">
                  <span className="text-xl font-bold">{deal.price}</span>
                  <span className="text-xs text-gray-300">MSRP: {deal.msrp}</span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-lg mb-1">{deal.name}</h4>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      📍 {deal.location}
                    </div>
                  </div>
                  {deal.soldOut && (
                    <span className="text-xs px-2 py-1 border-2 border-red-500 text-red-500 rounded font-semibold">
                      SOLD OUT
                    </span>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="grid grid-cols-4 gap-2 text-xs text-gray-600 mb-3">
                    <div>⛽ {deal.fuel}</div>
                    <div>🏎️ {deal.mileage}</div>
                    <div>⚙️ {deal.engine}</div>
                    <div>🚗 {deal.type}</div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-200">
                    <div>📅 {deal.date}</div>
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
