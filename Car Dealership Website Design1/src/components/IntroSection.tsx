import { ArrowRight } from 'lucide-react';

export function IntroSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-12 h-12 bg-black rounded flex items-center justify-center">
                <span className="text-white">ZD</span>
              </div>
              <div>
                <div className="text-sm tracking-wider">Zosia</div>
                <div className="text-xs">Drive</div>
              </div>
            </div>
            <h2 className="mb-6">
              Your trusted<br />partner in<br />automotive<br />excellence
            </h2>
            <button className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded flex items-center gap-2 transition-colors">
              Learn More
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-6">
            <p className="text-gray-600">
              At Zosia Drive, we believe in delivering more than just vehicles. We provide a complete automotive experience that combines quality, trust, and exceptional service.
            </p>
            <p className="text-gray-600">
              With over a decade of experience in the automotive industry, we've built our reputation on transparency, expertise, and a genuine commitment to helping our customers find their perfect vehicle.
            </p>
            <p className="text-gray-600">
              Every car in our inventory is carefully selected and thoroughly inspected to ensure it meets our high standards of quality and reliability.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
