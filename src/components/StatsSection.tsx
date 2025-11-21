export function StatsSection() {
  const stats = [
    { number: '10+', label: 'Years in Business' },
    { number: '5000+', label: 'Happy Customers' },
    { number: '500+', label: 'Premium Vehicles' },
    { number: '98%', label: 'Satisfaction Rate' },
  ];

  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-5xl font-bold text-amber-500 mb-2">{stat.number}</div>
              <div className="text-gray-200 text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
