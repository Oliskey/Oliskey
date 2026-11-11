import React from 'react';
import { ArrowRight, ExternalLink, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import ThemedShot from '../components/ThemedShot';
import Tilt3D from '../components/motion/Tilt3D';

// The product hub: every live product with what it does, its page here, and a button that opens it.
const Products: React.FC = () => (
  <div className="min-h-screen bg-white pt-28 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
    <section className="relative overflow-hidden px-5 pb-14 pt-10 sm:px-8 sm:pb-20 sm:pt-16">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-0 h-72 w-[min(90vw,900px)] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="relative mx-auto max-w-5xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300"><Sparkles size={16} /> The Oliskey product ecosystem</span>
        <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">Purpose-built software.<br className="hidden sm:block" /> One connected ecosystem.</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-xl sm:leading-8">Practical products that make everyday work clearer, from running a school and managing a transport fleet to learning to trade.</p>
      </div>
    </section>

    <section aria-label="Active Oliskey products" className="mx-auto max-w-7xl px-5 pb-5 sm:px-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold tracking-wide text-slate-500 dark:text-slate-400">Active products</h2>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">{PRODUCTS.length} products</span>
      </div>
      {/* one row that scrolls sideways on a phone instead of wrapping */}
      <div className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
        {PRODUCTS.map(({ id, name, icon: Icon }) => (
          <a key={id} href={`#${id}`} className="flex min-h-12 shrink-0 snap-start items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
            <Icon size={18} className="shrink-0" /> <span className="whitespace-nowrap">{name}</span>
          </a>
        ))}
      </div>
    </section>

    <section className="mx-auto grid max-w-7xl gap-5 px-5 pb-16 sm:px-8 sm:pb-24 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
      {PRODUCTS.map(({ id, name, eyebrow, description, appUrl, appLabel, detailsUrl, icon: Icon, shots, tint, points }) => (
        <Tilt3D as="article" id={id} key={id} max={5} className="group flex min-w-0 scroll-mt-24 flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className={`relative min-h-48 overflow-hidden bg-gradient-to-br ${tint} p-6 text-white sm:min-h-52 sm:p-7`}>
            <ThemedShot shots={shots} alt="" className="absolute inset-0 h-full w-full object-cover object-left-top opacity-25" />
            <div className="relative flex items-start justify-between gap-4">
              <div><p className="text-sm font-semibold text-white/75">{eyebrow}</p><Link to={detailsUrl} className="mt-3 inline-block rounded-sm text-3xl font-bold tracking-tight transition hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">{name}</Link></div>
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md"><Icon size={25} /></span>
            </div>
            <span className="relative mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/10 px-3 py-1.5 text-xs font-medium text-white/90"><ShieldCheck size={14} /> A product by Oliskey</span>
          </div>
          <div className="flex flex-1 flex-col p-6 sm:p-7">
            <p className="leading-7 text-slate-600 dark:text-slate-300 sm:text-base">{description}</p>
            <ul className="mb-7 mt-5 space-y-3">{points.map(point => <li key={point} className="flex items-start gap-2.5 text-sm leading-6 text-slate-700 dark:text-slate-200"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" />{point}</li>)}</ul>
            <div className="mt-auto flex flex-col gap-3 border-t border-slate-100 pt-5 dark:border-slate-800 min-[430px]:flex-row">
              <a href={appUrl} target="_blank" rel="noopener" className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:scale-[.98]">{appLabel} <ExternalLink size={15} /></a>
              <Link to={detailsUrl} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800">Learn more <ArrowRight size={16} /></Link>
            </div>
          </div>
        </Tilt3D>
      ))}
    </section>

    <section className="px-5 pb-16 sm:px-8 sm:pb-24"><div className="mx-auto max-w-7xl rounded-[1.75rem] bg-slate-950 px-6 py-10 text-center text-white sm:px-12 sm:py-14"><p className="text-sm font-semibold text-blue-300">Built to solve real operational problems</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Explore what Oliskey can do for you.</h2><p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-300">Open any product straight from here, read what it does first, or contact our team about getting started.</p><Link to="/contact" className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-blue-50">Talk to Oliskey <ArrowRight size={17} /></Link></div></section>
  </div>
);
export default Products;
