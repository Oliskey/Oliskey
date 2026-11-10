import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, LayoutGrid } from 'lucide-react';
// @ts-ignore
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products';

// The apps menu in the top bar: every Oliskey product, one tap to open it, from any page of the website.
// Solid, not glass: the top bar's own blur keeps a glass menu from blurring the page under it, so text showed through.
// Motion: grows from 96% while fading, 180 ms on the deceleration curve; leaves faster. Escape or a tap outside closes it.
const AppsMenu: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent | TouchEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', away);
    document.addEventListener('touchstart', away, { passive: true });
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', away); document.removeEventListener('touchstart', away); document.removeEventListener('keydown', esc); };
  }, [open]);

  return (
    <div ref={box} className={`relative ${className}`}>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        aria-label="Oliskey apps"
        aria-expanded={open}
        aria-haspopup="menu"
        title="Oliskey apps"
        className={`grid size-10 place-items-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-95 dark:text-slate-300 dark:hover:bg-slate-800 ${open ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
      >
        <LayoutGrid size={20} />
      </button>
      <div
        role="menu"
        aria-label="Open an Oliskey app"
        className={`fixed left-4 right-4 top-20 z-[80] origin-top transition-[opacity,transform] duration-[180ms] ease-[cubic-bezier(0.32,0.72,0,1)] sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:w-[22rem] sm:origin-top-right ${open ? 'visible scale-100 opacity-100' : 'invisible pointer-events-none scale-[.96] opacity-0 duration-[120ms]'}`}
      >
       <div className="rounded-3xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/15 dark:border-slate-700 dark:bg-slate-900">
        <p className="relative px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Oliskey apps</p>
        {PRODUCTS.map(({ id, name, short, appUrl, detailsUrl, icon: Icon, tint }) => (
          <div key={id} role="none" className="relative flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
            <span className={`grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${tint} text-white shadow-sm`}><Icon size={21} /></span>
            <Link role="menuitem" to={detailsUrl} onClick={() => setOpen(false)} className="min-w-0 flex-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
              <span className="block truncate text-sm font-semibold text-slate-900 dark:text-white">{name}</span>
              <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{short}</span>
            </Link>
            <a role="menuitem" href={appUrl} target="_blank" rel="noopener" onClick={() => setOpen(false)} aria-label={`Open ${name}`}
              className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full bg-slate-900 px-3.5 text-xs font-semibold text-white transition hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-[.97] dark:bg-white dark:text-slate-900 dark:hover:bg-blue-100">
              Open <ExternalLink size={12} />
            </a>
          </div>
        ))}
        <Link to="/products" onClick={() => setOpen(false)} className="relative mt-1 block rounded-2xl px-3 py-2.5 text-center text-xs font-semibold text-blue-700 transition-colors hover:bg-white/70 dark:text-blue-300 dark:hover:bg-white/5">See all products</Link>
       </div>
      </div>
    </div>
  );
};

export default AppsMenu;
