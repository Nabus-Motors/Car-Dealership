import { ImageWithFallback } from './figma/ImageWithFallback';

export function DreamSection() {
  const services = [
    {
      id: 1,
      title: 'Inventory',
      image: 'https://images.unsplash.com/photo-1710083521061-c1b1701c5d95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBpbnRlcmlvciUyMGRhc2hib2FyZHxlbnwxfHx8fDE3NjM2MzI5OTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      buttonText: 'View Inventory',
      buttonStyle: 'border-2 border-white text-white hover:bg-white hover:text-black'
    },
    {
      id: 2,
      title: 'VIP Appointment',
      image: 'https://images.unsplash.com/photo-1660153711902-c149a38587ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBzdGVlcmluZyUyMHdoZWVsfGVufDF8fHx8MTc2MzY0MTYyNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      buttonText: 'View Inventory',
      buttonStyle: 'border-2 border-white text-white hover:bg-white hover:text-black'
    },
    {
      id: 3,
      title: 'Auto iDeal Club Finance',
      image: 'https://images.unsplash.com/photo-1643142314913-0cf633d9bbb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBkZWFsZXJzaGlwJTIwc2hvd3Jvb218ZW58MXx8fHwxNzYzNTUwNzE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      buttonText: 'Apply Now',
      buttonStyle: 'bg-white text-black hover:bg-gray-100'
    },
    {
      id: 4,
      title: 'Auto iDeal Club Services',
      image: 'https://images.unsplash.com/photo-1716341930202-af49146d9a1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBibHVlJTIwc3BvcnRzJTIwY2FyfGVufDF8fHx8MTc2MzY0MTYyNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      buttonText: 'Schedule Now',
      buttonStyle: 'border-2 border-white text-white hover:bg-white hover:text-black'
    }
  ];

  return (
    <section className="relative py-20 bg-gray-50 overflow-hidden">
      {/* Decorative tire image - bottom left */}
      <div className="absolute bottom-0 left-0 w-48 h-48 opacity-80 hidden lg:block">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1645437042703-5c3249a70550?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjB0aXJlJTIwd2hlZWx8ZW58MXx8fHwxNzYzNjQxNjI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Car tire"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Decorative car image - top right */}
      <div className="absolute top-0 right-0 w-96 h-64 opacity-90 hidden lg:block">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1597588561267-7a9507649ab9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHNlZGFuJTIwY2FyfGVufDF8fHx8MTc2MzYzNzE3MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="White car"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <p className="text-sm text-gray-500 mb-2">Our Services</p>
          <h2 className="max-w-xl">
            How can we help to make your dream come true
          </h2>
          <div className="w-12 h-1 bg-primary mt-4"></div>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div key={service.id} className="group relative overflow-hidden rounded">
              <div className="relative h-64">
                <ImageWithFallback 
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
                
                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="text-white mb-4">{service.title}</h3>
                  <button className={`px-6 py-2 rounded transition-all ${service.buttonStyle}`}>
                    {service.buttonText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}