import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { PerformanceMonitor, useGLTF } from '@react-three/drei';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import scales from './lightmaps.json';
import type { Stop, Zone } from './stops';

// The live Oliskey headquarters. Architecture comes from Blender as GLB with light baked in (one lightmap per zone for day,
// one for night), so the browser only multiplies colour by stored light — realistic and cheap on phones.
// Props: which zones to load, the camera stops, a ref holding the scroll position in "stops", and a click handler for displays.

export type Mode = 'day' | 'night';
export interface WorldProps {
  zones: readonly Zone[];
  stops: Stop[];
  progress: React.MutableRefObject<number>;
  mode: Mode;
  phone: boolean;
  active: boolean;
  onSelect?: (id: string) => void;
  onReady?: () => void;
  snap?: boolean;
}

const LM_SIZE: Record<Zone, number> = { hq: 2048, school: 1024, fleet: 1024, alpha: 1024, labs: 1024 };
const SCALES = scales as Record<string, number>;
const loader = new THREE.TextureLoader();
const texCache = new Map<string, THREE.Texture>();
function tex(url: string, srgb = true, flip = false) {
  let t = texCache.get(url);
  if (!t) {
    t = loader.load(url);
    t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    t.flipY = flip; t.anisotropy = 4;
    texCache.set(url, t);
  }
  return t;
}

/** Which picture each display shows. Product screenshots follow the theme (white app by day, dark app by night). */
export function screenImage(name: string, mode: Mode): string | null {
  const v = mode === 'day' ? 'light' : 'dark';
  if (name.startsWith('logo_')) return '/hq/tex/logo_sign.webp';
  for (const pid of ['school', 'fleet', 'alpha']) {
    if (name === `screen_lobby_${pid}` || name === `screen_${pid}_main` || (pid === 'school' && name.startsWith('screen_school_tab')))
      return `/products/${pid}-${v}.webp`;
  }
  if (name === 'screen_lobby_labs' || name === 'screen_labs_main') return '/hq/tex/labs_main.webp';
  if (name.startsWith('screen_labs_dev')) return '/hq/tex/labs_dev.webp';
  if (name === 'screen_fleet_map') return '/hq/tex/fleet_map.webp';
  if (name === 'screen_alpha_wall1') return '/hq/tex/alpha_wall1.webp';
  if (name === 'screen_alpha_wall2') return '/hq/tex/alpha_wall2.webp';
  if (name.startsWith('screen_alpha_mon')) return '/hq/tex/alpha_mon.webp';
  return null;
}
/** Displays you can click, and the product each one opens. */
export function displayTarget(name: string): string | null {
  const m = /^screen_(?:lobby_)?(school|fleet|alpha|labs)(?:_main)?$/.exec(name);
  return m ? m[1] : null;
}

const lmUrl = (z: Zone, mode: Mode, phone: boolean) => `/hq/lm/${z}-${mode}${phone && LM_SIZE[z] > 1024 ? '-1k' : ''}.webp`;

const ZoneModel: React.FC<{ zone: Zone; mode: Mode; phone: boolean; hover: string | null }> = ({ zone, mode, phone, hover }) => {
  const { scene } = useGLTF(`/hq/glb/${zone}.glb`);
  const { scene: root } = useThree();

  // one-time material setup
  const parts = useMemo(() => {
    const statics: THREE.MeshStandardMaterial[] = [];
    const screens: { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial }[] = [];
    const lamps: THREE.MeshBasicMaterial[] = [];
    const leds: THREE.MeshBasicMaterial[] = [];
    const glass: THREE.MeshStandardMaterial[] = [];
    const water: THREE.MeshStandardMaterial[] = [];
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const owner = mesh.name.replace(/_\d+$/, '');
      const parentName = mesh.parent?.name ?? '';
      const name = owner.startsWith('Mesh') || owner === '' ? parentName : owner;
      mesh.matrixAutoUpdate = false; mesh.updateMatrix();
      if (name === 'far' || parentName === 'far') { mesh.visible = false; return; }
      if (name.startsWith(`${zone}_static`) || parentName.startsWith(`${zone}_static`)) {
        const m = mesh.material as THREE.MeshStandardMaterial;
        if (!statics.includes(m)) statics.push(m);
        return;
      }
      if (name.endsWith('_lamps')) { const m = new THREE.MeshBasicMaterial({ color: 0xffffff }); mesh.material = m; lamps.push(m); return; }
      if (name.endsWith('_leds')) { const m = new THREE.MeshBasicMaterial({ color: 0x3d86ff }); mesh.material = m; leds.push(m); return; }
      if (name.endsWith('_glass')) {
        const m = new THREE.MeshStandardMaterial({ color: 0xdbe8ff, roughness: 0.04, metalness: 0.0, transparent: true, opacity: 0.14, depthWrite: false, envMapIntensity: 1.2 });
        mesh.material = m; mesh.renderOrder = 2; glass.push(m); return;
      }
      if (name === 'water') {
        const m = new THREE.MeshStandardMaterial({ color: 0x0e2a4a, roughness: 0.06, metalness: 0.85, envMapIntensity: 1.0 });
        mesh.material = m; water.push(m); return;
      }
      if (name.startsWith('screen_') || name.startsWith('logo_')) {
        const m = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
        mesh.material = m; mesh.userData.display = displayTarget(name); mesh.userData.screen = name;
        screens.push({ mesh, mat: m });
      }
    });
    return { statics, screens, lamps, leds, glass, water };
  }, [scene, zone]);

  // light, screens and glass follow the time of day
  useEffect(() => {
    const lm = tex(lmUrl(zone, mode, phone));
    const k = (SCALES[`${zone}-${mode}`] ?? 1) * Math.PI;
    for (const m of parts.statics) {
      m.lightMap = lm; m.lightMapIntensity = k;
      m.envMapIntensity = m.roughness < 0.5 ? (mode === 'day' ? 0.35 : 0.18) : 0.04;
      m.needsUpdate = true;
    }
    for (const { mesh, mat } of parts.screens) {
      const url = screenImage(mesh.userData.screen, mode);
      if (url) { mat.map = tex(url); mat.needsUpdate = true; }
      mat.color.setScalar(mode === 'day' ? 0.92 : 0.85);
    }
    for (const m of parts.lamps) m.color.setScalar(mode === 'day' ? 1.6 : 3.2);
    for (const m of parts.leds) m.color.set(0x3d86ff).multiplyScalar(mode === 'day' ? 1.0 : 2.6);
    for (const m of parts.glass) { m.opacity = mode === 'day' ? 0.16 : 0.08; m.color.set(mode === 'day' ? 0xdbe8ff : 0x9fb6e0); }
    // prefetch the other time of day so a theme switch is instant
    const other: Mode = mode === 'day' ? 'night' : 'day';
    const idle = window.setTimeout(() => tex(lmUrl(zone, other, phone)), 2500);
    return () => window.clearTimeout(idle);
  }, [mode, parts, zone, phone, root]);

  useEffect(() => {
    for (const { mesh, mat } of parts.screens) {
      if (!mesh.userData.display) continue;
      mat.color.setScalar(hover === mesh.userData.screen ? 1.15 : mode === 'day' ? 0.92 : 0.85);
    }
  }, [hover, parts, mode]);

  return <primitive object={scene} />;
};

/** Sky, ground and distant hills, drawn in code so every page has the same surroundings without loading the plaza. */
const Surroundings: React.FC<{ mode: Mode }> = ({ mode }) => {
  const { scene, gl } = useThree();
  const sky = useMemo(() => {
    const c = document.createElement('canvas'); c.width = 4; c.height = 256;
    return { c, t: new THREE.CanvasTexture(c) };
  }, []);
  const hills = useMemo(() => {
    const g = new THREE.SphereGeometry(1, 32, 12);
    return [[-140, 160, 70, 18], [60, 210, 90, 24], [190, 90, 60, 14], [-200, 20, 55, 12], [150, -120, 50, 10], [-120, -150, 60, 12]].map(([x, y, r, h]) => ({ g, p: [x, -1, -y] as V, s: [r, h, r] as V }));
  }, []);
  useEffect(() => {
    const ctx = sky.c.getContext('2d')!;
    const gr = ctx.createLinearGradient(0, 0, 0, 256);
    if (mode === 'day') { gr.addColorStop(0, '#2f6fd8'); gr.addColorStop(0.55, '#86b3ec'); gr.addColorStop(1, '#dce9f7'); }
    else { gr.addColorStop(0, '#02050f'); gr.addColorStop(0.6, '#0a1a3a'); gr.addColorStop(1, '#1a2f5a'); }
    ctx.fillStyle = gr; ctx.fillRect(0, 0, 4, 256);
    sky.t.colorSpace = THREE.SRGBColorSpace; sky.t.needsUpdate = true;
    scene.background = sky.t;
    scene.fog = new THREE.Fog(mode === 'day' ? 0xd6e4f4 : 0x0b1730, 90, 420);
    gl.toneMappingExposure = mode === 'day' ? 1.55 : 1.0;
  }, [mode, scene, gl, sky]);
  const grass = mode === 'day' ? 0x5e8a3c : 0x0f1d17;
  const hill = mode === 'day' ? 0x6f8f58 : 0x0d1a1a;
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.08, -40]}><planeGeometry args={[900, 900]} /><meshBasicMaterial color={grass} /></mesh>
      {hills.map((h, i) => <mesh key={i} geometry={h.g} position={h.p} scale={h.s}><meshBasicMaterial color={hill} /></mesh>)}
    </group>
  );
};
type V = [number, number, number];

/** Camera that glides along the stops as the page scrolls; drag or move the pointer to look around a little. */
const Rig: React.FC<{ stops: Stop[]; progress: React.MutableRefObject<number>; phone: boolean; snap?: boolean; look: React.MutableRefObject<{ x: number; y: number }> }> = ({ stops, progress, phone, snap, look }) => {
  const { camera, size } = useThree();
  const path = useMemo(() => {
    const shots = stops.map((s) => (phone && s.phone) || s.desk);
    const eye = new THREE.CatmullRomCurve3(shots.map((s) => new THREE.Vector3(...s.eye)), false, 'centripetal');
    // via points keep looking where the next real stop looks
    const ats = shots.map((s, i) => {
      if (!stops[i].via) return new THREE.Vector3(...s.at);
      const next = stops.slice(i).find((x) => !x.via) ?? stops[stops.length - 1];
      return new THREE.Vector3(...((phone && next.phone) || next.desk).at);
    });
    const at = new THREE.CatmullRomCurve3(ats, false, 'centripetal');
    const fov = shots.map((s, i) => (stops[i].via ? 0 : s.fov));
    const real = stops.map((s, i) => (s.via ? -1 : i)).filter((i) => i >= 0);
    return { eye, at, fov, real, n: stops.length };
  }, [stops, phone]);
  const shown = useRef(progress.current);
  const tmp = useMemo(() => ({ e: new THREE.Vector3(), a: new THREE.Vector3(), d: new THREE.Vector3(), side: new THREE.Vector3() }), []);

  useFrame((_, dt) => {
    const goal = Math.max(0, Math.min(path.real.length - 1, progress.current));
    const k = snap ? 1 : 1 - Math.pow(0.0009, Math.min(dt, 0.05));   // frame-rate independent glide
    shown.current += (goal - shown.current) * k;
    const s = shown.current, i = Math.min(path.real.length - 2, Math.floor(s)), f = s - i;
    const ci0 = path.real[i], ci1 = path.real[Math.min(i + 1, path.real.length - 1)];
    const ci = ci0 + (ci1 - ci0) * f;
    const t = ci / (path.n - 1);
    path.eye.getPoint(t, tmp.e); path.at.getPoint(t, tmp.a);
    const fov = path.fov[ci0] + (path.fov[ci1] - path.fov[ci0]) * f;
    // look-around: yaw/pitch offset around the eye
    tmp.d.subVectors(tmp.a, tmp.e);
    const yaw = look.current.x * 0.32, pitch = -look.current.y * 0.16;
    tmp.d.applyAxisAngle(THREE.Object3D.DEFAULT_UP, -yaw);
    tmp.side.crossVectors(tmp.d, THREE.Object3D.DEFAULT_UP).normalize();
    tmp.d.applyAxisAngle(tmp.side, pitch);
    camera.position.copy(tmp.e);
    camera.lookAt(tmp.a.copy(tmp.e).add(tmp.d));
    const cam = camera as THREE.PerspectiveCamera;
    if (Math.abs(cam.fov - fov) > 0.01 || cam.aspect !== size.width / size.height) { cam.fov = fov; cam.aspect = size.width / size.height; cam.updateProjectionMatrix(); }
  });
  return null;
};

const Env: React.FC = () => {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const env = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => { env.dispose(); pm.dispose(); };
  }, [gl, scene]);
  return null;
};

const Ready: React.FC<{ onReady?: () => void }> = ({ onReady }) => {
  const done = useRef(false);
  useFrame(() => { if (!done.current) { done.current = true; requestAnimationFrame(() => onReady?.()); } });
  return null;
};

const World: React.FC<WorldProps> = ({ zones, stops, progress, mode, phone, active, onSelect, onReady, snap }) => {
  const [dpr, setDpr] = useState(phone ? 1.5 : Math.min(1.75, window.devicePixelRatio || 1));
  const [hover, setHover] = useState<string | null>(null);
  const look = useRef({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; lx: number; ly: number } | null>(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // pointer parallax (mouse) and drag-to-look (mouse and touch); the view springs back when you let go
    let raf = 0;
    const tick = () => {
      look.current.x += (target.current.x - look.current.x) * 0.08;
      look.current.y += (target.current.y - look.current.y) * 0.08;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const move = (e: PointerEvent) => {
      if (drag.current) {
        target.current.x = Math.max(-1, Math.min(1, drag.current.lx + (e.clientX - drag.current.x) / (window.innerWidth * 0.5)));
        target.current.y = Math.max(-1, Math.min(1, drag.current.ly + (e.clientY - drag.current.y) / (window.innerHeight * 0.7)));
      } else if (e.pointerType === 'mouse') {
        target.current.x = (e.clientX / window.innerWidth - 0.5) * 0.25;
        target.current.y = (e.clientY / window.innerHeight - 0.5) * 0.2;
      }
    };
    const up = () => { drag.current = null; target.current.x = 0; target.current.y = 0; };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); };
  }, []);

  const pick = (e: ThreeEvent<PointerEvent | MouseEvent>) => {
    const hit = e.intersections.find((i) => (i.object as THREE.Mesh).userData?.display);
    return hit ? (hit.object.userData as { display: string; screen: string }) : null;
  };

  return (
    <Canvas
      className="!absolute inset-0"
      style={{ touchAction: 'pan-y' }}
      frameloop={active ? 'always' : 'never'}
      dpr={dpr}
      gl={{ antialias: !phone, powerPreference: 'high-performance', toneMapping: THREE.AgXToneMapping, outputColorSpace: THREE.SRGBColorSpace }}
      camera={{ fov: 50, near: 0.1, far: 900, position: [0, 3, 40] }}
      onPointerDown={(e) => { drag.current = { x: e.clientX, y: e.clientY, lx: target.current.x, ly: target.current.y }; }}
      onPointerMissed={() => setHover(null)}
      aria-hidden
    >
      <PerformanceMonitor onDecline={() => setDpr((d) => Math.max(1, d - 0.25))} />
      <Env />
      <Surroundings mode={mode} />
      <group
        onPointerMove={(e) => { const d = pick(e); setHover(d?.screen ?? null); document.body.style.cursor = d ? 'pointer' : ''; }}
        onPointerOut={() => { setHover(null); document.body.style.cursor = ''; }}
        onClick={(e) => { const d = pick(e); if (d && onSelect && (!drag.current || Math.abs(e.nativeEvent.clientX - drag.current.x) < 6)) { e.stopPropagation(); onSelect(d.display); } }}
      >
        {zones.map((z) => (
          <Suspense key={z} fallback={null}><ZoneModel zone={z} mode={mode} phone={phone} hover={hover} /></Suspense>
        ))}
      </group>
      <Rig stops={stops} progress={progress} phone={phone} snap={snap} look={look} />
      <Suspense fallback={null}><ZoneGate zone={zones[0]} onReady={onReady} /></Suspense>
    </Canvas>
  );
};

/** Signals "ready" once the first zone (the one the camera starts in) has loaded and drawn. */
const ZoneGate: React.FC<{ zone: Zone; onReady?: () => void }> = ({ zone, onReady }) => {
  useGLTF(`/hq/glb/${zone}.glb`);
  return <Ready onReady={onReady} />;
};

export default World;
