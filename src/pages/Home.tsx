import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, ChevronDown } from 'lucide-react';
import Journey, { StopBlock } from '../three/Journey';
import { homeStops, type Zone } from '../three/stops';
import { RoomBlocks } from '../components/RoomBlocks';
import ProductSheet from '../components/ProductSheet';
import ProductTile from '../components/ProductTile';
import CTA from '../components/CTA';
import { SectionHead } from '../components/Section';
import { CONTACT, PRODUCTS, productById, type ProductId } from '../lib/products';
import { SOLUTIONS, INDUSTRIES } from '../lib/content';
import { useReveal } from '../lib/reveal';

const Panel: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`scene-panel w-full p-6 sm:p-7 md:w-[440px] ${className}`}>{children}</div>
);

const Home: React.FC = () => {
  const [sheet, setSheet] = useState<ProductId | null>(null);
  const [params, setParams] = useSearchParams();
  const pick = params.get('room');
  const room = (PRODUCTS.some((p) => p.id === pick) ? pick : null) as ProductId | null;
  const [justChose, setJustChose] = useState(false);
  useReveal();
  // the chosen room decides the rest of the walk: which zones load and where the camera goes after the showroom
  const ORDER: ProductId[] = ['school', 'fleet', 'alpha', 'labs'];
  const zones = useMemo<Zone[]>(() => ['hq', ...(room ? ORDER.slice(0, ORDER.indexOf(room) + 1) : [])], [room]);
  const stops = useMemo(() => homeStops(room), [room]);
  const choose = (id: ProductId) => { setParams({ room: id }, { replace: true, preventScrollReset: true }); setJustChose(true); };
  useEffect(() => {
    if (!justChose) return;
    setJustChose(false);
    // after choosing, glide on to the room's first block
    requestAnimationFrame(() => document.querySelectorAll<HTMLElement>('[data-stop]')[3]?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' }));
  }, [justChose, room]);
  return (
    <>
      <Journey zones={zones} stops={stops} stills={['outside', 'entrance', 'lobby', ...(room ? [room, room, room] : [])]}
        onSelect={(id) => (id === room ? setSheet(id as ProductId) : choose(id as ProductId))}
        label={`A walk through the Oliskey headquarters${room ? ` into the ${productById(room).name} room` : ''}`}>
        {/* 1 · the entrance */}
        <StopBlock tall top>
          <div className="relative w-full max-w-[640px]">
            <div aria-hidden className="absolute -inset-x-[40vw] -inset-y-24 -z-10 hidden bg-[radial-gradient(closest-side,rgb(var(--page)/0.82),rgb(var(--page)/0.55)_55%,transparent)] md:block" />
            <div className="scene-panel p-6 md:border-0 md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-0">
              <p className="eyebrow">Welcome to Oliskey</p>
              <h1 className="mt-3 text-[34px] font-bold leading-[1.06] tracking-[-0.03em] text-ink md:mt-4 md:text-display">Technology for education, transport, finance and innovation.</h1>
              <p className="mt-3 max-w-[520px] text-[16px] leading-relaxed text-muted md:mt-5 md:text-lead">Software that helps schools, transport operators and people learning to trade work with less paperwork and more clarity.</p>
              <div className="mt-5 flex flex-wrap gap-3 md:mt-8">
                <Link to="/get-started" className="btn-primary">Create your account<ArrowRight size={16} /></Link>
                <a href="#showroom" className="btn-secondary">Explore the products</a>
              </div>
            </div>
            <p className="mt-10 hidden items-center gap-2 text-[14px] font-medium text-muted md:flex"><ChevronDown size={16} className="animate-bounce" />Scroll to walk inside</p>
          </div>
        </StopBlock>

        {/* 2 · stepping in */}
        <StopBlock align="center">
          <Panel className="md:w-[480px] md:text-center">
            <p className="eyebrow">The headquarters</p>
            <h2 className="mt-3 text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-[32px]">One company. Four products under one roof.</h2>
            <p className="mt-3 text-[16px] leading-relaxed text-muted sm:text-[17px]">Every Oliskey product has its own room. Walk through each one to see what it does.</p>
          </Panel>
        </StopBlock>

        {/* 3 · the showroom */}
        <StopBlock id="showroom" align="right">
          <Panel>
            <p className="eyebrow">The showroom</p>
            <h2 className="mt-3 text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-[32px]">Choose a room to explore.</h2>
            <p className="mt-3 text-[16px] leading-relaxed text-muted">Select a screen in the showroom or pick below, then keep scrolling to walk inside.</p>
            <div className="mt-5 grid grid-cols-2 gap-2" role="group" aria-label="Rooms">
              {PRODUCTS.map((p) => {
                const Icon = p.icon;
                const on = room === p.id;
                return (
                  <button key={p.id} type="button" aria-pressed={on} onClick={() => choose(p.id)}
                    className={`flex min-h-[48px] items-center gap-2.5 rounded-2xl border px-3 text-left text-[14px] font-semibold transition-colors ${on ? 'border-accent bg-accent/10 text-ink' : 'border-line bg-raised text-ink hover:bg-surface'}`}>
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[9px] text-white" style={{ background: p.tint }}><Icon size={15} /></span>
                    <span className="flex-1">{p.name.replace('Oliskey ', '')}</span>{on && <Check size={16} className="text-accent" />}
                  </button>
                );
              })}
            </div>
          </Panel>
        </StopBlock>

        {room && <RoomBlocks key={room} id={room} heading="h2" onShow={() => setSheet(room)} />}
      </Journey>

      <ProductSheet id={sheet} onClose={() => setSheet(null)} />

      {/* after the walk: everything in one calm, scannable place */}
      <section className="relative bg-page py-20 md:py-28">
        <div className="page-x">
          <div data-reveal><SectionHead eyebrow="Our products" title="Explore the Oliskey product world" lead="Four products, each with its own place at headquarters." /></div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">{PRODUCTS.map((p) => <div key={p.id} data-reveal><ProductTile p={p} /></div>)}</div>
        </div>
      </section>

      <section className="bg-surface py-20 md:py-28">
        <div className="page-x grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div data-reveal><SectionHead eyebrow="Solutions" title="Start from the job you need done" lead="Pick what you are trying to do; we point you to the right product." /></div>
          <ul className="grid gap-px overflow-hidden rounded-card border border-line bg-line">
            {SOLUTIONS.map((s) => (
              <li key={s.title} data-reveal className="bg-raised">
                <Link to={s.to} className="group flex items-center gap-4 p-5 transition-colors hover:bg-surface sm:p-6">
                  <div className="min-w-0 flex-1"><h3 className="text-[17px] font-semibold text-ink">{s.title}</h3><p className="mt-1 text-[15px] text-muted">{s.text}</p></div>
                  <ArrowRight size={18} className="shrink-0 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-ink" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="page-x">
          <div data-reveal><SectionHead eyebrow="Industries" title="Built for the places we know" /></div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {INDUSTRIES.map((i) => {
              const Icon = i.icon;
              return (
                <div key={i.title} data-reveal>
                  <Icon size={26} className="text-accent" strokeWidth={1.8} />
                  <h3 className="mt-4 text-[18px] font-semibold text-ink">{i.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{i.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-line py-20 md:py-28">
        <div className="page-x grid gap-10 lg:grid-cols-2">
          <div data-reveal><SectionHead eyebrow="About Oliskey" title="A software company in Lagos" lead={`${CONTACT.company} designs and builds the Oliskey products — from the screens people tap to the systems behind them.`} /></div>
          <dl data-reveal className="grid content-start gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2">
            {[['Company', CONTACT.company], ['Based in', CONTACT.city], ['Live products', 'School, Fleet, Alpha'], ['In research', 'Oliskey Labs']].map(([k, v]) => (
              <div key={k} className="bg-raised p-5 sm:p-6"><dt className="text-[13px] font-medium text-muted">{k}</dt><dd className="mt-1 text-[18px] font-semibold text-ink">{v}</dd></div>
            ))}
          </dl>
        </div>
      </section>

      <CTA />
    </>
  );
};

export default Home;
