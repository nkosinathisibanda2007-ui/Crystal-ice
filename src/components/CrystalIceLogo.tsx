import React from 'react';

interface CrystalIceLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  lightMode?: boolean;
  customLogoUrl?: string;
}

export const CrystalIceLogo: React.FC<CrystalIceLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = false,
  lightMode = false,
  customLogoUrl
}) => {
  // Standard corporate logo dimensions: clean, compact, non-intrusive
  const containerHeights = {
    sm: 'h-7',
    md: 'h-8 sm:h-9',
    lg: 'h-10 sm:h-11'
  };

  const logoSrc = customLogoUrl || (lightMode ? '/crystal_ice_logo.png' : '/crystal_ice_logo.png');

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <img
        src={logoSrc}
        alt="Crystal Ice Zimbabwe Logo"
        className={`${containerHeights[size]} w-auto object-contain shrink-0`}
      />
      {showSubtitle && (
        <span
          className={`text-[9px] font-extrabold tracking-wider uppercase pl-2 border-l hidden sm:inline-block ${
            lightMode ? 'text-cyan-200 border-white/20' : 'text-slate-400 border-slate-300'
          }`}
        >
          Zimbabwe
        </span>
      )}
    </div>
  );
};
