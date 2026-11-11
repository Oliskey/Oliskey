import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bell, Check, CreditCard, Globe2, MapPin, PhoneMissed, ShoppingBag, Truck } from 'lucide-react';
import { prefersReducedMotion, useScrollProgress } from '../motion/Reveal';

// A short animated film, played by scrolling: one shop, seen in 3D.
//   1. Before: it runs on paper; customers queue to buy in person.
//   2. The cost: night falls, the doors close, calls are missed, the paperwork piles up, customers walk away.
//   3. The change: a website and an app rise beside the shop.
//   4. Online: customers appear from everywhere, connect to the shop, and orders and payments arrive by themselves.
//   5. Growth: sales climb (an illustration, not a promise of numbers).
// The "camera" glides between shots. Scroll position is smoothed so the film moves like a film, not in steps.
// Everything is transform/opacity written straight to elements once per frame; nothing re-renders per frame.
// Reduce Motion: no pinning; the final shot and all five captions are shown as they are.

const W = 640, H = 540;
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const range = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// camera shots: [progress, tiltX, turnZ, zoom, panX, panY]
const SHOTS: [number, number, number, number, number, number][] = [
  [0.0, 60, -26, 1.24, 170, 60],
  [0.18, 58, -34, 1.08, 140, 34],
  [0.36, 55, -24, 1.02, 10, 20],
  [0.56, 52, -14, 0.92, -40, 10],
  [0.74, 60, -18, 0.76, 0, 0],
  [1.0, 55, -32, 0.86, 30, -10],
];
const camera = (p: number) => {
  let i = 0;
  while (i < SHOTS.length - 2 && p > SHOTS[i + 1][0]) i++;
  const a = SHOTS[i], b = SHOTS[i + 1], t = ease(range(p, a[0], b[0]));
  return [1, 2, 3, 4, 5].map((k) => lerp(a[k], b[k], t)) as [number, number, number, number, number];
};

const SCENES = [
  { eyebrow: 'Before', title: 'A business that runs on paper', body: 'Every sale is written in a notebook, cash goes into a box, and customers have to come in person to buy.' },
  { eyebrow: 'The cost', title: 'When the doors close, sales stop', body: 'Calls get missed after hours, records get lost in piles of paper, and customers who can’t come in buy somewhere else.' },
  { eyebrow: 'The change', title: 'Your business, open online', body: 'A website and an app put your business in every customer’s pocket, open day and night.' },
  { eyebrow: 'Online', title: 'Customers from everywhere', body: 'People find you, order from anywhere and pay in seconds, while orders, payments and reminders arrive by themselves.' },
  { eyebrow: 'Growth', title: 'More customers. More sales. Less manual work.', body: 'The time once spent on paperwork goes into serving customers and growing the business.' },
];
const CUTS = [0, 0.19, 0.38, 0.58, 0.8];

// where things stand on the floor (world units = stage pixels)
const SHOP = { x: 92, y: 150, w: 176, d: 118, h: 132 };
const QUEUE = [[150, 318], [196, 344], [242, 370]] as const;
const MISSED = [[118, 200, 176], [214, 170, 214], [262, 238, 150]] as const;
const PINS = [[56, 470], [330, 506], [600, 446], [612, 150], [430, 34], [44, 74]] as const;
const PHONE = { x: 520, y: 352 };
const BARS = [44, 66, 92, 124, 164];

type Face = { x: number; y: number; w: number; d: number; h: number };
// A solid box standing on the floor: four walls and a roof (world: x right, y toward the viewer, z up)
const Box: React.FC<Face & { top: string; front: string; side: string; back?: string; frontContent?: React.ReactNode; boxRef?: React.Ref<HTMLDivElement> }> = ({ x, y, w, d, h, top, front, side, back, frontContent, boxRef }) => (
  <div ref={boxRef} className="absolute left-0 top-0 [transform-style:preserve-3d]" style={{ transformOrigin: `${x + w / 2}px ${y + d / 2}px` }}>
    <div className={`absolute left-0 top-0 ${back ?? side}`} style={{ width: w, height: h, transformOrigin: '0 0', transform: `translate3d(${x}px, ${y}px, ${h}px) rotateX(-90deg)` }} />
    <div className={`absolute left-0 top-0 ${side}`} style={{ width: d, height: h, transformOrigin: '0 0', transform: `translate3d(${x}px, ${y}px, ${h}px) rotateZ(90deg) rotateX(-90deg)` }} />
    <div className={`absolute left-0 top-0 ${side}`} style={{ width: d, height: h, transformOrigin: '0 0', transform: `translate3d(${x + w}px, ${y}px, ${h}px) rotateZ(90deg) rotateX(-90deg)` }} />
    <div className={`absolute left-0 top-0 overflow-hidden ${front}`} style={{ width: w, height: h, transformOrigin: '0 0', transform: `translate3d(${x}px, ${y + d}px, ${h}px) rotateX(-90deg)` }}>{frontContent}</div>
    <div className={`absolute left-0 top-0 ${top}`} style={{ width: w, height: d, transform: `translate3d(${x}px, ${y}px, ${h}px)` }} />
  </div>
);

const Person: React.FC<{ tone: string }> = ({ tone }) => (
  <div className="flex h-full w-full flex-col items-center justify-end">
    <span className={`size-[11px] rounded-full ${tone}`} />
    <span className={`mt-[2px] h-[26px] w-[20px] rounded-t-[10px] rounded-b-[4px] ${tone}`} />
  </div>
);

const BusinessFilm: React.FC = () => {
  const section = useRef<HTMLElement>(null);
  const world = useRef<HTMLDivElement>(null);
  const sky = useRef<HTMLDivElement>(null);
  const night = useRef<HTMLDivElement>(null);
  const boards = useRef<{ el: HTMLDivElement; z: number }[]>([]);   // things that stand up and turn to face the camera
  const queue = useRef<(HTMLDivElement | null)[]>([]);
  const missed = useRef<(HTMLDivElement | null)[]>([]);
  const pile = useRef<HTMLDivElement>(null);
  const closed = useRef<HTMLDivElement>(null);
  const open = useRef<HTMLDivElement>(null);
  const web = useRef<HTMLDivElement>(null);
  const phone = useRef<HTMLDivElement>(null);
  const pins = useRef<(HTMLDivElement | null)[]>([]);
  const arcs = useRef<SVGGElement>(null);
  const orders = useRef<HTMLDivElement>(null);
  const bars = useRef<(HTMLDivElement | null)[]>([]);
  const trend = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState(0);
  const sceneRef = useRef(0);
  const [still] = useState(prefersReducedMotion);

  const board = (z = 0) => (el: HTMLDivElement | null) => { if (el && !boards.current.some((b) => b.el === el)) boards.current.push({ el, z }); };

  const draw = useCallback((p: number) => {
    const [rx, rz, s, tx, ty] = camera(p);
    if (world.current) world.current.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(${s.toFixed(3)}) rotateX(${rx.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg)`;
    boards.current.forEach(({ el, z }) => { el.style.transform = `translateZ(${z}px) rotateZ(${(-rz).toFixed(2)}deg) rotateX(-90deg)`; });

    // 1–2: night falls, the shop closes, calls are missed, paper piles up, the queue walks away
    const dusk = ease(range(p, 0.17, 0.27)) * (1 - ease(range(p, 0.38, 0.48)));
    if (night.current) night.current.style.opacity = String(dusk);
    if (sky.current) sky.current.style.opacity = String(dusk);
    if (closed.current) closed.current.style.opacity = String(dusk);
    if (open.current) open.current.style.opacity = String(ease(range(p, 0.46, 0.54)));
    const leave = ease(range(p, 0.21, 0.35));
    queue.current.forEach((el, i) => { if (el) { el.style.opacity = String(1 - range(leave, 0.4 + i * 0.1, 1)); el.parentElement!.parentElement!.style.transform = `translate3d(${(leave * (240 + i * 40)).toFixed(1)}px, ${(leave * 60).toFixed(1)}px, 0)`; } });
    missed.current.forEach((el, i) => { if (el) { const m = ease(range(p, 0.2 + i * 0.03, 0.26 + i * 0.03)) * (1 - ease(range(p, 0.38, 0.44))); el.style.opacity = String(m); el.style.scale = String(0.6 + 0.4 * m); } });
    if (pile.current) { const g = ease(range(p, 0.22, 0.34)) * (1 - ease(range(p, 0.42, 0.5))); pile.current.style.opacity = String(Math.min(1, g * 1.5)); pile.current.style.transform = `scale3d(1, 1, ${Math.max(0.01, g).toFixed(3)})`; }

    // 3: the website and the app rise
    const wUp = ease(range(p, 0.38, 0.5)), pUp = ease(range(p, 0.44, 0.56));
    if (web.current) { web.current.style.transform = `scale3d(1, 1, ${Math.max(0.001, wUp).toFixed(3)})`; web.current.style.opacity = String(Math.min(1, wUp * 3)); }
    if (phone.current) { phone.current.style.transform = `scale3d(1, 1, ${Math.max(0.001, pUp).toFixed(3)})`; phone.current.style.opacity = String(Math.min(1, pUp * 3)); }

    // 4: customers everywhere connect, and orders flow in
    pins.current.forEach((el, i) => { if (el) { const a = ease(range(p, 0.58 + i * 0.02, 0.63 + i * 0.02)); el.style.opacity = String(a); el.style.scale = String(0.4 + 0.6 * a); } });
    const l = ease(range(p, 0.6, 0.72));
    if (arcs.current) {
      arcs.current.style.opacity = String(Math.min(1, l * 1.5));
      arcs.current.querySelectorAll<SVGPathElement>('.wire').forEach((w) => { w.style.strokeDashoffset = String(700 * (1 - l)); });
      arcs.current.classList.toggle('is-live', l > 0.95);
    }
    if (orders.current) orders.current.classList.toggle('is-live', p > 0.68);

    // 5: sales climb
    bars.current.forEach((el, i) => { if (el) { const b = ease(range(p, 0.8 + i * 0.025, 0.9 + i * 0.025)); el.style.transform = `scale3d(1, 1, ${Math.max(0.001, b).toFixed(3)})`; el.style.opacity = String(Math.min(1, b * 4)); } });
    if (trend.current) trend.current.style.opacity = String(ease(range(p, 0.9, 0.97)));

    if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    let sc = 0; CUTS.forEach((c, i) => { if (p >= c) sc = i; });
    if (sc !== sceneRef.current) { sceneRef.current = sc; setScene(sc); }
  }, []);

  // scroll sets the target; the film glides toward it, so it never jumps
  const target = useRef(0), shown = useRef(-1), raf = useRef(0);
  const glide = useCallback(() => {
    raf.current = 0;
    const d = target.current - shown.current;
    shown.current = Math.abs(d) < 0.0005 ? target.current : shown.current + d * 0.14;
    draw(shown.current);
    if (shown.current !== target.current) raf.current = requestAnimationFrame(glide);
  }, [draw]);
  const onProgress = useCallback((p: number) => {
    target.current = p;
    if (shown.current < 0) { shown.current = p; draw(p); return; }
    if (!raf.current) raf.current = requestAnimationFrame(glide);
  }, [draw, glide]);
  useScrollProgress(section, still ? () => {} : onProgress);
  useEffect(() => { if (still) draw(1); return () => cancelAnimationFrame(raf.current); }, [still, draw]);

  const fit = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = fit.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([e]) => { const w = e.contentRect.width, h = e.contentRect.height; setScale(Math.min(1.3, w / W, h > 0 ? h / H : 9)); });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const wall = 'bg-[#F4EEE6] dark:bg-[#2B2F3A]';
  const stage = (
    <div ref={fit} className="relative flex h-full w-full items-center justify-center [perspective:1500px]" aria-hidden>
      {/* the sky behind the scene darkens at night */}
      <div ref={sky} className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(ellipse_at_50%_30%,rgba(30,41,99,0.28),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_50%_30%,rgba(2,6,23,0.9),transparent_70%)]" style={{ opacity: 0 }} />
      <div className="relative shrink-0 [transform-style:preserve-3d]" style={{ width: W, height: H, transform: `scale(${scale})` }}>
        <div ref={world} className="absolute inset-0 [transform-style:preserve-3d] will-change-transform" style={{ transform: 'rotateX(55deg) rotateZ(-32deg) scale(.86)' }}>
          {/* the ground */}
          <div className="absolute inset-0 rounded-[40px] border border-slate-200 bg-[linear-gradient(rgba(148,163,184,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.16)_1px,transparent_1px)] bg-white [background-size:32px_32px] shadow-[0_60px_90px_-50px_rgba(15,23,42,0.45)] dark:border-white/[0.07] dark:bg-[#0B1120] dark:shadow-[0_60px_90px_-50px_rgba(0,0,0,0.95)]" />
          {/* a road past the shop */}
          <div className="absolute left-[20px] right-[20px] top-[396px] h-[46px] bg-slate-200/80 dark:bg-white/[0.05]"><div className="absolute inset-x-6 top-1/2 h-[3px] -translate-y-1/2 bg-[repeating-linear-gradient(90deg,white_0_22px,transparent_22px_40px)] opacity-80 dark:opacity-25" /></div>
          {/* night over the ground */}
          <div ref={night} className="absolute inset-0 rounded-[40px] bg-[#1e2a5a]/30 dark:bg-black/45" style={{ opacity: 0 }} />

          {/* connections from customers everywhere to the shop's app */}
          <svg className="absolute inset-0 overflow-visible" width={W} height={H}>
            <g ref={arcs} style={{ opacity: 0 }} className="[&.is-live_.flow-line]:opacity-100">
              {PINS.map(([x, y], i) => { const mx = (x + PHONE.x) / 2 + (i % 2 ? 60 : -60), my = (y + PHONE.y) / 2 + (i % 3 ? -40 : 40); const dPath = `M${x} ${y} Q${mx} ${my} ${PHONE.x} ${PHONE.y}`; return (
                <g key={i}><path d={dPath} className="wire stroke-blue-500/45 dark:stroke-blue-400/45" strokeWidth="2" fill="none" strokeDasharray="700" strokeDashoffset="700" /><path d={dPath} className="flow-line stroke-blue-500 opacity-0 transition-opacity duration-500 dark:stroke-blue-300" strokeWidth="3" strokeLinecap="round" fill="none" /></g>
              ); })}
            </g>
          </svg>

          {/* the shop */}
          <Box {...SHOP} top="bg-[#C2410C] dark:bg-[#7C2D12]" side={wall} front={wall} frontContent={
            <div className="relative h-full w-full">
              <div className="h-[26px] w-full bg-[repeating-linear-gradient(90deg,#DC2626_0_16px,#FFFFFF_16px_32px)] dark:bg-[repeating-linear-gradient(90deg,#991B1B_0_16px,#E2E8F0_16px_32px)]" />
              <div className="mx-auto mt-[6px] w-fit rounded-[3px] bg-slate-900 px-2 py-[2px] text-[10px] font-black tracking-[0.2em] text-amber-300">SHOP</div>
              <div className="absolute bottom-0 left-[12px] h-[70px] w-[86px] rounded-t-[4px] border-[3px] border-slate-500/60 bg-sky-100/90 dark:bg-sky-950/80">
                {/* the paper ledger on the counter */}
                <div className="absolute bottom-[8px] left-[8px] h-[20px] w-[30px] rotate-[-6deg] rounded-[2px] bg-white shadow-sm dark:bg-slate-200"><div className="m-[4px] space-y-[3px]"><i className="block h-[2px] w-[18px] bg-slate-400" /><i className="block h-[2px] w-[14px] bg-slate-400" /><i className="block h-[2px] w-[20px] bg-slate-400" /></div></div>
                <div className="absolute bottom-[8px] right-[10px] h-[14px] w-[20px] rounded-[2px] bg-amber-700" />
                <div className="absolute bottom-0 inset-x-0 h-[6px] bg-amber-900/70" />
              </div>
              <div className="absolute bottom-0 right-[16px] h-[84px] w-[46px] rounded-t-[6px] bg-amber-800 dark:bg-amber-950"><span className="absolute right-[6px] top-[42px] size-[4px] rounded-full bg-amber-300" /></div>
              <div ref={closed} className="absolute right-[10px] top-[38px] rounded-[3px] bg-red-600 px-1.5 py-[2px] text-[9px] font-black tracking-wider text-white" style={{ opacity: 0 }}>CLOSED</div>
              <div ref={open} className="absolute right-[6px] top-[38px] flex items-center gap-1 rounded-[3px] bg-emerald-500 px-1.5 py-[2px] text-[8.5px] font-black tracking-wide text-white" style={{ opacity: 0 }}>OPEN ONLINE · 24/7</div>
            </div>
          } />

          {/* the queue of customers who must come in person */}
          {QUEUE.map(([x, y], i) => (
            <div key={i} className="absolute left-0 top-0 [transform-style:preserve-3d]">
              <div ref={board(0)} className="absolute" style={{ left: x - 14, top: y - 44, width: 28, height: 44, transformOrigin: '50% 100%' }}>
                <div ref={(el) => { queue.current[i] = el; }} className="h-full w-full"><Person tone={['bg-indigo-500', 'bg-amber-500', 'bg-emerald-600'][i]} /></div>
              </div>
            </div>
          ))}

          {/* the paperwork that piles up */}
          <div ref={pile} className="absolute left-0 top-0 [transform-style:preserve-3d]" style={{ transformOrigin: '320px 250px 0', opacity: 0 }}>
            {Array.from({ length: 9 }, (_, i) => <div key={i} className="absolute rounded-[2px] border border-slate-300 bg-white shadow-sm dark:border-slate-500 dark:bg-slate-200" style={{ left: 296 + ((i * 7) % 9), top: 232 + ((i * 5) % 7), width: 44, height: 34, transform: `translateZ(${i * 6}px) rotate(${(i * 23) % 30 - 15}deg)` }} />)}
          </div>

          {/* calls missed while the shop is closed */}
          {MISSED.map(([x, y, z], i) => (
            <div key={i} ref={board(z)} className="absolute" style={{ left: x - 50, top: y - 28, width: 100, height: 28, transformOrigin: '50% 100%' }}>
              <div ref={(el) => { missed.current[i] = el; }} className="flex h-full items-center justify-center gap-1 rounded-full bg-red-600 px-2 text-[10px] font-bold text-white shadow-lg" style={{ opacity: 0 }}><PhoneMissed size={12} /> Missed call</div>
            </div>
          ))}

          {/* the website: a big screen rising beside the shop */}
          <div className="absolute left-0 top-0 [transform-style:preserve-3d]">
            <div ref={web} className="absolute left-0 top-0 [transform-style:preserve-3d]" style={{ transformOrigin: '420px 150px 0', opacity: 0 }}>
              <div className="absolute left-0 top-0 rounded-[10px] bg-slate-800 dark:bg-slate-700" style={{ width: 216, height: 150, transformOrigin: '0 0', transform: 'translate3d(316px, 150px, 160px) rotateX(-90deg) translateZ(-6px)' }} />
              <div className="absolute left-0 top-0 overflow-hidden rounded-[10px] border-[5px] border-slate-900 bg-white dark:border-slate-950 dark:bg-slate-900" style={{ width: 216, height: 150, transformOrigin: '0 0', transform: 'translate3d(316px, 150px, 160px) rotateX(-90deg)' }}>
                <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 dark:bg-slate-800"><i className="size-1.5 rounded-full bg-red-400" /><i className="size-1.5 rounded-full bg-amber-400" /><i className="size-1.5 rounded-full bg-emerald-400" /><span className="ml-1 flex flex-1 items-center gap-1 rounded-full bg-white px-1.5 text-[7px] text-slate-500 dark:bg-slate-700 dark:text-slate-300"><Globe2 size={7} /> yourshop.com</span></div>
                <div className="flex items-center justify-between px-2.5 pt-2"><b className="text-[10px] text-slate-900 dark:text-white">Your Shop</b><span className="rounded-full bg-blue-600 px-2 py-[2px] text-[7px] font-bold text-white">Order now</span></div>
                <div className="grid grid-cols-3 gap-1.5 px-2.5 pt-2">{['bg-amber-200', 'bg-sky-200', 'bg-emerald-200'].map((c, i) => <div key={i} className="rounded-[5px] border border-slate-100 p-1 dark:border-white/10"><div className={`h-[34px] rounded-[3px] ${c} dark:opacity-80`} /><i className="mt-1 block h-[3px] w-3/4 rounded bg-slate-300 dark:bg-slate-600" /><span className="mt-1 block rounded-[3px] bg-slate-900 py-[1px] text-center text-[6px] font-bold text-white dark:bg-white dark:text-slate-900">Add</span></div>)}</div>
              </div>
              {/* its stand */}
              <div className="absolute left-0 top-0 bg-slate-400 dark:bg-slate-600" style={{ width: 10, height: 10, transform: 'translate3d(419px, 145px, 0)' }} />
            </div>
          </div>

          {/* the app on a phone, where the orders arrive */}
          <div className="absolute left-0 top-0 [transform-style:preserve-3d]">
            <div ref={phone} className="absolute left-0 top-0 [transform-style:preserve-3d]" style={{ transformOrigin: `${PHONE.x}px ${PHONE.y}px 0`, opacity: 0 }}>
              <div ref={board(0)} className="absolute" style={{ left: PHONE.x - 40, top: PHONE.y - 150, width: 80, height: 150, transformOrigin: '50% 100%' }}>
                <div className="flex h-full w-full flex-col overflow-hidden rounded-[16px] border-[4px] border-slate-900 bg-white shadow-xl dark:bg-slate-900">
                  <div className="mx-auto mt-1 h-[4px] w-[22px] rounded-full bg-slate-900" />
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-600 px-2 py-2 text-[8px] font-bold text-white">Your Shop app</div>
                  <div className="flex-1 space-y-1 p-1.5">{['bg-amber-200', 'bg-sky-200', 'bg-emerald-200'].map((c) => <div key={c} className="flex items-center gap-1 rounded-[4px] bg-slate-50 p-1 dark:bg-white/5"><span className={`size-[12px] rounded-[3px] ${c}`} /><i className="h-[3px] flex-1 rounded bg-slate-300 dark:bg-slate-600" /></div>)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* customers everywhere */}
          {PINS.map(([x, y], i) => (
            <div key={i} ref={board(0)} className="absolute" style={{ left: x - 16, top: y - 46, width: 32, height: 46, transformOrigin: '50% 100%' }}>
              <div ref={(el) => { pins.current[i] = el; }} className="flex h-full flex-col items-center justify-end" style={{ opacity: 0 }}>
                <span className="grid size-[22px] place-items-center rounded-full bg-blue-600 text-white shadow-md"><MapPin size={12} /></span>
                <span className="mt-0.5 h-[14px] w-[2px] bg-blue-600/60" />
              </div>
            </div>
          ))}

          {/* orders, payments and reminders arriving by themselves (they keep coming once the shop is online) */}
          <div ref={board(150)} className="absolute" style={{ left: PHONE.x - 70, top: PHONE.y - 120, width: 140, height: 120, transformOrigin: '50% 100%' }}>
            <div ref={orders} className="film-orders relative h-full w-full">
              {[{ t: 'New order', I: ShoppingBag, c: 'bg-blue-600' }, { t: 'Payment received', I: CreditCard, c: 'bg-emerald-600' }, { t: 'Delivery booked', I: Truck, c: 'bg-violet-600' }, { t: 'Reminder sent', I: Bell, c: 'bg-amber-500' }].map(({ t, I, c }, i) => (
                <div key={t} className="film-order absolute inset-x-0 bottom-0 flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-[10px] font-bold text-slate-800 shadow-lg dark:border-white/10 dark:bg-slate-800 dark:text-white" style={{ animationDelay: `${i * 0.9}s`, ['--i' as any]: i }}><span className={`grid size-5 place-items-center rounded-md text-white ${c}`}><I size={11} /></span>{t}<Check size={11} className="ml-auto text-emerald-500" strokeWidth={3} /></div>
              ))}
            </div>
          </div>

          {/* sales climbing */}
          {BARS.map((h, i) => (
            <div key={i} className="absolute left-0 top-0 [transform-style:preserve-3d]">
              <Box boxRef={(el) => { bars.current[i] = el; }} x={96 + i * 40} y={462} w={26} d={26} h={h} top="bg-emerald-300 dark:bg-emerald-400" front="bg-emerald-500 dark:bg-emerald-600" side="bg-emerald-600 dark:bg-emerald-700" />
            </div>
          ))}
          <div ref={board(196)} className="absolute" style={{ left: 141, top: 470, width: 96, height: 30, transformOrigin: '50% 100%' }}>
            <div ref={trend} className="flex h-full items-center justify-center gap-1 rounded-full bg-emerald-600 text-[10px] font-bold text-white shadow-lg" style={{ opacity: 0 }}>Sales ↑</div>
          </div>
        </div>
      </div>
    </div>
  );

  if (still) {
    return (
      <section aria-labelledby="film-title" className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:items-center">
        <div><FilmHead /><ol className="mt-8 space-y-6">{SCENES.map((s) => <li key={s.title}><p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300">{s.eyebrow}</p><h3 className="mt-1 text-xl font-bold text-slate-950 dark:text-white">{s.title}</h3><p className="mt-1 text-slate-600 dark:text-slate-300">{s.body}</p></li>)}</ol><FilmCta /></div>
        <div className="h-[380px] sm:h-[480px]">{stage}</div>
      </section>
    );
  }

  return (
    <section ref={section} aria-labelledby="film-title" className="relative h-[620vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pt-20 lg:pt-0">
        <div className="mx-auto grid h-full w-full max-w-7xl flex-1 grid-cols-[minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)] gap-2 px-5 pb-4 sm:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:grid-rows-1 lg:items-center lg:gap-10 lg:pb-0">
          <div className="min-w-0">
            <FilmHead />
            <div className="relative mt-4 min-h-[14.5rem] sm:mt-7 sm:min-h-[15.5rem]">
              {SCENES.map((s, i) => (
                <div key={s.title} aria-hidden={i !== scene} className="absolute inset-0 transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]" style={{ opacity: i === scene ? 1 : 0, transform: `translate3d(0, ${i === scene ? 0 : i < scene ? -16 : 16}px, 0)`, filter: i === scene ? 'none' : 'blur(4px)' }}>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300">{s.eyebrow}</p>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">{s.title}</h3>
                  <p className="mt-2 max-w-md text-[15px] leading-7 text-slate-600 dark:text-slate-300 sm:text-lg sm:leading-8">{s.body}</p>
                  {i === SCENES.length - 1 && <FilmCta />}
                </div>
              ))}
            </div>
            <div className="mt-1 flex items-center gap-3">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div ref={bar} className="h-full origin-left rounded-full bg-blue-600 dark:bg-blue-400" style={{ transform: 'scaleX(0)' }} /></div>
              <span className="text-xs font-semibold tabular-nums text-slate-500 dark:text-slate-400">{scene + 1} / {SCENES.length}</span>
            </div>
            <p className="mt-2 hidden text-[11px] text-slate-400 dark:text-slate-500 lg:block">An illustration of a typical business, not real figures.</p>
          </div>
          <div className="relative h-full min-h-0 lg:h-[min(82vh,720px)]">{stage}</div>
        </div>
      </div>
    </section>
  );
};

function FilmHead() {
  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300 sm:text-sm">From offline to online</p>
      <h2 id="film-title" className="mt-3 text-3xl font-bold leading-[1.08] tracking-tight text-slate-950 dark:text-white sm:text-5xl">See what changes when a business goes online.</h2>
    </>
  );
}

function FilmCta() {
  return <Link to="/contact" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 active:scale-[.97]">Take your business online <ArrowRight size={16} /></Link>;
}

export default BusinessFilm;
