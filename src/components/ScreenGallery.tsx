import React from 'react';
import ThemedImage from './ThemedImage';
import type { Screen } from '../lib/products';

// Real screens of a product, one per role, each in the device that role uses (phone, tablet or computer).
// One row that scrolls sideways on phones; on wide screens the screens wrap onto more rows.
const FRAME: Record<Screen['kind'], { w: string; frame: string; radius: string }> = {
  phone: { w: 'w-[232px] md:w-[236px]', frame: 'rounded-[34px] p-[7px]', radius: 'rounded-[28px]' },
  tablet: { w: 'w-[300px] md:w-[340px]', frame: 'rounded-[26px] p-[9px]', radius: 'rounded-[18px]' },
  desktop: { w: 'w-[min(86vw,560px)] md:w-[520px]', frame: 'rounded-[16px] p-[6px] pt-[18px]', radius: 'rounded-[10px]' },
};

const ScreenGallery: React.FC<{ name: string; screens: Screen[] }> = ({ name, screens }) => (
  <div className="-mx-4 mt-10 overflow-x-auto px-4 pb-4 [scrollbar-width:none] md:mx-0 md:overflow-visible md:px-0" tabIndex={0} aria-label={`${name} screens`}>
    <ul className="flex snap-x snap-mandatory items-start gap-6 md:flex-wrap md:gap-x-8 md:gap-y-14">
      {screens.map((s) => {
        const f = FRAME[s.kind];
        return (
          <li key={s.light} className={`${f.w} shrink-0 snap-start`}>
            <div className={`relative bg-[#111216] shadow-[0_30px_60px_-36px_rgb(var(--shadow)/0.7)] ring-1 ring-black/5 dark:ring-white/10 ${f.frame}`}>
              {s.kind === 'desktop' && <span aria-hidden className="absolute left-[10px] top-[6px] flex gap-[5px]">{[0, 1, 2].map((i) => <i key={i} className="block h-[6px] w-[6px] rounded-full bg-white/25" />)}</span>}
              <div className={`overflow-hidden bg-surface ${f.radius}`}>
                <ThemedImage light={s.light} dark={s.dark} alt={`${name}: ${s.title}`} className="block w-full" />
              </div>
            </div>
            <p className="eyebrow mt-5">{s.role}</p>
            <h3 className="mt-2 text-[18px] font-semibold leading-snug tracking-[-0.3px] text-ink">{s.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.text}</p>
          </li>
        );
      })}
    </ul>
  </div>
);
export default ScreenGallery;
