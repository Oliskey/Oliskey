import React from 'react';
// @ts-ignore
import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail } from 'lucide-react';
import Logo from './Logo';
import { useTheme } from '../context/ThemeContext';
import { PRODUCTS } from '../data/products';

// Footer: the brand line, every product (its page here and its app), the company links and how to reach us.
const COMPANY = [
  { to: '/products', label: 'Products' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'Our Story' },
  { to: '/blog', label: 'Insights' },
  { to: '/contact', label: 'Contact' },
];

const Footer: React.FC = () => {
  const { theme } = useTheme();
  const logoVariant = theme === 'dark' ? 'light' : 'dark';
  const link = 'text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white';

  return (
    <footer className="border-t border-gray-100 bg-white transition-colors duration-300 dark:border-white/5 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_.7fr_1fr]">
          <div>
            <Logo className="h-10" variant={logoVariant} />
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500 dark:text-slate-400">Practical software, automated workflows and useful AI that make work feel lighter.</p>
          </div>

          {/* every product, linked from every page (helps people and search engines find each one) */}
          <nav aria-label="Oliskey products">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Products</p>
            <ul className="mt-4 space-y-3">
              {PRODUCTS.map(({ id, name, detailsUrl, appUrl, icon: Icon }) => (
                <li key={id} className="flex items-center justify-between gap-3">
                  <Link to={detailsUrl} className={`inline-flex items-center gap-2 ${link}`}><Icon size={16} /> {name}</Link>
                  <a href={appUrl} target="_blank" rel="noopener" aria-label={`Open ${name}`} className="inline-flex min-h-8 items-center gap-1 rounded-full border border-gray-200 px-2.5 text-xs font-semibold text-slate-600 transition-colors hover:border-blue-300 hover:text-blue-700 dark:border-white/10 dark:text-slate-300 dark:hover:text-blue-300">Open <ArrowUpRight size={12} /></a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Company</p>
            <ul className="mt-4 space-y-3">{COMPANY.map((c) => <li key={c.to}><Link to={c.to} className={link}>{c.label}</Link></li>)}</ul>
          </nav>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Talk to us</p>
            <a href="mailto:oliskeylee@gmail.com" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-800 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400"><Mail size={16} /> oliskeylee@gmail.com</a>
            <Link to="/contact" className="mt-5 flex min-h-11 w-fit items-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-blue-600 dark:bg-white dark:text-slate-950 dark:hover:bg-blue-100">Tell us what you need <ArrowUpRight size={15} /></Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-6 dark:border-white/5 sm:flex-row">
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">&copy; {new Date().getFullYear()} Oliskeylee Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="text-xs text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
