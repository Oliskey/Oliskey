import { hq } from './three/hq';
import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter';
import './index.css';
import App from './App';

// 3D pages: start downloading the 3D engine immediately, in parallel with the page code (no waiting in line)
const m3d = /^\/(school|fleet|alpha|labs)?\/?$/.exec(location.pathname);
if (m3d) {
  void import('./three/World');
  // and the baked light for the first space, matching theme and device
  const mode = document.documentElement.classList.contains('dark') ? 'night' : 'day';
  const lite = matchMedia('(max-width: 1023px)').matches || matchMedia('(pointer: coarse)').matches;
  const zone = m3d[1] || 'hq';
  new Image().src = hq(`/hq/lm/${zone}-${mode}${zone === 'hq' && lite ? '-1k' : ''}.webp`);
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
