// The Oliskey building, in real 3D (three.js). Scrolling walks the camera through it:
//   outside (the logo on the building) → lobby (paper turns into screens) → operations room → school wing →
//   fleet garage → trading floor → atrium, where the camera rises above the logo.
// White mode = daylight; dark mode = night with the lights on. Everything is built from simple shapes in code (no models
// to download). Only the product screenshots are images, and they follow the theme too.
import {
  ACESFilmicToneMapping, BoxGeometry, MeshLambertMaterial, type Material, CanvasTexture, CatmullRomCurve3, Color, CylinderGeometry, DirectionalLight, DoubleSide, Fog,
  Group, HemisphereLight, InstancedMesh, Mesh, MeshBasicMaterial, MeshStandardMaterial, Object3D, PCFSoftShadowMap, PerspectiveCamera,
  PlaneGeometry, PointLight, SRGBColorSpace, Scene, SphereGeometry, Texture, TextureLoader, TorusGeometry, Vector3, WebGLRenderer,
} from 'three';

export type Shots = { light: string; dark: string };
export type WorldOptions = { shots: { school: Shots; fleet: Shots; alpha: Shots }; mobile: boolean };

// camera stops, in scroll order (each lines up with one text block on the page)
const STOPS: { pos: [number, number, number]; look: [number, number, number]; via?: [number, number, number] }[] = [
  { pos: [0, 3.2, 56], look: [0, 10.5, 8] },                                  // 0 outside: the building and its logo, sky above
  { pos: [0.6, 1.9, -1], look: [3.6, 2.2, -7], via: [0, 2.2, 13] },          // 1 lobby (through the doors)
  { pos: [2.2, 2.3, -16], look: [-8, 2.4, -22] },                             // 2 operations room
  { pos: [-7.6, 3.1, -36.6], look: [8, 1.2, -50] },                           // 3 school wing: desks lead to the board
  { pos: [-4.5, 2.8, -63], look: [6, 1.4, -78] },                             // 4 fleet garage: tricycles under the dashboard
  { pos: [-4, 2.6, -93.5], look: [7, 1.5, -105] },                            // 5 trading floor: desks and the big screen
  { pos: [-1.2, 4.6, -116.5], look: [-2.6, 4.3, -128], via: [0, 3.2, -110] },       // 6 atrium: face the logo
];

const PAL = {
  light: { bg: '#dfe9f7', floor: '#e9dcc8', wall: '#f7f5f1', ceil: '#fbfaf7', trim: '#d6dbe3', wood: '#b98a5c', dark: '#1e293b', ring: '#0f172a', glass: '#a9c9f2', plaza: '#d9dee6', grass: '#9cc98a', win: '#cfe2fb', city: '#c7d2e2', hemi: 1.15, sun: 2.2, lamp: 0, fogNear: 60, fogFar: 230 },
  dark: { bg: '#050a16', floor: '#2a3550', wall: '#3a4768', ceil: '#1d263c', trim: '#43517a', wood: '#5b4330', dark: '#0b1020', ring: '#e2e8f0', glass: '#3b5f99', plaza: '#0a0f1c', grass: '#0f2a1e', win: '#ffd08a', city: '#0d1424', hemi: 2.6, sun: 0.5, lamp: 0, fogNear: 55, fogFar: 210 },
};

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function label(text: string, opts: { w?: number; h?: number; size?: number; color?: string; bg?: string; weight?: number } = {}) {
  const { w = 1024, h = 256, size = 120, color = '#ffffff', bg = 'transparent', weight = 800 } = opts;
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d')!;
  if (bg !== 'transparent') { g.fillStyle = bg; g.beginPath(); g.roundRect(0, 0, w, h, h / 2.6); g.fill(); }
  g.fillStyle = color; g.font = `${weight} ${size}px Inter, system-ui, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(text, w / 2, h / 2 + size * 0.04);
  const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; t.anisotropy = 4;
  return t;
}

export function createWorld(canvas: HTMLCanvasElement, opts: WorldOptions) {
  const { mobile } = opts;
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.75));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const shadows = !mobile;
  renderer.shadowMap.enabled = shadows;
  renderer.shadowMap.type = PCFSoftShadowMap;

  const scene = new Scene();
  scene.fog = new Fog('#e9eff8', 30, 140);
  const skyCanvas = document.createElement('canvas'); skyCanvas.width = 4; skyCanvas.height = 256;
  const sky = new CanvasTexture(skyCanvas); sky.colorSpace = SRGBColorSpace;
  const paintSky = (top: string, mid: string, bottom: string) => { const g = skyCanvas.getContext('2d')!; const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, top); gr.addColorStop(0.6, mid); gr.addColorStop(1, bottom); g.fillStyle = gr; g.fillRect(0, 0, 4, 256); sky.needsUpdate = true; };
  scene.background = sky;
  const camera = new PerspectiveCamera(55, 1, 0.1, 400);

  // ---------- materials (recoloured when the theme changes) ----------
  // flat surfaces are matte (Lambert): no highlight sweeping across big walls, which bands into rings on some screens
  const flat = (color: string) => new MeshLambertMaterial({ color, dithering: true });
  const std = (color: string, extra: Partial<ConstructorParameters<typeof MeshStandardMaterial>[0]> = {}) => new MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, dithering: true, ...extra });
  const M = {
    floor: flat('#ffffff'), wall: flat('#ffffff'), ceil: flat('#ffffff'), trim: flat('#ffffff'), wood: std('#c9a47c', { roughness: 0.6 }),
    dark: std('#1e293b', { roughness: 0.5 }), ring: std('#0f172a', { roughness: 0.25, metalness: 0.35 }), plaza: flat('#ffffff'),
    glass: std('#9cc3ff', { transparent: true, opacity: 0.32, roughness: 0.05, metalness: 0.2 }),
    blue: std('#2563eb', { emissive: new Color('#3b82f6'), emissiveIntensity: 0.6, roughness: 0.3 }),
    white: std('#ffffff', { roughness: 0.6 }), plant: std('#3f9b5a'), pot: std('#e7ded3'),
    yellow: std('#f5c518', { roughness: 0.45 }), green: std('#16a34a', { roughness: 0.45 }), tyre: std('#111827', { roughness: 0.9 }),
    candleUp: std('#10b981', { emissive: new Color('#10b981'), emissiveIntensity: 0.5 }), candleDown: std('#f43f5e', { emissive: new Color('#f43f5e'), emissiveIntensity: 0.5 }),
    paper: new MeshBasicMaterial({ color: '#ffffff', side: DoubleSide, transparent: true }),
    glow: new MeshBasicMaterial({ color: '#60a5fa' }),
    win: new MeshBasicMaterial({ color: '#cfe2fb' }), panel: new MeshBasicMaterial({ color: '#ffffff' }),
    grass: flat('#9cc98a'), city: flat('#c7d2e2'),
    accentOps: flat('#dbe7fb'), accentSchool: flat('#fbefd9'), accentFleet: flat('#e6e9ee'), accentTrade: flat('#ebe6fb'),
  };

  const root = new Group(); scene.add(root);
  const geoBox = new BoxGeometry(1, 1, 1);
  const box = (w: number, h: number, d: number, m: Material, x: number, y: number, z: number, parent: Object3D = root) => {
    const b = new Mesh(geoBox, m); b.scale.set(w, h, d); b.position.set(x, y, z); b.castShadow = shadows; b.receiveShadow = shadows; parent.add(b); return b;
  };

  // ---------- lights ----------
  const hemi = new HemisphereLight('#ffffff', '#cbd5e1', 1.35); scene.add(hemi);
  const sun = new DirectionalLight('#fff7ed', 2.4); sun.position.set(-30, 50, 40); sun.castShadow = shadows;
  if (shadows) { sun.shadow.mapSize.set(2048, 2048); const s = sun.shadow.camera; s.left = -40; s.right = 40; s.top = 60; s.bottom = -60; s.far = 200; sun.shadow.bias = -0.0004; sun.target.position.set(0, 0, -50); scene.add(sun.target); }
  scene.add(sun);
  const lamps: PointLight[] = [];
  [[0, 5, 2], [0, 5, -22], [0, 5, -47], [0, 5, -75], [0, 5, -103], [0, 7, -128]].forEach(([x, y, z]) => { const l = new PointLight('#ffd9a8', 0, 34, 1.6); l.position.set(x, y, z); scene.add(l); lamps.push(l); });

  // ---------- ground and building shell ----------
  const ground = new Mesh(new PlaneGeometry(400, 400), M.plaza); ground.rotation.x = -Math.PI / 2; ground.position.set(0, -0.02, -40); ground.receiveShadow = shadows; root.add(ground);
  // a path to the door
  box(7, 0.04, 26, M.trim, 0, 0.0, 24);
  const Z0 = 10, Z1 = -140, LEN = Z0 - Z1, MID = (Z0 + Z1) / 2;
  box(18, 0.1, LEN, M.floor, 0, 0.0, MID);                       // floor
  box(0.4, 9, LEN, M.wall, -9.2, 4.5, MID); box(0.4, 9, LEN, M.wall, 9.2, 4.5, MID);   // side walls
  box(18.8, 0.3, 125, M.ceil, 0, 6.35, Z0 - 62.5);              // ceiling (the atrium at the end is open to the sky)
  box(18.8, 0.6, 125, M.wall, 0, 9.2, Z0 - 62.5);                // roof
  box(18.8, 9, 0.4, M.wall, 0, 4.5, Z1);                         // back wall
  // front: the facade with a tall glass entrance and the logo over it
  box(6.2, 9, 0.6, M.wall, -6.1, 4.5, Z0); box(6.2, 9, 0.6, M.wall, 6.1, 4.5, Z0); box(6, 3.4, 0.6, M.wall, 0, 7.3, Z0);
  // facade windows: daylight blue by day, warm and lit at night
  [[-6.1, 2.6], [6.1, 2.6], [-6.1, 6.4], [6.1, 6.4]].forEach(([x, y]) => { const wn = new Mesh(new PlaneGeometry(4.8, 2.9), M.win); wn.position.set(x, y, Z0 + 0.31); root.add(wn); box(5.2, 0.16, 0.3, M.trim, x, y - 1.55, Z0 + 0.4); });
  box(18.8, 0.3, 0.8, M.trim, 0, 4.5, Z0 + 0.4);
  // side windows along the building (seen from inside as light)
  for (let z = 4; z > Z1 + 10; z -= 6) { if (Math.abs(z - -10) < 2 || Math.abs(z + 35) < 2 || Math.abs(z + 60) < 2 || Math.abs(z + 90) < 2 || Math.abs(z + 115) < 2) continue; [-8.98, 8.98].forEach((x) => { const wn = new Mesh(new PlaneGeometry(3.6, 2.2), M.win); wn.position.set(x, 3.9, z); wn.rotation.y = x < 0 ? Math.PI / 2 : -Math.PI / 2; root.add(wn); }); }
  // ceiling light strips
  for (let z = 6; z > -114; z -= 5) { const pnl = new Mesh(new PlaneGeometry(6, 0.5), M.panel); pnl.rotation.x = Math.PI / 2; pnl.position.set(0, 6.19, z); root.add(pnl); }
  // the street around it: lawns, trees and the city beyond
  const lawnL = new Mesh(new PlaneGeometry(40, 60), M.grass); lawnL.rotation.x = -Math.PI / 2; lawnL.position.set(-26, 0.0, 10); lawnL.receiveShadow = shadows; root.add(lawnL);
  const lawnR = lawnL.clone(); lawnR.position.x = 26; root.add(lawnR);
  const treeTrunk = new CylinderGeometry(0.18, 0.24, 2.2, 10), treeTop = new SphereGeometry(1.5, 18, 14);
  [[-7, 18], [7, 18], [-7.5, 27], [7.5, 27], [-8, 36], [8, 36], [-15, 12], [15, 12], [-19, 24], [19, 26], [-13, 40], [13, 42]].forEach(([x, z], i) => {
    const tr = new Mesh(treeTrunk, M.wood); tr.position.set(x, 1.1, z); tr.castShadow = shadows; root.add(tr);
    const tp = new Mesh(treeTop, M.plant); tp.position.set(x, 2.9 + (i % 3) * 0.3, z); tp.scale.setScalar(1 + (i % 4) * 0.12); tp.castShadow = shadows; root.add(tp);
  });
  const cityTex = (() => { const c = document.createElement('canvas'); c.width = 64; c.height = 128; const g = c.getContext('2d')!; g.fillStyle = '#ffffff'; g.fillRect(0, 0, 64, 128); for (let y = 6; y < 128; y += 10) for (let x = 6; x < 64; x += 12) { g.fillStyle = ((x * 7 + y * 3) % 5) ? '#9fb0c8' : '#e9edf3'; g.fillRect(x, y, 7, 5); } const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; return t; })();
  M.city.map = cityTex;
  [[-34, -20, 26], [-48, -60, 38], [-30, -110, 22], [-52, -150, 44], [36, -30, 30], [50, -80, 46], [32, -130, 24], [54, -170, 36], [-70, -10, 30], [72, -20, 34], [-20, -190, 50], [24, -200, 40]].forEach(([x, z, hgt]) => box(14, hgt, 14, M.city, x, hgt / 2, z));
  box(18.8, 0.4, 2.4, M.dark, 0, 9.6, Z0 + 0.6);                 // roof edge
  const doorL = box(3, 5.6, 0.12, M.glass, -1.5, 2.8, Z0 + 0.05), doorR = box(3, 5.6, 0.12, M.glass, 1.5, 2.8, Z0 + 0.05);
  [doorL, doorR].forEach((d) => { d.castShadow = false; });

  // ---------- the Oliskey logo in 3D: three interlocking rings, one blue accent ----------
  const ringGeo = new TorusGeometry(1, 0.185, 20, 72);
  const accentGeo = new TorusGeometry(1, 0.19, 20, 24, Math.PI / 4);
  const makeLogo = () => {
    const g = new Group();
    const centers: [number, number, number][] = [[-0.68, -0.545, 0.06], [0.68, -0.545, -0.06], [0, 0.636, 0]];
    centers.forEach(([x, y, z], i) => { const r = new Mesh(ringGeo, M.ring); r.position.set(x, y, z); r.rotation.y = [0.12, -0.12, 0][i]; r.castShadow = shadows; g.add(r); });
    const a = new Mesh(accentGeo, M.blue); a.position.set(0, 0.636, 0.05); g.add(a);
    return g;
  };
  const facadeLogo = makeLogo(); facadeLogo.scale.setScalar(1.05); facadeLogo.position.set(0, 7.35, Z0 + 0.9); root.add(facadeLogo);
  const sign = new Mesh(new PlaneGeometry(4.2, 1.05), new MeshBasicMaterial({ map: label('OLISKEY', { color: '#0f172a', size: 150 }), transparent: true }));
  sign.position.set(0, 5.95, Z0 + 0.36); root.add(sign);

  // each room has its own wall colour
  ([[M.accentOps, -22.5], [M.accentSchool, -47.5], [M.accentFleet, -75], [M.accentTrade, -102.5]] as [Material, number][]).forEach(([m, z]) => { box(0.1, 6.2, 22, m, -8.95, 3.1, z); box(0.1, 6.2, 22, m, 8.95, 3.1, z); });

  // ---------- partitions between rooms, each with its name over the opening ----------
  const ROOMS: [number, string][] = [[-10, 'Operations'], [-35, 'School'], [-60, 'Fleet'], [-90, 'Trading'], [-115, '']];
  const roomSigns: Mesh[] = [];
  ROOMS.forEach(([z, name]) => {
    box(5.2, 6.3, 0.3, M.wall, -6.4, 3.15, z); box(5.2, 6.3, 0.3, M.wall, 6.4, 3.15, z); box(7.6, 1.5, 0.3, M.wall, 0, 5.55, z);
    if (!name) return;
    const s = new Mesh(new PlaneGeometry(3.2, 0.8), new MeshBasicMaterial({ map: label(name, { color: '#ffffff', bg: '#2563eb', size: 110 }), transparent: true }));
    s.position.set(0, 5.5, z + 0.17); root.add(s); roomSigns.push(s);
  });

  // ---------- product screens (real app screenshots, swapped by theme) ----------
  const loader = new TextureLoader();
  const tex = (url: string) => { const t = loader.load(url); t.colorSpace = SRGBColorSpace; t.anisotropy = 8; return t; };
  const shotTex = {
    school: { light: tex(opts.shots.school.light), dark: tex(opts.shots.school.dark) },
    fleet: { light: tex(opts.shots.fleet.light), dark: tex(opts.shots.fleet.dark) },
    alpha: { light: tex(opts.shots.alpha.light), dark: tex(opts.shots.alpha.dark) },
  };
  const screenMats: { m: MeshBasicMaterial; id: keyof typeof shotTex }[] = [];
  const screen = (id: keyof typeof shotTex, w: number, x: number, y: number, z: number, rotY: number, parent: Object3D = root) => {
    const m = new MeshBasicMaterial({ map: shotTex[id].light, toneMapped: false });
    screenMats.push({ m, id });
    const g = new Group(); g.position.set(x, y, z); g.rotation.y = rotY; parent.add(g);
    const h = w / 1.6;
    box(w + 0.16, h + 0.16, 0.12, M.dark, 0, 0, -0.07, g);
    const p = new Mesh(new PlaneGeometry(w, h), m); p.position.z = 0.002; g.add(p);
    return g;
  };

  // ---------- lobby: reception, plants, the logo, and paperwork turning into a screen ----------
  box(5, 1.1, 1.4, M.white, -4.6, 0.55, -3); box(5.2, 0.08, 1.6, M.wood, -4.6, 1.14, -3);
  const lobbyLogo = makeLogo(); lobbyLogo.scale.setScalar(0.9); lobbyLogo.position.set(-4.6, 3.2, -6.6); root.add(lobbyLogo);
  const plant = (x: number, z: number, s = 1) => { const p = new Mesh(new CylinderGeometry(0.35 * s, 0.28 * s, 0.7 * s, 20), M.pot); p.position.set(x, 0.35 * s, z); p.castShadow = shadows; root.add(p); const f = new Mesh(new SphereGeometry(0.62 * s, 20, 16), M.plant); f.position.set(x, 1.1 * s, z); f.castShadow = shadows; root.add(f); };
  [[-8, 8], [8, 8], [-8, -8.5], [8, -8.5], [-8, -33], [8, -33], [-8, -113], [8, -113]].forEach(([x, z]) => plant(x, z));
  const lobbyScreen = screen('school', 3.6, 6.2, 2.6, -8.2, -0.5);
  const lobbyScreenMat = (lobbyScreen.children[1] as Mesh).material as MeshBasicMaterial;
  lobbyScreenMat.transparent = true; lobbyScreenMat.opacity = 0;
  const papers: { m: Mesh; from: Vector3; to: Vector3; spin: number }[] = [];
  const paperGeo = new PlaneGeometry(0.34, 0.44);
  for (let i = 0; i < 26; i++) {
    const m = new Mesh(paperGeo, M.paper.clone()); root.add(m);
    const from = new Vector3(-1.5 + ((i * 37) % 30) / 10, 0.6 + ((i * 13) % 20) / 10, -1 - ((i * 23) % 60) / 10);
    const to = new Vector3(6.2 - 1.5 + ((i % 6) * 0.6), 1.6 + Math.floor(i / 6) * 0.45, -8.1);
    papers.push({ m, from, to, spin: ((i * 53) % 360) * (Math.PI / 180) });
  }

  // ---------- operations room: a wall of live screens, desks with monitors, data running across the floor ----------
  screen('fleet', 4.6, -8.85, 2.9, -16, Math.PI / 2); screen('alpha', 4.6, -8.85, 2.9, -22.5, Math.PI / 2); screen('school', 4.6, -8.85, 2.9, -29, Math.PI / 2);
  const deskGeo = new BoxGeometry(2.2, 0.08, 1); const legGeo = new BoxGeometry(2.1, 0.72, 0.9); const monGeo = new BoxGeometry(0.9, 0.55, 0.05);
  const desks = new InstancedMesh(deskGeo, M.wood, 40), deskBases = new InstancedMesh(legGeo, M.white, 40), mons = new InstancedMesh(monGeo, M.dark, 60);
  const monGlow = new InstancedMesh(new PlaneGeometry(0.84, 0.49), M.glow, 60);
  [desks, deskBases, mons].forEach((im) => { im.castShadow = shadows; im.receiveShadow = shadows; root.add(im); }); root.add(monGlow);
  let nd = 0, nm = 0; const o = new Object3D();
  const desk = (x: number, z: number, rotY: number, monitors = 1) => {
    o.position.set(x, 0.76, z); o.rotation.set(0, rotY, 0); o.scale.set(1, 1, 1); o.updateMatrix(); desks.setMatrixAt(nd, o.matrix);
    o.position.y = 0.36; o.updateMatrix(); deskBases.setMatrixAt(nd++, o.matrix);
    for (let k = 0; k < monitors; k++) {
      const off = (k - (monitors - 1) / 2) * 0.95, c = Math.cos(rotY), s = Math.sin(rotY);
      o.position.set(x + off * c - 0.3 * s, 1.15, z - off * s - 0.3 * c); o.rotation.set(0, rotY + (k - (monitors - 1) / 2) * -0.25, 0); o.updateMatrix(); mons.setMatrixAt(nm, o.matrix);
      o.translateZ(0.03); o.updateMatrix(); monGlow.setMatrixAt(nm++, o.matrix);
    }
  };
  for (let r = 0; r < 2; r++) for (let i = 0; i < 4; i++) desk(4 + r * 2.6, -14 - i * 4.5, Math.PI / 2, 1);
  // data pulses on the floor
  const pulses: Mesh[] = [];
  for (let i = 0; i < 6; i++) { box(0.06, 0.02, 24, M.trim, -6 + i * 0.4, 0.06, -22.5); const p = new Mesh(new BoxGeometry(0.14, 0.05, 0.9), M.glow); p.position.set(-6 + i * 0.4, 0.08, -11); root.add(p); pulses.push(p); }

  // ---------- school wing: a classroom with the School App on the board ----------
  screen('school', 6.2, 8.85, 2.9, -47, -Math.PI / 2);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) desk(-6.5 + c * 2.3, -40 - r * 3.4, -Math.PI / 2, 0);
  box(0.5, 2.6, 6, M.wood, -8.7, 1.3, -52);                                  // bookshelf
  for (let i = 0; i < 12; i++) box(0.3, 0.42, 0.14, [M.blue, M.yellow, M.green, M.dark][i % 4] as Material, -8.4, 0.6 + Math.floor(i / 6) * 0.9, -54.5 + (i % 6) * 0.9);

  // ---------- fleet garage: tricycles parked and one driving, the Fleet dashboard on the wall ----------
  screen('fleet', 5.6, 8.85, 2.8, -76, -Math.PI / 2);
  for (let i = 0; i < 6; i++) box(0.12, 0.02, 1.4, M.yellow, -2.2, 0.07, -63 - i * 4.6);   // lane markings
  const trike = () => {
    const g = new Group();
    box(1.05, 0.95, 2.1, M.yellow, 0, 0.85, 0, g); box(0.95, 0.5, 0.9, M.green, 0, 1.55, 0.55, g); box(1.2, 0.08, 2.3, M.dark, 0, 2.15, -0.1, g);
    [[-0.5, 1.2, -1.05], [0.5, 1.2, -1.05], [-0.5, 1.2, 0.9], [0.5, 1.2, 0.9]].forEach(([x, , z]) => box(0.06, 1.0, 0.06, M.dark, x, 1.65, z, g));
    const wheel = new CylinderGeometry(0.34, 0.34, 0.2, 20);
    [[-0.62, -0.6], [0.62, -0.6], [0, 0.95]].forEach(([x, z]) => { const w = new Mesh(wheel, M.tyre); w.rotation.z = Math.PI / 2; w.position.set(x, 0.34, z); w.castShadow = shadows; g.add(w); });
    root.add(g); return g;
  };
  for (let i = 0; i < 4; i++) { const t = trike(); t.position.set(5.6, 0, -68 - i * 4.2); t.rotation.y = -0.9; }
  const driving = trike(); driving.position.set(-0.6, 0, -62);

  // ---------- trading floor: desks with three screens each, a live candle wall, Alpha on the big screen ----------
  screen('alpha', 6.2, 8.85, 2.9, -103, -Math.PI / 2);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) desk(1.8 + c * 3.3, -96 - r * 4.2, 0, 3);
  const candles: { m: Mesh; phase: number }[] = [];
  for (let i = 0; i < 26; i++) { const up = (i * 7) % 3 !== 0; const m = box(0.1, 1, 0.22, up ? M.candleUp : M.candleDown, -8.85, 2.6, -92 - i * 0.85); candles.push({ m, phase: i * 0.7 }); }
  desks.count = nd; deskBases.count = nd; mons.count = nm; monGlow.count = nm;
  [desks, deskBases, mons, monGlow].forEach((im) => { im.instanceMatrix.needsUpdate = true; });

  // ---------- atrium: the logo, large, with the three products around it ----------
  const bigLogo = makeLogo(); bigLogo.scale.setScalar(1.35); bigLogo.position.set(0, 4.5, -128); root.add(bigLogo);
  const plinth = new Mesh(new CylinderGeometry(4, 4.4, 0.5, 48), M.white); plinth.position.set(0, 0.25, -128); plinth.receiveShadow = shadows; root.add(plinth);
  const orbit = new Group(); orbit.position.set(0, 3.2, -128); root.add(orbit);
  (['school', 'fleet', 'alpha'] as const).forEach((id, i) => { const a = (i / 3) * Math.PI * 2; screen(id, 2.6, Math.sin(a) * 5.6, 0, Math.cos(a) * 5.6, a, orbit); });

  // ---------- the path the camera takes ----------
  const pts: Vector3[] = [], looks: Vector3[] = [], stopT: number[] = [];
  STOPS.forEach((s) => {
    if (s.via) { pts.push(new Vector3(...s.via)); looks.push(new Vector3(s.via[0], s.via[1], s.via[2] - 10)); }
    stopT.push(pts.length); pts.push(new Vector3(...s.pos)); looks.push(new Vector3(...s.look));
  });
  const path = new CatmullRomCurve3(pts, false, 'centripetal'), lookPath = new CatmullRomCurve3(looks, false, 'centripetal');
  const n = pts.length - 1;

  // ---------- theme ----------
  let isDark = false;
  const applyTheme = (dark: boolean) => {
    isDark = dark;
    const P = dark ? PAL.dark : PAL.light;
    (scene.fog as Fog).color.set(dark ? P.bg : '#dfe9f7'); (scene.fog as Fog).near = P.fogNear; (scene.fog as Fog).far = P.fogFar;
    M.floor.color.set(P.floor); M.wall.color.set(P.wall); M.ceil.color.set(P.ceil); M.trim.color.set(P.trim); M.wood.color.set(P.wood); M.dark.color.set(P.dark);
    M.ring.color.set(P.ring); M.glass.color.set(P.glass); M.plaza.color.set(P.plaza); M.white.color.set(dark ? '#1f2937' : '#ffffff'); M.pot.color.set(dark ? '#3b3530' : '#e7ded3');
    M.ring.emissive.set(dark ? '#334155' : '#000000');
    hemi.intensity = P.hemi; hemi.color.set(dark ? '#ffd9a8' : '#ffffff'); hemi.groundColor.set(dark ? '#1a2440' : '#cbd5e1'); sun.intensity = P.sun; sun.color.set(dark ? '#9db6ff' : '#fff7ed');
    lamps.forEach((l) => { l.intensity = P.lamp; });
    M.glow.color.set(dark ? '#60a5fa' : '#93c5fd');
    M.win.color.set(P.win); M.grass.color.set(P.grass); M.city.color.set(P.city); M.panel.color.set(dark ? '#ffe7c2' : '#ffffff');
    M.plant.color.set(dark ? '#1f5a35' : '#4e9f63');
    M.accentOps.color.set(dark ? '#1c2f5c' : '#c9dcfb'); M.accentSchool.color.set(dark ? '#3b2d17' : '#fde3b8'); M.accentFleet.color.set(dark ? '#283247' : '#dde2ea'); M.accentTrade.color.set(dark ? '#2f2457' : '#ddd3fb');
    if (dark) paintSky('#02040b', '#0a1430', '#162447'); else paintSky('#8fb8ee', '#cfe0f6', '#eef3fa');
    M.city.emissive.set(dark ? '#ffcf8a' : '#000000'); M.city.emissiveMap = dark ? cityTex : null; M.city.emissiveIntensity = dark ? 0.35 : 0; M.city.needsUpdate = true;
    (sign.material as MeshBasicMaterial).map = label('OLISKEY', { color: dark ? '#ffffff' : '#0f172a', size: 150 }); (sign.material as MeshBasicMaterial).needsUpdate = true;
    screenMats.forEach(({ m, id }) => { m.map = shotTex[id][dark ? 'dark' : 'light']; m.needsUpdate = true; });
    papers.forEach((p) => (p.m.material as MeshBasicMaterial).color.set(dark ? '#e2e8f0' : '#ffffff'));
  };

  // ---------- frame ----------
  let w = 0, h = 0;
  const resize = (cw: number, ch: number) => {
    if (cw === w && ch === h) return; w = cw; h = ch;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    camera.fov = w / h < 0.8 ? 72 : w / h < 1.2 ? 62 : 52;    // phones see a wider view
    camera.updateProjectionMatrix();
  };
  const tmpP = new Vector3(), tmpL = new Vector3();
  const render = (s: number, time: number, pointer: [number, number]) => {
    // s: 0 … STOPS.length-1, fractional between stops; eased so the camera settles at each stop
    const k = Math.min(STOPS.length - 2, Math.floor(s)), f = ease(Math.min(1, Math.max(0, s - k)));
    const t = (stopT[k] + (stopT[k + 1] - stopT[k]) * f) / n;
    path.getPoint(t, tmpP); lookPath.getPoint(t, tmpL);
    camera.position.copy(tmpP); camera.position.x += pointer[0] * 0.35; camera.position.y += pointer[1] * -0.2 + Math.sin(time * 0.6) * 0.03;
    if (w / h < 0.8) tmpL.y += 2.2 * Math.max(0, 1 - s);   // phones: building sits lower, under the headline
    camera.lookAt(tmpL);

    // doors slide open as you arrive
    const open = Math.min(1, Math.max(0, (s - 0.25) / 0.45));
    doorL.position.x = -1.5 - open * 2.9; doorR.position.x = 1.5 + open * 2.9;
    // paper flies into the lobby screen
    const pp = Math.min(1, Math.max(0, (s - 0.55) / 0.9));
    papers.forEach(({ m, from, to, spin }, i) => {
      const q = ease(Math.min(1, Math.max(0, pp * 1.4 - i * 0.015)));
      m.position.lerpVectors(from, to, q); m.position.y += Math.sin(Math.PI * q) * 0.8 + Math.sin(time * 1.2 + i) * 0.05 * (1 - q);
      m.rotation.set(spin * (1 - q) + 0.3, spin * 0.6 * (1 - q) - 0.5 * q, spin * 0.3 * (1 - q));
      (m.material as MeshBasicMaterial).opacity = 1 - Math.max(0, (q - 0.8) / 0.2);
    });
    lobbyScreenMat.opacity = Math.min(1, Math.max(0, (pp - 0.55) / 0.35));
    // life
    [facadeLogo, lobbyLogo].forEach((g, i) => { g.rotation.y = Math.sin(time * 0.5 + i) * 0.35; });
    bigLogo.rotation.y = Math.sin(time * 0.4) * 0.5; orbit.rotation.y = -time * 0.22;
    pulses.forEach((p, i) => { p.position.z = -11 - ((time * (3 + i * 0.4) + i * 4) % 23); });
    driving.position.z = -62 - ((time * 2.4) % 26); driving.position.x = -0.6;
    candles.forEach(({ m, phase }) => { const hgt = 0.5 + Math.abs(Math.sin(time * 0.9 + phase)) * 1.4; m.scale.y = hgt; m.position.y = 1.4 + hgt / 2 + Math.sin(phase) * 0.6; });
    renderer.render(scene, camera);
  };

  return {
    resize, render, applyTheme, get isDark() { return isDark; }, stops: STOPS.length,
    dispose: () => {
      renderer.dispose();
      scene.traverse((ob) => { const m = ob as Mesh; if (m.geometry) m.geometry.dispose(); });
      Object.values(M).forEach((m) => m.dispose());
      Object.values(shotTex).forEach((s) => { (s.light as Texture).dispose(); (s.dark as Texture).dispose(); });
    },
  };
}
