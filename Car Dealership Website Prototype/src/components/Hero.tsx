import { ImageWithFallback } from './figma/ImageWithFallback';

export function Hero() {
  return (
    <section className="relative bg-[#001F3F] text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&h=600&fit=crop"
          alt="Luxury car"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative max-w-[1600px] mx-auto px-8 py-24 lg:py-32">
        <div className="max-w-3xl">
          <h1 className="text-5xl lg:text-6xl mb-4">
            Drive the future
          </h1>
          <p className="text-lg lg:text-xl mb-8 text-gray-300 max-w-2xl">
            The car you trust to protect your family. How protects that future
          </p>
          <button className="bg-[#FFC700] text-[#001F3F] px-8 py-4 hover:bg-[#FFD700] transition-colors shadow-lg">
            Schedule a Test Drive
          </button>
        </div>
      </div>
    </section>
  );
}
