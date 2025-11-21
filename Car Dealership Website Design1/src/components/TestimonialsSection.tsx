import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Business Owner',
    content: 'The team at Zosia Drive made my car buying experience seamless and enjoyable. They listened to my needs and found the perfect vehicle for my lifestyle.',
    rating: 5
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Software Engineer',
    content: 'Exceptional service and incredible selection. I found my dream Tesla here, and the entire process was transparent and professional.',
    rating: 5
  },
  {
    id: 3,
    name: 'Emma Williams',
    role: 'Designer',
    content: 'From start to finish, the experience was outstanding. The staff was knowledgeable, friendly, and genuinely cared about finding the right car for me.',
    rating: 5
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="mb-4">Car World reviews</h2>
          <p className="text-xl text-gray-600">What our customers say</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-50 p-8 rounded-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-gray-700 mb-6">{testimonial.content}</p>
              <div>
                <div>{testimonial.name}</div>
                <div className="text-sm text-gray-500">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
