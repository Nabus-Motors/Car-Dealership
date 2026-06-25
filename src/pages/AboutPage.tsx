import { Target, Sparkles, Star, Trophy, MapPin, Phone, Mail } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { HeroSection } from '../components/HeroSection';

export function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Transparency",
      description: "Honest pricing and clear communication in every transaction"
    },
    {
      icon: Star,
      title: "Quality",
      description: "High-quality verified vehicles meeting rigorous standards"
    },
    {
      icon: Trophy,
      title: "Excellence",
      description: "Award-winning customer service and expertise since 2021"
    },
    {
      icon: Sparkles,
      title: "Innovation",
      description: "Embracing digital innovation and sustainable mobility"
    }
  ];

  const services = [
    { title: "Vehicle Sales", description: "Extensive inventory of luxury and family vehicles" },
    { title: "Vehicle Imports", description: "International sourcing with complete documentation" },
    { title: "Car Rentals", description: "Flexible rental options for short and long-term needs" },
    { title: "Motor Insurance", description: "Comprehensive coverage and easy claim processes" },
    { title: "Car Registration", description: "Hassle-free registration and compliance services" },
    { title: "Vehicle Services", description: "Full servicing, diagnostics, and mechanical work" }
  ];

  return (
    <div className="min-h-screen w-screen">
      {/* Hero Section */}
      <HeroSection
        backgroundImage="https://images.unsplash.com/photo-1592891024301-bf7948cee673?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBkZWFsZXJzaGlwJTIwdGVhbXxlbnwxfHx8fDE3NTg3MjE3Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080"
        title="Nabus Motors"
        subtitle="Drive Your Dream Car — Ghana's Premier Automotive Partner"
        centered={true}
        className="-mt-16 pt-16"
      />

      {/* Company Overview Section */}
      <section className="py-16 bg-white flex flex-col items-center">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-[#0A0A0A]">
                One-Stop Shop for Everything Automobile
              </h2>
              <div className="space-y-4 text-slate-700 leading-relaxed text-lg">
                <p>
                  Nabus Motors is a leading automobile dealership in Ghana, offering comprehensive automotive 
                  solutions including vehicle sales, imports, rentals, motor insurance, and vehicle registration. 
                  Operating out of Accra since 2004, we've established ourselves as Ghana's most trusted 
                  automotive destination.
                </p>
                <p>
                  Our reputation is built on transparency, quality customer service, and high-quality verified 
                  vehicles. These core values earned us the prestigious recognition as Ghana's Best Automobile 
                  Dealer of the Year in 2021, a testament to our unwavering commitment to excellence.
                </p>
                <p>
                  Through innovative partnerships like our collaboration with Autochek Ghana, we've extended 
                  our mission to financial inclusion, enabling customers to access flexible car loans and 
                  pay in convenient installments.
                </p>
              </div>
              
              {/* Location Card */}
              <div className="mt-8 p-6 bg-[#F9F9F7] rounded-lg border border-[#E8E8E8]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#C9A84C] mt-1 shrink-0" />
                  <div>
                    <h4 className="font-bold text-[#0A0A0A] mb-1">Visit Us Today</h4>
                    <p className="text-sm text-slate-600">
                      Dzorwulu, Abelenkpe Traffic Light<br />
                      Opposite Baptist House, Accra, Ghana
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1705747401901-28363172fe7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBzaG93cm9vbXxlbnwxfHx8fDE3NTg3MTYyMTl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Nabus Motors showroom"
                className="w-full h-96 object-cover rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-[#F9F9F7] flex flex-col items-center">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0A0A0A] mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-slate-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-2 border-[#C9A84C]/30 rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="mb-4">
                    <div className="w-14 h-14 bg-[#C9A84C]/20 rounded-lg flex items-center justify-center">
                      <value.icon className="w-7 h-7 text-[#C9A84C]" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#0A0A0A] mb-3">
                    {value.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values Detailed Section */}
      <section className="py-20 bg-white flex flex-col items-center">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="space-y-16">
            {/* Mission */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-[#0A0A0A] mb-6">Our Mission</h2>
                <p className="text-lg text-slate-700 leading-relaxed">
                  To serve as Ghana's premier one-stop automotive destination by providing transparent, 
                  quality-focused services that empower customers to own their dream vehicles. We partner 
                  with fintech innovators to make car ownership accessible through flexible financing, 
                  demonstrating our commitment to financial inclusion and customer empowerment.
                </p>
              </div>
              <div className="p-8 bg-[#C9A84C]/10 rounded-xl border-2 border-[#C9A84C]/30">
                <p className="text-2xl font-bold text-[#C9A84C] italic">
                  "It has taken great effort to see this buoyant auto industry in Ghana grow with technology."
                </p>
                <p className="text-sm text-slate-600 mt-4">— CEO, Nana Adu Bonsu</p>
              </div>
            </div>

            {/* Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="p-8 bg-[#0A0A0A]/5 rounded-xl border-2 border-[#0A0A0A]/20 order-2 md:order-1">
                <p className="text-lg text-slate-700 leading-relaxed italic">
                  "As the world transitions into a new era of sustainable mobility, digital innovation, 
                  and integrated logistics, Ghana's transport sector must continue to evolve."
                </p>
                <p className="text-sm text-slate-600 mt-4">— Group CEO, Nana Adu Bonsu</p>
              </div>
              <div className="order-1 md:order-2">
                <h2 className="text-3xl font-bold text-[#0A0A0A] mb-6">Our Vision</h2>
                <p className="text-lg text-slate-700 leading-relaxed">
                  To champion sustainable mobility and digital innovation throughout Ghana's transport 
                  sector. As President of the Chamber of Automobile Dealership Ghana (CADEG), we advocate 
                  for a level playing field between vehicle assemblers and certified dealerships, enabling 
                  "Made in Ghana" automotive brands to receive global recognition.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-[#F9F9F7] flex flex-col items-center">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#0A0A0A] mb-4">
              Our Comprehensive Services
            </h2>
            <p className="text-xl text-slate-600">
              Everything you need for your automotive journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-2 border-[#E8E8E8] rounded-xl hover:border-[#C9A84C] transition-colors">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-[#C9A84C] rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0A0A0A] mb-3">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CEO Profile Section */}
      <section className="py-20 bg-white flex flex-col items-center">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-[#C9A84C]/20 rounded-xl" />
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.1.0&auto=format&fit=facearea&facepad=8&w=1024&h=1024"
                alt="Nana Adu Bonsu Agyekum Prempeh"
                className="w-full h-96 object-cover rounded-xl relative z-10"
              />
            </div>

            <div className="space-y-8">
              <div>
                <p className="text-[#C9A84C] font-bold uppercase tracking-wider mb-2">
                  Leadership
                </p>
                <h2 className="text-4xl font-bold text-[#0A0A0A] mb-2">
                  Nana Adu Bonsu Agyekum Prempeh
                </h2>
                <p className="text-xl text-slate-600 font-semibold">
                  Chief Executive Officer & Industry Visionary
                </p>
              </div>

              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p>
                  A highly respected entrepreneur and thought leader who has played a pivotal role in 
                  reshaping Ghana's automotive industry. As CEO of NABUS MOTORS and President of the 
                  Chamber of Automobile Dealerships Ghana (CADEG), he is recognized for exceptional 
                  leadership, innovative strategies, and unwavering dedication to industry growth.
                </p>
                <p>
                  Under his visionary leadership, NABUS MOTORS has been transformed into a trusted name 
                  synonymous with excellence, quality, and customer satisfaction. The company has set itself 
                  apart through customer-focused initiatives including free vehicle registration, complimentary 
                  motor insurance, and free roadworthy certification.
                </p>
              </div>

              {/* Achievements */}
              <div className="space-y-3 pt-4 border-t border-[#E8E8E8]">
                <h3 className="text-lg font-bold text-[#0A0A0A]">Key Achievements</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="text-[#C9A84C] font-bold mt-1">✓</span>
                    <span className="text-slate-700">
                      Auto Dealership of the Year Award 2021 (Autochek Ghana)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#C9A84C] font-bold mt-1">✓</span>
                    <span className="text-slate-700">
                      Ghana Auto Industry Award 2022
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#C9A84C] font-bold mt-1">✓</span>
                    <span className="text-slate-700">
                      Pioneered fintech partnerships for financial inclusion
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#C9A84C] font-bold mt-1">✓</span>
                    <span className="text-slate-700">
                      Industry advocacy through CADEG presidency
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Stats Section */}
      <section className="py-20 bg-[#0A0A0A] text-white flex flex-col items-center">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-[#C9A84C] mb-2">
                20+
              </div>
              <p className="text-lg text-white/80">Years of Excellence</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-[#C9A84C] mb-2">
                500+
              </div>
              <p className="text-lg text-white/80">Vehicles Available</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-[#C9A84C] mb-2">
                2,000+
              </div>
              <p className="text-lg text-white/80">Happy Customers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-[#C9A84C] mb-2">
                5★
              </div>
              <p className="text-lg text-white/80">Customer Rated</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white flex flex-col items-center">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-[#0A0A0A] mb-6">
            Ready to Drive Your Dream Car?
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Discover our extensive inventory and experience automotive excellence
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/explore" className="px-8 py-4 bg-[#C9A84C] text-[#0A0A0A] font-bold rounded-lg hover:bg-[#E5C263] transition-colors">
              Browse Inventory
            </a>
            <a href="/contact" className="px-8 py-4 border-2 border-[#C9A84C] text-[#C9A84C] font-bold rounded-lg hover:bg-[#C9A84C]/10 transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
