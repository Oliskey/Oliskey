import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, ChevronDown } from 'lucide-react';
import Journey, { StopBlock } from '../three/Journey';
import { homeStops, type Zone } from '../three/stops';
import { RoomBlocks } from '../components/RoomBlocks';
import ProductSheet from '../components/ProductSheet';
import ProductTile from '../components/ProductTile';
import ThemedImage from '../components/ThemedImage';
import CTA from '../components/CTA';
import { SectionHead } from '../components/Section';
import { PRODUCTS, productById, type ProductId } from '../lib/products';
import { useReveal } from '../lib/reveal';

const Panel: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`scene-panel w-full p-6 sm:p-7 md:w-[440px] ${className}`}>{children}</div>
);

/** The closing scene of a world: what it changes, and the way to its own page for the full story. */
const WorldFinale: React.FC<{ id: ProductId; onOther: () => void }> = ({ id, onOther }) => {
  const p = productById(id);
  const Icon = p.icon;
  return (
    <StopBlock tall align="center">
      <div className="scene-panel w-full overflow-hidden md:w-[620px]">
        <div className="relative aspect-[16/8] bg-surface">
          <ThemedImage light={p.shots.light} dark={p.shots.dark} alt={`${p.name} dashboard`} className="h-full w-full object-cover object-left-top" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-raised via-raised/10 to-transparent" />
        </div>
        <div className="-mt-10 p-6 sm:p-8">
          <span className="relative grid h-12 w-12 place-items-center rounded-[14px] text-white shadow-lg" style={{ background: p.tint }}><Icon size={22} /></span>
          <h2 className="mt-4 text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-[34px]">From manual to digital with {p.name}</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {p.points.map((pt) => <li key={pt.title} className="flex items-start gap-2 text-[15px] text-ink"><Check size={17} className="mt-0.5 shrink-0 text-accent" />{pt.title}</li>)}
          </ul>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to={p.path} className="btn-primary">Learn more about {p.name.replace('Oliskey ', '')}<ArrowRight size={16} /></Link>
            <button type="button" onClick={onOther} className="btn-secondary">Choose another world</button>
          </div>
        </div>
      </div>
    </StopBlock>
  );
};

const Home: React.FC = () => {
  const [sheet, setSheet] = useState<ProductId | null>(null);
  const [params, setParams] = useSearchParams();
  const pick = params.get('room');
  const room = (PRODUCTS.some((p) => p.id === pick) ? pick : null) as ProductId | null;
  useReveal();
  // only the showroom building and the chosen world are loaded: worlds never see each other, and phones keep memory free
  const zones = useMemo<Zone[]>(() => (room ? ['hq', room] : ['hq']), [room]);
  const stops = useMemo(() => homeStops(room), [room]);
  // choosing a world only selects it: the camera moves when the visitor scrolls, never on its own
  const choose = (id: ProductId) => setParams({ room: id }, { replace: true, preventScrollReset: true });
  return (
    <>
      <Journey zones={zones} stops={stops}
        onSelect={(id) => (id === room ? setSheet(id as ProductId) : choose(id as ProductId))}
        label={`A walk through the Oliskey headquarters${room ? ` into the ${productById(room).name} world` : ''}`}>
        {/* 1 · the entrance */}
        <StopBlock tall shade>
          <div className="relative w-full max-w-[640px]">
            
            <div className="scene-panel relative z-10 p-6 md:border-0 md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-0">
              <p className="eyebrow">Welcome to Oliskey</p>
              <h1 className="mt-3 text-[30px] font-bold leading-[1.06] tracking-[-0.03em] text-ink md:mt-4 md:text-display">We turn manual work into digital business.</h1>
              <p className="mt-3 max-w-[520px] text-[15px] leading-relaxed text-muted md:mt-5 md:text-lead">Oliskey moves schools, transport operators and traders from paper and local reach to online systems — so they work faster and reach more customers.</p>
              <div className="mt-5 flex flex-wrap gap-3 md:mt-8">
                <Link to="/get-started" className="btn-primary">Create your account<ArrowRight size={16} /></Link>
                <a href="#showroom" className="btn-secondary">Explore the products</a>
              </div>
            </div>
            <p className="relative z-10 mt-10 hidden items-center gap-2 text-[14px] font-medium text-muted md:flex"><ChevronDown size={16} className="animate-bounce" />Scroll to go inside</p>
          </div>
        </StopBlock>

        {/* 2 · at the glass doors: choose a world before going in */}
        <StopBlock id="showroom" align="center">
          <Panel className="md:w-[520px]">
            <p className="eyebrow">From manual to digital</p>
            <h2 className="mt-3 text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-[32px]">Choose the world you want to explore.</h2>
            <p className="mt-3 text-[16px] leading-relaxed text-muted">Each Oliskey product turns paper, notebooks and phone calls into one clear system. Pick a world, keep scrolling — the doors open and you walk in.</p>
            <div className="mt-5 grid grid-cols-2 gap-2" role="group" aria-label="Worlds">
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

        {/* 3 · inside the showroom, on the way to the chosen world */}
        {room && (
          <StopBlock align="right" key={`${room}-lobby`}>
            <Panel>
              <p className="eyebrow">Welcome inside</p>
              <h2 className="mt-3 text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-[32px]">The Oliskey showroom</h2>
              <p className="mt-3 text-[16px] leading-relaxed text-muted">Every product has its own screen here. We are heading to the {productById(room).name} world.</p>
            </Panel>
          </StopBlock>
        )}

        {room && (
          <>
            <StopBlock align="right" key={`${room}-preview`}>
              <Panel>
                <p className="eyebrow">Your world</p>
                <h2 className="mt-3 text-[28px] font-bold leading-tight tracking-tight text-ink sm:text-[32px]">{productById(room).name}</h2>
                <p className="mt-3 text-[16px] leading-relaxed text-muted">{productById(room).tagline}. Keep scrolling to step inside.</p>
                <ChevronDown size={20} className="mt-4 animate-bounce text-accent" />
              </Panel>
            </StopBlock>
            <RoomBlocks key={room} id={room} heading="h2" onShow={() => setSheet(room)} />
            <WorldFinale id={room} onOther={() => { setParams({}, { replace: true, preventScrollReset: true }); document.getElementById('showroom')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }} />
          </>
        )}
      </Journey>

      <ProductSheet id={sheet} onClose={() => setSheet(null)} />

      {/* after the walk: the other worlds, then the account call to action (details live on each product's own page) */}
      <section className="relative bg-page py-20 md:py-28">
        <div className="page-x">
          <div data-reveal><SectionHead eyebrow="Oliskey worlds" title={room ? 'Explore another world' : 'Every product is a world'} lead="Each one turns a manual way of working into a digital one." /></div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">{PRODUCTS.filter((p) => p.id !== room).map((p) => <div key={p.id} data-reveal><ProductTile p={p} /></div>)}</div>
        </div>
      </section>

      <CTA />
    </>
  );
};

export default Home;
