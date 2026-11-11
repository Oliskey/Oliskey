import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, ExternalLink, MousePointer2 } from 'lucide-react';
// @ts-ignore
import { Link, useLocation } from 'react-router-dom';
import { PRODUCTS, type OliskeyProduct } from '../data/products';
import ThemedShot from '../components/ThemedShot';
import { prefersReducedMotion } from '../components/motion/Reveal';

// Home, rebuilt from scratch (2026-11-11) around two things: the Oliskey logo and the three products.
// The page is a walk through a business in real 3D: scrolling moves the camera from the street, through the doors, past
// paperwork turning into software, into the operations room, the school wing, the fleet garage and the trading floor,
// then up above the logo. Each text block below lines up with one room (data-stop). No sound, no voice-over.
// Reduce Motion or no 3D support: the same text over a still background.
const BusinessWorld = lazy(() => import('../components/world/BusinessWorld'));

const canUse3d = () => {
  if (typeof window === 'undefined' || prefersReducedMotion()) return false;
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
};

const glass = 'rounded-[1.75rem] border border-white/70 bg-white/80 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 dark:shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]';
const eyebrow = 'text-xs font-semibold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300';

const Stop: React.FC<{ side?: 'left' | 'right'; children: React.ReactNode; className?: string }> = ({ side = 'left', children, className = '' }) => (
  <div data-stop className={`flex min-h-[125svh] items-end px-4 pb-[19svh] sm:px-8 md:items-center md:pb-0 ${className}`}>
    <div className={`mx-auto flex w-full max-w-7xl ${side === 'right' ? 'md:justify-end' : ''}`}>{children}</div>
  </div>
);

const ProductStop: React.FC<{ p: OliskeyProduct; room: string; side: 'left' | 'right' }> = ({ p, room, side }) => {
  const Icon = p.icon;
  return (
    <Stop side={side}>
      <article className={`${glass} w-full max-w-[26rem] overflow-hidden`}>
        <div className={`relative aspect-[16/7] overflow-hidden bg-gradient-to-br sm:aspect-[16/9] ${p.tint}`}>
          <ThemedShot shots={p.shots} alt={`${p.name} screen`} className="absolute inset-0 h-full w-full object-cover object-left-top" />
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md"><Icon size={13} /> {room}</span>
        </div>
        <div className="p-4 sm:p-6">
          <p className={`${eyebrow} hidden sm:block`}>{p.eyebrow}</p>
          <h2 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white sm:mt-2 sm:text-3xl">{p.name}</h2>
          <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300 sm:hidden">{p.short}</p>
          <p className="mt-2 hidden text-[15px] leading-6 text-slate-600 dark:text-slate-300 sm:block">{p.description}</p>
          <ul className="mt-4 hidden space-y-1.5 sm:block">{p.points.map((pt) => <li key={pt} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200"><Check size={16} className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" />{pt}</li>)}</ul>
          <div className="mt-4 flex gap-2 sm:mt-5">
            <a href={p.appUrl} target="_blank" rel="noopener" className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-full bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-blue-600 active:scale-[.97] dark:bg-white dark:text-slate-950 dark:hover:bg-blue-100">{p.appLabel} <ExternalLink size={14} /></a>
            <Link to={p.detailsUrl} aria-label={`About ${p.name}`} className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 dark:border-white/15 dark:text-white dark:hover:bg-white/5">Learn more</Link>
          </div>
        </div>
      </article>
    </Stop>
  );
};

const Home: React.FC = () => {
  const location = useLocation();
  const journey = useRef<HTMLElement>(null);
  const [use3d] = useState(canUse3d);

  useEffect(() => {
    if (location.state && (location.state as any).scrollToProducts) {
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <div className="relative w-full overflow-x-clip bg-[#e9eff8] font-sans text-slate-900 dark:bg-[#050a16] dark:text-slate-50">
      <section ref={journey} aria-label="A walk through a business running on Oliskey">
        {/* the 3D world, held on screen while the text scrolls over it */}
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,#ffffff,transparent_60%)] dark:bg-[radial-gradient(ellipse_at_50%_20%,#13203d,transparent_60%)]" />
          {!use3d && <StillLogo />}
          {use3d && <Suspense fallback={null}><BusinessWorld journey={journey} /></Suspense>}
          {/* soft fades top and bottom so the menu and text stay readable */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#e9eff8]/90 to-transparent dark:from-[#050a16]/90" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#e9eff8]/80 to-transparent dark:from-[#050a16]/85" />
        </div>

        <div className="relative -mt-[100svh]">
          {/* 0 · outside the building */}
          <div data-stop className="flex min-h-[100svh] flex-col px-5 pt-24 sm:px-8 sm:pt-32">
            <div className="mx-auto w-full max-w-7xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/70 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-blue-800 backdrop-blur-md dark:border-blue-400/20 dark:bg-slate-900/60 dark:text-blue-300">SOFTWARE · AUTOMATION · AI</span>
              <h1 className="mx-auto mt-5 max-w-4xl text-[2.15rem] font-bold leading-[1.04] tracking-[-0.04em] text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">Make your business run with <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-300 dark:to-violet-300">less manual work.</span></h1>
              <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-6 text-slate-600 dark:text-slate-300 sm:mt-4 sm:text-lg sm:leading-7">Oliskey builds practical software, automated workflows and AI-powered tools. Scroll to walk inside a business that runs on them.</p>
              <div className="mt-5 flex justify-center gap-2 sm:mt-6 sm:gap-2.5">
                <a href="#products" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 active:scale-[.97] sm:min-h-12 sm:px-6">See our products <ArrowRight size={17} /></a>
                <Link to="/contact" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-5 text-sm font-semibold text-slate-900 backdrop-blur-md transition hover:border-blue-200 dark:border-white/15 dark:bg-slate-900/60 dark:text-white sm:min-h-12 sm:px-6"><span className="sm:hidden">Contact us</span><span className="hidden sm:inline">Tell us what to automate</span> <ArrowUpRight size={16} /></Link>
              </div>
            </div>
            <div className="mt-auto flex justify-center pb-6" aria-hidden><span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-600 backdrop-blur-md dark:bg-slate-900/60 dark:text-slate-300"><MousePointer2 size={13} className="animate-bounce motion-reduce:animate-none" /> Scroll to walk inside</span></div>
          </div>

          {/* 1 · the lobby: paperwork becomes a system */}
          <Stop side="right">
            <div className={`${glass} max-w-md p-6 sm:p-7`}>
              <p className={eyebrow}>Inside a business</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">Paperwork becomes one clear system.</h2>
              <p className="mt-3 text-[15px] leading-7 text-slate-600 dark:text-slate-300">Repeated data entry, scattered records, missed follow-ups and processes that depend on memory: we turn them into software people can actually use.</p>
            </div>
          </Stop>

          {/* 2 · the operations room */}
          <Stop side="right">
            <div className={`${glass} max-w-md p-6 sm:p-7`}>
              <p className={eyebrow}>Operations</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">Every part of the business, on one screen.</h2>
              <p className="mt-3 text-[15px] leading-7 text-slate-600 dark:text-slate-300">Business software, workflow automation and useful AI working together, so routine work runs by itself and decisions start from real numbers.</p>
              <div className="mt-4 flex flex-wrap gap-1.5">{['Business software', 'Workflow automation', 'Useful AI'].map((t) => <span key={t} className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">{t}</span>)}</div>
            </div>
          </Stop>

          {/* 3–5 · the three products, each in its own room */}
          <ProductStop p={PRODUCTS[0]} room="School wing" side="left" />
          <ProductStop p={PRODUCTS[1]} room="Fleet garage" side="left" />
          <ProductStop p={PRODUCTS[2]} room="Trading floor" side="left" />

          {/* 6 · above the logo */}
          <Stop side="left">
            <div className={`${glass} max-w-md p-6 sm:p-8`}>
              <p className={eyebrow}>Oliskey</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">Your business could run like this.</h2>
              <p className="mt-3 text-[15px] leading-7 text-slate-600 dark:text-slate-300">Start with one of our products, or tell us what takes too much time and we’ll build what helps.</p>
              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <Link to="/contact" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 active:scale-[.97]">Tell us what you need <ArrowRight size={17} /></Link>
                <Link to="/products" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-200 px-6 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-white/15 dark:text-white dark:hover:bg-white/5">Explore all products</Link>
              </div>
            </div>
          </Stop>
        </div>
      </section>

      {/* every product, side by side */}
      <section id="products" className="relative scroll-mt-20 bg-white px-5 py-20 dark:bg-slate-950 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className={eyebrow}>Our products</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl">Purpose-built software. One connected ecosystem.</h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {PRODUCTS.map((p) => { const Icon = p.icon; return (
              <article key={p.id} className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl dark:border-white/10 dark:bg-slate-900">
                <div className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${p.tint}`}>
                  <ThemedShot shots={p.shots} alt={`${p.name} screen`} className="absolute inset-0 h-full w-full object-cover object-left-top transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04]" />
                  <span className="absolute left-4 top-4 grid size-10 place-items-center rounded-xl border border-white/30 bg-black/25 text-white backdrop-blur-md"><Icon size={20} /></span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{p.eyebrow}</p>
                  <h3 className="mt-1 text-xl font-bold tracking-tight text-slate-950 dark:text-white">{p.name}</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{p.short}</p>
                  <div className="mt-6 flex gap-2">
                    <a href={p.appUrl} target="_blank" rel="noopener" className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-full bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-blue-600 active:scale-[.97] dark:bg-white dark:text-slate-950 dark:hover:bg-blue-100">{p.appLabel} <ExternalLink size={14} /></a>
                    <Link to={p.detailsUrl} aria-label={`About ${p.name}`} className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 dark:border-white/10 dark:text-white dark:hover:bg-white/5">Learn more</Link>
                  </div>
                </div>
              </article>
            ); })}
          </div>
        </div>
      </section>
    </div>
  );
};

// No 3D available (or Reduce Motion): the logo, large and still, behind the text.
function StillLogo() {
  return (
    <svg aria-hidden viewBox="0 0 100 100" className="absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 opacity-[0.08] dark:opacity-[0.12]" fill="none">
      <g stroke="currentColor" strokeWidth="8" strokeLinecap="round"><circle cx="35" cy="62" r="22" /><circle cx="65" cy="62" r="22" /><circle cx="50" cy="36" r="22" /></g>
      <path d="M 65.55 20.44 A 22 22 0 0 1 72 36" stroke="#3b82f6" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

export default Home;
