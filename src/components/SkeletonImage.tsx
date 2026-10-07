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
  priority?: boolean;
}

export const SkeletonImage: React.FC<SkeletonImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  skeletonClassName = '',
  fallbackSrc,
  dark = false,
  priority = false,
  ...props
}) => {
  // If priority is true, image starts in loaded state to eliminate any delay
  const [isLoaded, setIsLoaded] = useState(() => priority);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(src || fallbackSrc);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
    setHasError(false);
    if (priority) {
      setIsLoaded(true);
      return;
    }

    if (!src && !fallbackSrc) {
      setHasError(true);
      return;
    }

    // Check if the image is already completely cached by the browser
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [src, fallbackSrc, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      // Gracefully switch to fallback photo without showing broken icon
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else {
      setHasError(true);
      setIsLoaded(true);
    }
  };

  const imageSrc = currentSrc;

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {/* Background Skeleton: Sits BEHIND the image so progressive JPEGs paint immediately */}
      {!isLoaded && !priority && (
        <div
          aria-hidden="true"
          className={`absolute inset-0 z-0 overflow-hidden ${
            dark ? 'bg-slate-900' : 'bg-slate-200'
          } ${skeletonClassName}`}
        >
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

      {/* Actual Image: Renders immediately on top with eager/progressive decoding */}
      {imageSrc ? (
        <img
          ref={imgRef}
          src={imageSrc}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding={priority ? 'sync' : 'async'}
          onLoad={handleLoad}
          onError={handleError}
          className={`${className} relative z-1 transition-opacity duration-200 ease-out ${
            priority || isLoaded ? 'opacity-100' : 'opacity-90'
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
        <div className="absolute inset-0 z-2 flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-2 text-center text-xs">
          <ImageIcon className="w-5 h-5 mb-1 opacity-50" />
          <span className="text-[10px] text-slate-400 line-clamp-1">{alt}</span>
        </div>
      )}
    </div>
  );
};
