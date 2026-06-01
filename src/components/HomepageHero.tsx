import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

interface HomepageHeroProps {
  onReserve?: () => void;
  onTestDrive?: () => void;
  featuredCarImage?: string;
}

export default function HomepageHero({
  onTestDrive,
  featuredCarImage = 'https://firebasestorage.googleapis.com/v0/b/car-dealership-8f6d2.appspot.com/o/hero-bg.jpg?alt=media'
}: HomepageHeroProps) {
  const navigate = useNavigate();
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate scroll indicator pulse
    const indicator = scrollIndicatorRef.current;
    if (indicator) {
      const keyframes = `
        @keyframes pulse-gradient {
          0% { opacity: 0.5; transform: translateY(0); }
          50% { opacity: 1; }
          100% { opacity: 0.5; transform: translateY(8px); }
        }
      `;
      const style = document.createElement('style');
      style.textContent = keyframes;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-[#0A0A0A]">
      {/* Background image layer */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={featuredCarImage}
          alt="Premium Vehicles"
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        
        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(10,10,10,0.97)] via-[rgba(10,10,10,0.85)] to-transparent" />
        
        {/* Subtle gold grid texture - right side only */}
        <div 
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(201, 168, 76, 0.05) 25%, rgba(201, 168, 76, 0.05) 26%, transparent 27%, transparent 74%, rgba(201, 168, 76, 0.05) 75%, rgba(201, 168, 76, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(201, 168, 76, 0.05) 25%, rgba(201, 168, 76, 0.05) 26%, transparent 27%, transparent 74%, rgba(201, 168, 76, 0.05) 75%, rgba(201, 168, 76, 0.05) 76%, transparent 77%, transparent)',
            backgroundSize: '50px 50px',
            backgroundPosition: '0 0, 25px 25px',
            maskImage: 'linear-gradient(to left, black 0%, transparent 30%)',
            WebkitMaskImage: 'linear-gradient(to left, black 0%, transparent 30%)',
          }}
        />
      </div>

      {/* Content layer */}
      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Top vehicle badge */}
        <div className="absolute top-12 right-8 hidden xl:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
          <div className="w-2 h-2 bg-[#C9A84C] rounded-full animate-pulse" />
          <span className="text-xs font-medium text-white/70 uppercase tracking-[2px]">Featured Vehicles</span>
        </div>

        {/* Main content container */}
        <div className="w-full max-w-3xl text-center">
          {/* Eyebrow label with accent bar */}
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#C9A84C]" />
            <span className="text-xs font-black text-[#C9A84C] uppercase tracking-[4px]">
              Premium Automobiles
            </span>
            <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#C9A84C]" />
          </div>

          {/* Headline with mixed styling */}
          <div className="mb-6">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black font-barlow text-white leading-tight mb-2">
              Drive<span className="block" />
              <span className="text-[#C9A84C]">Your</span>
              <span className="block" />
              <span 
                className="text-white"
                style={{
                  WebkitTextStroke: '2px #C9A84C',
                  paintOrder: 'stroke fill',
                }}
              >
                Dream
              </span>
            </h1>
          </div>

          {/* Supporting text */}
          <p className="text-base sm:text-lg text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            Premium new and pre-owned vehicles, certified and ready for Ghana's roads.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => navigate('/explore')}
              className="px-8 py-4 bg-[#C9A84C] text-[#0A0A0A] font-black uppercase tracking-[1px] text-sm rounded transition-all hover:bg-[#E5C263] hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              Browse Inventory
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button
              onClick={onTestDrive}
              className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-black uppercase tracking-[1px] text-sm rounded transition-all hover:border-white/60 hover:bg-white/5 active:scale-95"
            >
              Book Test Drive
            </button>
          </div>

          {/* Stats strip */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 py-8 border-y border-white/10">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-[#C9A84C] font-barlow">500+</div>
              <div className="text-xs uppercase text-white/60 tracking-[1px] mt-1">Vehicles</div>
            </div>
            <div className="hidden sm:block w-[1px] h-8 bg-white/10" />
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-[#C9A84C] font-barlow">10+</div>
              <div className="text-xs uppercase text-white/60 tracking-[1px] mt-1">Years Experience</div>
            </div>
            <div className="hidden sm:block w-[1px] h-8 bg-white/10" />
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-[#C9A84C] font-barlow">2,000+</div>
              <div className="text-xs uppercase text-white/60 tracking-[1px] mt-1">Happy Customers</div>
            </div>
            <div className="hidden sm:block w-[1px] h-8 bg-white/10" />
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-[#C9A84C] font-barlow">5★</div>
              <div className="text-xs uppercase text-white/60 tracking-[1px] mt-1">Rated</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce"
          style={{
            animation: 'pulse-gradient 2s ease-in-out infinite',
          }}
        >
          <span className="text-xs uppercase text-white/40 tracking-[2px]">Scroll</span>
          <ChevronDown className="w-5 h-5 text-white/40" />
        </div>

        {/* Bottom gold accent line */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent opacity-60" />
      </div>
    </section>
  );
}
