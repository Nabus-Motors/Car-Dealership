import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StorageImage } from '@/components/figma/StorageImage';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { formatPrice, formatMileage } from '@/utils/format';
import { ContactFormDialog } from '@/components/ContactFormDialog';
import type { Car } from '@/types/car';

interface CarCardHorizontalProps extends Car {}

export function CarCardHorizontal(car: CarCardHorizontalProps) {
  const navigate = useNavigate();
  const [isContactHovered, setIsContactHovered] = useState(false);
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const isSold = car.status?.toLowerCase() === 'sold';

  const handleClick = () => {
    if (car.id) {
      navigate(`/car/${car.id}`);
    }
  };

  return (
    <>
    <div 
      onClick={() => !isSold && handleClick()}
      className={`flex flex-col sm:flex-row gap-4 border border-slate-200 bg-white hover:shadow-lg hover:border-slate-300 transition-all duration-300 cursor-pointer overflow-hidden ${isSold ? 'opacity-50 grayscale' : ''}`}
    >
      {/* Image Section */}
      <div className="flex-shrink-0 w-full sm:w-56 h-48 sm:h-40 bg-slate-100 overflow-hidden border-b sm:border-b-0 sm:border-r border-slate-200">
        {car.imageUrls && car.imageUrls.length > 0 ? (
          <StorageImage
            src={car.imageUrls[0]}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
            </svg>
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                {car.year} {car.brand} {car.model}
              </h3>
              <div className="flex items-center gap-1 text-xs sm:text-sm text-slate-500 mt-1">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" /> 
                <span>Location</span>
              </div>
            </div>
          </div>

          {/* Specs Badges */}
          <div className="flex flex-wrap gap-2 my-3">
            {car.fuelType && (
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 font-medium">
                {car.fuelType}
              </span>
            )}
            {car.transmission && (
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 font-medium">
                {car.transmission}
              </span>
            )}
            {car.mileage && (
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 font-medium">
                {formatMileage(car.mileage)}
              </span>
            )}
            {car.condition && (
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 font-medium">
                {car.condition}
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-end justify-between pt-3 sm:pt-4 border-t border-slate-200 mt-auto">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">Price</p>
            <p className="text-xl sm:text-2xl font-bold text-slate-900">{formatPrice(car.price)}</p>
          </div>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setContactFormOpen(true);
            }}
            onMouseEnter={() => setIsContactHovered(true)}
            onMouseLeave={() => setIsContactHovered(false)}
            className={`bg-[#FFD700] hover:bg-[#FFC700] text-[#001F3F] font-semibold transition-all duration-300 ${
              isContactHovered ? 'shadow-lg' : ''
            }`}
          >
            Contact Seller
          </Button>
        </div>
      </div>
    </div>

    {/* Contact Form Dialog */}
    <ContactFormDialog 
      open={contactFormOpen} 
      onOpenChange={setContactFormOpen}
      carTitle={`${car.year} ${car.brand} ${car.model}`}
    />
    </>
  );
}
