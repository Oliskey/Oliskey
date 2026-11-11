import React, { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import ThemedShot from '../ThemedShot';
import { prefersReducedMotion } from '../motion/Reveal';

// The hero's right side, built in real 3D: the three products stand in space at different depths, each a screen with a
// little thickness, with small notes of finished work floating in front. The whole set leans toward the mouse (on a
// phone it sways gently by itself), and as the page scrolls the screens fan apart in depth and the set tips back.
// Pictures follow the site theme. One transform per element per frame; nothing re-renders. Reduce Motion: a still pose.

const DEPTH = [30, -80, 120];
const PLACE = ['left-[-4%] top-[8%] w-[70%]', 'right-[-6%] top-[-4%] w-[68%]', 'left-[20%] top-[44%] w-[74%]'];
const TURN = [-2.5, 2, -1];
const URLS = ['app.oliskey.com', 'tricycles.oliskey.com', 'alpha.oliskey.com'];
const NOTES = [
  { text: 'Report cards published', at: 'left-[2%] top-[72%]', z: 190, tint: PRODUCTS[0].tint, icon: PRODUCTS[0].icon },
  { text: 'Remittance recorded', at: 'right-[-6%] top-[30%]', z: 230, tint: PRODUCTS[1].tint, icon: PRODUCTS[1].icon },
  { text: 'Practice trade closed', at: 'right-[-2%] bottom-[-2%]', z: 210, tint: PRODUCTS[2].tint, icon: PRODUCTS[2].icon },
];

const HeroScreens: React.FC = () => {
  const box = useRef<HTMLDivElement>(null);
  const rig = useRef<HTMLDivElement>(null);
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const notes = useRef<(HTMLDivElement | null)[]>([]);
  const [still] = useState(prefersReducedMotion);

  useEffect(() => {
    const el = box.current;
    if (!el || still) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    let raf = 0, visible = true, t0 = performance.now();
    let mx = 0, my = 0, x = 0, y = 0, s = 0;     // pointer target, smoothed pointer, smoothed scroll
    const frame = (now: number) => {
      raf = 0;
      if (!visible) return;
      const t = (now - t0) / 1000;
      const r = el.getBoundingClientRect(), vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.35 - r.top) / (vh * 0.35 + r.height)));   // 0 at rest, 1 once the hero has scrolled away
      s += (p - s) * 0.12; x += (mx - x) * 0.06; y += (my - y) * 0.06;
      const swayX = fine ? 0 : Math.sin(t * 0.45) * 3.5, swayY = fine ? 0 : Math.cos(t * 0.35) * 1.6;
      const rx = 11 + s * 16 - y * 9 + swayY, ry = -15 + x * 14 + swayX;
      if (rig.current) rig.current.style.transform = `translate3d(0, ${(-s * 36).toFixed(1)}px, 0) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      const spread = 1 + s * 1.3;
      layers.current.forEach((l, i) => { if (l) l.style.transform = `translate3d(0, ${(Math.sin(t * 0.8 + i * 2) * 4).toFixed(1)}px, ${(DEPTH[i] * spread).toFixed(1)}px) rotateZ(${TURN[i]}deg)`; });
      notes.current.forEach((n, i) => { if (n) { n.style.transform = `translate3d(0, ${(Math.sin(t * 1.1 + i * 1.7) * 6).toFixed(1)}px, ${(NOTES[i].z * spread).toFixed(1)}px)`; n.style.opacity = String(Math.max(0, 1 - s * 1.6)); } });
      raf = requestAnimationFrame(frame);
    };
    const go = () => { if (!raf && visible) raf = requestAnimationFrame(frame); };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; go(); }, { rootMargin: '120px' });
    io.observe(el);
    const move = (e: PointerEvent) => { if (e.pointerType !== 'mouse') return; mx = e.clientX / window.innerWidth - 0.5; my = e.clientY / window.innerHeight - 0.5; };
    window.addEventListener('pointermove', move, { passive: true });
    go();
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('pointermove', move); };
  }, [still]);

  const pose = (i: number) => `translate3d(0, 0, ${DEPTH[i]}px) rotateZ(${TURN[i]}deg)`;

  return (
    <div ref={box} className="relative mx-auto aspect-[1.02] w-full max-w-[620px] [perspective:1700px] [perspective-origin:50%_40%]">
      <div ref={rig} className="absolute inset-[3%] [transform-style:preserve-3d] will-change-transform" style={{ transform: 'rotateX(11deg) rotateY(-15deg)' }}>
        {/* the shadow the set casts on the floor below it */}
        <div aria-hidden className="absolute inset-x-[8%] bottom-[-14%] h-[22%] rounded-[50%] bg-slate-900/25 blur-2xl dark:bg-black/70" style={{ transform: 'translate3d(0,0,-160px) rotateX(70deg)' }} />
        {PRODUCTS.map((pr, i) => (
          <div key={pr.id} ref={(n) => { layers.current[i] = n; }} className={`absolute ${PLACE[i]} [transform-style:preserve-3d]`} style={{ transform: pose(i) }}>
            {/* the screen's back and edge: it has thickness, so turning it shows depth */}
            <div aria-hidden className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-800" style={{ transform: 'translateZ(-10px)' }} />
            <figure className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_40px_80px_-30px_rgba(15,23,42,0.55)] ring-1 ring-white/60 dark:border-white/10 dark:bg-slate-900 dark:shadow-[0_40px_90px_-30px_rgba(0,0,0,0.95)] dark:ring-white/5">
              <div className="flex items-center gap-1 border-b border-slate-100 bg-white px-3 py-2 dark:border-white/5 dark:bg-slate-900" aria-hidden><i className="size-1.5 rounded-full bg-slate-300 dark:bg-white/20" /><i className="size-1.5 rounded-full bg-slate-300 dark:bg-white/20" /><i className="size-1.5 rounded-full bg-slate-300 dark:bg-white/20" /><span className="ml-2 truncate text-[9px] text-slate-400">{URLS[i]}</span></div>
              <ThemedShot shots={pr.shots} alt={`${pr.name} screen`} eager className="block aspect-[16/10] w-full object-cover object-left-top" />
              {/* a sheen across the glass, brighter at the top edge */}
              <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent dark:from-white/[0.07]" />
            </figure>
          </div>
        ))}
        {NOTES.map((n, i) => { const Icon = n.icon; return (
          <div key={n.text} ref={(el) => { notes.current[i] = el; }} aria-hidden className={`absolute ${n.at} hidden sm:block`} style={{ transform: `translate3d(0,0,${n.z}px)` }}>
            <div className="flex items-center gap-2.5 rounded-2xl border border-white/70 bg-white/85 py-2 pl-2 pr-3.5 shadow-[0_18px_40px_-14px_rgba(15,23,42,0.45)] backdrop-blur-md dark:border-white/10 dark:bg-slate-900/85 dark:shadow-[0_18px_40px_-14px_rgba(0,0,0,0.9)]">
              <span className={`grid size-8 place-items-center rounded-xl bg-gradient-to-br ${n.tint} text-white`}><Icon size={16} /></span>
              <span className="whitespace-nowrap text-xs font-semibold text-slate-800 dark:text-slate-100">{n.text}</span>
              <span className="grid size-5 place-items-center rounded-full bg-emerald-500 text-white"><Check size={12} strokeWidth={3} /></span>
            </div>
          </div>
        ); })}
      </div>
    </div>
  );
};

export default HeroScreens;
