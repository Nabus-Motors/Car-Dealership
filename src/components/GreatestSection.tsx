import { CheckCircle } from 'lucide-react';

const features = [
  { title: 'Certified Quality', description: 'Every vehicle undergoes rigorous inspection' },
  { title: 'Best Pricing', description: 'Competitive rates with transparent pricing' },
  { title: 'Expert Support', description: 'Dedicated team to assist your purchase' },
  { title: 'Warranty Coverage', description: 'Extended warranty options available' },
];

export function GreatestSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose Nabus Motors</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're committed to providing you with the best automotive experience
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <CheckCircle className="w-10 h-10 text-amber-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
