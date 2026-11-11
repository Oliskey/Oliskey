import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { PerformanceMonitor, useGLTF } from '@react-three/drei';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { GroundedSkybox } from 'three/examples/jsm/objects/GroundedSkybox.js';
import propsJson from './props.json';
import kitsJson from './kits.json';
import District from './District';
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
  onLost?: () => void;
  fade?: React.RefObject<HTMLDivElement>;
}

const EXPOSURE = { day: Number(new URLSearchParams(location.search).get('exp') || 0.8), night: Number(new URLSearchParams(location.search).get('expn') || 0.75) };
/** Reflection maps per time of day (photographic HDRI by day; the room-light environment at night). */
const ENV: Record<Mode, THREE.Texture | null> = { day: null, night: null };
const Effects = React.lazy(() => import('./Effects'));
const LM_SIZE: Record<Zone, number> = { hq: 2048, school: 1024, fleet: 1024, alpha: 2048, labs: 1024 };
/** Zones whose lightmap islands are padded enough (8 px) for a few mip levels: smooth, shimmer-free far ceilings and floors. */
const MIPPED: Partial<Record<Zone, boolean>> = { alpha: true };
let GL: THREE.WebGLRenderer | null = null;
const SCALES = scales as Record<string, number>;
const loader = new THREE.TextureLoader();
const texCache = new Map<string, THREE.Texture>();
const texReady = new Map<string, Promise<void>>();
function tex(url: string, srgb = true, flip = false) {
  let t = texCache.get(url);
  if (!t) {
    let done = () => {};
    texReady.set(url, new Promise<void>((r) => { done = r; }));
    t = loader.load(url, () => done(), undefined, () => done());
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
  if (name === 'screen_alpha_ticker') return '/hq/tex/alpha_ticker.webp';
  if (name === 'screen_alpha_tv1') return `/products/alpha-${v}.webp`;
  if (name === 'screen_alpha_tv2') return '/hq/tex/alpha_board.webp';
  return null;
}
/** World clocks over the trading floor: the real time now in Lagos, London, New York and Tokyo. */
let clockTex: THREE.CanvasTexture | null = null;
function clocks() {
  if (clockTex) return clockTex;
  const c = document.createElement('canvas'); c.width = 2048; c.height = 154;
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; t.flipY = false;   // same UV convention as the GLB screens
  const cities: [string, string][] = [['LAGOS', 'Africa/Lagos'], ['LONDON', 'Europe/London'], ['NEW YORK', 'America/New_York'], ['TOKYO', 'Asia/Tokyo']];
  const draw = () => {
    const g = c.getContext('2d')!; g.fillStyle = '#06070a'; g.fillRect(0, 0, c.width, c.height);
    cities.forEach(([city, tz], i) => {
      const x = i * 512;
      if (i) { g.fillStyle = '#1c1d22'; g.fillRect(x, 20, 3, 114); }
      let time = '--:--';
      try { time = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz }).format(new Date()); } catch { /* old browsers */ }
      g.fillStyle = '#8f93a0'; g.font = '600 34px Inter, system-ui, sans-serif'; g.fillText(city, x + 40, 64);
      g.fillStyle = '#f5f6fa'; g.font = '700 64px Inter, system-ui, sans-serif'; g.fillText(time, x + 290, 100);
    });
    t.needsUpdate = true;
  };
  draw(); window.setInterval(draw, 20000);
  clockTex = t; return t;
}

/** Displays you can click, and the product each one opens. */
export function displayTarget(name: string): string | null {
  const m = /^screen_(?:lobby_)?(school|fleet|alpha|labs)(?:_main)?$/.exec(name);
  return m ? m[1] : null;
}

/** Lightmaps: no mipmaps — lower mip levels would mix neighbouring UV islands and show blotches at grazing angles. */
function lightmap(url: string, mips = 0) {
  const t = tex(url);
  if (!mips) { t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; t.magFilter = THREE.LinearFilter; t.anisotropy = 1; return t; }
  // limited mipmaps: the first levels smooth minified texels; deeper levels would mix neighbouring UV islands, so stop there
  t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter; t.anisotropy = 4;
  t.onUpdate = () => {
    if (!GL) return;
    const g = GL.getContext() as WebGL2RenderingContext;
    const wt = (GL.properties.get(t) as { __webglTexture?: WebGLTexture }).__webglTexture;
    if (!wt || !(g instanceof WebGL2RenderingContext)) return;
    g.bindTexture(g.TEXTURE_2D, wt); g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAX_LEVEL, mips);
  };
  return t;
}
/** Surface detail on the second UV set (world scale, 1 unit = 1 m). Real scans (wood, grass) carry their own colour, so the
 *  material colour becomes a tint; the procedural ones (stone joints, paving, plaster) multiply the material colour. */
const SURF: Record<string, { f: string; m: number; tint?: number; rough?: string }> = {
  floor_wood: { f: 'wood_real', m: 2.4, tint: 1.0, rough: 'wood_rough' }, floor_dark: { f: 'wood_real', m: 2.4, tint: 0.55, rough: 'wood_rough' },
  wood: { f: 'wood_real', m: 1.6, tint: 0.85 }, wood_light: { f: 'wood_real', m: 1.6, tint: 1.25 },
  floor_stone: { f: 'stone', m: 2.4 }, stair: { f: 'stone', m: 2.4 }, plaza: { f: 'pavers', m: 4.8 }, plaza_light: { f: 'pavers', m: 4.8 },
  plaster: { f: 'plaster', m: 3 }, plaster_warm: { f: 'plaster', m: 3 }, ceiling: { f: 'plaster', m: 3 }, floor_epoxy: { f: 'epoxy', m: 2 },
  carpet: { f: 'carpet', m: 2 }, ceil_tile: { f: 'ceiltile', m: 1.2 }, slats: { f: 'slats', m: 1, tint: 0.62 },
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

const ZoneModel: React.FC<{ zone: Zone; mode: Mode; phone: boolean; hover: string | null; envVer: number; onLit?: () => void }> = ({ zone, mode, phone, hover, envVer, onLit }) => {
  const { scene } = useGLTF(`/hq/glb/${zone}.glb`);
  const { scene: root } = useThree();
  const ticker = useRef<THREE.Texture | null>(null);
  useFrame((_, dt) => { if (ticker.current) ticker.current.offset.x = (ticker.current.offset.x + dt * 0.012) % 1; });

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
          if (zone === 'hq' && m.name === 'metal_dark') m.onBeforeCompile = (sh) => {
            // keep the entrance clear: no glazing post in the middle of the doorway
            sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWp;').replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvWp = (modelMatrix * vec4(transformed, 1.0)).xyz;');
            sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vWp;').replace('void main() {', 'void main() {\n  if (abs(vWp.x) < 0.09 && abs(vWp.z) < 0.13 && vWp.y < 9.7) discard;');
          };
          if (mesh.geometry.getAttribute('uv1')) applySurface(m);
        }
        return;
      }
      if (name.endsWith('_lamps')) { const m = new THREE.MeshBasicMaterial({ color: 0xffffff }); mesh.material = m; lamps.push(m); return; }
      if (name.endsWith('_leds')) { const m = new THREE.MeshBasicMaterial({ color: 0x3d86ff }); mesh.material = m; leds.push(m); return; }
      if (name.endsWith('_glass')) {
        const m = new THREE.MeshStandardMaterial({ color: 0xdbe8ff, roughness: 0.04, metalness: 0.0, transparent: true, opacity: 0.14, depthWrite: false, envMapIntensity: 1.2 });
        if (zone === 'hq') m.onBeforeCompile = (sh) => {
          sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWp;').replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvWp = (modelMatrix * vec4(transformed, 1.0)).xyz;');
          sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vWp;').replace('void main() {', 'void main() {\n  if (abs(vWp.x) < 2.55 && vWp.y < 3.78 && abs(vWp.z) < 0.12) discard;');
        };
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
    const lm = lightmap(lmUrl(zone, mode, phone), MIPPED[zone] ? (phone ? 2 : 3) : 0);
    texReady.get(lmUrl(zone, mode, phone))?.then(() => onLit?.());   // fade the 3D in only once it is lit
    const k = (SCALES[`${zone}-${mode}`] ?? 1) * Number(new URLSearchParams(location.search).get('lmk') || Math.PI) * EXPOSURE[mode];   // exposure lives in the light, so it holds with or without the effects pass
    for (const m of parts.statics) {
      m.lightMap = lm; m.lightMapIntensity = k;
      if (!m.roughnessMap && m.metalness < 0.5) m.roughness = Math.max(m.roughness, m.name === 'floor_epoxy' ? 0.7 : m.name === 'carpet' || m.name === 'ceil_tile' ? 1 : 0.5);   // satin, not mirror: no hard sun glints
      const glossy = m.roughness < 0.6 || !!m.roughnessMap || m.metalness > 0.5;
      m.envMap = glossy ? ENV[mode] : null;
      m.envMapIntensity = m.metalness > 0.5 ? (mode === 'day' ? 0.7 : 0.35) : mode === 'day' ? 0.12 : 0.05;
      m.needsUpdate = true;
    }
    // screen pictures load after the light, so the room appears first and the displays switch on a moment later
    texReady.get(lmUrl(zone, mode, phone))?.then(() => {
    for (const { mesh, mat } of parts.screens) {
        const name = mesh.userData.screen as string;
        if (name === 'screen_alpha_clocks') { mat.map = clocks(); mat.needsUpdate = true; continue; }
        const url = screenImage(name, mode);
        if (url) {
          mat.map = tex(url);
          if (name === 'screen_alpha_ticker') { mat.map.wrapS = THREE.RepeatWrapping; mat.map.repeat.x = (11.8 / 0.3) / (3530 / 128); mat.map.needsUpdate = true; ticker.current = mat.map; }
          mat.needsUpdate = true;
        }
        mat.color.setScalar(mode === 'day' ? 0.92 : 0.85);
      }
    });
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
const Surroundings: React.FC<{ mode: Mode; lite: boolean; envVer: number }> = ({ mode, lite }) => {
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
    const m = new GroundedSkybox(bg, 60, 600);
    m.position.y = 60 - 0.5; m.rotation.y = SKY_ROT;
    (m.material as THREE.MeshBasicMaterial).toneMapped = false;
    return m;
  }, [bg]);
  useEffect(() => () => { sky?.geometry.dispose(); (sky?.material as THREE.Material | undefined)?.dispose(); bg?.dispose(); }, [sky, bg]);
  return <>{sky && <primitive object={sky} />}<District mode={mode} env={ENV[mode]} lite={lite} /></>;
};
const DEBUG = new URLSearchParams(location.search).has('debug');
/** ?debug&cam=ex,ey,ez,tx,ty,tz (Blender coordinates): pin the camera, for checking details. */
const DEBUG_CAM = DEBUG ? (new URLSearchParams(location.search).get('cam')?.split(',').map(Number) ?? null) : null;
const SKY_ROT = Number(new URLSearchParams(location.search).get('skyrot') || 0) * (Math.PI / 180);

/** Closed walls at the ends of a world (navy feature walls with the Oliskey mark), so a world never looks into another one. */
const ROOM_Y: Record<string, [number, number]> = { school: [22, 44], fleet: [44, 66], alpha: [66, 88], labs: [88, 110] };
const Seals: React.FC<{ zones: readonly Zone[]; mode: Mode }> = ({ zones, mode }) => {
  const mats = useMemo(() => ({
    wall: new THREE.MeshStandardMaterial({ color: 0x0b1a3a, roughness: 0.55, metalness: 0.0 }),
    logo: new THREE.MeshBasicMaterial({ map: (() => { const t = new THREE.TextureLoader().load('/hq/tex/logo_sign.webp'); t.colorSpace = THREE.SRGBColorSpace; return t; })(), toneMapped: false }),
  }), []);
  useEffect(() => { mats.wall.envMap = ENV[mode]; mats.wall.envMapIntensity = mode === 'day' ? 0.9 : 0.6; mats.wall.color.set(mode === 'day' ? 0x13285a : 0x0b1a3a); mats.wall.needsUpdate = true; }, [mode, mats]);
  const walls: React.ReactNode[] = [];
  for (const z of zones) {
    if (z === 'hq') continue;
    const [y0, y1] = ROOM_Y[z];
    const prev = { school: 'hq', fleet: 'school', alpha: 'fleet', labs: 'alpha' }[z] as Zone;
    const next = { school: 'fleet', fleet: 'alpha', alpha: 'labs', labs: null }[z] as Zone | null;
    if (!zones.includes(prev)) walls.push(
      <group key={`${z}-in`} position={[0, 0.6 + 2.75, -(y0 + 0.2)]}>
        <mesh material={mats.wall}><boxGeometry args={[22.4, 5.5, 0.12]} /></mesh>
        <mesh material={mats.logo} position={[0, 0.4, -0.07]} rotation-y={Math.PI}><planeGeometry args={[4, 1]} /></mesh>
      </group>);
    if (next && !zones.includes(next)) walls.push(
      <group key={`${z}-out`} position={[0, 0.6 + 2.0, -(y1 - 0.22)]}>
        <mesh material={mats.wall}><boxGeometry args={[7.2, 4.05, 0.1]} /></mesh>
        <mesh material={mats.logo} position={[0, 0.3, 0.06]}><planeGeometry args={[3.2, 0.8]} /></mesh>
      </group>);
  }
  return <>{walls}</>;
};

/** Automatic sliding glass doors at the entrance: they part as the camera approaches and close behind it. */
const Doors: React.FC<{ mode: Mode }> = ({ mode }) => {
  const left = useRef<THREE.Group>(null), right = useRef<THREE.Group>(null);
  const open = useRef(0);
  const mats = useMemo(() => ({
    glass: new THREE.MeshStandardMaterial({ color: 0xdbe8ff, roughness: 0.04, transparent: true, opacity: 0.18, depthWrite: false }),
    frame: new THREE.MeshStandardMaterial({ color: 0x2b2f36, roughness: 0.35, metalness: 0.8 }),
  }), []);
  useEffect(() => { for (const m of [mats.glass, mats.frame]) { m.envMap = ENV[mode]; m.needsUpdate = true; } mats.glass.opacity = mode === 'day' ? 0.18 : 0.1; }, [mode, mats]);
  useFrame(({ camera }, dt) => {
    const d = Math.hypot(camera.position.x, camera.position.z - 0.6);           // distance to the doorway
    const want = 1 - THREE.MathUtils.smoothstep(d, 5, 14);
    open.current += (want - open.current) * Math.min(1, dt * 3.2);              // motorised, eased
    const x = 1.28 + open.current * 2.45;
    if (left.current) left.current.position.x = -x;
    if (right.current) right.current.position.x = x;
  });
  const Leaf = React.forwardRef<THREE.Group>((_, ref) => (
    <group ref={ref} position={[0, 0.6 + 1.58, 0.0]}>
      <mesh material={mats.glass} renderOrder={3}><boxGeometry args={[2.5, 3.1, 0.03]} /></mesh>
      <mesh material={mats.frame} position={[0, 1.57, 0]}><boxGeometry args={[2.56, 0.07, 0.07]} /></mesh>
      <mesh material={mats.frame} position={[0, -1.57, 0]}><boxGeometry args={[2.56, 0.07, 0.07]} /></mesh>
      <mesh material={mats.frame} position={[-1.26, 0, 0]}><boxGeometry args={[0.06, 3.1, 0.07]} /></mesh>
      <mesh material={mats.frame} position={[1.26, 0, 0]}><boxGeometry args={[0.06, 3.1, 0.07]} /></mesh>
      <mesh material={mats.frame} position={[0, 0, 0.05]}><boxGeometry args={[0.03, 0.9, 0.04]} /></mesh>
    </group>
  ));
  return <group><Leaf ref={left} /><Leaf ref={right} /></group>;
};

/** Real furniture and plants (Khronos glTF sample models, CC BY 4.0), lit by the environment map. */
const PROP_FILES = (propsJson as { models: Record<string, string> }).models;
type PropItem = { m: string; zone: Zone; p: [number, number, number]; yaw: number; s: number };
const Prop: React.FC<{ item: PropItem; mode: Mode }> = ({ item, mode }) => {
  const { scene } = useGLTF(`/hq/props/${PROP_FILES[item.m]}.glb`);
  const obj = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => {
      const mesh = o as THREE.Mesh; if (!mesh.isMesh) return;
      const src = mesh.material as THREE.MeshPhysicalMaterial;
      // transmission/sheen force extra render passes and memory on every frame: use a plain PBR material instead
      const m = new THREE.MeshStandardMaterial({ map: src.map, normalMap: src.normalMap, roughnessMap: src.roughnessMap, metalnessMap: src.metalnessMap,
        aoMap: src.aoMap, color: src.color, roughness: src.roughness, metalness: src.metalness, side: src.side, alphaTest: src.alphaTest, transparent: false });
      m.name = src.name; mesh.material = m;
    });
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
/** Oliskey Alpha trading floor: 18 workstations (desk set, three monitors, task chair) drawn as instances, and the traders.
 *  Their light is baked in Blender into their own textures (albedo x light), so they cost one draw call per part. */
type Station = { x: number; y: number; mirror: boolean; chair: [number, number, number]; state: string };
const KITS = kitsJson as unknown as { fl: number; stations: Station[] };
const STATE_TEX: Record<string, string> = {
  win1: 'alpha_win1', win2: 'alpha_win2', win3: 'alpha_win3', wait1: 'alpha_wait1', wait2: 'alpha_wait2', wait3: 'alpha_wait3', idle1: 'alpha_mon', idle2: 'alpha_mon2',
};
const noRay = () => {};
const TradingFloor: React.FC<{ mode: Mode; phone: boolean }> = ({ mode, phone }) => {
  const kit = useGLTF('/hq/glb/alpha_kit.glb').scene;
  const crowd = useGLTF('/hq/glb/alpha_people.glb').scene;
  const { gl } = useThree();
  const indoor = useMemo(() => { const pm = new THREE.PMREMGenerator(gl); const t = pm.fromScene(new RoomEnvironment(), 0.04).texture; pm.dispose(); return t; }, [gl]);
  const built = useMemo(() => {
    // each part's geometry plus its node matrix (meshopt quantisation stores the real scale and offset on the node)
    const geo: Record<string, THREE.BufferGeometry> = {}, node: Record<string, THREE.Matrix4> = {};
    kit.updateMatrixWorld(true);
    kit.traverse((o) => {
      const m = o as THREE.Mesh; if (!m.isMesh) return;
      const k = (m.name.startsWith('Mesh') || !m.name ? m.parent?.name : m.name)!.replace(/_\d+$/, '');
      geo[k] = m.geometry; node[k] = m.matrixWorld.clone();
    });
    const baked = (key: string) => new THREE.MeshBasicMaterial({ name: key, side: THREE.DoubleSide });
    const mats = { kitdesk: baked('kitdesk'), kitchair: baked('kitchair') };
    const screenMat = (file: string) => { const m = new THREE.MeshBasicMaterial({ map: tex(`/hq/tex/${file}.webp`), toneMapped: false, side: THREE.DoubleSide }); return m; };
    const n = KITS.stations.length, fl = KITS.fl;
    const o = new THREE.Object3D();
    const station = (s: Station) => { o.position.set(s.x, fl, -s.y); o.rotation.set(0, 0, 0); o.scale.set(1, 1, s.mirror ? -1 : 1); o.updateMatrix(); return o.matrix.clone(); };
    const tmpM = new THREE.Matrix4();
    const inst = (g: THREE.BufferGeometry, m: THREE.Material, mats4: THREE.Matrix4[]) => {
      const k = Object.keys(geo).find((x) => geo[x] === g)!;
      const im = new THREE.InstancedMesh(g, m, mats4.length); mats4.forEach((x, i) => im.setMatrixAt(i, tmpM.multiplyMatrices(x, node[k])));
      im.instanceMatrix.needsUpdate = true; im.raycast = noRay; im.frustumCulled = false; return im;
    };
    const group = new THREE.Group();
    const S = KITS.stations.map(station);
    // drop two pieces that read badly at a distance: the low fabric desk screen (looked like a second, blank monitor)
    // and the desk phone (two dark blobs). Boxes are in workstation metres: x (towards the trader), y (along the desk), height.
    const CUT: [number, number, number, number, number, number][] = [[-0.41, -0.36, -0.82, 0.82, 0.72, 1.04], [-0.17, 0.17, -0.86, -0.4, 0.73, 0.9], [0.08, 0.32, 0.2, 0.48, 0.735, 0.7445]];
    {
      const g = geo.kit_desk, pos = g.getAttribute('position'), m = node.kit_desk, v = new THREE.Vector3();
      const inside = (i: number) => { v.fromBufferAttribute(pos, i).applyMatrix4(m); const x = v.x, y = -v.z, z = v.y;
        return CUT.some(([x0, x1, y0, y1, z0, z1]) => x >= x0 && x <= x1 && y >= y0 && y <= y1 && z >= z0 && z <= z1); };
      const idx = g.getIndex();
      if (idx) {
        const keep: number[] = [];
        for (let t = 0; t < idx.count; t += 3) { const a = idx.getX(t), b2 = idx.getX(t + 1), c = idx.getX(t + 2); if (!(inside(a) && inside(b2) && inside(c))) keep.push(a, b2, c); }
        g.setIndex(keep);
      }
    }
    // screens are never mirrored (text would read backwards): a mirrored desk uses the unmirrored station and the
    // opposite side monitor, which sits exactly where the mirrored one would
    const U = KITS.stations.map((s) => station({ ...s, mirror: false }));
    group.add(inst(geo.kit_desk, mats.kitdesk, S));
    group.add(inst(geo.kitscr_c, new THREE.MeshBasicMaterial({ toneMapped: false, side: THREE.DoubleSide }), U));
    const add = (map: Map<string, THREE.Matrix4[]>, f: string, m: THREE.Matrix4) => map.set(f, [...(map.get(f) ?? []), m]);
    const trade = { n: new Map<string, THREE.Matrix4[]>(), p: new Map<string, THREE.Matrix4[]>() };
    const chart = { n: new Map<string, THREE.Matrix4[]>(), p: new Map<string, THREE.Matrix4[]>() };
    KITS.stations.forEach((s, i) => {
      // the trade (won / waiting) is on the trader's left-hand monitor, a chart on the right
      const left = s.mirror ? 'p' : 'n', right = s.mirror ? 'n' : 'p';
      add(trade[left], STATE_TEX[s.state] ?? 'alpha_mon', U[i]);
      add(chart[right], i % 2 ? 'alpha_mon' : 'alpha_mon2', U[i]);
    });
    for (const side of ['n', 'p'] as const) {
      const g = side === 'n' ? geo.kitscr_n : geo.kitscr_p;
      trade[side].forEach((m4, f) => group.add(inst(g, screenMat(f), m4)));
      chart[side].forEach((m4, f) => group.add(inst(g, screenMat(f), m4)));
    }
    const C = KITS.stations.map((s) => {
      const [dx, dy, yaw] = s.chair;
      o.position.set(s.x + dx, fl, -(s.y + dy * (s.mirror ? -1 : 1))); o.rotation.set(0, yaw, 0); o.scale.set(1, 1, 1); o.updateMatrix(); return o.matrix.clone();
    });
    group.add(inst(geo.kit_chair, mats.kitchair, C));
    // the traders keep their own textures (sharp faces and hands) and are lit by an indoor environment like the room's panels
    const people: THREE.MeshStandardMaterial[] = [];
    crowd.traverse((x) => {
      const m = x as THREE.Mesh; if (!m.isMesh) return;
      m.raycast = noRay; m.frustumCulled = false;   // quantised bounds can cull the whole crowd
      const src = m.material as THREE.MeshStandardMaterial;
      if (!people.includes(src)) { src.metalness = 0; src.roughness = Math.max(src.roughness, 0.55); people.push(src); }
    });
    group.add(crowd);
    return { group, mats, people, centre: group.children[1] as THREE.InstancedMesh, n };
  }, [kit, crowd]);
  useEffect(() => {
    for (const m of built.people) { m.envMap = indoor; m.envMapIntensity = mode === 'day' ? 1.05 : 0.8; m.needsUpdate = true; }
    for (const [key, m] of Object.entries(built.mats)) {
      m.map = tex(`/hq/lm/alpha_${key}-${mode}.webp`);
      m.color.setScalar((SCALES[`alpha_${key}-${mode}`] ?? 1) * EXPOSURE[mode]);
      m.needsUpdate = true;
    }
    // the middle monitor shows the real Alpha app, in the theme of the moment
    const cm = built.centre.material as THREE.MeshBasicMaterial;
    cm.map = tex(`/products/alpha-${mode === 'day' ? 'light' : 'dark'}.webp`); cm.color.setScalar(mode === 'day' ? 0.9 : 0.85); cm.needsUpdate = true;
  }, [built, mode, phone, indoor]);
  return <primitive object={built.group} />;
};

const Props: React.FC<{ zones: readonly Zone[]; mode: Mode }> = ({ zones, mode }) => {
  const items = (propsJson as unknown as { items: PropItem[] }).items.filter((i) => zones.includes(i.zone));
  return <>{items.map((it, k) => <Suspense key={k} fallback={null}><Prop item={it} mode={mode} /></Suspense>)}</>;
};



/** Camera rig. Stops are grouped into runs of continuous movement (a spline through each run's points); a stop marked
 *  `cut` ends its run, and the move to the next run is a cinematic cut: the camera pushes in, the frame fades, and it opens
 *  inside the next space — so choosing a world takes you straight there instead of walking through other worlds.
 *  Motion is a critically-damped spring (weighted start and stop, like a real camera move) with a slight hand-held sway. */
const Rig: React.FC<{ stops: Stop[]; progress: React.MutableRefObject<number>; phone: boolean; snap?: boolean; look: React.MutableRefObject<{ x: number; y: number }>; aim: React.MutableRefObject<{ x: number; y: number }>; fade?: React.RefObject<HTMLDivElement> }> = ({ stops, progress, phone, snap, look, aim, fade }) => {
  const { camera, size } = useThree();
  const plan = useMemo(() => {
    const shot = (s: Stop) => (phone && s.phone) || s.desk;
    type Run = { eye: THREE.CatmullRomCurve3; at: THREE.CatmullRomCurve3; n: number };
    const runs: Run[] = [];
    const real: { run: number; ci: number; fov: number; cut: boolean }[] = [];
    let cur: Stop[] = [];
    const flush = () => {
      if (!cur.length) return;
      const pts = cur.length === 1 ? [cur[0], cur[0]] : cur;
      const eye = new THREE.CatmullRomCurve3(pts.map((x) => new THREE.Vector3(...shot(x).eye)), false, 'centripetal');
      const ats = pts.map((x, i) => {
        if (!x.via) return new THREE.Vector3(...shot(x).at);
        const next = pts.slice(i).find((y) => !y.via) ?? pts[pts.length - 1];
        return new THREE.Vector3(...shot(next).at);
      });
      runs.push({ eye, at: new THREE.CatmullRomCurve3(ats, false, 'centripetal'), n: pts.length });
      cur = [];
    };
    stops.forEach((st) => {
      cur.push(st);
      if (!st.via) real.push({ run: runs.length, ci: cur.length - 1, fov: shot(st).fov, cut: !!st.cut });
      if (st.cut) flush();
    });
    flush();
    return { runs, real };
  }, [stops, phone]);
  const st = useRef({ s: progress.current, v: 0, t: 0 });
  const tmp = useMemo(() => ({ e: new THREE.Vector3(), a: new THREE.Vector3(), d: new THREE.Vector3(), side: new THREE.Vector3(), e2: new THREE.Vector3(), a2: new THREE.Vector3() }), []);

  const pose = (k: number, e: THREE.Vector3, a: THREE.Vector3) => {
    // pose at real stop k + fraction, inside one run
    const i = Math.floor(k), f = k - i;
    const r0 = plan.real[i], r1 = plan.real[Math.min(i + 1, plan.real.length - 1)];
    const run = plan.runs[r0.run];
    const ci = r1.run === r0.run ? r0.ci + (r1.ci - r0.ci) * f : r0.ci;
    const t = run.n > 1 ? ci / (run.n - 1) : 0;
    run.eye.getPoint(Math.min(1, t), e); run.at.getPoint(Math.min(1, t), a);
  };

  useFrame((_, dt0) => {
    const dt = Math.min(dt0, 0.05);
    const last = plan.real.length - 1;
    const goal = Math.max(0, Math.min(last, progress.current));
    const S = st.current;
    const before = S.s;
    if (snap) { S.s = goal; S.v = 0; } else {
      const w = 5.2;                                   // spring stiffness: settles in ~0.8 s
      S.v += (w * w * (goal - S.s) - 2 * w * S.v) * dt;
      S.s += S.v * dt;
    }
    S.t += dt;
    // after a drag, scrolling eases the view back toward the planned direction: about 80% recovered per stop scrolled
    const back = Math.exp(-1.6 * Math.abs(S.s - before));
    aim.current.x *= back; aim.current.y *= back;
    if (DEBUG) (window as unknown as { __rig: unknown }).__rig = { s: S.s, goal, aim: { ...aim.current }, look: { ...look.current } };
    const s = Math.max(0, Math.min(last, S.s));
    const i = Math.min(Math.max(0, last - 1), Math.floor(s)), f = s - i;
    const r0 = plan.real[i], r1 = plan.real[Math.min(i + 1, last)];
    let fov = r0.fov + (r1.fov - r0.fov) * f;
    let veil = 0;
    if (r0.cut && r1 !== r0 && r1.run !== r0.run) {
      // cinematic cut: push in on the current view, fade, open on the next space easing back into place
      const ease = (x: number) => x * x * (3 - 2 * x);
      if (f < 0.5) {
        pose(i, tmp.e, tmp.a);
        const p = ease(f * 2);
        tmp.d.subVectors(tmp.a, tmp.e); tmp.e.addScaledVector(tmp.d, 0.55 * p);
        fov = r0.fov * (1 - 0.18 * p);
      } else {
        pose(i + 1, tmp.e, tmp.a);
        const p = ease((1 - f) * 2);
        tmp.d.subVectors(tmp.a, tmp.e).normalize(); tmp.e.addScaledVector(tmp.d, -1.6 * p);
        fov = r1.fov * (1 + 0.1 * p);
      }
      veil = Math.max(0, 1 - Math.abs(f - 0.5) / 0.22);
    } else {
      pose(s, tmp.e, tmp.a);
    }
    if (fade?.current) fade.current.style.opacity = String(veil);
    // hand-held feel: a gentle sway that grows with speed and fades to stillness at rest
    const speed = Math.min(1, Math.abs(S.v) * 1.4);
    const sway = 0.012 + 0.05 * speed;
    tmp.e.x += Math.sin(S.t * 0.9) * sway; tmp.e.y += Math.sin(S.t * 1.7) * sway * 0.5;
    // look-around: yaw/pitch offset around the eye
    tmp.d.subVectors(tmp.a, tmp.e);
    const yaw = look.current.x * Math.PI, pitch = -look.current.y * 0.55;
    tmp.d.applyAxisAngle(THREE.Object3D.DEFAULT_UP, -yaw);
    tmp.side.crossVectors(tmp.d, THREE.Object3D.DEFAULT_UP).normalize();
    tmp.d.applyAxisAngle(tmp.side, pitch);
    camera.position.copy(tmp.e);
    camera.lookAt(tmp.a.copy(tmp.e).add(tmp.d));
    if (DEBUG_CAM) { camera.position.set(DEBUG_CAM[0], DEBUG_CAM[2], -DEBUG_CAM[1]); camera.lookAt(DEBUG_CAM[3], DEBUG_CAM[5], -DEBUG_CAM[4]); }
    const cam = camera as THREE.PerspectiveCamera;
    if (Math.abs(cam.fov - fov) > 0.01 || cam.aspect !== size.width / size.height) { cam.fov = fov; cam.aspect = size.width / size.height; cam.updateProjectionMatrix(); }
  });
  return null;
};

const Env: React.FC<{ mode: Mode; onEnv: () => void }> = ({ mode, onEnv }) => {
  const { gl, scene } = useThree();
  const { camera: dbgCam } = useThree();
  if (new URLSearchParams(location.search).has('debug')) { (window as unknown as { __scene: THREE.Scene }).__scene = scene; (window as unknown as { __camera: THREE.Camera }).__camera = dbgCam; }
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

const World: React.FC<WorldProps> = ({ zones, stops, progress, mode, phone, active, onSelect, onReady, snap, onLost, fade }) => {
  // phones: sharper picture (1.5x) with hardware anti-aliasing; the performance monitor steps down if a device struggles
  const [dpr, setDpr] = useState(phone ? Math.min(1.5, window.devicePixelRatio || 1) : Math.min(1.5, window.devicePixelRatio || 1));
  const [hover, setHover] = useState<string | null>(null);
  const [envVer, setEnvVer] = useState(0);
  const [litOnce, setLitOnce] = useState(false);
  const lit = React.useCallback(() => setLitOnce(true), []);
  const onEnv = React.useCallback(() => setEnvVer((v) => v + 1), []);
  const look = useRef({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; lx: number; ly: number } | null>(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // drag-to-look (mouse and touch): the view stays where it is left; scrolling eases it back toward the planned view
    let raf = 0;
    const tick = () => {
      look.current.x += (target.current.x - look.current.x) * 0.12;
      look.current.y += (target.current.y - look.current.y) * 0.12;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const move = (e: PointerEvent) => {
      if (!drag.current) return;
      // drag to look around: a full screen-width drag turns the view half way round; the view stays where it is left
      target.current.x = drag.current.lx + (e.clientX - drag.current.x) / window.innerWidth;
      target.current.y = Math.max(-1, Math.min(1, drag.current.ly + (e.clientY - drag.current.y) / (window.innerHeight * 0.8)));
    };
    const up = () => { drag.current = null; };   // no spring back: scrolling continues from the direction the visitor chose
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
      gl={{ antialias: true, powerPreference: 'high-performance', toneMapping: (({ aces: THREE.ACESFilmicToneMapping, neutral: THREE.NeutralToneMapping } as Record<string, THREE.ToneMapping>)[new URLSearchParams(location.search).get('tm') || ''] ?? THREE.AgXToneMapping), outputColorSpace: THREE.SRGBColorSpace }}
      camera={{ fov: 50, near: 0.1, far: 900, position: [0, 3, 40] }}
      onPointerDown={(e) => { drag.current = { x: e.clientX, y: e.clientY, lx: target.current.x, ly: target.current.y }; document.body.style.cursor = 'grabbing'; }}
      onPointerMissed={() => setHover(null)}
      onCreated={({ gl }) => { GL = gl; gl.domElement.addEventListener('webglcontextlost', (e) => { e.preventDefault(); onLost?.(); }, { once: true }); }}
      aria-hidden
    >
      <PerformanceMonitor onDecline={() => setDpr((d) => Math.max(1, d - 0.25))} />
      <Env mode={mode} onEnv={onEnv} />
      <Surroundings mode={mode} lite={phone} envVer={envVer} />
      {!phone && <Props zones={zones} mode={mode} key={`props-${envVer}`} />}
      {zones.includes('hq') && <Doors mode={mode} key={`doors-${envVer}`} />}
      <Seals zones={zones} mode={mode} key={`seals-${envVer}`} />
      {zones.includes('alpha') && <Suspense fallback={null}><TradingFloor mode={mode} phone={phone} /></Suspense>}
      <group
        onPointerMove={(e) => { const d = pick(e); setHover(d?.screen ?? null); document.body.style.cursor = d ? 'pointer' : ''; }}
        onPointerOut={() => { setHover(null); document.body.style.cursor = ''; }}
        onClick={(e) => { const d = pick(e); if (d && onSelect && (!drag.current || Math.abs(e.nativeEvent.clientX - drag.current.x) < 6)) { e.stopPropagation(); onSelect(d.display); } }}
      >
        {zones.map((z) => (
          <Suspense key={z} fallback={null}><ZoneModel zone={z} mode={mode} phone={phone} hover={hover} envVer={envVer} onLit={z === zones[0] ? lit : undefined} /></Suspense>
        ))}
      </group>
      {!phone && !new URLSearchParams(location.search).has('nofx') && <Suspense fallback={null}><Effects night={mode === 'night'} /></Suspense>}
      <Rig stops={stops} progress={progress} phone={phone} snap={snap} look={look} aim={target} fade={fade} />
      {litOnce && <Ready onReady={onReady} />}
    </Canvas>
  );
};

export default World;
