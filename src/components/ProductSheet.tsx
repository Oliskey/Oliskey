import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, X } from 'lucide-react';
import { productById, type ProductId } from '../lib/products';
import ThemedImage from './ThemedImage';

// Opens when a visitor clicks a product display in the 3D headquarters (or one of the showroom buttons).
const ProductSheet: React.FC<{ id: ProductId | null; onClose: () => void }> = ({ id, onClose }) => {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current; if (!d) return;
    if (id && !d.open) d.showModal();
    if (!id && d.open) d.close();
  }, [id]);
  const p = id ? productById(id) : null;
  return (
    <dialog ref={ref} onClose={onClose} onClick={(e) => e.target === ref.current && onClose()}
      className="m-auto w-[min(560px,calc(100vw-24px))] overflow-hidden rounded-[28px] border border-line bg-raised p-0 text-ink shadow-2xl backdrop:bg-navy/45 backdrop:backdrop-blur-sm open:route-enter">
      {p && (
        <div>
          <div className="relative aspect-[16/9] bg-surface">
            <ThemedImage light={p.shots.light} dark={p.shots.dark} alt={`${p.name} screen`} className="h-full w-full object-cover object-top" eager />
            <button type="button" onClick={onClose} aria-label="Close" className="glass absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full text-ink"><X size={18} /></button>
          </div>
          <div className="p-6 sm:p-7">
            <p className="eyebrow">{p.audience}</p>
            <h2 className="mt-2 text-[26px] font-bold tracking-tight">{p.name}</h2>
            <p className="mt-3 text-[16px] leading-relaxed text-muted">{p.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to={p.path} className="btn-primary" onClick={onClose}>Explore {p.name.replace('Oliskey ', '')}</Link>
              {p.app && <a href={p.app.url} target="_blank" rel="noreferrer" className="btn-secondary">{p.app.label}<ArrowUpRight size={16} /></a>}
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
};
export default ProductSheet;
