import React, { useEffect, useState } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '@/firebase/firebase';
import { ImageWithFallback } from './ImageWithFallback';

type Props = {
  src?: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  onResolved?: (url: string | null) => void;
};

function isHttpUrl(s?: string) {
  if (!s) return false;
  return s.startsWith('http://') || s.startsWith('https://') || s.startsWith('data:');
}

export function StorageImage({ src, alt, className, style, onResolved }: Props) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;
    async function resolve() {
      try {
        if (!src) {
          if (!cancelled) {
            setUrl(null);
            setLoading(false);
            onResolved?.(null);
          }
          return;
        }
        if (isHttpUrl(src)) {
          if (!cancelled) {
            setUrl(src);
            setLoading(false);
            onResolved?.(src);
          }
          return;
        }
        // Treat as storage path
        const download = await getDownloadURL(ref(storage, src));
        if (!cancelled) {
          setUrl(download);
          setLoading(false);
          onResolved?.(download);
        }
      } catch (e) {
        console.error('Failed to resolve image url:', e);
        if (!cancelled) {
          setUrl(null);
          setLoading(false);
          onResolved?.(null);
        }
      }
    }
    setLoading(true);
    resolve();
    return () => {
      cancelled = true;
    };
  }, [src, onResolved]);

  if (loading) {
    return (
      <div className={`bg-gray-100 animate-pulse ${className ?? ''}`} style={style} />
    );
  }

  if (!url) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center text-gray-400 ${className ?? ''}`} style={style}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path fillRule="evenodd" d="M1.5 6A2.25 2.25 0 013.75 3.75h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zm3 .75a.75.75 0 000 1.5h14.25a.75.75 0 000-1.5H4.5zm4.28 5.47a.75.75 0 011.06 0l2.22 2.22 1.22-1.22a.75.75 0 011.06 0l2.72 2.72a.75.75 0 01-1.06 1.06l-2.19-2.19-1.25 1.25a.75.75 0 01-1.06 0l-2.75-2.75a.75.75 0 010-1.06z" clipRule="evenodd" />
        </svg>
      </div>
    );
  }

  return (
    <ImageWithFallback src={url} alt={alt} className={className} style={style} />
  );
}
