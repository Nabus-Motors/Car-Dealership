export function DreamSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1638641506328-c9fa89d128e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzcG9ydHMlMjBjYXIlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjM1NjA2NjB8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Dream car interior"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Your Dream Car Awaits</h2>
            <p className="text-lg text-gray-600 mb-4">
              From sleek sedans to powerful SUVs, our curated collection features the vehicles you've always wanted.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Every car in our inventory is thoroughly inspected, certified, and ready to exceed your expectations.
            </p>
            <button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded font-semibold transition-colors">
              Explore All Vehicles
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
