import React, { useEffect, useRef } from 'react';
import ThemedImage from './ThemedImage';
import type { RoleScreens } from '../lib/products';

// Every role of a product with three of its real screens, each on a phone.
// The role's screens glide sideways on their own in an endless row (the set is repeated so it never runs out).
// The visitor can still swipe or scroll it; touching, scrolling, hovering or focusing it holds it still, and it
// glides on again a few seconds after they let go. It only moves while on screen. Reduce Motion: it never moves on its own.
const SPEED = 28;          // px per second
const RESUME_MS = 3500;    // quiet time after the visitor's last touch before it glides again
const HOLD_EVENTS = ['pointerdown', 'touchstart', 'wheel', 'focusin', 'keydown'] as const;

function useGlide(row: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false, hovered = false, heldUntil = 0, last = 0, raf = 0, pos = el.scrollLeft, ours = false;
    const loop = () => (el.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0;   // width of one full set
    const hold = () => { heldUntil = performance.now() + RESUME_MS; };
    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(64, t - (last || t)); last = t;
      if (!visible || hovered || reduce.matches || t < heldUntil || document.hidden) { pos = el.scrollLeft; return; }
      const w = loop(); if (!w) return;
      pos += (SPEED * dt) / 1000;
      if (pos >= w) pos -= w;                       // back to the same picture in the first set: no visible jump
      ours = true; el.scrollLeft = pos;
    };
    const onScroll = () => {
      if (ours) { ours = false; return; }
      hold(); const w = loop();
      if (w && el.scrollLeft >= w) el.scrollLeft -= w;   // a visitor's swipe also loops endlessly
      pos = el.scrollLeft;
    };
    const enter = () => { hovered = true; }, leave = () => { hovered = false; hold(); };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.3 });
    io.observe(el);
    el.addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('mouseenter', enter); el.addEventListener('mouseleave', leave);
    for (const ev of HOLD_EVENTS) el.addEventListener(ev, hold, { passive: true });
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf); io.disconnect();
      el.removeEventListener('scroll', onScroll); el.removeEventListener('mouseenter', enter); el.removeEventListener('mouseleave', leave);
      for (const ev of HOLD_EVENTS) el.removeEventListener(ev, hold);
    };
  }, [row]);
}

const Phones: React.FC<{ name: string; r: RoleScreens; copy?: boolean }> = ({ name, r, copy }) => (
  <ul className="flex shrink-0 gap-5 pr-5 md:gap-7 md:pr-7" aria-hidden={copy || undefined}>
    {r.screens.map((s) => (
      <li key={s.light} className="w-[210px] shrink-0 md:w-[236px]">
        <div className="rounded-[30px] bg-[#111216] p-[6px] shadow-[0_30px_60px_-36px_rgb(var(--shadow)/0.7)] ring-1 ring-black/5 dark:ring-white/10">
          <div className="overflow-hidden rounded-[25px] bg-surface">
            <ThemedImage light={s.light} dark={s.dark} alt={copy ? '' : `${name}, ${r.role}: ${s.title}`} className="block aspect-[390/844] w-full object-cover object-top" />
          </div>
        </div>
        <h4 className="mt-4 text-[16px] font-semibold leading-snug text-ink">{s.title}</h4>
        <p className="mt-1 text-[14px] leading-relaxed text-muted">{s.text}</p>
      </li>
    ))}
  </ul>
);

const RoleRow: React.FC<{ name: string; r: RoleScreens }> = ({ name, r }) => {
  const row = useRef<HTMLDivElement>(null);
  useGlide(row);
  return (
    <section aria-label={`${name} for ${r.role}`} className="md:grid md:grid-cols-[minmax(0,260px)_minmax(0,1fr)] md:gap-10 lg:gap-14">
      <div className="md:pt-6">
        <p className="eyebrow">{r.eyebrow}</p>
        <h3 className="mt-2 text-[24px] font-semibold leading-tight tracking-[-0.5px] text-ink md:text-[28px]">{r.role}</h3>
        <p className="mt-3 max-w-[460px] text-[15px] leading-relaxed text-muted">{r.summary}</p>
      </div>
      <div ref={row} tabIndex={0} aria-label={`${r.role} screens, moving sideways`}
        className="role-glide -mx-4 mt-7 flex overflow-x-auto px-4 pb-3 pt-2 [scrollbar-width:none] md:mx-0 md:mt-0 md:px-0 [&::-webkit-scrollbar]:hidden">
        <Phones name={name} r={r} />
        <Phones name={name} r={r} copy />
        <Phones name={name} r={r} copy />
      </div>
    </section>
  );
};

const ScreenGallery: React.FC<{ name: string; roles: RoleScreens[] }> = ({ name, roles }) => (
  <div className="mt-12 space-y-16 md:mt-16 md:space-y-24">
    {roles.map((r) => <RoleRow key={r.role} name={name} r={r} />)}
  </div>
);
export default ScreenGallery;
