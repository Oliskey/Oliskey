import React from 'react';

// The Oliskey mark: three interlocking rings with the electric-blue arc, and the wordmark. Rings follow the text colour.
const Logo: React.FC<{ className?: string; showText?: boolean }> = ({ className = 'h-8', showText = true }) => (
  <span className={`inline-flex items-center gap-2.5 ${className}`}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="8" strokeLinecap="round">
        <circle cx="35" cy="62" r="22" />
        <circle cx="65" cy="62" r="22" />
        <circle cx="50" cy="36" r="22" />
      </g>
      <path d="M 65.55 20.44 A 22 22 0 0 1 72 36" stroke="#3b82f6" strokeWidth="8" strokeLinecap="round" />
    </svg>
    {showText && <span className="text-[21px] font-bold tracking-tight">Oliskey</span>}
  </span>
);

export default Logo;
