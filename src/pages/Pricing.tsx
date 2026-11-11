import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { PageTop, SectionHead } from '../components/Section';
import CTA from '../components/CTA';
import { productById } from '../lib/products';
import { useReveal } from '../lib/reveal';

// Oliskey School licence levels (yearly). Prices are in Nigerian naira.
const SCHOOL = [
  { name: 'Level 1', who: 'Primary · Nigerian curriculum', licence: '₦550,000', student: '₦3,200' },
  { name: 'Level 2', who: 'Secondary · Nigerian curriculum', licence: '₦1,350,000', student: '₦4,500' },
  { name: 'Level 3', who: 'International or dual curriculum', licence: '₦2,500,000', student: '₦6,000' },
  { name: 'Level 4', who: 'Enterprise and government', licence: '₦4,000,000', student: '₦8,000' },
];

const Pricing: React.FC = () => {
  useReveal();
  const fleet = productById('fleet'), alpha = productById('alpha');
  return (
    <>
      <PageTop>
        <SectionHead as="h1" eyebrow="Pricing" title="Simple, yearly pricing for schools" lead="Oliskey School is licensed per school per year, plus a small amount per student. Prices are in Nigerian naira." />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SCHOOL.map((t, i) => (
            <div key={t.name} data-reveal className={`flex flex-col rounded-card border p-6 ${i === 1 ? 'border-accent bg-raised shadow-[0_24px_60px_-34px_rgb(var(--accent)/0.6)]' : 'border-line bg-raised'}`}>
              <p className="text-[15px] font-semibold text-ink">{t.name}</p>
              <p className="mt-1 min-h-[44px] text-[14px] text-muted">{t.who}</p>
              <p className="mt-5 text-[30px] font-bold tracking-tight tabular-nums text-ink">{t.licence}</p>
              <p className="text-[14px] text-muted">licence per year</p>
              <p className="mt-4 border-t border-line pt-4 text-[15px] text-ink"><span className="font-semibold tabular-nums">{t.student}</span> <span className="text-muted">per student per year</span></p>
            </div>
          ))}
        </div>
        <div data-reveal className="mt-8 flex flex-wrap gap-3">
          <Link to="/contact?topic=quote&product=school" className="btn-primary">Get a quote for your school</Link>
          <Link to="/school" className="btn-secondary">About Oliskey School</Link>
        </div>

        <h2 data-reveal className="mt-24 text-section text-ink">Other products</h2>
        <div className="mt-6 grid gap-px overflow-hidden rounded-card border border-line bg-line">
          {[
            [fleet.name, 'Pricing depends on the size of your fleet. Message us and we will set you up.', <Link key="f" to="/contact?topic=quote&product=fleet" className="btn-secondary">Get a quote</Link>],
            [alpha.name, 'Practice runs on demo credits. Open the app to start.', <a key="a" href={alpha.app!.url} target="_blank" rel="noreferrer" className="btn-secondary">Open Oliskey Alpha<ArrowUpRight size={16} /></a>],
            ['Oliskey Labs', 'Custom software and research projects are priced per project.', <Link key="l" to="/contact?topic=partnership&product=labs" className="btn-secondary">Talk to us</Link>],
          ].map(([n, d, a]) => (
            <div key={n as string} data-reveal className="flex flex-col gap-4 bg-raised p-6 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="text-[17px] font-semibold text-ink">{n}</p><p className="mt-1 text-[15px] text-muted">{d}</p></div>{a}
            </div>
          ))}
        </div>
      </PageTop>
      <CTA />
    </>
  );
};
export default Pricing;
