import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { CONTACT, PRODUCTS } from '../lib/products';

const Col: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div><h2 className="text-[13px] font-semibold text-ink">{title}</h2><ul className="mt-3 grid gap-2 text-[14px] text-muted">{children}</ul></div>
);
const A: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <li>{to.startsWith('http') || to.startsWith('mailto:') ? <a href={to} className="hover:text-ink" {...(to.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>{children}</a> : <Link to={to} className="hover:text-ink">{children}</Link>}</li>
);

const Footer: React.FC = () => (
  <footer className="border-t border-line bg-surface">
    <div className="page-x grid gap-10 py-14 md:grid-cols-[1.3fr_repeat(3,1fr)]">
      <div className="max-w-[300px]">
        <Logo className="h-7 text-ink" />
        <p className="mt-4 text-[14px] leading-relaxed text-muted">Bring your business to the world and reach more customers. Software for schools, transport operators and traders, built in {CONTACT.city}.</p>
      </div>
      <Col title="Products">{PRODUCTS.map((p) => <A key={p.id} to={p.path}>{p.name}</A>)}</Col>
      <Col title="Company"><A to="/about">About</A><A to="/solutions">Solutions</A><A to="/industries">Industries</A><A to="/pricing">Pricing</A></Col>
      <Col title="Get in touch"><A to="/contact">Contact & support</A><A to="/resources">Resources</A><A to={`mailto:${CONTACT.email}`}>Email us</A><A to={CONTACT.whatsapp}>WhatsApp</A><A to="/get-started">Create an account</A></Col>
    </div>
    <div className="page-x flex flex-col gap-2 border-t border-line py-6 text-[13px] text-muted sm:flex-row sm:justify-between">
      <p>© {new Date().getFullYear()} {CONTACT.company} All rights reserved.</p>
      <p>{CONTACT.city}</p>
    </div>
  </footer>
);
export default Footer;
