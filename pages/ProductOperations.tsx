import React, { useState } from 'react';
import { ArrowLeft, ArrowUpRight, CheckCircle2, AlertCircle, Copy, ExternalLink, Gauge, GraduationCap, Globe, Search, ShieldCheck, Activity, ClipboardCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const products = [
  {
    id: 'school',
    name: 'Oliskey School App',
    category: 'Education platform',
    domain: 'https://app.oliskey.com/',
    repo: 'https://github.com/Oliskey-School/School-app-',
    deploy: 'https://vercel.com/oliskeylee',
    sitemap: 'https://app.oliskey.com/sitemap.xml',
    robots: 'https://app.oliskey.com/robots.txt',
    seoProperty: 'https://search.google.com/search-console?resource_id=sc-domain%3Aoliskey.com',
    title: 'School Management System for Nigerian Schools | Oliskey',
    description: 'Manage students, teachers, attendance, fees, exams, report cards and school communication in one connected school management platform.',
    icon: GraduationCap,
    accent: 'blue',
    checklist: ['Unique page title and meta description', 'Canonical URLs and indexable public pages', 'Sitemap and robots.txt accessible', 'Google Search Console property verified'],
  },
  {
    id: 'fleet',
    name: 'Oliskey Fleet',
    category: 'Fleet operations platform',
    domain: 'https://tricycles.oliskey.com/',
    repo: 'https://github.com/Oliskey/oliskey-fleet',
    deploy: 'https://vercel.com/oliskeylee/oliskey-fleet',
    sitemap: 'https://tricycles.oliskey.com/sitemap.xml',
    robots: 'https://tricycles.oliskey.com/robots.txt',
    seoProperty: 'https://search.google.com/search-console?resource_id=sc-domain%3Aoliskey.com',
    title: 'Tricycle Fleet Management Software | Oliskey Fleet',
    description: 'Manage tricycles, drivers, staff, collections, remittances, maintenance and finance records in one fleet operations workspace.',
    icon: Gauge,
    accent: 'violet',
    checklist: ['Unique page title and meta description', 'Canonical URL matches the product domain', 'Sitemap and robots.txt accessible', 'Product domain covered in Search Console'],
  },
];

const LinkButton = ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">{children}<ExternalLink size={14} /></a>;

const ProductOperations: React.FC = () => {
  const [selected, setSelected] = useState('school');
  const [copied, setCopied] = useState('');
  const product = products.find(p => p.id === selected) || products[0];
  const copyText = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(''), 1800);
    } catch {
      setCopied('Copy unavailable — select the text manually');
    }
  };
  const Icon = product.icon;

  return (
    <div className="min-h-screen bg-slate-50 px-4 pb-16 pt-28 text-slate-900 dark:bg-slate-950 dark:text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Link to="/admin" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"><ArrowLeft size={16} /> Back to admin dashboard</Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-sm font-bold uppercase tracking-[.16em] text-blue-600">Oliskey control centre</p><h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">Products &amp; SEO</h1><p className="mt-3 max-w-2xl leading-7 text-slate-600 dark:text-slate-300">A central workspace for product links, deployment consoles and search-engine readiness. Deployment and indexing status must be confirmed in the linked provider dashboards.</p></div>
          <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:self-auto">Open Search Console <ArrowUpRight size={17} /></a>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {products.map(p => {
            const ProductIcon = p.icon;
            return <button key={p.id} type="button" onClick={() => setSelected(p.id)} className={`rounded-2xl border p-5 text-left transition sm:p-6 ${selected === p.id ? 'border-blue-500 bg-blue-50 shadow-sm ring-2 ring-blue-500/10 dark:bg-blue-950/30' : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'}`}>
              <div className="flex items-start justify-between gap-3"><span className="grid size-11 place-items-center rounded-xl bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-white"><ProductIcon size={22} /></span><span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">Verify status</span></div>
              <h2 className="mt-4 text-xl font-bold">{p.name}</h2><p className="mt-1 break-all text-sm text-slate-500">{p.domain.replace('https://','')}</p><p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{p.category}</p>
            </button>;
          })}
        </div>

        <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 p-5 dark:border-slate-800 sm:p-7"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><span className="grid size-12 place-items-center rounded-2xl bg-slate-100 dark:bg-slate-800"><Icon size={24} /></span><div><h2 className="text-xl font-bold">{product.name}</h2><p className="text-sm text-slate-500">{product.category}</p></div></div><LinkButton href={product.domain}>Open live domain</LinkButton></div></div>
          <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-2">
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-base font-bold"><Activity size={18} /> Production &amp; source</h3>
              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Public domain</p><a className="mt-1 block break-all font-semibold text-blue-600 hover:underline" href={product.domain} target="_blank" rel="noreferrer">{product.domain}</a><p className="mt-2 text-sm text-slate-500">Open the product directly to confirm the current customer-facing experience.</p></div>
              <div className="grid gap-3 min-[460px]:grid-cols-2"><LinkButton href={product.deploy}>Vercel deployments</LinkButton><LinkButton href={product.repo}>GitHub repository</LinkButton></div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30"><p className="flex items-center gap-2 font-semibold text-amber-900 dark:text-amber-200"><AlertCircle size={17} /> Live status is not yet connected</p><p className="mt-2 text-sm leading-6 text-amber-900/80 dark:text-amber-100/80">This page does not claim a deployment is healthy. Use Vercel to confirm the latest build, domain alias and deployment state. Automated health checks need a secure server-side integration.</p></div>
            </div>
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-base font-bold"><Search size={18} /> SEO tools &amp; indexing</h3>
              <div className="grid gap-3 min-[460px]:grid-cols-2"><LinkButton href={product.sitemap}>Open sitemap.xml</LinkButton><LinkButton href={product.robots}>Open robots.txt</LinkButton><LinkButton href={product.seoProperty}>Google Search Console</LinkButton><LinkButton href="https://pagespeed.web.dev/">PageSpeed Insights</LinkButton></div>
              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Suggested SEO title</p><p className="mt-2 font-semibold leading-6">{product.title}</p><button onClick={() => copyText('title', product.title)} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-600"><Copy size={15} /> Copy title</button></div>
              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Suggested meta description</p><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{product.description}</p><button onClick={() => copyText('description', product.description)} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-600"><Copy size={15} /> Copy description</button></div>
            </div>
          </div>
          <div className="border-t border-slate-100 p-5 dark:border-slate-800 sm:p-7"><h3 className="flex items-center gap-2 text-base font-bold"><ClipboardCheck size={18} /> SEO launch checklist</h3><p className="mt-1 text-sm text-slate-500">Use this checklist during each release. It is a guide, not an automatic audit.</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{product.checklist.map(item => <div key={item} className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-3 text-sm leading-6 dark:bg-slate-800/70"><CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-600" />{item}</div>)}</div><p aria-live="polite" className="mt-3 min-h-5 text-sm text-emerald-600">{copied}</p></div>
        </section>
        <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-slate-500"><ShieldCheck size={15} className="mt-0.5 shrink-0" /> This control centre is restricted to the existing Oliskey admin route. It does not expose API keys, alter deployments, or claim live SEO metrics. Live status and Search Console analytics require authenticated provider APIs and server-side credentials.</p>
      </div>
    </div>
  );
};
export default ProductOperations;
