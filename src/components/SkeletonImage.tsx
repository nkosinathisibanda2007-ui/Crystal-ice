import React, { useState, useEffect, useRef } from 'react';
import { ImageIcon } from 'lucide-react';

interface SkeletonImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  skeletonClassName?: string;
  fallbackSrc?: string;
  dark?: boolean;
}

export const SkeletonImage: React.FC<SkeletonImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  skeletonClassName = '',
  fallbackSrc,
  dark = false,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Check if image is already cached in browser memory on mount or src change
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);

    if (!src) {
      setHasError(true);
      return;
    }

    // If the image is already completely cached by the browser
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    if (fallbackSrc && src !== fallbackSrc) {
      setHasError(false);
    } else {
      setHasError(true);
      setIsLoaded(true);
    }
  };

  const imageSrc = hasError && fallbackSrc ? fallbackSrc : src;

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {/* Skeleton Shimmer Overlay */}
      {!isLoaded && (
        <div
          aria-hidden="true"
          className={`absolute inset-0 z-10 overflow-hidden ${
            dark ? 'bg-slate-900' : 'bg-slate-200'
          } ${skeletonClassName}`}
        >
          {/* Animated Shimmer Wave */}
          <div
            className={`w-full h-full animate-pulse ${
              dark
                ? 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900'
                : 'bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200'
            }`}
          />
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
        </div>
      )}

      {/* Actual Image with Fade-in on load */}
      {imageSrc ? (
        <img
          ref={imgRef}
          src={imageSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`${className} transition-opacity duration-300 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...props}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
          <ImageIcon className="w-6 h-6 opacity-40" />
        </div>
      )}

      {/* Fallback placeholder if image load fails completely */}
      {hasError && !fallbackSrc && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-2 text-center text-xs">
          <ImageIcon className="w-5 h-5 mb-1 opacity-50" />
          <span className="text-[10px] text-slate-400 line-clamp-1">{alt}</span>
        </div>
      )}
    </div>
  );
};
