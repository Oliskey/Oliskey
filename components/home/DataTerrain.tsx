import React, { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../motion/Reveal';

// The hero's floor: a real 3D field of data points (three.js) rolling slowly like a landscape, seen from above at an angle,
// with a few brighter points travelling across it like work moving through a system. Colours follow the site theme.
// Loaded after the page is interactive (never delays the first paint), drawn only while on screen and the tab is visible,
// capped pixel ratio. Reduce Motion / Save-Data / no WebGL: nothing is drawn (the CSS dot grid under it remains).
const COLS = 110, ROWS = 56, GAP = 0.4;

const DataTerrain: React.FC<{ className?: string }> = ({ className = '' }) => {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el || prefersReducedMotion() || (navigator as any).connection?.saveData) return;
    let disposed = false, cleanup = () => {};
    const start = async () => {
      const THREE = await import('./threeLite');
      if (disposed) return;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try { renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'low-power' }); } catch { return; }
      renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1));
      renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      // low over the field, looking toward the horizon, so the rolling surface reads as a landscape
      const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
      const LOOK = [0, 0.4, -7] as const;
      camera.position.set(0, 3.4, 10.5);
      camera.lookAt(...LOOK);

      // round, soft points (a plain point is a square)
      const dot = document.createElement('canvas'); dot.width = dot.height = 64;
      const g = dot.getContext('2d')!, grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255,255,255,1)'); grad.addColorStop(0.45, 'rgba(255,255,255,0.9)'); grad.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = grad; g.fillRect(0, 0, 64, 64);
      const sprite = new THREE.CanvasTexture(dot);

      // the field
      const n = COLS * ROWS, pos = new Float32Array(n * 3), base = new Float32Array(n * 2);
      for (let j = 0, k = 0; j < ROWS; j++) for (let i = 0; i < COLS; i++, k++) {
        const x = (i - (COLS - 1) / 2) * GAP, z = (j - (ROWS - 1) / 2) * GAP;
        base[k * 2] = x; base[k * 2 + 1] = z; pos[k * 3] = x; pos[k * 3 + 2] = z;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({ size: 0.09, map: sprite, sizeAttenuation: true, transparent: true, depthWrite: false });
      scene.add(new THREE.Points(geo, mat));

      // work moving through it: bright points riding the surface along the rows
      const RUN = 18, runPos = new Float32Array(RUN * 3), runs = Array.from({ length: RUN }, (_, i) => ({ row: (i * 7 + 3) % ROWS, speed: 0.6 + ((i * 37) % 10) / 12, off: (i * 53) % COLS }));
      const runGeo = new THREE.BufferGeometry();
      runGeo.setAttribute('position', new THREE.BufferAttribute(runPos, 3));
      const runMat = new THREE.PointsMaterial({ size: 0.3, map: sprite, sizeAttenuation: true, transparent: true, depthWrite: false });
      scene.add(new THREE.Points(runGeo, runMat));

      const height = (x: number, z: number, t: number) => Math.sin(x * 0.38 + t * 0.5) * 0.55 + Math.cos(z * 0.45 - t * 0.38) * 0.4 + Math.sin((x + z) * 0.2 + t * 0.28) * 0.35;

      const paint = () => {
        const dark = document.documentElement.classList.contains('dark');
        mat.color.set(dark ? '#60a5fa' : '#2563eb'); mat.opacity = dark ? 0.6 : 0.5;
        runMat.color.set(dark ? '#a5b4fc' : '#4f46e5'); runMat.opacity = dark ? 0.95 : 0.8;
      };
      paint();
      const themeWatch = new MutationObserver(paint);
      themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

      const size = () => { const w = el.clientWidth, h = el.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
      size();
      const ro = new ResizeObserver(size); ro.observe(el);

      let visible = true, raf = 0, last = performance.now(), t = 0, mx = 0, cx = 0;
      const frame = (now: number) => {
        raf = 0;
        if (!visible || document.hidden) return;
        t += Math.min(0.05, (now - last) / 1000); last = now;
        for (let k = 0; k < n; k++) pos[k * 3 + 1] = height(base[k * 2], base[k * 2 + 1], t);
        geo.attributes.position.needsUpdate = true;
        runs.forEach((r, i) => {
          const col = ((r.off + t * r.speed * 6) % COLS + COLS) % COLS;
          const x = (col - (COLS - 1) / 2) * GAP, z = (r.row - (ROWS - 1) / 2) * GAP;
          runPos[i * 3] = x; runPos[i * 3 + 1] = height(x, z, t) + 0.05; runPos[i * 3 + 2] = z;
        });
        runGeo.attributes.position.needsUpdate = true;
        cx += (mx - cx) * 0.04;                          // the camera drifts a little toward the mouse
        camera.position.x = cx * 1.6; camera.lookAt(...LOOK);
        renderer.render(scene, camera);
        raf = requestAnimationFrame(frame);
      };
      const go = () => { if (!raf && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } };
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; go(); });
      io.observe(el);
      const onVis = () => go();
      const onMove = (e: PointerEvent) => { if (e.pointerType === 'mouse') mx = e.clientX / window.innerWidth - 0.5; };
      document.addEventListener('visibilitychange', onVis);
      window.addEventListener('pointermove', onMove, { passive: true });
      go();
      setReady(true);

      cleanup = () => {
        cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); themeWatch.disconnect();
        document.removeEventListener('visibilitychange', onVis); window.removeEventListener('pointermove', onMove);
        geo.dispose(); mat.dispose(); sprite.dispose(); runGeo.dispose(); runMat.dispose(); renderer.dispose(); renderer.domElement.remove();
      };
    };
    // wait until the page is idle so the hero text and buttons are ready first
    const ric = (window as any).requestIdleCallback as ((cb: () => void, o?: any) => number) | undefined;
    const id = ric ? ric(start, { timeout: 1500 }) : window.setTimeout(start, 600);
    return () => { disposed = true; ric ? (window as any).cancelIdleCallback?.(id) : clearTimeout(id); cleanup(); };
  }, []);

  return <div ref={host} aria-hidden className={`pointer-events-none transition-opacity duration-[1200ms] ${ready ? 'opacity-100' : 'opacity-0'} ${className}`} />;
};

export default DataTerrain;
