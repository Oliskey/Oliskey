import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { PerformanceMonitor, useGLTF } from '@react-three/drei';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { GroundedSkybox } from 'three/examples/jsm/objects/GroundedSkybox.js';
import propsJson from './props.json';
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

const EXPOSURE = { day: Number(new URLSearchParams(location.search).get('exp') || 0.8), night: Number(new URLSearchParams(location.search).get('expn') || 0.75) };
/** Reflection maps per time of day (photographic HDRI by day; the room-light environment at night). */
const ENV: Record<Mode, THREE.Texture | null> = { day: null, night: null };
const Effects = React.lazy(() => import('./Effects'));
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

/** Lightmaps: no mipmaps — lower mip levels would mix neighbouring UV islands and show blotches at grazing angles. */
function lightmap(url: string) {
  const t = tex(url);
  t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; t.magFilter = THREE.LinearFilter; t.anisotropy = 1;
  return t;
}
/** Surface detail on the second UV set (world scale, 1 unit = 1 m). Real scans (wood, grass) carry their own colour, so the
 *  material colour becomes a tint; the procedural ones (stone joints, paving, plaster) multiply the material colour. */
const SURF: Record<string, { f: string; m: number; tint?: number; rough?: string }> = {
  floor_wood: { f: 'wood_real', m: 2.4, tint: 1.0, rough: 'wood_rough' }, floor_dark: { f: 'wood_real', m: 2.4, tint: 0.55, rough: 'wood_rough' },
  wood: { f: 'wood_real', m: 1.6, tint: 0.85 }, wood_light: { f: 'wood_real', m: 1.6, tint: 1.25 },
  floor_stone: { f: 'stone', m: 2.4 }, stair: { f: 'stone', m: 2.4 }, plaza: { f: 'pavers', m: 4.8 }, plaza_light: { f: 'pavers', m: 4.8 },
  plaster: { f: 'plaster', m: 3 }, plaster_warm: { f: 'plaster', m: 3 }, ceiling: { f: 'plaster', m: 3 }, floor_epoxy: { f: 'epoxy', m: 2 },
  grass: { f: 'grass_real', m: 4, tint: 1.0 }, hedge: { f: 'grass_real', m: 1.5, tint: 0.7 },
};
const surfCache = new Map<string, THREE.Texture>();
function tiled(file: string, metres: number, srgb = true) {
  const key = `${file}@${metres}`;
  let t = surfCache.get(key);
  if (!t) {
    t = loader.load(`/hq/surf/${file}.webp`);
    t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(1 / metres, 1 / metres); t.channel = 1; t.anisotropy = 8;
    surfCache.set(key, t);
  }
  return t;
}
function applySurface(m: THREE.MeshStandardMaterial) {
  const s = SURF[m.name]; if (!s) return;
  m.map = tiled(s.f, s.m);
  if (s.tint !== undefined) m.color.setScalar(s.tint);
  if (s.rough) { m.roughnessMap = tiled(s.rough, s.m, false); m.roughness = 1; }
  m.needsUpdate = true;
}
const lmUrl = (z: Zone, mode: Mode, phone: boolean) => `/hq/lm/${z}-${mode}${phone && LM_SIZE[z] > 1024 ? '-1k' : ''}.webp`;

const ZoneModel: React.FC<{ zone: Zone; mode: Mode; phone: boolean; hover: string | null; envVer: number }> = ({ zone, mode, phone, hover, envVer }) => {
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
        if (!statics.includes(m)) {
          statics.push(m);
          if (mesh.geometry.getAttribute('uv1')) applySurface(m);
        }
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
    const lm = lightmap(lmUrl(zone, mode, phone));
    const k = (SCALES[`${zone}-${mode}`] ?? 1) * Number(new URLSearchParams(location.search).get('lmk') || Math.PI) * EXPOSURE[mode];   // exposure lives in the light, so it holds with or without the effects pass
    for (const m of parts.statics) {
      m.lightMap = lm; m.lightMapIntensity = k;
      const glossy = m.roughness < 0.5 || !!m.roughnessMap || m.metalness > 0.5;
      m.envMap = glossy ? ENV[mode] : null;
      m.envMapIntensity = m.metalness > 0.5 ? (mode === 'day' ? 0.7 : 0.35) : mode === 'day' ? 0.12 : 0.05;
      m.needsUpdate = true;
    }
    for (const { mesh, mat } of parts.screens) {
      const url = screenImage(mesh.userData.screen, mode);
      if (url) { mat.map = tex(url); mat.needsUpdate = true; }
      mat.color.setScalar(mode === 'day' ? 0.92 : 0.85);
    }
    for (const m of parts.lamps) m.color.setScalar(mode === 'day' ? 1.6 : 3.2);
    for (const m of parts.leds) m.color.set(0x3d86ff).multiplyScalar(mode === 'day' ? 1.0 : 2.6);
    for (const m of [...parts.glass, ...parts.water]) { m.envMap = ENV[mode]; m.needsUpdate = true; }
    for (const m of parts.glass) { m.opacity = mode === 'day' ? 0.16 : 0.08; m.color.set(mode === 'day' ? 0xdbe8ff : 0x9fb6e0); }
    // prefetch the other time of day so a theme switch is instant
    const other: Mode = mode === 'day' ? 'night' : 'day';
    const idle = window.setTimeout(() => lightmap(lmUrl(zone, other, phone)), 2500);
    return () => window.clearTimeout(idle);
  }, [mode, parts, zone, phone, root, envVer]);

  useEffect(() => {
    for (const { mesh, mat } of parts.screens) {
      if (!mesh.userData.display) continue;
      mat.color.setScalar(hover === mesh.userData.screen ? 1.15 : mode === 'day' ? 0.92 : 0.85);
    }
  }, [hover, parts, mode]);

  return <primitive object={scene} />;
};

/** Surroundings: the same photographic HDRI used for lighting in Blender, projected onto a ground dome so the horizon,
 *  trees and sky sit at a believable distance (a park by day, a starlit sky with town glow at night). */
const Surroundings: React.FC<{ mode: Mode }> = ({ mode }) => {
  const { scene, gl } = useThree();
  const [bg, setBg] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    let live = true;
    new THREE.TextureLoader().load(`/hq/env/${mode}-bg.jpg`, (t) => {
      if (!live) return;
      t.colorSpace = THREE.SRGBColorSpace; t.mapping = THREE.EquirectangularReflectionMapping;
      setBg(t);
    });
    gl.toneMappingExposure = 1;
    scene.background = new THREE.Color(mode === 'day' ? 0xa9c4e6 : 0x05080f);
    scene.fog = null;
    return () => { live = false; };
  }, [mode, scene, gl]);
  const sky = useMemo(() => {
    if (!bg) return null;
    const m = new GroundedSkybox(bg, 18, 420);
    m.position.y = 18 - 0.25; m.rotation.y = SKY_ROT;
    (m.material as THREE.MeshBasicMaterial).toneMapped = false;
    return m;
  }, [bg]);
  useEffect(() => () => { sky?.geometry.dispose(); (sky?.material as THREE.Material | undefined)?.dispose(); bg?.dispose(); }, [sky, bg]);
  return sky ? <primitive object={sky} /> : null;
};
const SKY_ROT = Number(new URLSearchParams(location.search).get('skyrot') || 0) * (Math.PI / 180);

/** Real furniture and plants (Khronos glTF sample models, CC BY 4.0), lit by the environment map. */
const PROP_FILES = (propsJson as { models: Record<string, string> }).models;
type PropItem = { m: string; zone: Zone; p: [number, number, number]; yaw: number; s: number };
const Prop: React.FC<{ item: PropItem; mode: Mode }> = ({ item, mode }) => {
  const { scene } = useGLTF(`/hq/props/${PROP_FILES[item.m]}.glb`);
  const obj = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => { const mesh = o as THREE.Mesh; if (mesh.isMesh) { mesh.material = (mesh.material as THREE.Material).clone(); } });
    return c;
  }, [scene]);
  useEffect(() => {
    obj.traverse((o) => {
      const mesh = o as THREE.Mesh; if (!mesh.isMesh) return;
      const m = mesh.material as THREE.MeshStandardMaterial;
      m.envMap = ENV[mode]; m.envMapIntensity = mode === 'day' ? 1.1 : 0.9; m.needsUpdate = true;
    });
  }, [obj, mode]);
  const [x, y, z] = item.p;
  return <primitive object={obj} position={[x, z, -y]} rotation={[0, (item.yaw * Math.PI) / 180, 0]} scale={item.s} />;
};
const Props: React.FC<{ zones: readonly Zone[]; mode: Mode }> = ({ zones, mode }) => {
  const items = (propsJson as unknown as { items: PropItem[] }).items.filter((i) => zones.includes(i.zone));
  return <>{items.map((it, k) => <Suspense key={k} fallback={null}><Prop item={it} mode={mode} /></Suspense>)}</>;
};



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

const Env: React.FC<{ mode: Mode; onEnv: () => void }> = ({ mode, onEnv }) => {
  const { gl, scene } = useThree();
  if (new URLSearchParams(location.search).has('debug')) (window as unknown as { __scene: THREE.Scene }).__scene = scene;
  useEffect(() => {
    if (ENV[mode]) { onEnv(); return; }
    const pm = new THREE.PMREMGenerator(gl);
    if (mode === 'night') {
      ENV.night = pm.fromScene(new RoomEnvironment(), 0.04).texture; pm.dispose(); onEnv();
      return;
    }
    let live = true;
    new RGBELoader().load('/hq/env/day.hdr', (t) => {
      t.mapping = THREE.EquirectangularReflectionMapping;
      ENV.day = pm.fromEquirectangular(t).texture; t.dispose(); pm.dispose();
      if (live) onEnv();
    });
    return () => { live = false; };
  }, [gl, mode, onEnv]);
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
  const [envVer, setEnvVer] = useState(0);
  const onEnv = React.useCallback(() => setEnvVer((v) => v + 1), []);
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
      gl={{ antialias: !phone, powerPreference: 'high-performance', toneMapping: (({ aces: THREE.ACESFilmicToneMapping, neutral: THREE.NeutralToneMapping } as Record<string, THREE.ToneMapping>)[new URLSearchParams(location.search).get('tm') || ''] ?? THREE.AgXToneMapping), outputColorSpace: THREE.SRGBColorSpace }}
      camera={{ fov: 50, near: 0.1, far: 900, position: [0, 3, 40] }}
      onPointerDown={(e) => { drag.current = { x: e.clientX, y: e.clientY, lx: target.current.x, ly: target.current.y }; }}
      onPointerMissed={() => setHover(null)}
      aria-hidden
    >
      <PerformanceMonitor onDecline={() => setDpr((d) => Math.max(1, d - 0.25))} />
      <Env mode={mode} onEnv={onEnv} />
      <Surroundings mode={mode} />
      <Props zones={zones} mode={mode} key={`props-${envVer}`} />
      <group
        onPointerMove={(e) => { const d = pick(e); setHover(d?.screen ?? null); document.body.style.cursor = d ? 'pointer' : ''; }}
        onPointerOut={() => { setHover(null); document.body.style.cursor = ''; }}
        onClick={(e) => { const d = pick(e); if (d && onSelect && (!drag.current || Math.abs(e.nativeEvent.clientX - drag.current.x) < 6)) { e.stopPropagation(); onSelect(d.display); } }}
      >
        {zones.map((z) => (
          <Suspense key={z} fallback={null}><ZoneModel zone={z} mode={mode} phone={phone} hover={hover} envVer={envVer} /></Suspense>
        ))}
      </group>
      {!phone && !new URLSearchParams(location.search).has('nofx') && <Suspense fallback={null}><Effects night={mode === 'night'} /></Suspense>}
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
