import { Button } from './ui/button';

// Curated high-quality background image (Unsplash) suitable for a car dealership hero
// Attribution: https://unsplash.com/photos/red-coupe-on-road-7e6692767b70 (license-free via Unsplash)
const defaultHeroBackgroundImage =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&h=1080&q=80";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  height?: string;
  overlayOpacity?: number; // 0 to 1, controls darkness of the image overlay
  backgroundImage?: string; // optional override for background image
}

export function HeroSection({
  title,
  subtitle,
  buttonText,
  onButtonClick,
  height = 'min-h-screen',
  overlayOpacity = 0.6,
  backgroundImage,
}: HeroSectionProps) {
  return (
    <div className={`relative ${height} w-full flex items-center justify-center overflow-hidden bg-background`}>
      {/* Background Image */}
      {/* Use an <img> with object-cover so the photo fills the area without stretching */}
      <img
        src={backgroundImage || defaultHeroBackgroundImage}
        srcSet={`${(backgroundImage || defaultHeroBackgroundImage)}&w=640 640w, ${(backgroundImage || defaultHeroBackgroundImage)}&w=1024 1024w, ${(backgroundImage || defaultHeroBackgroundImage)}&w=1440 1440w, ${(backgroundImage || defaultHeroBackgroundImage)}&w=1920 1920w`}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
        alt="Hero background"
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
        decoding="async"
        fetchPriority={height.includes('min-h-screen') ? 'high' as any : 'auto' as any}
      />
      {/* Image-only overlay to darken the background photo */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: `rgba(0,0,0,${Math.min(Math.max(overlayOpacity, 0), 1)})`,
        }}
        aria-hidden="true"
      />
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8 leading-tight tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8 md:mb-10 text-gray-100 max-w-3xl mx-auto font-light">
            {subtitle}
          </p>
        )}
        {buttonText && onButtonClick && (
          <Button
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 md:px-8 md:py-4 lg:px-10 lg:py-5 text-base md:text-lg lg:text-xl font-semibold rounded-full shadow-lg shadow-red-900/30 transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
            onClick={onButtonClick}
          >
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
}