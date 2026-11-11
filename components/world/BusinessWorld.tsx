import React, { useEffect, useRef, useState } from 'react';
import { createWorld } from './scene';
import { PRODUCTS, productById } from '../../data/products';

// The live 3D canvas behind the Home journey. It stays on screen (sticky) while the page's text blocks scroll over it.
// Each block marked data-stop lines up with one camera stop: when a block's centre crosses the middle of the screen the
// camera has arrived at its room. Between blocks the camera travels. Scroll sets the target; the camera glides to it.
// Draws only while the journey is on screen and the tab is visible. The pointer nudges the camera a little (mouse only).
type Props = { journey: React.RefObject<HTMLElement>; onReady?: () => void };

const BusinessWorld: React.FC<Props> = ({ journey, onReady }) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const cv = canvas.current, box = journey.current;
    if (!cv || !box) return;
    const mobile = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;
    let world: ReturnType<typeof createWorld>;
    try {
      world = createWorld(cv, { mobile, shots: { school: productById('school').shots, fleet: productById('fleet').shots, alpha: productById('alpha').shots } });
    } catch { return; }
    const root = document.documentElement;
    // a problem in the 3D layer must never take the page down with it
    const theme = () => { try { world.applyTheme(root.classList.contains('dark')); } catch (e) { console.error('[world] theme', e); } };
    theme();
    const themeWatch = new MutationObserver(theme);
    themeWatch.observe(root, { attributes: true, attributeFilter: ['class'] });

    const blocks = () => Array.from(box.querySelectorAll<HTMLElement>('[data-stop]'));
    let list = blocks();
    const target = () => {
      // where are we between the blocks? 0 = first block centred, 1 = second, …
      const mid = window.innerHeight / 2;
      const c = list.map((b) => { const r = b.getBoundingClientRect(); return r.top + r.height / 2 - mid; });
      if (!c.length) return 0;
      if (c[0] >= 0) return 0;
      for (let i = 0; i < c.length - 1; i++) if (c[i] <= 0 && c[i + 1] > 0) return i + -c[i] / (c[i + 1] - c[i]);
      return c.length - 1;
    };

    const snap = new URLSearchParams(location.search).has('worldsnap');   // test hook: jump straight to the scroll position
    let shown = target(), raf = 0, visible = true, t0 = performance.now(), px = 0, py = 0, sx = 0, sy = 0, first = true;
    const size = () => { const r = cv.getBoundingClientRect(); world.resize(Math.max(1, Math.round(r.width)), Math.max(1, Math.round(r.height))); };
    size();
    const frame = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      const goal = Math.min(world.stops - 1, target());
      shown = snap ? goal : shown + (goal - shown) * 0.075;
      sx += (px - sx) * 0.05; sy += (py - sy) * 0.05;
      try { world.render(shown, (now - t0) / 1000, [sx, sy]); } catch (e) { console.error('[world] render', e); return; }
      if (first) { first = false; setReady(true); onReady?.(); }
      raf = requestAnimationFrame(frame);
    };
    const go = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame); };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; go(); }, { rootMargin: '100px' });
    io.observe(box);
    const ro = new ResizeObserver(() => { size(); list = blocks(); });
    ro.observe(cv);
    const move = (e: PointerEvent) => { if (e.pointerType !== 'mouse') return; px = e.clientX / window.innerWidth - 0.5; py = e.clientY / window.innerHeight - 0.5; };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('visibilitychange', go);
    go();
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); themeWatch.disconnect();
      window.removeEventListener('pointermove', move); document.removeEventListener('visibilitychange', go);
      world.dispose();
    };
  }, [journey, onReady]);

  return <canvas ref={canvas} aria-label={`A 3D walk through a business running on ${PRODUCTS.map((p) => p.name).join(', ')}`} role="img" className={`absolute inset-0 block h-full w-full transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`} />;
};

export default BusinessWorld;
