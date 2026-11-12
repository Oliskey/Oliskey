import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Check } from 'lucide-react';
import { PageTop, SectionHead } from '../components/Section';
import CTA from '../components/CTA';
import { productById } from '../lib/products';
import { useReveal } from '../lib/reveal';

// Oliskey School: priced per child per term (owner's current pricing).
const SCHOOL = [
  { name: 'Free', price: '₦0', per: 'per child per term', points: ['Start at no cost', 'Upgrade when your school is ready'] },
  { name: 'Basic', price: '₦1,000', per: 'per child per term', points: ['Billed per term, per child', 'Pay with Paystack'] },
  { name: 'Advanced', price: '₦3,000', per: 'per child per term', points: ['Everything in Basic', 'Includes AI features'] },
];

const Pricing: React.FC = () => {
  useReveal();
  const fleet = productById('fleet'), alpha = productById('alpha');
  return (
    <>
      <PageTop>
        <SectionHead as="h1" eyebrow="Pricing" title="Simple pricing for schools" lead="Oliskey School is priced per child, per term. Register with no upfront payment and pay from next term." />
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {SCHOOL.map((t, i) => (
            <div key={t.name} data-reveal className={`flex flex-col rounded-card border p-6 sm:p-7 ${i === 1 ? 'border-accent bg-raised shadow-[0_24px_60px_-34px_rgb(var(--accent)/0.6)]' : 'border-line bg-raised'}`}>
              <p className="text-[17px] font-semibold text-ink">{t.name}</p>
              <p className="mt-4 text-[34px] font-bold tracking-tight tabular-nums text-ink">{t.price}</p>
              <p className="text-[14px] text-muted">{t.per}</p>
              <ul className="mt-5 grid gap-2 border-t border-line pt-5">{t.points.map((pt) => <li key={pt} className="flex gap-2 text-[15px] text-ink"><Check size={17} className="mt-0.5 shrink-0 text-accent" />{pt}</li>)}</ul>
            </div>
          ))}
        </div>
        <p data-reveal className="mt-6 rounded-2xl bg-accent/10 px-5 py-4 text-[15px] text-ink"><b>Founding schools:</b> the first 100 schools keep their price for 12 months. You can delete your school’s account at any time.</p>
        <div data-reveal className="mt-8 flex flex-wrap gap-3">
          <Link to="/contact?topic=quote&product=school" className="btn-primary">Get a quote for your school</Link>
          <Link to="/school" className="btn-secondary">About Oliskey School</Link>
        </div>

        <h2 data-reveal className="mt-24 text-section text-ink">Other products</h2>
        <div className="mt-6 grid gap-px overflow-hidden rounded-card border border-line bg-line">
          {[
            [fleet.name, 'Pricing depends on the size of your fleet. Message us and we will set you up.', <Link key="f" to="/contact?topic=quote&product=fleet" className="btn-secondary">Get a quote</Link>],
            [alpha.name, 'Practice runs on demo credits. Open the app to start.', <a key="a" href={alpha.app!.url} target="_blank" rel="noreferrer" className="btn-secondary">Open Oliskey Alpha<ArrowUpRight size={16} /></a>],
            ['Oliskey Lab', 'Plans for businesses are being finalised — try the demo, or talk to us about custom work.', <Link key="l" to="/contact?topic=partnership&product=labs" className="btn-secondary">Talk to us</Link>],
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
