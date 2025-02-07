import { useState, useEffect } from 'react';
import { DEFAULT_IMAGE } from '../utils/imageMap';

interface BlurImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}

export const BlurImage = ({ src, alt, className = '', placeholder = DEFAULT_IMAGE }: BlurImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSrc, setCurrentSrc] = useState(placeholder);

  useEffect(() => {
    // Start loading the image
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setIsLoading(false);
      setCurrentSrc(src);
    };
    img.onerror = () => {
      setIsLoading(false);
      setCurrentSrc(placeholder);
    };
  }, [src, placeholder]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={currentSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-50 scale-105 blur-lg' : 'opacity-100 scale-100 blur-0'
        }`}
        decoding="async"
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
    </div>
  );
}; 