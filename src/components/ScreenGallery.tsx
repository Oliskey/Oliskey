import React from 'react';
import ThemedImage from './ThemedImage';
import type { RoleScreens } from '../lib/products';

// Every role of a product with three of its real screens, each on a phone.
// Phones: the role's name and summary, then its three screens in a row that scrolls sideways.
// Wide screens: the role on the left, its three phones side by side on the right.
const ScreenGallery: React.FC<{ name: string; roles: RoleScreens[] }> = ({ name, roles }) => (
  <div className="mt-12 space-y-16 md:mt-16 md:space-y-24">
    {roles.map((r) => (
      <section key={r.role} aria-label={`${name} for ${r.role}`} className="md:grid md:grid-cols-[minmax(0,260px)_1fr] md:gap-10 lg:gap-14">
        <div className="md:pt-6">
          <p className="eyebrow">{r.eyebrow}</p>
          <h3 className="mt-2 text-[24px] font-semibold leading-tight tracking-[-0.5px] text-ink md:text-[28px]">{r.role}</h3>
          <p className="mt-3 max-w-[460px] text-[15px] leading-relaxed text-muted">{r.summary}</p>
        </div>
        <div className="-mx-4 mt-7 overflow-x-auto px-4 pb-3 [scrollbar-width:none] md:mx-0 md:mt-0 md:overflow-visible md:px-0" tabIndex={0} aria-label={`${r.role} screens`}>
          <ul className="flex snap-x snap-mandatory gap-5 md:grid md:grid-cols-3 md:gap-6">
            {r.screens.map((s) => (
              <li key={s.light} className="w-[210px] shrink-0 snap-start md:w-auto">
                <div className="rounded-[30px] bg-[#111216] p-[6px] shadow-[0_30px_60px_-36px_rgb(var(--shadow)/0.7)] ring-1 ring-black/5 dark:ring-white/10">
                  <div className="overflow-hidden rounded-[25px] bg-surface">
                    <ThemedImage light={s.light} dark={s.dark} alt={`${name}, ${r.role}: ${s.title}`} className="block aspect-[390/844] w-full object-cover object-top" />
                  </div>
                </div>
                <h4 className="mt-4 text-[16px] font-semibold leading-snug text-ink">{s.title}</h4>
                <p className="mt-1 text-[14px] leading-relaxed text-muted">{s.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    ))}
  </div>
);
export default ScreenGallery;
