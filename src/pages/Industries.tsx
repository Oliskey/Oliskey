import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PageTop, SectionHead } from '../components/Section';
import CTA from '../components/CTA';
import { INDUSTRIES } from '../lib/content';
import { useReveal } from '../lib/reveal';

const Industries: React.FC = () => {
  useReveal();
  return (
    <>
      <PageTop>
        <SectionHead as="h1" eyebrow="Industries" title="Built for the places we know" lead="Each Oliskey product starts from how work is really done in one industry." />
        <div className="mt-14 grid gap-px overflow-hidden rounded-card border border-line bg-line">
          {INDUSTRIES.map((i) => {
            const Icon = i.icon;
            return (
              <section key={i.title} data-reveal className="grid gap-4 bg-raised p-6 sm:p-8 md:grid-cols-[220px_1fr_auto] md:items-start md:gap-10">
                <div className="flex items-center gap-3"><Icon size={24} className="text-accent" strokeWidth={1.8} /><h2 className="text-[19px] font-semibold text-ink">{i.title}</h2></div>
                <p className="max-w-read text-[16px] leading-relaxed text-muted">{i.detail}</p>
                <Link to={i.to} className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-accent-ink hover:underline">See the product<ArrowRight size={16} /></Link>
              </section>
            );
          })}
        </div>
      </PageTop>
      <CTA />
    </>
  );
};
export default Industries;
