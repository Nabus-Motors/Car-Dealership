import { useRef, useState, useEffect } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
}

interface UseIntersectionObserverResult {
  ref: React.RefObject<HTMLDivElement>;
  isVisible: boolean;
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverResult {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        // Unobserve once visible to avoid re-triggering
        observer.unobserve(entry.target);
      }
    }, {
      threshold: options.threshold ?? 0.1,
      rootMargin: options.rootMargin ?? '100px',
      root: options.root ?? null,
    });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return { ref, isVisible };
}
