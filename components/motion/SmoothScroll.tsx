import { useEffect } from 'react';
import { prefersReducedMotion } from './Reveal';

// Apple-style smooth scrolling for mouse wheels and trackpads: the page glides to where the wheel sends it instead of
// jumping in steps, so the scroll-played scenes move like film. Touch scrolling stays native (phones already glide).
// Off under Reduce Motion. Loaded on its own small chunk after the page is ready.
const SmoothScroll = () => {
  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null, raf = 0, gone = false;
    import('lenis').then(({ default: Lenis }) => {
      if (gone) return;
      lenis = new Lenis({ duration: 1.05, easing: (t: number) => 1 - Math.pow(1 - t, 3.2), wheelMultiplier: 1 });
      const loop = (t: number) => { lenis!.raf(t); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
    });
    return () => { gone = true; cancelAnimationFrame(raf); lenis?.destroy(); };
  }, []);
  return null;
};

export default SmoothScroll;
