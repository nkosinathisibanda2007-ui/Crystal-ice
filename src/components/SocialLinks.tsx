import React from 'react';

interface SocialLinksProps {
  className?: string;
  variant?: 'light' | 'dark' | 'brand';
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
  className = '',
  variant = 'dark',
  size = 'md',
  showLabels = false
}) => {
  const facebookUrl = "https://www.facebook.com/crystalicezim";
  const instagramUrl = "https://www.instagram.com/crystalicezim?stkn=MTVkODRobXRpc2hqaw==";
  const xTwitterUrl = "https://x.com/crystalicezim";
  const googleBusinessUrl = "https://www.google.com/search?kgmid=%2Fg%2F11q40rdy9f&hl=en-ZW&q=Crystal%20Ice%20Zimbabwe&shem=epsd1%2Cltae%2Crimspwouoe&shndl=30&source=sh%2Fx%2Floc%2Fosrp%2Fm1%2F4&kgs=73ff328e81c3f7ff";

  const sizeClasses = {
    sm: 'w-8 h-8 p-1.5 text-xs',
    md: 'w-10 h-10 p-2 text-sm',
    lg: 'w-12 h-12 p-2.5 text-base'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const getVariantClasses = (type: 'fb' | 'ig' | 'x' | 'google') => {
    if (variant === 'light') {
      // Light background on dark sections
      return 'bg-white/10 hover:bg-white/20 text-white border border-white/15';
    }
    if (variant === 'brand') {
      if (type === 'fb') return 'bg-[#1877F2]/10 hover:bg-[#1877F2] text-[#1877F2] hover:text-white border border-[#1877F2]/30';
      if (type === 'ig') return 'bg-pink-50 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-600 hover:to-purple-600 text-pink-600 hover:text-white border border-pink-200';
      if (type === 'x') return 'bg-slate-100 hover:bg-black text-slate-900 hover:text-white border border-slate-300';
      if (type === 'google') return 'bg-blue-50 hover:bg-[#4285F4] text-[#4285F4] hover:text-white border border-blue-200';
    }
    // Default dark text on light background
    return 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200';
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Facebook */}
      <a
        id="social-link-facebook"
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Crystal Ice Zimbabwe on Facebook"
        title="Follow Crystal Ice Zimbabwe on Facebook"
        className={`rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 ${sizeClasses[size]} ${getVariantClasses('fb')}`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className={iconSizes[size]}>
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        {showLabels && <span className="ml-2 font-bold text-xs">Facebook</span>}
      </a>

      {/* Instagram */}
      <a
        id="social-link-instagram"
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Crystal Ice Zimbabwe on Instagram"
        title="Follow Crystal Ice Zimbabwe on Instagram"
        className={`rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 ${sizeClasses[size]} ${getVariantClasses('ig')}`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className={iconSizes[size]}>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
        {showLabels && <span className="ml-2 font-bold text-xs">Instagram</span>}
      </a>

      {/* X / Twitter */}
      <a
        id="social-link-twitter"
        href={xTwitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Crystal Ice Zimbabwe on X"
        title="Follow Crystal Ice Zimbabwe on X (@crystalicezim)"
        className={`rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 ${sizeClasses[size]} ${getVariantClasses('x')}`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className={iconSizes[size]}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        {showLabels && <span className="ml-2 font-bold text-xs">X (Twitter)</span>}
      </a>

      {/* Google Business Profile / Reviews */}
      <a
        id="social-link-google"
        href={googleBusinessUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Crystal Ice Zimbabwe Google Business Profile & Reviews"
        title="View Crystal Ice Zimbabwe on Google Search & Maps"
        className={`rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 ${sizeClasses[size]} ${getVariantClasses('google')}`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className={iconSizes[size]}>
          <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.067 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
        </svg>
        {showLabels && <span className="ml-2 font-bold text-xs">Google Profile</span>}
      </a>
    </div>
  );
};
