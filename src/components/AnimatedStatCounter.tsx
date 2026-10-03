import React, { useEffect, useRef, useState } from 'react';

interface AnimatedStatCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  description?: string;
  duration?: number;
}

export const AnimatedStatCounter: React.FC<AnimatedStatCounterProps> = ({
  value,
  prefix = '',
  suffix = '',
  label,
  description,
  duration = 2000
}) => {
  const [displayValue, setDisplayValue] = useState<number>(0);
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          let startTime: number | null = null;
          const startValue = 0;
          const endValue = value;

          const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            
            // Ease out cubic
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(startValue + (endValue - startValue) * easeOutProgress);
            
            setDisplayValue(current);

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setDisplayValue(endValue);
            }
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  const formattedNumber = value % 1 !== 0 
    ? (hasAnimated ? value.toFixed(1) : '0.0')
    : displayValue.toLocaleString();

  return (
    <div
      ref={elementRef}
      id={`stat-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
      className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-cyan-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
    >
      <div>
        <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight flex items-baseline gap-1 font-['Outfit']">
          <span className="text-cyan-600">{prefix}</span>
          <span>{hasAnimated ? formattedNumber : '0'}</span>
          <span className="text-cyan-600 text-2xl sm:text-3xl font-bold">{suffix}</span>
        </div>
        <div className="mt-2 text-base font-semibold text-slate-800">
          {label}
        </div>
      </div>
      {description && (
        <div className="mt-2 text-xs text-slate-500 leading-relaxed">
          {description}
        </div>
      )}
    </div>
  );
};
