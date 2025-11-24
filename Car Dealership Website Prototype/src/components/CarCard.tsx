import { Share2, Fuel, Gauge, Users, Settings } from 'lucide-react';
import { Car } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CarCardProps {
  car: Car;
  viewMode: 'grid' | 'list';
}

const carImages: { [key: number]: string } = {
  1: 'https://images.unsplash.com/photo-1742056024244-02a093dae0b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzcG9ydHMlMjBjYXJ8ZW58MXx8fHwxNzYzOTYwMDIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  2: 'https://images.unsplash.com/photo-1517942491415-4fc176d3c2f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3JzY2hlJTIwY2F5ZW5uZSUyMHN1dnxlbnwxfHx8fDE3NjM5OTAyMjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
  3: 'https://images.unsplash.com/photo-1653047256313-41c8b65413cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBzcG9ydHMlMjBjb3VwZXxlbnwxfHx8fDE3NjM5OTk4NTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
  4: 'https://images.unsplash.com/photo-1655287290532-afcbe826ac2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibXclMjBjb252ZXJ0aWJsZSUyMGNhcnxlbnwxfHx8fDE3NjM5MTM3MTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
  5: 'https://images.unsplash.com/photo-1714225632888-d0e2ad66fbc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2xrc3dhZ2VuJTIwc3V2JTIwZ3JheXxlbnwxfHx8fDE3NjM5OTk4NTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
  6: 'https://images.unsplash.com/photo-1720997530122-15a7f2026e8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXJjZWRlcyUyMGJlbnolMjBjb3VwZXxlbnwxfHx8fDE3NjM5OTk4NTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
  7: 'https://images.unsplash.com/photo-1694658073846-bcf14ab05945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGJtdyUyMHNlZGFufGVufDF8fHx8MTc2Mzk5OTg1OHww&ixlib=rb-4.1.0&q=80&w=1080',
  8: 'https://images.unsplash.com/photo-1703658829488-c7894a5e4f58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGF1ZGklMjBzdXZ8ZW58MXx8fHwxNzYzOTk5ODU4fDA&ixlib=rb-4.1.0&q=80&w=1080',
  9: 'https://images.unsplash.com/photo-1618863114786-d501cae6d853?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5ZWxsb3clMjBzdXBlcmNhciUyMGFtZ3xlbnwxfHx8fDE3NjM5OTk4NTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
  10: 'https://images.unsplash.com/photo-1696581084306-591db2e1af14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBmZXJyYXJpJTIwc3BvcnRzfGVufDF8fHx8MTc2Mzk5OTg1OXww&ixlib=rb-4.1.0&q=80&w=1080',
  11: 'https://images.unsplash.com/photo-1718199641744-24cd055edc7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmF5JTIwYXVkaSUyMHI4fGVufDF8fHx8MTc2Mzk5OTg1OXww&ixlib=rb-4.1.0&q=80&w=1080',
  12: 'https://images.unsplash.com/photo-1676409427801-254734be8829?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwYm13JTIwc3V2fGVufDF8fHx8MTc2Mzk5OTg1OXww&ixlib=rb-4.1.0&q=80&w=1080'
};

export function CarCard({ car, viewMode }: CarCardProps) {
  if (viewMode === 'list') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex">
        <div className="relative w-1/3">
          <ImageWithFallback 
            src={carImages[car.id]}
            alt={car.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-0">
            <div className="bg-[#FFC700] text-[#001F3F] px-4 py-1 text-sm transform -skew-x-12">
              <span className="inline-block transform skew-x-12">FEATURED</span>
            </div>
          </div>
          {car.condition === 'Certified' && (
            <div className="absolute top-14 left-0">
              <div className="bg-[#001F3F] text-white px-4 py-1 text-sm transform -skew-x-12">
                <span className="inline-block transform skew-x-12">CERTIFIED</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl text-[#001F3F] mb-2">{car.title}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Gauge className="w-4 h-4" />
                  {car.mileage}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Settings className="w-4 h-4" />
                  {car.transmission}
                </span>
                <span>•</span>
                <span>{car.bodyType}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {car.seats}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Fuel className="w-4 h-4" />
                  {car.fuelType}
                </span>
              </div>
            </div>
            <div className="bg-[#0047AB] text-white px-4 py-2 rounded">
              ${car.price.toLocaleString()}
            </div>
          </div>
          
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>{car.date}</span>
            <button className="hover:text-[#FFC700] transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 group">
      <div className="relative">
        <ImageWithFallback 
          src={carImages[car.id]}
          alt={car.title}
          className="w-full h-56 object-cover"
        />
        <div className="absolute top-4 left-0">
          <div className="bg-[#FFC700] text-[#001F3F] px-4 py-1 text-sm transform -skew-x-12">
            <span className="inline-block transform skew-x-12">FEATURED</span>
          </div>
        </div>
        {car.condition === 'Certified' && (
          <div className="absolute top-14 left-0">
            <div className="bg-[#001F3F] text-white px-4 py-1 text-sm transform -skew-x-12">
              <span className="inline-block transform skew-x-12">CERTIFIED</span>
            </div>
          </div>
        )}
        <div className="absolute top-4 right-4">
          <div className="bg-[#0047AB] text-white px-4 py-2 rounded">
            ${car.price.toLocaleString()}
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg text-[#001F3F] mb-3">{car.title}</h3>
        
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
          <span className="flex items-center gap-1">
            <Gauge className="w-4 h-4" />
            {car.mileage}
          </span>
          <span className="flex items-center gap-1">
            <Settings className="w-4 h-4" />
            {car.transmission}
          </span>
          <span>{car.bodyType}</span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {car.seats} Seats
          </span>
          <span className="flex items-center gap-1 col-span-2">
            <Fuel className="w-4 h-4" />
            {car.fuelType}
          </span>
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-3">
          <span>{car.date}</span>
          <button className="hover:text-[#FFC700] transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
