import React, { useEffect, useRef } from 'react';
import { prefersReducedMotion } from './Reveal';

// A card that sits in 3D space: it leans toward the mouse, its content floats a little above its surface, and a soft
// light follows the pointer across it. Mouse/trackpad only (touch keeps cards flat and still); off under Reduce Motion.
// Writes transforms straight to the element once per frame; nothing re-renders.
type Props = React.HTMLAttributes<HTMLElement> & { as?: keyof JSX.IntrinsicElements; max?: number; glare?: boolean; children: React.ReactNode };

const Tilt3D: React.FC<Props> = ({ as = 'div', max = 7, glare = true, className = '', children, style, ...rest }) => {
  const el = useRef<HTMLElement>(null);
  const light = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = el.current;
    if (!node || prefersReducedMotion() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let raf = 0, tx = 0, ty = 0, x = 0, y = 0, gx = 50, gy = 50, on = false;
    const tick = () => {
      x += (tx - x) * 0.14; y += (ty - y) * 0.14;
      node.style.transform = `perspective(1100px) rotateX(${y.toFixed(2)}deg) rotateY(${x.toFixed(2)}deg) translateZ(${on ? 8 : 0}px)`;
      if (light.current) { light.current.style.opacity = on ? '1' : '0'; light.current.style.background = `radial-gradient(420px circle at ${gx}% ${gy}%, var(--tilt-glare), transparent 60%)`; }
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.01 ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const r = node.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      tx = (px - 0.5) * 2 * max; ty = (0.5 - py) * 2 * max; gx = px * 100; gy = py * 100; on = true; kick();
    };
    const leave = () => { tx = 0; ty = 0; on = false; kick(); };
    node.addEventListener('pointermove', move);
    node.addEventListener('pointerleave', leave);
    return () => { node.removeEventListener('pointermove', move); node.removeEventListener('pointerleave', leave); cancelAnimationFrame(raf); };
  }, [max]);

  const Tag = as as any;
  return (
    <Tag ref={el} className={`tilt-3d relative [transform-style:preserve-3d] ${className}`} style={style} {...rest}>
      {children}
      {glare && <span ref={light} aria-hidden className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit] opacity-0 transition-opacity duration-300" />}
    </Tag>
  );
};

export default Tilt3D;
