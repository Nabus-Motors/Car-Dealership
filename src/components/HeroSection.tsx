import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
  backgroundImage: string;
  title: string;
  subtitle: string;
  height?: string;
  className?: string;
  cta?: {
    text: string;
    onClick?: () => void;
  };
  centered?: boolean;
}

export function HeroSection({
  backgroundImage,
  title,
  subtitle,
  height = 'h-80 md:h-96 lg:h-[32rem]',
  className = '',
  cta,
  centered = false,
}: HeroSectionProps) {
  const navigate = useNavigate();

  const handleCTA = () => {
    if (cta?.onClick) {
      cta.onClick();
    } else {
      navigate('/explore');
    }
  };

  return (
    <section
      className={`relative ${height} bg-[#050F1F] text-white overflow-hidden ${className}`}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt="Hero Background"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Main Content */}
      <div className="relative h-full flex items-center pt-16 md:pt-0">
        <div className="container mx-auto px-4 max-w-7xl w-full">
          {centered ? (
            // Centered layout
            <div className="text-center">
              <h1 className="mb-4 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                {title}
              </h1>
              <p className="text-base md:text-lg text-gray-200 max-w-2xl mx-auto mb-8 font-medium leading-relaxed">
                {subtitle}
              </p>
              {cta && (
                <button 
                  onClick={handleCTA}
                  className="bg-[#FFD700] hover:bg-[#FFC700] text-[#001F3F] px-8 py-4 inline-flex items-center gap-3 transition-all duration-300 font-black uppercase tracking-widest text-lg hover:shadow-lg hover:shadow-[#FFD700]/50 hover:scale-105"
                >
                  {cta.text}
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          ) : (
            // Left-aligned layout
            <div>
              <h1 className="mb-4 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                {title}
              </h1>
              <p className="text-base md:text-lg text-gray-200 max-w-2xl mb-8 font-medium leading-relaxed">
                {subtitle}
              </p>
              {cta && (
                <button 
                  onClick={handleCTA}
                  className="bg-[#FFD700] hover:bg-[#FFC700] text-[#001F3F] px-8 py-4 inline-flex items-center gap-3 transition-all duration-300 font-black uppercase tracking-widest text-lg hover:shadow-lg hover:shadow-[#FFD700]/50 hover:scale-105"
                >
                  {cta.text}
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}