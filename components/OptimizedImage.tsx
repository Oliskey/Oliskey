import React, { useState, useEffect } from 'react';
import { ImageOff } from 'lucide-react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string; // Applied to the wrapper div
  imgClassName?: string; // Applied to the img tag
  priority?: boolean; // If true, eager load
  fill?: boolean; // If true, object-cover w-full h-full
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  src, 
  alt, 
  className = "", 
  imgClassName = "", 
  priority = false, 
  fill = true,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.src = src;
    if (img.complete) {
        setIsLoaded(true);
    }
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
      {/* Loading Skeleton */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 z-10">
           {/* Shimmer Effect */}
           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_1.5s_infinite] -translate-x-full" style={{ content: '""' }} />
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 text-gray-400 p-4 text-center z-20">
            <ImageOff size={24} className="mb-2 opacity-40" />
            <span className="text-[10px] uppercase tracking-wider font-semibold opacity-60">Image Unavailable</span>
        </div>
      )}

      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        className={`transition-all duration-700 ease-out ${
            fill ? 'w-full h-full object-cover' : ''
        } ${isLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-105 blur-lg'} ${imgClassName}`}
        {...props}
      />
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default OptimizedImage;