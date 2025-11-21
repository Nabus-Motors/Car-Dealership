import { Shield, Award, Users } from 'lucide-react';

export function GreatestSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="mb-4">Greatest.</h2>
          <p className="text-xl text-gray-600">Delivering the best deals</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-8 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h4 className="mb-4">Quality Assurance</h4>
            <p className="text-gray-600">
              Every vehicle undergoes rigorous inspection and certification to ensure the highest standards of quality and reliability.
            </p>
          </div>

          <div className="text-center p-8 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <h4 className="mb-4">Best Value</h4>
            <p className="text-gray-600">
              We negotiate the best prices and pass the savings to you. Get premium vehicles at competitive rates with transparent pricing.
            </p>
          </div>

          <div className="text-center p-8 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h4 className="mb-4">Customer First</h4>
            <p className="text-gray-600">
              Your satisfaction is our priority. We provide personalized service and support throughout your entire buying journey.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
