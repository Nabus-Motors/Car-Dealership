import { Heart } from 'lucide-react';

const values = [
  { icon: '🎯', title: 'Integrity', description: 'Transparent dealings and honest pricing' },
  { icon: '💼', title: 'Excellence', description: 'Premium quality in every interaction' },
  { icon: '🤝', title: 'Reliability', description: 'Dependable service you can trust' },
  { icon: '🌟', title: 'Innovation', description: 'Latest technology and services' },
];

export function ValuesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#001F3F]">Our Core Values</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Built on principles that matter to you and your family
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl mb-4">{value.icon}</div>
              <h3 className="text-xl font-bold mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
