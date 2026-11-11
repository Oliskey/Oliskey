import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BarChart3, Bell, CalendarDays, Check, FolderOpen, MessageSquare, Receipt, Table2, Wallet, Zap } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { prefersReducedMotion, useScrollProgress } from '../motion/Reveal';

// "From busywork to better workflows", told by scrolling. The section is tall; its stage stays on screen while you scroll:
//   1. scattered paper work drifts loose   2. it lines up and becomes digital records inside a system
//   3. the records connect and data flows  4. routine work runs by itself, and the products appear.
// Everything moves with transform/opacity only, written straight to the elements once per frame (no re-render per frame).
// Reduce Motion: no pinning; the finished system and all four steps are shown as they are.

const W = 560, H = 460;                       // the stage's own coordinates; it is scaled to fit the screen
const CARD_W = 96, CARD_H = 74;
const COLS = [116, 222, 328, 434], ROWS = [62, 148];

type Item = { paper: React.ReactNode; icon: React.ElementType; title: string; sub: string; from: [number, number, number] };
const lines = (n: number, w = [70, 52, 62, 40]) => Array.from({ length: n }, (_, i) => <span key={i} className="block h-[3px] rounded-full bg-slate-300/90 dark:bg-white/20" style={{ width: `${w[i % w.length]}%` }} />);
const ITEMS: Item[] = [
  { icon: Receipt, title: 'Invoices', sub: 'Sent and tracked', from: [28, 40, -12], paper: <><b className="text-[9px] tracking-widest text-slate-500 dark:text-slate-400">INVOICE</b>{lines(3)}</> },
  { icon: Wallet, title: 'Payments', sub: 'Collected', from: [400, 22, 9], paper: <><b className="text-[9px] text-slate-500 dark:text-slate-400">Cash · ₦</b>{lines(2, [45, 60])}<span className="mt-1 block text-right text-[10px] font-bold text-slate-500 dark:text-slate-400">TOTAL ?</span></> },
  { icon: Table2, title: 'Records', sub: 'In one place', from: [190, 110, 5], paper: <div className="grid grid-cols-3 gap-[3px]">{Array.from({ length: 9 }, (_, i) => <span key={i} className="h-[7px] rounded-[2px] bg-slate-200 dark:bg-white/15" />)}</div> },
  { icon: Bell, title: 'Reminders', sub: 'Automatic', from: [440, 170, -7], paper: <span className="font-['Comic_Sans_MS',cursive] text-[11px] leading-tight text-amber-900 dark:text-amber-100">Call parents about fees!!</span> },
  { icon: MessageSquare, title: 'Messages', sub: 'Answered', from: [40, 210, 8], paper: <span className="block rounded-xl rounded-bl-sm bg-emerald-100 px-2 py-1.5 text-[10px] text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-100">Has the driver paid today?</span> },
  { icon: CalendarDays, title: 'Schedule', sub: 'Planned', from: [250, 300, -10], paper: <><b className="text-[9px] tracking-widest text-red-500">MONDAY</b>{lines(2, [80, 50])}</> },
  { icon: FolderOpen, title: 'Documents', sub: 'Organised', from: [430, 330, 12], paper: <><b className="text-[9px] text-slate-500 dark:text-slate-400">File 2023 (old)</b>{lines(3, [60, 72, 35])}</> },
  { icon: BarChart3, title: 'Reports', sub: 'Ready on time', from: [110, 360, -5], paper: <span className="font-['Comic_Sans_MS',cursive] text-[11px] text-slate-600 dark:text-slate-300">12 + 45 + 8 = ??</span> },
];
const PAPER_TONE = ['bg-white dark:bg-slate-800', 'bg-[#FFFDF5] dark:bg-[#26282f]', 'bg-white dark:bg-slate-800', 'bg-amber-100 dark:bg-amber-900/70', 'bg-white dark:bg-slate-800', 'bg-white dark:bg-slate-800', 'bg-[#F6F1E4] dark:bg-[#2a2823]', 'bg-[#FFFDF5] dark:bg-[#26282f]'];
const HUB: [number, number] = [328, 300];
const AUTOMATIONS = ['Reminders go out by themselves', 'Records update in one place', 'Reports are ready when you need them'];

const STEPS = [
  { eyebrow: 'Today', title: 'Scattered work', body: 'Every business has work that is harder than it needs to be: repeated data entry, scattered records, missed follow-ups and processes that depend on memory.' },
  { eyebrow: '01', title: 'Understand the work', body: 'Find the tasks, handoffs and bottlenecks that slow you down.' },
  { eyebrow: '02', title: 'Build a better system', body: 'Connect software, automation and AI to the actual need.' },
  { eyebrow: '03', title: 'Give people time back', body: 'Make routine work clearer, more consistent and easier to manage.' },
];

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const range = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);   // decelerates into place, like the glide curve
const slot = (i: number): [number, number] => [COLS[i % 4], ROWS[Math.floor(i / 4)]];

const DigitalStory: React.FC = () => {
  const section = useRef<HTMLElement>(null);
  const items = useRef<(HTMLDivElement | null)[]>([]);
  const floats = useRef<(HTMLDivElement | null)[]>([]);   // the idle float lives on an inner layer: an animation on the moving element would override its position
  const papers = useRef<(HTMLDivElement | null)[]>([]);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const frame = useRef<HTMLDivElement>(null);
  const wires = useRef<SVGGElement>(null);
  const hub = useRef<HTMLDivElement>(null);
  const autos = useRef<(HTMLDivElement | null)[]>([]);
  const prods = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const desk = useRef<HTMLDivElement>(null);   // the 3D plane everything sits on
  const table = useRef<HTMLDivElement>(null);  // the visible desk surface under the papers
  const [step, setStep] = useState(0);
  const [still] = useState(prefersReducedMotion);
  const stepRef = useRef(0);

  const draw = useCallback((p: number) => {
    const settle = range(p, 0.1, 0.4);
    items.current.forEach((el, i) => {
      if (!el) return;
      const t = ease(range(settle, i * 0.05, i * 0.05 + 0.6));
      const [fx, fy, fr] = ITEMS[i].from, [tx, ty] = slot(i);
      const lift = Math.sin(Math.PI * t) * 46;   // each paper rises off the desk on its way to its place
      el.style.transform = `translate3d(${fx + (tx - fx) * t}px, ${fy + (ty - fy) * t}px, ${lift.toFixed(1)}px) rotate(${fr * (1 - t)}deg)`;
      floats.current[i]?.classList.toggle('float-idle', t < 0.02 && !still);
      const morph = range(t, 0.45, 0.9);
      if (papers.current[i]) papers.current[i]!.style.opacity = String(1 - morph);
      if (cards.current[i]) cards.current[i]!.style.opacity = String(morph);
    });
    // the desk: at first the papers lie on a table seen at an angle; as they are organised, the system stands up to face you
    const up = ease(range(p, 0.08, 0.5));
    if (desk.current) desk.current.style.transform = `rotateX(${(38 * (1 - up)).toFixed(2)}deg) rotateZ(${(-9 * (1 - up)).toFixed(2)}deg) translate3d(0, ${(24 * (1 - up)).toFixed(1)}px, 0)`;
    if (table.current) table.current.style.opacity = String(1 - ease(range(p, 0.2, 0.42)));
    const f = ease(range(p, 0.3, 0.46));
    if (frame.current) { frame.current.style.opacity = String(f); frame.current.style.transform = `scale(${0.96 + 0.04 * f})`; }
    const l = ease(range(p, 0.46, 0.62));
    if (wires.current) {
      wires.current.style.opacity = String(Math.min(1, l * 1.4));
      wires.current.querySelectorAll<SVGPathElement>('.wire').forEach((w) => { w.style.strokeDashoffset = String(260 * (1 - l)); });
      wires.current.classList.toggle('is-live', l > 0.95);
    }
    if (hub.current) { const h = ease(range(p, 0.52, 0.62)); hub.current.style.opacity = String(h); hub.current.style.transform = `translate(-50%, -50%) scale(${0.8 + 0.2 * h})`; }
    autos.current.forEach((el, i) => {
      if (!el) return;
      const a = ease(range(p, 0.64 + i * 0.05, 0.7 + i * 0.05));
      el.style.opacity = String(a);
      el.style.transform = `translate3d(${(1 - a) * 14}px, 0, 0)`;
    });
    if (prods.current) { const q = ease(range(p, 0.82, 0.94)); prods.current.style.opacity = String(q); prods.current.style.transform = `translate3d(0, ${(1 - q) * 14}px, 0)`; }
    if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    const s = p < 0.16 ? 0 : p < 0.44 ? 1 : p < 0.64 ? 2 : 3;
    if (s !== stepRef.current) { stepRef.current = s; setStep(s); }
  }, [still]);

  useScrollProgress(section, still ? () => {} : draw);
  useEffect(() => { if (still) draw(1); }, [still, draw]);

  // the stage keeps its own 560×460 drawing and is scaled to the space it has
  const fit = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = fit.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([e]) => { const w = e.contentRect.width, h = e.contentRect.height; setScale(Math.min(1.25, w / W, h > 0 ? h / H : 9)); });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const stage = (
    <div ref={fit} className="relative flex h-full w-full items-center justify-center [perspective:1600px]">
      <div className="relative shrink-0 [transform-style:preserve-3d]" style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: 'center' }} aria-hidden>
      <div ref={desk} className="absolute inset-0 [transform-style:preserve-3d] will-change-transform" style={{ transform: still ? 'none' : 'rotateX(38deg) rotateZ(-9deg) translate3d(0,24px,0)' }}>
        {/* the desk the paperwork is spread across; it fades as the work moves into the system */}
        <div ref={table} className="absolute -inset-6 rounded-[36px] border border-slate-200/80 bg-[linear-gradient(rgba(148,163,184,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.14)_1px,transparent_1px)] bg-slate-50/80 [background-size:28px_28px] shadow-[0_50px_80px_-40px_rgba(15,23,42,0.35)] dark:border-white/[0.06] dark:bg-white/[0.02] dark:shadow-[0_50px_80px_-40px_rgba(0,0,0,0.9)]" style={{ opacity: still ? 0 : 1 }} />
        {/* the system forming around the work */}
        <div ref={frame} className="absolute inset-0 rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-[#0B1120] dark:shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]" style={{ opacity: 0 }}>
          <div className="flex h-10 items-center gap-1.5 border-b border-slate-100 px-4 dark:border-white/5"><i className="size-2.5 rounded-full bg-slate-200 dark:bg-white/15" /><i className="size-2.5 rounded-full bg-slate-200 dark:bg-white/15" /><i className="size-2.5 rounded-full bg-slate-200 dark:bg-white/15" /><span className="ml-3 h-2 w-28 rounded-full bg-slate-100 dark:bg-white/10" /></div>
          <div className="absolute bottom-4 left-4 top-14 w-[76px] rounded-2xl bg-slate-50 p-3 dark:bg-white/[0.04]">{[0, 1, 2, 3, 4].map((i) => <span key={i} className={`mb-3 block h-2 rounded-full ${i === 0 ? 'w-full bg-blue-500/70' : 'w-3/4 bg-slate-200 dark:bg-white/10'}`} />)}</div>
        </div>
        {/* connections from every record to one system, with data flowing once they are live */}
        <svg className="pointer-events-none absolute inset-0" width={W} height={H}>
          <g ref={wires} style={{ opacity: 0 }} className="[&.is-live_.flow-line]:opacity-100">
            {ITEMS.map((_, i) => { const [x, y] = slot(i); const sx = x + CARD_W / 2, sy = y + CARD_H; const d = `M${sx} ${sy} C${sx} ${sy + 60}, ${HUB[0]} ${HUB[1] - 70}, ${HUB[0]} ${HUB[1]}`; return (
              <g key={i}><path d={d} className="wire stroke-blue-500/35 dark:stroke-blue-400/35" strokeWidth="1.5" fill="none" strokeDasharray="260" strokeDashoffset="260" /><path d={d} className="flow-line stroke-blue-500 opacity-0 transition-opacity duration-500 dark:stroke-blue-300" strokeWidth="2.2" strokeLinecap="round" fill="none" /></g>
            ); })}
          </g>
        </svg>
        <div ref={hub} className="absolute grid size-16 place-items-center rounded-2xl bg-blue-600 text-white shadow-[0_12px_40px_-8px_rgba(37,99,235,0.7)]" style={{ left: HUB[0], top: HUB[1], opacity: 0, transform: 'translate(-50%, -50%) scale(.8)' }}><Zap size={28} /></div>
        {/* what now runs by itself */}
        <div className="absolute bottom-5 left-[116px] right-5 grid grid-cols-3 gap-2">
          {AUTOMATIONS.map((a, i) => <div key={a} ref={(el) => { autos.current[i] = el; }} className="flex items-start gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 p-2 text-[10px] font-semibold leading-tight text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200" style={{ opacity: 0 }}><Check size={12} className="mt-px shrink-0" strokeWidth={3} />{a}</div>)}
        </div>
        {/* the products that do it */}
        <div ref={prods} className="absolute left-4 top-[150px] flex w-[76px] flex-col gap-2" style={{ opacity: 0 }}>
          {PRODUCTS.map(({ id, icon: Icon, tint }) => <span key={id} className={`grid h-10 place-items-center rounded-xl bg-gradient-to-br ${tint} text-white shadow-sm`}><Icon size={18} /></span>)}
        </div>
        {/* the work itself: paper first, then a digital record */}
        {ITEMS.map((it, i) => { const Icon = it.icon; return (
          <div key={it.title} ref={(el) => { items.current[i] = el; }} className="absolute left-0 top-0 will-change-transform" style={{ width: CARD_W, height: CARD_H, transform: `translate3d(${it.from[0]}px, ${it.from[1]}px, 0) rotate(${it.from[2]}deg)` }}>
            <div ref={(el) => { floats.current[i] = el; }} className="absolute inset-0" style={{ animationDelay: `${i * -0.7}s` }}>
            <div ref={(el) => { papers.current[i] = el; }} className={`absolute inset-0 flex flex-col gap-1.5 rounded-md border border-slate-200/90 p-2.5 shadow-[0_6px_18px_-6px_rgba(15,23,42,0.35)] dark:border-white/10 dark:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.8)] ${PAPER_TONE[i]}`}>{it.paper}</div>
            <div ref={(el) => { cards.current[i] = el; }} className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm dark:border-white/10 dark:bg-white/[0.06]" style={{ opacity: 0 }}>
              <span className="grid size-7 place-items-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300"><Icon size={15} /></span>
              <span><b className="block text-[11px] font-semibold leading-tight text-slate-900 dark:text-white">{it.title}</b><span className="block text-[9.5px] leading-tight text-slate-500 dark:text-slate-400">{it.sub}</span></span>
            </div>
            </div>
          </div>
        ); })}
      </div>
      </div>
    </div>
  );

  if (still) {
    return (
      <section aria-labelledby="story-title" className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:items-center">
        <div><StoryHead /><ol className="mt-8 space-y-6">{STEPS.map((s) => <li key={s.title}><p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300">{s.eyebrow}</p><h3 className="mt-1 text-xl font-bold text-slate-950 dark:text-white">{s.title}</h3><p className="mt-1 text-slate-600 dark:text-slate-300">{s.body}</p></li>)}</ol></div>
        <div className="h-[360px] sm:h-[460px]">{stage}</div>
      </section>
    );
  }

  return (
    <section ref={section} aria-labelledby="story-title" className="relative h-[460vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pt-20 lg:pt-0">
        <div className="mx-auto grid h-full w-full max-w-7xl flex-1 grid-cols-[minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)] gap-4 px-5 pb-6 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:grid-rows-1 lg:items-center lg:gap-14 lg:pb-0">
          <div className="min-w-0">
            <StoryHead />
            {/* the four steps, one at a time; all four stay in the page for reading aloud and search */}
            <div className="relative mt-5 min-h-[12.5rem] sm:mt-8 sm:min-h-[13rem]">
              {STEPS.map((s, i) => (
                <div key={s.title} aria-hidden={i !== step} className="absolute inset-0 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]" style={{ opacity: i === step ? 1 : 0, transform: `translate3d(0, ${i === step ? 0 : i < step ? -12 : 12}px, 0)` }}>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300">{s.eyebrow}</p>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">{s.title}</h3>
                  <p className="mt-2 max-w-md text-[15px] leading-7 text-slate-600 dark:text-slate-300 sm:text-lg sm:leading-8">{s.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-3">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div ref={bar} className="h-full origin-left rounded-full bg-blue-600 dark:bg-blue-400" style={{ transform: 'scaleX(0)' }} /></div>
              <span className="text-xs font-semibold tabular-nums text-slate-500 dark:text-slate-400">{step + 1} / 4</span>
            </div>
          </div>
          <div className="relative h-full min-h-0 overflow-hidden lg:h-[min(74vh,660px)] lg:overflow-visible">{stage}</div>
        </div>
      </div>
    </section>
  );
};

function StoryHead() {
  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300 sm:text-sm">The Oliskey approach</p>
      <h2 id="story-title" className="mt-3 text-3xl font-bold leading-[1.1] tracking-tight text-slate-950 dark:text-white sm:text-5xl">From busywork to better workflows.</h2>
    </>
  );
}

export default DigitalStory;
