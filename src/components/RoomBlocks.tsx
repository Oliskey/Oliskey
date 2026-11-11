import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { StopBlock } from '../three/Journey';
import { CONTACT, productById, type ProductId } from '../lib/products';

/** The three text blocks for a product room: introduction, what it does, inside the room. Used on Home and product pages. */
export const RoomBlocks: React.FC<{ id: ProductId; onShow: () => void; heading?: 'h1' | 'h2' }> = ({ id, onShow, heading = 'h1' }) => {
  const p = productById(id);
  const Icon = p.icon;
  const H = heading;
  const primary = <Link to="/get-started" className="btn-primary">Create your account<ArrowRight size={16} /></Link>;
  const secondary = p.app
    ? <a href={p.app.url} target="_blank" rel="noreferrer" className="btn-secondary">{p.app.label}<ArrowUpRight size={16} /></a>
    : <a href={`mailto:${CONTACT.email}?subject=Oliskey%20Labs`} className="btn-secondary">Talk to us</a>;
  return (
    <>
        <StopBlock tall={heading === 'h1'}>
          <div className="scene-panel w-full p-6 sm:p-8 md:w-[540px]">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-[14px] text-white" style={{ background: p.tint }}><Icon size={22} /></span>
              <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">{p.audience}</p>
            </div>
            <H className="mt-5 text-title text-ink">{p.name}</H>
            <p className="mt-2 text-[20px] font-medium tracking-tight text-ink/80">{p.tagline}</p>
            <p className="mt-4 text-[16px] leading-relaxed text-muted sm:text-[17px]">{p.description}</p>
            <div className="mt-7 flex flex-wrap gap-3">{primary}{secondary}</div>
          </div>
        </StopBlock>
        <StopBlock align="right">
          <div className="scene-panel w-full p-6 sm:p-7 md:w-[460px]">
            <p className="eyebrow">What it does</p>
            <ul className="mt-4 grid gap-4">
              {p.points.map((pt) => (
                <li key={pt.title} className="flex gap-3">
                  <Check size={18} className="mt-0.5 shrink-0 text-accent" strokeWidth={2.4} />
                  <div><p className="text-[16px] font-semibold text-ink">{pt.title}</p><p className="mt-0.5 text-[15px] leading-relaxed text-muted">{pt.text}</p></div>
                </li>
              ))}
            </ul>
          </div>
        </StopBlock>
        <StopBlock align="right">
          <div className="scene-panel w-full p-6 sm:p-7 md:w-[440px]">
            <p className="eyebrow">Inside the room</p>
            <p className="mt-3 text-[18px] font-medium leading-relaxed text-ink">{p.room}</p>
            <button type="button" onClick={onShow} className="btn-secondary mt-5">See the app on the display</button>
          </div>
        </StopBlock>
    </>
  );
};
