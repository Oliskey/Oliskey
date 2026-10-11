import React from 'react';
import { ArrowRight, CalendarClock, CheckCircle2, ExternalLink, Gauge, ShieldCheck, Truck, Users, Wallet, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

const APP_URL = 'https://tricycles.oliskey.com/';
const capabilities = [
  { icon: Truck, title: 'Know your fleet', body: 'Keep tricycle and vehicle records organised, including which vehicle is assigned to each driver.' },
  { icon: Users, title: 'Connect drivers and staff', body: 'Keep driver and staff details together with their responsibilities and vehicle assignments.' },
  { icon: Wallet, title: 'Track collections and remittances', body: 'Record payment schedules, daily collections, remittances and outstanding balances for easier follow-up.' },
  { icon: Wrench, title: 'Plan maintenance', body: 'Keep maintenance records and service reminders visible so you can plan vehicle upkeep.' },
  { icon: CalendarClock, title: 'Understand obligations', body: 'Keep partner balances and relevant finance records together for clearer operational decisions.' },
  { icon: Gauge, title: 'See operations more clearly', body: 'Bring key fleet records into a workspace designed to be practical on mobile and larger screens.' },
];

const FleetProductPage: React.FC = () => (
  <div className="min-h-screen overflow-hidden bg-white pt-24 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
    <section className="relative isolate px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-16 lg:px-8">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-80 max-w-5xl rounded-full bg-violet-500/10 blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-16">
        <div className="min-w-0">
          <Link to="/products" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-200 bg-white/75 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur-xl transition hover:border-violet-200 hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:border-slate-800 dark:bg-slate-900/75 dark:text-slate-300 dark:hover:text-violet-300">
            <ArrowRight size={15} className="rotate-180" /> All Oliskey products
          </Link>
          <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-violet-700 dark:border-violet-900 dark:bg-violet-950/50 dark:text-violet-300">
            <ShieldCheck size={14} /> Fleet and transport operations
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">Run your tricycle business with a clearer view of every moving part.</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg sm:leading-8">Oliskey Fleet is designed to help tricycle and transport operators organise vehicle records, drivers, staff, collections, remittances, maintenance and partner balances—without spreading daily operations across disconnected records.</p>
          <div className="mt-8 flex flex-col gap-3 min-[430px]:flex-row">
            <a href={APP_URL} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-violet-600 px-6 py-3 font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2">Open Oliskey Fleet <ArrowRight size={17} /></a>
            <Link to="/contact" className="oliskey-liquid-glass inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-200/80 px-6 py-3 font-semibold text-slate-800 transition hover:border-violet-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:border-slate-700 dark:text-white">Ask about Fleet</Link>
          </div>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Learn what the product is for first. Open the live workspace when you are ready.</p>
        </div>
        <div className="relative">
          <div aria-hidden className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-violet-500/15 via-blue-500/10 to-transparent blur-2xl" />
          <div className="oliskey-liquid-glass relative rounded-[2rem] border border-white/70 bg-white/75 p-5 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl dark:border-slate-700/70 dark:bg-slate-900/75 sm:p-8">
            <div className="flex items-center gap-3 border-b border-slate-200/80 pb-5 dark:border-slate-700">
              <span className="grid size-12 place-items-center rounded-2xl bg-violet-600 text-white"><Gauge size={25} /></span>
              <div><p className="text-sm font-semibold text-violet-700 dark:text-violet-300">Oliskey Fleet</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Fleet operations overview</p></div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {['Vehicle records', 'Driver assignments', 'Daily collections', 'Maintenance plans'].map(label => <div key={label} className="rounded-2xl border border-slate-200/80 bg-white/75 p-4 dark:border-slate-700 dark:bg-slate-950/50"><CheckCircle2 size={18} className="text-violet-600 dark:text-violet-300" /><p className="mt-3 text-sm font-semibold">{label}</p></div>)}
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400">Illustrative capability summary, not live account data.</p>
          </div>
        </div>
      </div>
    </section>
    <section className="bg-slate-50/80 px-4 py-16 dark:bg-slate-900/40 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-300">What it helps you manage</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">The everyday details, in one place.</h2><p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">Spend less time searching through separate records and more time understanding how your operation is doing.</p></div>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map(({ icon: Icon, title, body }) => <article key={title} className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950/70 sm:p-7"><span className="grid size-11 place-items-center rounded-2xl bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300"><Icon size={22} /></span><h3 className="mt-5 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{body}</p></article>)}
        </div>
      </div>
    </section>
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[2rem] bg-slate-950 px-6 py-10 text-center text-white sm:px-12 sm:py-14">
        <p className="text-sm font-semibold uppercase tracking-wider text-violet-300">Your next step</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Ready to see Oliskey Fleet?</h2>
        <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-300">You have seen what the product is designed to help with. Open the Fleet workspace to explore the application itself.</p>
        <a href={APP_URL} target="_blank" rel="noreferrer" className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">Open the Fleet app <ExternalLink size={16} /></a>
      </div>
    </section>
  </div>
);

export default FleetProductPage;
