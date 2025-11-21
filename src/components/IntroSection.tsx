export function IntroSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Welcome to Nabus Motors</h2>
            <p className="text-lg text-gray-600 mb-4">
              Experience the finest selection of premium vehicles, meticulously curated and expertly maintained for your ultimate driving satisfaction.
            </p>
            <p className="text-lg text-gray-600">
              With over a decade of automotive excellence, we pride ourselves on offering unparalleled customer service and transparent pricing.
            </p>
          </div>
          <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1609339717443-b78d3b260a70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBzaG93cm9vbXxlbnwxfHx8fDE3NjM1NjA2MzR8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Showroom"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
