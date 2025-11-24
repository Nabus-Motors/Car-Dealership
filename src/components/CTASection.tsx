import { ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-[#FFD700] to-[#FFC700] text-[#001F3F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Drive Home Your Dream Car?</h2>
        <p className="text-lg md:text-xl mb-8 text-[#0A1D47] max-w-2xl mx-auto">
          Join thousands of satisfied customers who found their perfect vehicle at Nabus Motors
        </p>
        <button className="bg-[#001F3F] hover:bg-[#0A1D47] text-[#FFD700] font-bold px-10 py-4 rounded-lg transition-all duration-300 inline-flex items-center gap-2 hover:shadow-lg hover:shadow-[#001F3F]/50">
          Explore Our Inventory
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
