import React from 'react';

// A real app screenshot that matches the site's theme: the white-mode picture in white mode, the dark one in dark mode.
// Both are lazy: the browser only fetches the one that is showing (a hidden lazy image is not loaded).
type Props = { shots: { light: string; dark: string }; alt: string; className?: string; eager?: boolean; width?: number; height?: number };

const ThemedShot: React.FC<Props> = ({ shots, alt, className = '', eager = false, width = 1600, height = 1000 }) => {
  const common = { width, height, decoding: 'async' as const, loading: eager ? undefined : ('lazy' as const), draggable: false };
  return (
    <>
      <img src={shots.light} alt={alt} {...common} className={`${className} dark:hidden`} />
      <img src={shots.dark} alt={alt} {...common} className={`${className} hidden dark:block`} />
    </>
  );
};

export default ThemedShot;
