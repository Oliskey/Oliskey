import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'dark' | 'light';
  showText?: boolean;
  animated?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "h-10", variant = 'dark', showText = true, animated = false }) => {
  const textColor = variant === 'dark' ? 'text-slate-900' : 'text-white';
  const ringColor = variant === 'dark' ? '#0f172a' : '#ffffff'; // slate-900 or white

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={`h-full w-auto ${animated ? 'animate-slow-spin' : ''}`}
      >
        {/* Interlocking Rings */}
        <g stroke={ringColor} strokeWidth="8" strokeLinecap="round">
          {/* Bottom Left */}
          <circle cx="35" cy="62" r="22" />
          {/* Bottom Right */}
          <circle cx="65" cy="62" r="22" />
          {/* Top Center */}
          <circle cx="50" cy="36" r="22" />
        </g>
        
        {/* Blue Accent Segment on Top Ring (Top-Right Quadrant) */}
        <path 
          d="M 65.55 20.44 A 22 22 0 0 1 72 36" 
          stroke="#3b82f6" 
          strokeWidth="8" 
          strokeLinecap="round" 
        />
      </svg>
      {/* Text hidden on mobile (hidden), shown on md screens (md:block) */}
      {showText && (
        <span className={`font-bold tracking-tight ${textColor} text-2xl hidden md:block`}>
          Oliskey
        </span>
      )}
    </div>
  );
};

export default Logo;