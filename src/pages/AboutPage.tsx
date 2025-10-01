import { Calendar, Car, Star, Trophy } from 'lucide-react';
import { HeroSection } from '../components/HeroSection';
import { Card, CardContent } from '../components/ui/card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function AboutPage() {
  const highlights = [
    {
      icon: Calendar,
      title: "20+ Years",
      subtitle: "Of Experience"
    },
    {
      icon: Car,
      title: "1000+",
      subtitle: "Cars Sold"
    },
    {
      icon: Star,
      title: "4.9/5",
      subtitle: "Customer Rating"
    },
    {
      icon: Trophy,
      title: "Award",
      subtitle: "Winning Service"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        backgroundImage="https://images.unsplash.com/photo-1592891024301-bf7948cee673?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBkZWFsZXJzaGlwJTIwdGVhbXxlbnwxfHx8fDE3NTg3MjE3Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        title="About AutoMax"
        subtitle="Your trusted automotive partner since 2004"
        height="h-[400px]"
      />

      {/* Company Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Founded in 2004, AutoMax began as a small family-owned dealership with a simple mission: 
                  to provide honest, reliable, and exceptional automotive services to our community. 
                  What started as a modest operation has grown into one of the region's most trusted 
                  automotive destinations.
                </p>
                <p>
                  Over the past two decades, we've built our reputation on transparency, quality, and 
                  customer satisfaction. Our team of automotive professionals brings decades of combined 
                  experience, ensuring every customer receives expert guidance and personalized service.
                </p>
                <p>
                  Today, we proudly serve thousands of customers annually, offering an extensive 
                  inventory of luxury, sports, and family vehicles from the world's leading manufacturers. 
                  Our commitment to excellence remains unwavering as we continue to evolve with the 
                  automotive industry.
                </p>
              </div>
            </div>

            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1705747401901-28363172fe7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBzaG93cm9vbXxlbnwxfHx8fDE3NTg3MTYyMTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="AutoMax showroom"
                className="w-full h-80 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mission */}
            <Card className="h-full">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white">🎯</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Our Mission</h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-center">
                  To revolutionize the car buying experience by providing transparent pricing, 
                  exceptional customer service, and access to the finest vehicles. We strive to 
                  make every customer's journey memorable and stress-free, building lasting 
                  relationships based on trust and satisfaction.
                </p>
              </CardContent>
            </Card>

            {/* Values */}
            <Card className="h-full">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white">💫</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Our Values</h3>
                </div>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>Integrity in every interaction</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>Customer satisfaction above all</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>Transparency in pricing and services</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>Excellence in automotive expertise</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Our Achievements
            </h2>
            <p className="mt-4 text-gray-600">
              Milestones that define our journey of excellence
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {highlights.map((highlight, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-50 rounded-full">
                      <highlight.icon className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {highlight.title}
                  </h3>
                  <p className="text-gray-600">{highlight.subtitle}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}