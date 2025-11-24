import React from 'react';
import { ChevronRight } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="bg-[#0a1628] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <a href="#" className="hover:text-white transition-colors">
            Car Details
          </a>
          <ChevronRight size={16} />
          <a href="#" className="hover:text-white transition-colors">
            Sports Cars
          </a>
          <ChevronRight size={16} />
          <span className="text-white">Ferrari GTC4</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl mb-2">
          Ferrari GTC4 3 door coupe
        </h1>
        <p className="text-gray-400">Premium luxury sports vehicle</p>
      </div>
    </div>
  );
}
