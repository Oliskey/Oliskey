import React from 'react';
import { PageTop, SectionHead } from '../components/Section';
import ProductTile from '../components/ProductTile';
import CTA from '../components/CTA';
import { CONTACT, PRODUCTS } from '../lib/products';
import { useReveal } from '../lib/reveal';

const About: React.FC = () => {
  useReveal();
  return (
    <>
      <PageTop>
        <SectionHead as="h1" eyebrow="About" title="Bring your business to the world" lead={`Our goal is to help every business reach more customers, work smarter and grow. ${CONTACT.company} is a software company in ${CONTACT.city}. We design and build every Oliskey product ourselves — the screens people use and the systems behind them.`} />
        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {[
            ['What we believe', 'Good software removes steps. If a screen needs explaining, we simplify it.'],
            ['How we work', 'We start from how a school, an operator or a learner really works today, then build the shortest path to the result.'],
            ['What we make', 'Products for education, transport and trading practice, and Oliskey Lab, which builds, connects and grows any business online.'],
          ].map(([t, d]) => (
            <div key={t} data-reveal><h2 className="text-[19px] font-semibold text-ink">{t}</h2><p className="mt-3 text-[16px] leading-relaxed text-muted">{d}</p></div>
          ))}
        </div>
      </PageTop>
      <section className="border-t border-line bg-surface py-20">
        <div className="page-x">
          <div data-reveal><SectionHead title="Our products" /></div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">{PRODUCTS.map((p) => <div key={p.id} data-reveal><ProductTile p={p} /></div>)}</div>
        </div>
      </section>
      <CTA />
    </>
  );
};
export default About;
