import React, { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '../lib/theme';
import type { Stop, Zone } from './stops';

const World = lazy(() => import('./World'));

/** WebGL available and the visitor hasn't asked for less motion. */
export function canUse3d() {
  if (typeof window === 'undefined') return false;
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch { return false; }
}

/** Lite 3D for phones and tablets (touch screens, small screens or low memory): no heavy models or effects, lower resolution. */
const isPhone = () => window.matchMedia('(max-width: 1023px)').matches || window.matchMedia('(pointer: coarse)').matches
  || ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) <= 4;

/** If anything in the 3D layer throws, the scene is rebuilt (and resumes at the current stop). */
class Guard extends React.Component<{ onFail: () => void; children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(e: unknown) { console.error('[3d] disabled after an error', e); this.props.onFail(); }
  render() { return this.state.failed ? null : this.props.children; }
}

/**
 * A scroll journey: the 3D scene stays pinned behind the page while text blocks (marked data-stop) scroll over it.
 * When a block's centre reaches the middle of the screen the camera has arrived at that stop. Native scrolling is never
 * taken over. The 3D is always shown (no still-picture fallback); a quiet veil covers the moment before it is lit.
 */
const Journey: React.FC<{
  zones: readonly Zone[];
  stops: Stop[];
  onSelect?: (id: string) => void;
  children: React.ReactNode;   // the text blocks
  label: string;
}> = ({ zones, stops, onSelect, children, label }) => {
  const box = useRef<HTMLDivElement>(null);
  const fade = useRef<HTMLDivElement>(null);   // the veil the camera fades through on a cinematic cut
  const progress = useRef(0);
  const [use3d] = useState(canUse3d);
  const [gen, setGen] = useState(0);   // bumped to rebuild the 3D scene if the browser drops it
  const restart = () => { setReady(false); setGen((g) => (g < 3 ? g + 1 : g)); };
  const [phone, setPhone] = useState(isPhone);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(true);
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
        {/* until the 3D is lit: a quiet veil with the Oliskey mark (no still pictures) */}
        <div aria-hidden className={`absolute inset-0 grid place-items-center bg-surface transition-opacity duration-700 ease-glide ${ready ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
          {use3d ? <span className="h-10 w-10 animate-pulse text-faint"><svg viewBox="0 0 100 100" fill="none" className="h-full w-full"><g stroke="currentColor" strokeWidth="8" strokeLinecap="round"><circle cx="35" cy="62" r="22" /><circle cx="65" cy="62" r="22" /><circle cx="50" cy="36" r="22" /></g></svg></span>
            : <p className="max-w-[300px] text-center text-[15px] text-muted">This browser can’t show the 3D headquarters. Everything else on this page works as usual.</p>}
        </div>
        {use3d && (
          <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}>
            <Guard key={gen} onFail={restart}>
              <Suspense fallback={null}>
                <World zones={zones} stops={stops} progress={progress} mode={mode} phone={phone} active={active} onSelect={onSelect} onReady={() => { setReady(true); (window as unknown as { __ready3d?: number }).__ready3d = performance.now(); }} snap={snap} onLost={restart} fade={fade} />
              </Suspense>
            </Guard>
          </div>
        )}
        <div ref={fade} aria-hidden className="pointer-events-none absolute inset-0 bg-page opacity-0" />
        {/* soft shade where text sits, so panels stay readable on any frame */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-page/55 to-transparent md:hidden" />
      </div>
      <div className="pointer-events-none relative -mt-[100svh]">{children}</div>
    </div>
  );
};

export default Journey;

/** A text block the camera stops at. Content inside is clickable; the empty area lets the scene receive drags and clicks. */
export const StopBlock: React.FC<{ children: React.ReactNode; align?: 'left' | 'right' | 'center'; tall?: boolean; id?: string; top?: boolean; shade?: boolean }> = ({ children, align = 'left', tall, id, top, shade }) => (
  <section id={id} data-stop className={`relative page-x flex ${tall ? 'min-h-[100svh]' : 'min-h-[130svh]'} ${top ? 'items-start pt-[88px]' : tall ? 'items-end pb-[max(24px,6svh)]' : 'items-end pb-[21svh]'} md:items-center md:pb-0 md:pt-0 ${align === 'right' ? 'md:justify-end' : align === 'center' ? 'md:justify-center' : ''}`}>
    {shade && <div aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-screen -translate-x-1/2 bg-gradient-to-r from-page/90 via-page/45 via-45% to-transparent to-75% [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_78%,transparent)] md:block" />}
    <div className="pointer-events-auto relative w-full md:w-auto">{children}</div>
  </section>
);
