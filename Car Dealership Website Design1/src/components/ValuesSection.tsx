import { Heart, Star, Zap, TrendingUp } from 'lucide-react';

export function ValuesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2>Values</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h4 className="mb-2">Integrity</h4>
            <p className="text-gray-600 text-sm">
              Honest and transparent in every interaction
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-10 h-10 text-white" />
            </div>
            <h4 className="mb-2">Excellence</h4>
            <p className="text-gray-600 text-sm">
              Committed to the highest standards
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h4 className="mb-2">Innovation</h4>
            <p className="text-gray-600 text-sm">
              Embracing new technologies and methods
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <h4 className="mb-2">Growth</h4>
            <p className="text-gray-600 text-sm">
              Continuous improvement and development
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
