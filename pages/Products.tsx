import React from 'react';
import { ArrowRight, ExternalLink, GraduationCap, Gauge, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const products = [
  {
    name: 'Oliskey School App',
    eyebrow: 'Education · School operations',
    description: 'Help schools bring student records, attendance, fees, exams, report cards, communication and learning tools together in one workspace.',
    url: 'https://app.oliskey.com/',
    detailsUrl: '/school-management',
    action: 'Explore school platform',
    icon: GraduationCap,
    image: '/school-dashboard.png',
    tint: 'from-blue-600 to-indigo-700',
    points: ['Admin, teacher, student and parent experiences', 'School operations and learning tools', 'Built for schools in Nigeria'],
  },
  {
    name: 'Oliskey Fleet',
    eyebrow: 'Fleet · Transport operations',
    description: 'Give tricycle operators a clearer way to manage vehicles, staff, drivers, collections, remittances, maintenance and finance records.',
    url: 'https://tricycles.oliskey.com/',
    detailsUrl: 'https://tricycles.oliskey.com/',
    action: 'Explore Oliskey Fleet',
    icon: Gauge,
    image: '',
    tint: 'from-violet-600 to-indigo-700',
    points: ['Vehicle, staff and driver records', 'Collections, remittances and finance', 'Mobile-first fleet workflows'],
  },
];

const Products: React.FC = () => (
  <div className="min-h-screen bg-white pt-28 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
    <section className="relative overflow-hidden px-5 pb-14 pt-10 sm:px-8 sm:pb-20 sm:pt-16">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-0 h-72 w-[min(90vw,900px)] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="relative mx-auto max-w-5xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300"><Sparkles size={16} /> The Oliskey product ecosystem</span>
        <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">Purpose-built software.<br className="hidden sm:block" /> One connected ecosystem.</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-xl sm:leading-8">Practical products that make everyday work clearer—from running a school to managing a transport fleet.</p>
      </div>
    </section>
    <section className="mx-auto grid max-w-7xl gap-5 px-5 pb-16 sm:px-8 sm:pb-24 lg:grid-cols-2 lg:gap-7">
      {products.map(({ name, eyebrow, description, url, detailsUrl, action, icon: Icon, image, tint, points }) => (
        <article key={name} className="group flex min-w-0 flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className={`relative min-h-48 overflow-hidden bg-gradient-to-br ${tint} p-6 text-white sm:min-h-56 sm:p-8`}>
            {image ? <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-screen" /> : <div aria-hidden className="absolute -right-10 -top-10 h-64 w-64 rounded-full border-[36px] border-white/10" />}
            <div className="relative flex items-start justify-between gap-4">
              <div><p className="text-sm font-semibold text-white/75">{eyebrow}</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{name}</h2></div>
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md"><Icon size={25} /></span>
            </div>
            <span className="relative mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/10 px-3 py-1.5 text-xs font-medium text-white/90"><ShieldCheck size={14} /> A product by Oliskey</span>
          </div>
          <div className="flex flex-1 flex-col p-6 sm:p-8">
            <p className="leading-7 text-slate-600 dark:text-slate-300 sm:text-base">{description}</p>
            <ul className="mt-5 space-y-3">{points.map(point => <li key={point} className="flex items-start gap-2.5 text-sm leading-6 text-slate-700 dark:text-slate-200"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" />{point}</li>)}</ul>
            <div className="mt-7 flex flex-col gap-3 border-t border-slate-100 pt-5 dark:border-slate-800 min-[430px]:flex-row">
              <a href={url} target="_blank" rel="noreferrer" className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[.98]">{action}<ArrowRight size={17} /></a>
              {detailsUrl.startsWith('/') ? <Link to={detailsUrl} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800">Product details</Link> : <a href={detailsUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800">Open website <ExternalLink size={15} /></a>}
            </div>
          </div>
        </article>
      ))}
    </section>
    <section className="px-5 pb-16 sm:px-8 sm:pb-24"><div className="mx-auto max-w-7xl rounded-[1.75rem] bg-slate-950 px-6 py-10 text-center text-white sm:px-12 sm:py-14"><p className="text-sm font-semibold text-blue-300">Built to solve real operational problems</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Explore what Oliskey can do for you.</h2><p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-300">Choose a product to see its capabilities, visit its website, or contact our team about getting started.</p><Link to="/contact" className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-blue-50">Talk to Oliskey <ArrowRight size={17} /></Link></div></section>
  </div>
);
export default Products;
