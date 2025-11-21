import { Car, Users, Award, MapPin } from 'lucide-react';

export function StatsSection() {
  return (
    <section className="py-16 bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="w-8 h-8 text-primary" />
            </div>
            <div className="text-4xl mb-2">250+</div>
            <div className="text-gray-400">Vehicles Available</div>
          </div>

          <div>
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div className="text-4xl mb-2">620+</div>
            <div className="text-gray-400">Happy Customers</div>
          </div>

          <div>
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <div className="text-4xl mb-2">15+</div>
            <div className="text-gray-400">Years Experience</div>
          </div>

          <div>
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <div className="text-4xl mb-2">5</div>
            <div className="text-gray-400">Locations</div>
          </div>
        </div>
      </div>
    </section>
  );
}
