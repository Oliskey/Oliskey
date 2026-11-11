import React, { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '../lib/theme';
import type { Stop, Zone } from './stops';

const World = lazy(() => import('./World'));

/** WebGL available and the visitor hasn't asked for less motion. */
export function canUse3d() {
  if (typeof window === 'undefined') return false;
  if (new URLSearchParams(location.search).has('no3d')) return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch { return false; }
}

const isPhone = () => window.matchMedia('(max-width: 767px)').matches || (window.matchMedia('(pointer: coarse)').matches && window.innerWidth < 1024);

/**
 * A scroll journey: the 3D scene stays pinned behind the page while text blocks (marked data-stop) scroll over it.
 * When a block's centre reaches the middle of the screen the camera has arrived at that stop. Native scrolling is never
 * taken over. Without WebGL (or with Reduce Motion) the same stops are shown as rendered stills that cross-fade.
 */
const Journey: React.FC<{
  zones: readonly Zone[];
  stops: Stop[];
  stills: string[];            // one still per real stop, by name (rendered from the same scene)
  onSelect?: (id: string) => void;
  children: React.ReactNode;   // the text blocks
  label: string;
}> = ({ zones, stops, stills, onSelect, children, label }) => {
  const box = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [use3d] = useState(canUse3d);
  const [phone, setPhone] = useState(isPhone);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(true);
  const [still, setStill] = useState(0);
  const { theme } = useTheme();
  const mode = theme === 'dark' ? 'night' : 'day';
  const snap = useMemo(() => new URLSearchParams(location.search).has('worldsnap'), []);

  useEffect(() => {
    const el = box.current; if (!el) return;
    let blocks = Array.from(el.querySelectorAll<HTMLElement>('[data-stop]'));
    const measure = () => {
      blocks = Array.from(el.querySelectorAll<HTMLElement>('[data-stop]'));   // blocks can change (a room was chosen)
      const mid = window.innerHeight / 2;
      const c = blocks.map((b) => { const r = b.getBoundingClientRect(); return r.top + r.height / 2 - mid; });
      let s = 0;
      if (c.length && c[0] < 0) {
        s = c.length - 1;
        for (let i = 0; i < c.length - 1; i++) if (c[i] <= 0 && c[i + 1] > 0) { s = i + -c[i] / (c[i + 1] - c[i]); break; }
      }
      progress.current = s;
      setStill(Math.round(s));
    };
    const resize = () => { blocks = Array.from(el.querySelectorAll<HTMLElement>('[data-stop]')); setPhone(isPhone()); measure(); };
    measure();
    const mo = new MutationObserver(() => requestAnimationFrame(measure));
    mo.observe(el, { childList: true, subtree: true });
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', resize);
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: '120px' });
    io.observe(el);
    const vis = () => setActive(!document.hidden);
    document.addEventListener('visibilitychange', vis);
    return () => { window.removeEventListener('scroll', measure); window.removeEventListener('resize', resize); io.disconnect(); mo.disconnect(); document.removeEventListener('visibilitychange', vis); };
  }, []);

  return (
    <div ref={box} className="relative">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-surface" role="img" aria-label={label}>
        {/* stills: the poster before 3D is ready, and the whole experience without WebGL */}
        {stills.map((s, i) => (
          <picture key={`${s}-${i}`} className={`absolute inset-0 transition-opacity duration-700 ease-glide ${(use3d ? !ready && i === 0 : i === Math.min(still, stills.length - 1)) ? 'opacity-100' : 'opacity-0'}`}>
            <img src={`/hq/stills/${s}-${mode}.webp`} alt="" className="h-full w-full object-cover" loading={i === 0 ? 'eager' : 'lazy'} decoding="async" {...{ fetchpriority: i === 0 ? 'high' : 'auto' }} />
          </picture>
        ))}
        {use3d && (
          <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}>
            <Suspense fallback={null}>
              <World zones={zones} stops={stops} progress={progress} mode={mode} phone={phone} active={active} onSelect={onSelect} onReady={() => setReady(true)} snap={snap} />
            </Suspense>
          </div>
        )}
        {/* soft shade where text sits, so panels stay readable on any frame */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-page/55 to-transparent md:hidden" />
      </div>
      <div className="pointer-events-none relative -mt-[100svh]">{children}</div>
    </div>
  );
};

export default Journey;

/** A text block the camera stops at. Content inside is clickable; the empty area lets the scene receive drags and clicks. */
export const StopBlock: React.FC<{ children: React.ReactNode; align?: 'left' | 'right' | 'center'; tall?: boolean; id?: string; top?: boolean }> = ({ children, align = 'left', tall, id, top }) => (
  <section id={id} data-stop className={`page-x flex ${tall ? 'min-h-[100svh]' : 'min-h-[130svh]'} ${top ? 'items-start pt-[88px]' : 'items-end pb-[max(24px,6svh)]'} md:items-center md:pb-0 md:pt-0 ${align === 'right' ? 'md:justify-end' : align === 'center' ? 'md:justify-center' : ''}`}>
    <div className="pointer-events-auto w-full md:w-auto">{children}</div>
  </section>
);
