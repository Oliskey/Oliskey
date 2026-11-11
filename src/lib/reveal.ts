import { useEffect } from 'react';

// Elements marked data-reveal rise 24px and fade in once as they scroll into view (GSAP ScrollTrigger).
// Reduce Motion: shown immediately. GSAP loads on demand so text pages stay light.
export function useReveal(dep: unknown = null) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let kill = () => {};
    let live = true;
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      if (!live) return;
      gsap.registerPlugin(ScrollTrigger);
      const els = gsap.utils.toArray<HTMLElement>('[data-reveal]');
      const tweens = els.map((el) => gsap.fromTo(el, { autoAlpha: 0, y: 24 }, {
        autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      }));
      kill = () => tweens.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); });
    })();
    return () => { live = false; kill(); };
  }, [dep]);
}
