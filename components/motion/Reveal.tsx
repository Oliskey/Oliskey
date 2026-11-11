import React, { useEffect, useRef, useState } from 'react';

// Fades and rises content into place the first time it enters the screen (index.css .reveal). Once in, it stays.
export const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string; as?: 'div' | 'li' | 'article' | 'section' }> = ({ children, delay = 0, className = '', as = 'div' }) => {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setInView(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Tag = as as any;
  return <Tag ref={ref} className={`reveal ${inView ? 'is-in' : ''} ${className}`} style={{ ['--reveal-delay' as any]: `${delay}ms` }}>{children}</Tag>;
};

/** True when the visitor asked for less motion. */
export const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Calls `onProgress(p)` (0 → 1) as `ref` scrolls. 'pin' (tall pinned sections): 0 when its top reaches the top of the screen,
 * 1 when its bottom reaches the bottom. 'pass' (ordinary blocks): 0 when it enters at the bottom, 1 when it has left at the top.
 * One animation frame per scroll, only while it is near the screen.
 */
export function useScrollProgress(ref: React.RefObject<HTMLElement>, onProgress: (p: number) => void, mode: 'pin' | 'pass' = 'pin') {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0, near = true;
    const measure = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const travel = r.height - vh;
      const p = mode === 'pass'
        ? Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)))
        : travel <= 0 ? (r.top <= 0 ? 1 : 0) : Math.min(1, Math.max(0, -r.top / travel));
      onProgress(p);
    };
    const onScroll = () => { if (near && !frame) frame = requestAnimationFrame(measure); };
    const io = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(([e]) => { near = e.isIntersecting; if (near) onScroll(); }, { rootMargin: '200px 0px' }) : null;
    io?.observe(el);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    measure();
    return () => { io?.disconnect(); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (frame) cancelAnimationFrame(frame); };
  }, [ref, onProgress, mode]);
}
