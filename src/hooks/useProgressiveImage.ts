import { useState, useEffect } from 'react';
import { useImageCache } from './useImageCache';

export interface UseProgressiveImageResult {
  src: string;
  isLoading: boolean;
  isError: boolean;
}

// SVG fallback car icon
const FALLBACK_SVG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiMxQzFDMUUiIC8+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMjAwIiByPSI0MCIgZmlsbD0iIzBBMEEwQSIgc3Ryb2tlPSIjQzlBODRDIiBzdHJva2Utd2lkdGg9IjIiIC8+CiAgPGNpcmNsZSBjeD0iMzAwIiBjeT0iMjAwIiByPSI0MCIgZmlsbD0iIzBBMEEwQSIgc3Ryb2tlPSIjQzlBODRDIiBzdHJva2Utd2lkdGg9IjIiIC8+CiAgPHJlY3QgeD0iNjAiIHk9IjEyMCIgd2lkdGg9IjI4MCIgaGVpZ2h0PSI1MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjQzlBODRDIiBzdHJva2Utd2lkdGg9IjIiIC8+CiAgPHRleHQgeD0iMjAwIiB5PSIxNjAiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjQzlBODRDIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5QcmVtaXVtIFZlaGljbGU8L3RleHQ+Cjwvc3ZnPg==';

// Image preloading timeout (reduced from 8s for faster fallback)
const IMAGE_LOAD_TIMEOUT = 5000;

export function useProgressiveImage(src: string | null | undefined): UseProgressiveImageResult {
  const [currentSrc, setCurrentSrc] = useState<string>(FALLBACK_SVG);
  const [isLoading, setIsLoading] = useState<boolean>(!!src);
  const [isError, setIsError] = useState<boolean>(false);
  
  // Use image cache hook for better performance
  const cachedSrc = useImageCache(src);

  useEffect(() => {
    if (!cachedSrc || cachedSrc === currentSrc) {
      if (!src) {
        setCurrentSrc(FALLBACK_SVG);
        setIsLoading(false);
        setIsError(false);
      }
      return;
    }

    setIsLoading(true);
    setIsError(false);

    const img = new Image();
    img.src = cachedSrc;

    const handleLoad = () => {
      setCurrentSrc(cachedSrc);
      setIsLoading(false);
      setIsError(false);
    };

    const handleError = () => {
      setCurrentSrc(FALLBACK_SVG);
      setIsLoading(false);
      setIsError(true);
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);

    // Timeout fallback for images that take too long
    const timeout = setTimeout(() => {
      setCurrentSrc(FALLBACK_SVG);
      setIsLoading(false);
      setIsError(true);
    }, IMAGE_LOAD_TIMEOUT);

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
      clearTimeout(timeout);
    };
  }, [cachedSrc, src]);

  return {
    src: currentSrc,
    isLoading,
    isError,
  };
}
