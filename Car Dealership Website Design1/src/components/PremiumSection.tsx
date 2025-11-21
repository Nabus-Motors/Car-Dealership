import { ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function PremiumSection() {
  return (
    <section className="relative py-32 bg-black text-white overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1665491641262-53155eaac2b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYXIlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjM1NDcyMDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Premium car interior"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="mb-6">Premium collection</h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
          Discover our exclusive selection of luxury vehicles
        </p>
        <button className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded inline-flex items-center gap-2 transition-colors">
          View Collection
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
