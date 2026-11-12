import React from 'react';
import { Link } from 'react-router-dom';

// The account call to action that closes most pages.
const CTA: React.FC<{ title?: string; text?: string }> = ({ title = 'Create your Oliskey account', text = 'Reach more customers, work smarter and grow your business. One account, ready in a minute.' }) => (
  <section className="page-x py-20 md:py-28">
    <div className="relative overflow-hidden rounded-[28px] bg-navy px-6 py-14 text-center text-white sm:px-12 md:py-20">
      <div aria-hidden className="absolute inset-0 opacity-60" style={{ background: 'radial-gradient(60% 80% at 50% 0%, rgba(31,107,255,0.55), transparent 70%)' }} />
      <div className="relative mx-auto max-w-[620px]">
        <h2 className="text-title">{title}</h2>
        <p className="mt-4 text-lead text-white/80">{text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/get-started" className="btn bg-white text-navy hover:bg-white/90">Create your account</Link>
          <Link to="/products" className="btn border border-white/30 text-white hover:bg-white/10">See the products</Link>
        </div>
      </div>
    </div>
  </section>
);
export default CTA;
