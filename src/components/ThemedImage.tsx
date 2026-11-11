import React from 'react';

// Shows the white-mode picture in light mode and the dark one in dark mode. Both are lazy, so only the visible one loads early.
const ThemedImage: React.FC<{ light: string; dark: string; alt: string; className?: string; eager?: boolean }> = ({ light, dark, alt, className = '', eager }) => (
  <>
    <img src={light} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" className={`${className} dark:hidden`} />
    <img src={dark} alt={alt} loading="lazy" decoding="async" className={`${className} hidden dark:block`} />
  </>
);
export default ThemedImage;
