import { ArrowRight, Play, Facebook, Twitter, Instagram } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative h-screen bg-[#050F1F] text-white overflow-hidden pt-16">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1762316817062-53ef18353891?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwc3BvcnRzJTIwY2FyJTIwcmVkJTIwbGlnaHRzfGVufDF8fHx8MTc2MzY0MTE3MXww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Sports car with red lights"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Social Media Icons - Left Side */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-20 hidden md:flex">
        <a href="#" className="text-white hover:text-[#FFD700] transition-colors duration-300">
          <Facebook className="w-5 h-5" />
        </a>
        <a href="#" className="text-white hover:text-[#FFD700] transition-colors duration-300">
          <Twitter className="w-5 h-5" />
        </a>
        <a href="#" className="text-white hover:text-[#FFD700] transition-colors duration-300">
          <Instagram className="w-5 h-5" />
        </a>
      </div>

      {/* Main Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left side - empty space for image */}
            <div></div>
            
            {/* Right side - content */}
            <div className="text-left">
              <h1 className="mb-6 text-5xl sm:text-6xl font-bold leading-tight">
                Drive the<br />future
              </h1>
              <p className="text-lg mb-8 text-gray-300 max-w-md">
                The car you trust to protect your family,<br />now protects their future
              </p>
              <button className="bg-[#FFD700] hover:bg-[#FFC700] text-[#001F3F] px-8 py-3 rounded flex items-center gap-2 transition-all duration-300 font-semibold hover:shadow-lg hover:shadow-[#FFD700]/50">
                <ArrowRight className="w-5 h-5" />
                Reserve yours
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Stats and Video */}
      <div className="absolute bottom-0 left-0 right-0 pb-8 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-end gap-8">
            {/* Stats - Bottom Left */}
            <div className="flex gap-6 sm:gap-12">
              <div>
                <div className="text-4xl sm:text-5xl mb-1 font-bold">1.9<span className="text-sm">s</span></div>
                <div className="text-xs text-gray-400">0-60 mph</div>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl mb-1 font-bold"><span className="text-[#FFD700]">+</span>250<span className="text-sm">mph</span></div>
                <div className="text-xs text-gray-400">Top Speed</div>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl mb-1 font-bold">620<span className="text-sm">mi</span></div>
                <div className="text-xs text-gray-400">Mile Range</div>
              </div>
            </div>

            {/* Video Thumbnail - Bottom Right */}
            <div className="hidden md:block">
              <div className="relative w-48 h-28 rounded-lg overflow-hidden group cursor-pointer shadow-lg hover:shadow-[#FFD700]/30 transition-shadow duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1742056024244-02a093dae0b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzcG9ydHMlMjBjYXJ8ZW58MXx8fHwxNzYzNTY5OTI0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Video preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-12 h-12 bg-[#FFD700] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-5 h-5 text-[#001F3F] ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}