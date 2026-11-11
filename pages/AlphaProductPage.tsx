import React from 'react';
import { ArrowRight, BarChart3, Bell, Bot, BookOpen, CandlestickChart, CheckCircle2, ExternalLink, LineChart, ShieldCheck, Target, Timer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { productById } from '../data/products';
import ThemedShot from '../components/ThemedShot';

// Oliskey Alpha's page on the main site. Honest by design: demo credits only, no promise of profit, real-money trading not offered.
const alpha = productById('alpha');
const APP_URL = alpha.appUrl;

const capabilities = [
  { icon: Timer, title: 'Fixed Time trades', body: 'Choose Up or Down and a time. When the time ends, you see at once whether the price moved your way.' },
  { icon: Target, title: 'InZone trades', body: 'Pick a price range. If the price is still inside it when the time ends, the trade wins.' },
  { icon: LineChart, title: 'Forex-style trades', body: 'Open and close when you choose, with stop-loss and take-profit, to learn how real positions behave.' },
  { icon: Bot, title: 'An AI with a real record', body: 'Follow AI signals that show every win and loss. The AI only trades types that have passed its money tests.' },
  { icon: BarChart3, title: 'Charts and tools', body: 'Live candles, drawing tools and indicators, on phone and desktop.' },
  { icon: Bell, title: 'Alerts', body: 'Turn on alerts to hear about new signals, AI trades and every result.' },
];

const AlphaProductPage: React.FC = () => (
  <div className="min-h-screen overflow-hidden bg-white pt-24 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
    <section className="relative isolate px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-16 lg:px-8">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-80 max-w-5xl rounded-full bg-[#5B3DF5]/10 blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-16">
        <div className="min-w-0">
          <Link to="/products" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-200 bg-white/75 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur-xl transition hover:border-violet-200 hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:border-slate-800 dark:bg-slate-900/75 dark:text-slate-300 dark:hover:text-violet-300">
            <ArrowRight size={15} className="rotate-180" /> All Oliskey products
          </Link>
          <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-violet-700 dark:border-violet-900 dark:bg-violet-950/50 dark:text-violet-300">
            <CandlestickChart size={14} /> Oliskey Alpha · trading practice
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">Learn to trade without risking your money.</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg sm:leading-8">Oliskey Alpha gives you demo credits to practise Fixed Time, InZone and Forex-style trades on live crypto prices. Follow an AI that shows its full record, and learn with free lessons, before you ever think about real money.</p>
          <div className="mt-8 flex flex-col gap-3 min-[430px]:flex-row">
            <a href={APP_URL} target="_blank" rel="noopener" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#5B3DF5] px-6 py-3 font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:bg-[#4A2EE0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 active:scale-[.98]">Open Oliskey Alpha <ArrowRight size={17} /></a>
            <a href="#how-it-works" className="oliskey-liquid-glass inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-200/80 px-6 py-3 font-semibold text-slate-800 transition hover:border-violet-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 dark:border-slate-700 dark:text-white">See what is inside</a>
          </div>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Free to start. Demo credits have no cash value.</p>
        </div>
        <div className="relative">
          <div aria-hidden className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-[#5B3DF5]/20 via-[#1E6FD9]/10 to-transparent blur-2xl" />
          <figure className="relative overflow-hidden rounded-[1.75rem] border border-slate-800 bg-black shadow-2xl shadow-slate-900/25">
            <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3" aria-hidden><span className="size-2.5 rounded-full bg-white/20" /><span className="size-2.5 rounded-full bg-white/20" /><span className="size-2.5 rounded-full bg-white/20" /><span className="ml-3 truncate text-xs text-white/40">alpha.oliskey.com</span></div>
            <ThemedShot shots={productById('alpha').shots} alt="Oliskey Alpha trading screen: a live candle chart with Up and Down buttons, amount and duration, and a demo balance" eager className="block h-auto w-full" />
            <figcaption className="px-4 py-3 text-xs text-white/50">The trading screen, on a demo account.</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section id="how-it-works" className="scroll-mt-24 bg-slate-50/80 px-4 py-16 dark:bg-slate-900/40 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-300">What you can do</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Practise every kind of trade, in one app.</h2><p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">Make your mistakes with demo credits, see why each trade won or lost, and build the habit of managing risk.</p></div>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map(({ icon: Icon, title, body }) => <article key={title} className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950/70 sm:p-7"><span className="grid size-11 place-items-center rounded-2xl bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300"><Icon size={22} /></span><h3 className="mt-5 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{body}</p></article>)}
        </div>
      </div>
    </section>

    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-200 p-7 dark:border-slate-800 sm:p-9">
          <span className="grid size-11 place-items-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"><BookOpen size={22} /></span>
          <h2 className="mt-5 text-2xl font-bold tracking-tight">Learn as you go</h2>
          <ul className="mt-5 space-y-3">{['Free lessons on trading and risk', 'A clear reason for every AI result', 'Your full history, wins and losses'].map((t) => <li key={t} className="flex items-start gap-2.5 text-sm leading-6 text-slate-700 dark:text-slate-200"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-violet-600 dark:text-violet-300" />{t}</li>)}</ul>
        </div>
        <div className="rounded-[2rem] border border-amber-200 bg-amber-50/60 p-7 dark:border-amber-900/60 dark:bg-amber-950/20 sm:p-9">
          <span className="grid size-11 place-items-center rounded-2xl bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"><ShieldCheck size={22} /></span>
          <h2 className="mt-5 text-2xl font-bold tracking-tight">Straight about risk</h2>
          <p className="mt-4 text-sm leading-6 text-slate-700 dark:text-slate-200">Oliskey Alpha is for practice. Demo credits have no cash value, and real-money trading is not offered. Any trade or signal can lose, and past results do not promise future ones. This is not financial advice.</p>
        </div>
      </div>
    </section>

    <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[2rem] bg-slate-950 px-6 py-10 text-center text-white sm:px-12 sm:py-14">
        <p className="text-sm font-semibold uppercase tracking-wider text-violet-300">Your next step</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Start practising today.</h2>
        <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-300">Open Oliskey Alpha on your phone or computer. It works in the browser, nothing to install.</p>
        <a href={APP_URL} target="_blank" rel="noopener" className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">Open Oliskey Alpha <ExternalLink size={16} /></a>
      </div>
    </section>
  </div>
);

export default AlphaProductPage;
