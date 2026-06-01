import { useState } from 'react';
import { useProgressiveImage } from '../hooks/useProgressiveImage';

interface OptimizedImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  aspectRatio?: '16/9' | '3/2' | '4/3' | '1/1' | 'auto';
  priority?: boolean;
  objectPosition?: string;
}

const aspectRatioClasses: Record<string, string> = {
  '16/9': 'aspect-video',
  '3/2': 'aspect-[3/2]',
  '4/3': 'aspect-[4/3]',
  '1/1': 'aspect-square',
  'auto': '',
};

export default function OptimizedImage({
  src,
  alt,
  className = '',
  aspectRatio = 'auto',
  priority = false,
  objectPosition = 'center',
}: OptimizedImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { src: progressiveSrc, isLoading } = useProgressiveImage(src);

  const aspectClass = aspectRatioClasses[aspectRatio] || '';
  const loading = priority ? 'eager' : 'lazy';
  const decoding = priority ? 'sync' : 'async';

  return (
    <div className={`relative overflow-hidden bg-[#1C1C1E] ${aspectClass} ${className}`}>
      {/* Shimmer skeleton while loading */}
      {isLoading && !imageLoaded && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{
            animation: 'shimmer 1.4s infinite',
            backgroundSize: '200% 100%',
            backgroundPosition: '200% 0',
          }}
        />
      )}

      {/* Image */}
      <img
        src={progressiveSrc}
        alt={alt}
        className="w-full h-full object-cover transition-opacity duration-300"
        style={{
          objectPosition,
          opacity: isLoading && !imageLoaded ? 0.5 : 1,
        }}
        loading={loading}
        decoding={decoding}
        onLoad={() => setImageLoaded(true)}
      />
    </div>
  );
}
