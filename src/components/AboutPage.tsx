import React from 'react';
import { HeroSection } from './HeroSection';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function AboutPage() {
  const highlights = [
    {
      icon: "📅",
      title: "20+ Years",
      subtitle: "Of Experience"
    },
    {
      icon: "🚗",
      title: "1000+",
      subtitle: "Cars Sold"
    },
    {
      icon: "⭐",
      title: "4.9/5",
      subtitle: "Customer Rating"
    },
    {
      icon: "🏆",
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
                    <span className="text-2xl text-white">💎</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Our Values</h3>
                </div>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-center space-x-3">
                    <span className="text-red-600">✓</span>
                    <span>Integrity in every transaction</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-red-600">✓</span>
                    <span>Customer satisfaction above all</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-red-600">✓</span>
                    <span>Transparent and fair pricing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-red-600">✓</span>
                    <span>Continuous innovation and improvement</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Highlights Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              By the Numbers
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our achievements reflect our commitment to excellence and customer satisfaction
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {highlights.map((highlight, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">{highlight.icon}</div>
                  <div className="text-2xl font-bold text-slate-900 mb-1">
                    {highlight.title}
                  </div>
                  <div className="text-gray-600">
                    {highlight.subtitle}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Meet Our Expert Team
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Our dedicated professionals bring years of automotive expertise and a passion for 
            helping customers find their perfect vehicle. From sales specialists to financing 
            experts, we're here to guide you every step of the way.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="space-y-4">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">👨‍💼</span>
              </div>
              <div>
                <h4 className="font-semibold">Sales Team</h4>
                <p className="text-gray-300">Expert advisors to help you find the perfect vehicle</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">💼</span>
              </div>
              <div>
                <h4 className="font-semibold">Finance Team</h4>
                <p className="text-gray-300">Flexible financing solutions tailored to your needs</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">🔧</span>
              </div>
              <div>
                <h4 className="font-semibold">Service Team</h4>
                <p className="text-gray-300">Ongoing support and maintenance for your vehicle</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}