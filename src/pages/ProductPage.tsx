import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Journey from '../three/Journey';
import { RoomBlocks } from '../components/RoomBlocks';
import { ROOM_STOPS } from '../three/stops';
import ProductSheet from '../components/ProductSheet';
import ProductTile from '../components/ProductTile';
import ThemedImage from '../components/ThemedImage';
import ScreenGallery from '../components/ScreenGallery';
import CTA from '../components/CTA';
import { SectionHead } from '../components/Section';
import { PRODUCTS, productById, type ProductId } from '../lib/products';
import { useReveal } from '../lib/reveal';

// One page per product. The top is a walk through the product's own room at headquarters; below it, the real app.
const ProductPage: React.FC<{ id: ProductId }> = ({ id }) => {
  const p = productById(id);
  const [sheet, setSheet] = useState<ProductId | null>(null);
  useReveal(id);
  const primary = <Link to="/get-started" className="btn-primary">Create your account<ArrowRight size={16} /></Link>;
  const secondary = p.app
    ? <a href={p.app.url} target="_blank" rel="noreferrer" className="btn-secondary">{p.app.label}<ArrowUpRight size={16} /></a>
    : <Link to="/contact?topic=partnership&product=labs" className="btn-secondary">Talk to us</Link>;

  return (
    <>
      <Journey key={id} zones={[id]} stops={ROOM_STOPS[id]} onSelect={(x) => setSheet(x as ProductId)} label={`The ${p.name} room: ${p.room}`}>
        <RoomBlocks id={id} onShow={() => setSheet(id)} />
      </Journey>
      <ProductSheet id={sheet} onClose={() => setSheet(null)} />

      <section className="py-20 md:py-28">
        <div className="page-x">
          <div data-reveal><SectionHead eyebrow={p.app ? 'The real app' : 'At the lab'} title={p.app ? `This is ${p.name}` : 'Where new Oliskey products begin'} lead={p.app ? 'Shown with sample data. It follows your light or dark setting.' : undefined} /></div>
          <div data-reveal className="mt-10 overflow-hidden rounded-[24px] border border-line bg-surface shadow-[0_40px_80px_-50px_rgb(var(--shadow)/0.6)]">
            <ThemedImage light={p.shots.light} dark={p.shots.dark} alt={p.app ? `${p.name} with sample data` : 'The Oliskey Labs room'} className="w-full" />
          </div>
          <div data-reveal className="mt-8 flex flex-wrap gap-3">{primary}{secondary}</div>
        </div>
      </section>

      {p.roles && (
        <section className="border-t border-line py-20 md:py-28">
          <div className="page-x">
            <div data-reveal><SectionHead eyebrow="Every role, its own screen" title={`Who uses ${p.name}, and how`} lead="Every role has its own app. Three real screens from each, with sample data." /></div>
            <div data-reveal><ScreenGallery name={p.name} roles={p.roles} /></div>
          </div>
        </section>
      )}

      <section className="border-t border-line bg-surface py-20 md:py-24">
        <div className="page-x">
          <div data-reveal><SectionHead title="More from Oliskey" /></div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">{PRODUCTS.filter((x) => x.id !== id).map((x) => <div key={x.id} data-reveal><ProductTile p={x} /></div>)}</div>
        </div>
      </section>
      <CTA />
    </>
  );
};
export default ProductPage;
