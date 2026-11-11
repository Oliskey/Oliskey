import React from 'react';
import { ArrowUpRight, Mail, MessageCircle } from 'lucide-react';
import { PageTop, SectionHead } from '../components/Section';
import { CONTACT, PRODUCTS } from '../lib/products';
import { useReveal } from '../lib/reveal';

const FAQ = [
  ['Do I need a separate account for each product?', 'Create one Oliskey account here. Some products, like Oliskey School, also have their own sign-in for each school.'],
  ['Is Oliskey Alpha real-money trading?', 'No. Oliskey Alpha is for practice: you trade with demo credits on live prices and learn how risk works.'],
  ['Can Oliskey School work for my school?', 'It is built for primary and secondary schools. Email or message us and we will walk you through it.'],
  ['Where is Oliskey based?', `${CONTACT.company} is based in ${CONTACT.city}.`],
];

const Resources: React.FC = () => {
  useReveal();
  return (
    <PageTop>
      <SectionHead as="h1" eyebrow="Resources" title="Everything you need to get going" lead="Open the apps, get help, and find quick answers." />
      <h2 className="mt-16 text-section text-ink" data-reveal>Open an app</h2>
      <ul className="mt-6 grid gap-3 sm:grid-cols-3">
        {PRODUCTS.filter((p) => p.app).map((p) => {
          const Icon = p.icon;
          return (
            <li key={p.id} data-reveal>
              <a href={p.app!.url} target="_blank" rel="noreferrer" className="flex min-h-[64px] items-center gap-3 rounded-2xl border border-line bg-raised px-4 transition-colors hover:bg-surface">
                <span className="grid h-9 w-9 place-items-center rounded-[11px] text-white" style={{ background: p.tint }}><Icon size={18} /></span>
                <span className="flex-1 text-[15px] font-semibold text-ink">{p.name}</span><ArrowUpRight size={17} className="text-faint" />
              </a>
            </li>
          );
        })}
      </ul>
      <h2 className="mt-16 text-section text-ink" data-reveal>Get help</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <a data-reveal href={`mailto:${CONTACT.email}`} className="flex items-center gap-4 rounded-2xl border border-line bg-raised p-5 hover:bg-surface"><Mail className="text-accent" /><div><p className="font-semibold text-ink">Email</p><p className="text-[15px] text-muted">{CONTACT.email}</p></div></a>
        <a data-reveal href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-2xl border border-line bg-raised p-5 hover:bg-surface"><MessageCircle className="text-accent" /><div><p className="font-semibold text-ink">WhatsApp</p><p className="text-[15px] text-muted">Message the Oliskey team</p></div></a>
      </div>
      <h2 className="mt-16 text-section text-ink" data-reveal>Questions</h2>
      <div className="mt-6 divide-y divide-line rounded-card border border-line bg-raised">
        {FAQ.map(([q, a]) => (
          <details key={q} data-reveal className="group px-5 sm:px-6">
            <summary className="flex min-h-[60px] cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-semibold text-ink">{q}<span className="text-faint transition-transform group-open:rotate-45 text-[22px] leading-none">+</span></summary>
            <p className="pb-5 text-[15px] leading-relaxed text-muted">{a}</p>
          </details>
        ))}
      </div>
    </PageTop>
  );
};
export default Resources;
