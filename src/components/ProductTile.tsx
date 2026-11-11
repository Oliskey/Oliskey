import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Product } from '../lib/products';
import ThemedImage from './ThemedImage';

// One card per product: the product's room at headquarters (day or night), name, one line, and one action.
const ProductTile: React.FC<{ p: Product }> = ({ p }) => {
  const Icon = p.icon;
  return (
    <Link to={p.path} className="group flex flex-col overflow-hidden rounded-card border border-line bg-raised transition-shadow duration-200 hover:shadow-[0_24px_50px_-30px_rgb(var(--shadow)/0.5)]">
      <div className="relative aspect-[16/9] overflow-hidden bg-surface">
        <ThemedImage light={p.shots.light} dark={p.shots.dark} alt={`${p.name} dashboard`}
          className="h-full w-full object-cover object-left-top transition-transform duration-500 ease-glide group-hover:scale-[1.03]" />
      </div>
      <div className="flex flex-1 items-start gap-4 p-5 sm:p-6">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] text-white" style={{ background: p.tint }}><Icon size={21} strokeWidth={2} /></span>
        <div className="min-w-0 flex-1">
          <h3 className="text-[19px] font-semibold tracking-tight text-ink">{p.name}</h3>
          <p className="mt-1 text-[15px] leading-snug text-muted">{p.tagline}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-semibold text-accent-ink">Enter the {p.name.replace('Oliskey ', '')} world <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" /></span>
        </div>
      </div>
    </Link>
  );
};
export default ProductTile;
