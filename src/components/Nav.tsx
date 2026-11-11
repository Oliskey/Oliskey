import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, Moon, Sun, X } from 'lucide-react';
import Logo from './Logo';
import { useTheme } from '../lib/theme';
import { useAuth } from '../lib/auth';

export const NAV = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/solutions', label: 'Solutions' },
  { to: '/industries', label: 'Industries' },
  { to: '/resources', label: 'Resources' },
  { to: '/about', label: 'About' },
  { to: '/pricing', label: 'Pricing' },
];

export const ThemeSwitch: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';
  return (
    <button type="button" onClick={toggle} aria-label={dark ? 'Switch to light mode (day)' : 'Switch to dark mode (night)'} title={dark ? 'Day' : 'Night'}
      className={`relative grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5 ${className}`}>
      {dark ? <Sun size={19} strokeWidth={2} /> : <Moon size={19} strokeWidth={2} />}
    </button>
  );
};

// Floating glass bar over every page. Desktop shows all sections; smaller screens open a sheet.
const Nav: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { session } = useAuth();
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', k); document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [open]);

  const link = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-3 py-2 text-[14px] font-medium transition-colors ${isActive ? 'text-ink' : 'text-muted hover:text-ink'}`;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-[max(10px,env(safe-area-inset-top))] sm:px-5">
      <nav aria-label="Main" className="glass pointer-events-auto mx-auto flex h-[60px] max-w-[1240px] items-center gap-2 rounded-full pl-5 pr-2">
        <Link to="/" aria-label="Oliskey home" className="mr-2 flex shrink-0 items-center text-ink"><Logo className="h-7" /></Link>
        <div className="hidden flex-1 items-center justify-center gap-0.5 lg:flex">
          {NAV.map((n) => <NavLink key={n.to} to={n.to} end={n.to === '/'} className={link}>{n.label}</NavLink>)}
        </div>
        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <ThemeSwitch />
          {session
            ? <Link to="/account" className="btn-quiet hidden sm:inline-flex">Account</Link>
            : <Link to="/sign-in" className="btn-quiet hidden sm:inline-flex">Sign in</Link>}
          <Link to="/get-started" className="btn-primary hidden h-11 min-h-0 px-5 sm:inline-flex">Get started</Link>
          <button type="button" className="grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-ink/5 lg:hidden" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {open && (
        <div className="pointer-events-auto fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm route-enter" onClick={() => setOpen(false)} />
          <div className="route-enter absolute inset-x-3 top-[max(10px,env(safe-area-inset-top))] rounded-[28px] border border-line bg-raised p-3 shadow-2xl">
            <div className="flex h-[52px] items-center justify-between pl-3">
              <Logo className="h-7 text-ink" />
              <button type="button" className="grid h-11 w-11 place-items-center rounded-full text-ink hover:bg-ink/5" aria-label="Close menu" onClick={() => setOpen(false)}><X size={20} /></button>
            </div>
            <ul className="mt-1 grid">
              {NAV.map((n) => (
                <li key={n.to}><NavLink to={n.to} end={n.to === '/'} className={({ isActive }) => `flex min-h-[48px] items-center rounded-2xl px-4 text-[17px] font-medium ${isActive ? 'bg-surface text-ink' : 'text-ink/85 hover:bg-surface'}`}>{n.label}</NavLink></li>
              ))}
            </ul>
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-line pt-3">
              {session ? <Link to="/account" className="btn-secondary">Account</Link> : <Link to="/sign-in" className="btn-secondary">Sign in</Link>}
              <Link to="/get-started" className="btn-primary">Get started</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Nav;
