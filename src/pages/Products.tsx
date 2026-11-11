import React from 'react';
import { PageTop, SectionHead } from '../components/Section';
import ProductTile from '../components/ProductTile';
import CTA from '../components/CTA';
import { PRODUCTS } from '../lib/products';
import { useReveal } from '../lib/reveal';

const Products: React.FC = () => {
  useReveal();
  return (
    <>
      <PageTop>
        <SectionHead as="h1" eyebrow="Products" title="Explore the Oliskey product world" lead="Software for schools, transport operators and people learning to trade — and a lab for what comes next." />
        <div className="mt-14 grid gap-5 sm:grid-cols-2">{PRODUCTS.map((p) => <div key={p.id} data-reveal><ProductTile p={p} /></div>)}</div>
      </PageTop>
      <CTA />
    </>
  );
};
export default Products;
