import React, { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Share2, Printer, Heart, Phone, MessageCircle, Calendar } from 'lucide-react';

export function CarDetailSection() {
  const [selectedImage, setSelectedImage] = useState(0);

  const images = [
    'https://images.unsplash.com/photo-1696581084306-591db2e1af14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBmZXJyYXJpJTIwc3BvcnRzJTIwY2FyfGVufDF8fHx8MTc2Mzk5OTI0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1665491641262-53155eaac2b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzcG9ydHMlMjBjYXIlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjM5OTQ1NjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1710823367826-02e38b3c9f67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGx1eHVyeSUyMGNhcnxlbnwxfHx8fDE3NjM5Mjc4ODN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1752462091434-f204aad93153?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHNwb3J0cyUyMGNhcnxlbnwxfHx8fDE3NjM5NTk1MTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
  ];

  const specs = [
    { label: 'VIN', value: 'ZFFAA02A150125698' },
    { label: 'Mileage', value: '12,450 miles' },
    { label: 'Engine', value: '3.9L V8 Twin-Turbo' },
    { label: 'Transmission', value: '7-Speed Automatic' },
    { label: 'Fuel Type', value: 'Premium Unleaded' },
    { label: 'Exterior Color', value: 'Rosso Corsa' },
    { label: 'Interior Color', value: 'Black Leather' },
    { label: 'Drive Type', value: 'RWD' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Image Gallery (60% on desktop) */}
        <div className="lg:col-span-2">
          {/* Main Image */}
          <div className="bg-gray-100 overflow-hidden mb-4">
            <ImageWithFallback
              src={images[selectedImage]}
              alt="Ferrari GTC4"
              className="w-full h-[400px] md:h-[500px] object-cover"
            />
          </div>

          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-4 gap-4">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`overflow-hidden border-2 transition-all duration-200 ${
                  selectedImage === index
                    ? 'border-[#2563eb] scale-105'
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <ImageWithFallback
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-20 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Sidebar (40% on desktop) */}
        <div className="lg:col-span-1">
          {/* Price */}
          <div className="bg-[#0a1628] text-white p-6 mb-6 clip-corner-tr">
            <div className="text-gray-400 text-sm mb-1">Starting Price</div>
            <div className="text-4xl">$490,000</div>
          </div>

          {/* Specs Badges */}
          <div className="bg-white border border-gray-200 p-6 mb-6">
            <h3 className="mb-4">Key Specifications</h3>
            <div className="grid grid-cols-2 gap-3">
              {specs.map((spec, index) => (
                <div key={index} className="bg-gray-50 p-3 border-l-2 border-[#2563eb]">
                  <div className="text-gray-500 text-sm mb-1">{spec.label}</div>
                  <div className="text-sm">{spec.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3 mb-6">
            <button className="w-full bg-[#2563eb] text-white py-3 px-6 hover:bg-[#1d4ed8] transition-colors duration-200 flex items-center justify-center gap-2 clip-corner-br">
              <Phone size={18} />
              Get a Quote
            </button>
            <button className="w-full bg-white border-2 border-[#2563eb] text-[#2563eb] py-3 px-6 hover:bg-[#eff6ff] transition-colors duration-200 flex items-center justify-center gap-2">
              <MessageCircle size={18} />
              Make an Offer
            </button>
            <button className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-6 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2">
              <Calendar size={18} />
              Confirm Availability
            </button>
          </div>

          {/* Share Options */}
          <div className="border-t border-gray-200 pt-6">
            <div className="text-sm text-gray-600 mb-3">Share this vehicle:</div>
            <div className="flex gap-3">
              <button className="flex-1 py-2 px-4 border border-gray-300 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2">
                <Share2 size={16} />
                <span className="text-sm">Share</span>
              </button>
              <button className="flex-1 py-2 px-4 border border-gray-300 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2">
                <Printer size={16} />
                <span className="text-sm">Print</span>
              </button>
              <button className="flex-1 py-2 px-4 border border-gray-300 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2">
                <Heart size={16} />
                <span className="text-sm">Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}