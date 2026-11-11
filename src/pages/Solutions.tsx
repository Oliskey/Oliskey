import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PageTop, SectionHead } from '../components/Section';
import CTA from '../components/CTA';
import { SOLUTIONS } from '../lib/content';
import { useReveal } from '../lib/reveal';

const Solutions: React.FC = () => {
  useReveal();
  return (
    <>
      <PageTop>
        <SectionHead as="h1" eyebrow="Solutions" title="Start from the job you need done" lead="Tell us what you are trying to do. Each job below maps to one Oliskey product." />
        <ol className="mt-14 grid gap-5 md:grid-cols-2">
          {SOLUTIONS.map((s, i) => (
            <li key={s.title} data-reveal>
              <Link to={s.to} className="group flex h-full flex-col rounded-card border border-line bg-raised p-6 transition-shadow hover:shadow-[0_24px_50px_-30px_rgb(var(--shadow)/0.5)] sm:p-8">
                <span className="text-[13px] font-semibold tabular-nums text-faint">0{i + 1}</span>
                <h2 className="mt-3 text-section text-ink">{s.title}</h2>
                <p className="mt-3 flex-1 text-[16px] leading-relaxed text-muted">{s.text}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-semibold text-accent-ink">{s.product}<ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" /></span>
              </Link>
            </li>
          ))}
        </ol>
      </PageTop>
      <CTA />
    </>
  );
};
export default Solutions;
