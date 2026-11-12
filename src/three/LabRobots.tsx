import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/**
 * The robots of Oliskey Lab (an original design, built from simple shapes at real-world scale and animated live):
 *  - four collaborative robot arms on the benches doing pick-and-place, with a blue light ring on every joint;
 *  - a humanoid assistant beside the research wall, presenting the screen;
 *  - two quadcopter drones hovering over a test pad;
 *  - a mobile robot carrying a tote on a loop around the benches, its lidar spinning.
 * Blender coordinates (x right, y into the building, z up) are converted to three.js as (x, z, -y), like the props.
 * Lit by an indoor environment like the people; each robot has a soft contact shadow. Reduce Motion: they hold still.
 */
type Mode = 'day' | 'night';
const FL = 0.6, BENCH = FL + 0.5;
const at = (x: number, y: number, z: number) => new THREE.Vector3(x, z, -y);
const noRay = () => {};
const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const smooth = (t: number) => t * t * (3 - 2 * t);

function useMats() {
  return useMemo(() => {
    const shell = new THREE.MeshPhysicalMaterial({ color: '#F3F4F6', roughness: 0.32, metalness: 0, clearcoat: 0.8, clearcoatRoughness: 0.18 });
    const graphite = new THREE.MeshStandardMaterial({ color: '#2A2D33', roughness: 0.45, metalness: 0.55 });
    const black = new THREE.MeshPhysicalMaterial({ color: '#0B0C0F', roughness: 0.12, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.05 });
    const steel = new THREE.MeshStandardMaterial({ color: '#BFC3CA', roughness: 0.28, metalness: 1 });
    const led = new THREE.MeshStandardMaterial({ color: '#1F6BFF', emissive: '#3D8BFF', emissiveIntensity: 2.2, roughness: 0.4, toneMapped: false });
    const cyan = new THREE.MeshStandardMaterial({ color: '#39E0FF', emissive: '#39E0FF', emissiveIntensity: 2.6, roughness: 0.3, toneMapped: false });
    const green = new THREE.MeshStandardMaterial({ color: '#16D27A', emissive: '#16D27A', emissiveIntensity: 2.0, toneMapped: false });
    const orange = new THREE.MeshStandardMaterial({ color: '#FF7A1A', roughness: 0.5 });
    const tote = new THREE.MeshStandardMaterial({ color: '#1F6BFF', roughness: 0.55 });
    const part = new THREE.MeshStandardMaterial({ color: '#E8B04A', roughness: 0.35, metalness: 0.6 });
    const prop = new THREE.MeshBasicMaterial({ color: '#C9CED6', transparent: true, opacity: 0.22, depthWrite: false, side: THREE.DoubleSide });
    const pad = new THREE.MeshStandardMaterial({ color: '#17191D', roughness: 0.85 });
    // soft contact shadow, drawn once
    const cv = document.createElement('canvas'); cv.width = cv.height = 64;
    const g = cv.getContext('2d')!; const rg = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    rg.addColorStop(0, 'rgba(0,0,0,0.55)'); rg.addColorStop(0.55, 'rgba(0,0,0,0.22)'); rg.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = rg; g.fillRect(0, 0, 64, 64);
    const shadow = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
    const lit = [shell, graphite, black, steel, orange, tote, part, pad];
    return { shell, graphite, black, steel, led, cyan, green, orange, tote, part, prop, pad, shadow, lit };
  }, []);
}
type Mats = ReturnType<typeof useMats>;

// ---------------------------------------------------------------- shape helpers
const cyl = (r: number, h: number, m: THREE.Material, seg = 20) => new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg), m);
const cap = (r: number, len: number, m: THREE.Material) => new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 6, 14), m);
const rbox = (w: number, h: number, d: number, m: THREE.Material) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d, 1, 1, 1), m);
const ring = (r: number, t: number, m: THREE.Material) => { const o = new THREE.Mesh(new THREE.TorusGeometry(r, t, 8, 28), m); return o; };
const blob = (mats: Mats, w: number, d = w) => { const s = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mats.shadow); s.rotation.x = -Math.PI / 2; return s; };
const sphere = (r: number, m: THREE.Material) => new THREE.Mesh(new THREE.SphereGeometry(r, 18, 12), m);

/** A horizontal joint: a graphite drum along the local X axis with a blue light ring on each side. */
function joint(mats: Mats, r: number, w: number) {
  const g = new THREE.Group();
  const d = cyl(r, w, mats.graphite); d.rotation.z = Math.PI / 2; g.add(d);
  for (const s of [-1, 1]) { const l = ring(r * 0.82, 0.006, mats.led); l.rotation.y = Math.PI / 2; l.position.x = (s * w) / 2 + s * 0.002; g.add(l); }
  return g;
}

// ---------------------------------------------------------------- collaborative arm
interface Arm { sc: number; root: THREE.Group; yaw: THREE.Group; shoulder: THREE.Group; elbow: THREE.Group; wrist: THREE.Group; fingers: THREE.Mesh[]; tip: THREE.Object3D; part: THREE.Mesh; phase: number; pick: THREE.Vector3; place: THREE.Vector3 }
function makeArm(mats: Mats, phase: number): Arm {
  const root = new THREE.Group();
  const base = cyl(0.095, 0.1, mats.shell, 28); base.position.y = 0.05; root.add(base);
  const foot = cyl(0.11, 0.015, mats.graphite, 28); foot.position.y = 0.0075; root.add(foot);
  const baseRing = ring(0.096, 0.006, mats.led); baseRing.rotation.x = Math.PI / 2; baseRing.position.y = 0.1; root.add(baseRing);
  const yaw = new THREE.Group(); yaw.position.y = 0.1; root.add(yaw);
  const tower = cyl(0.07, 0.14, mats.shell, 24); tower.position.y = 0.07; yaw.add(tower);
  const shoulder = new THREE.Group(); shoulder.position.y = 0.17; yaw.add(shoulder);
  shoulder.add(joint(mats, 0.075, 0.13));
  const upper = cap(0.048, 0.36, mats.shell); upper.position.y = 0.21; shoulder.add(upper);
  const elbow = new THREE.Group(); elbow.position.y = 0.42; shoulder.add(elbow);
  elbow.add(joint(mats, 0.06, 0.11));
  const fore = cap(0.04, 0.32, mats.shell); fore.position.y = 0.19; elbow.add(fore);
  const wrist = new THREE.Group(); wrist.position.y = 0.38; elbow.add(wrist);
  wrist.add(joint(mats, 0.045, 0.09));
  const w2 = cyl(0.04, 0.07, mats.shell, 20); w2.position.y = 0.05; wrist.add(w2);
  const flange = cyl(0.032, 0.02, mats.graphite, 20); flange.position.y = 0.095; wrist.add(flange);
  const grip = rbox(0.09, 0.035, 0.05, mats.graphite); grip.position.y = 0.12; wrist.add(grip);
  const fingers = [-1, 1].map((s) => { const f = rbox(0.012, 0.06, 0.03, mats.steel); f.position.set(s * 0.03, 0.165, 0); wrist.add(f); return f; });
  const tip = new THREE.Object3D(); tip.position.y = 0.18; wrist.add(tip);
  const part = rbox(0.045, 0.045, 0.045, mats.part);
  return { sc: 1, root, yaw, shoulder, elbow, wrist, fingers, tip, part, phase, pick: new THREE.Vector3(), place: new THREE.Vector3() };
}
// joint poses (yaw, shoulder, elbow, wrist) for: rest above pick, at pick, above place, at place
const POSE = {
  up: [0.9, 0.6, 1.3, 1.24], pick: [0.9, 1.0, 1.3, 0.84], upB: [-0.9, 0.6, 1.3, 1.24], place: [-0.9, 1.0, 1.3, 0.84],
} as const;
const SEQ: [keyof typeof POSE, keyof typeof POSE, number, number][] = [
  // from, to, seconds, grip (0 open, 1 closed) at the end
  ['up', 'pick', 1.1, 0], ['pick', 'pick', 0.5, 1], ['pick', 'up', 1.0, 1], ['up', 'upB', 2.0, 1],
  ['upB', 'place', 1.1, 1], ['place', 'place', 0.5, 0], ['place', 'upB', 1.0, 0], ['upB', 'up', 2.0, 0],
];
const CYCLE = SEQ.reduce((a, s) => a + s[2], 0);
function poseArm(a: Arm, t: number) {
  let k = ((t + a.phase) % CYCLE + CYCLE) % CYCLE, i = 0;
  while (k > SEQ[i][2]) { k -= SEQ[i][2]; i++; }
  const [from, to, dur, g] = SEQ[i]; const f = smooth(Math.min(1, k / dur));
  const A = POSE[from], B = POSE[to];
  const v = A.map((x, j) => x + (B[j] - x) * f);
  a.yaw.rotation.y = v[0]; a.shoulder.rotation.x = v[1]; a.elbow.rotation.x = v[2]; a.wrist.rotation.x = v[3];
  const prevG = SEQ[(i + SEQ.length - 1) % SEQ.length][3];
  const grip = prevG + (g - prevG) * f;
  a.fingers.forEach((fi, s) => { fi.position.x = (s ? 1 : -1) * (0.034 - 0.012 * grip); });
  return { carrying: (i >= 2 && i <= 4) || (i === 1 && f > 0.6) || (i === 5 && f < 0.4), toPlace: i >= 4 && i <= 7 };
}

// ---------------------------------------------------------------- humanoid assistant
interface Humanoid { root: THREE.Group; body: THREE.Group; head: THREE.Group; armR: THREE.Group; foreR: THREE.Group; armL: THREE.Group }
function makeHumanoid(mats: Mats): Humanoid {
  const root = new THREE.Group();
  const body = new THREE.Group(); root.add(body);
  // legs
  for (const s of [-1, 1]) {
    const thigh = cap(0.065, 0.36, mats.shell); thigh.position.set(s * 0.1, 0.72, 0); body.add(thigh);
    const knee = sphere(0.06, mats.graphite); knee.position.set(s * 0.1, 0.5, 0.01); body.add(knee);
    const shin = cap(0.055, 0.34, mats.shell); shin.position.set(s * 0.1, 0.28, 0); body.add(shin);
    const foot = rbox(0.11, 0.06, 0.24, mats.graphite); foot.position.set(s * 0.1, 0.03, 0.04); body.add(foot);
  }
  const pelvis = rbox(0.3, 0.14, 0.18, mats.graphite); pelvis.position.y = 0.95; body.add(pelvis);
  const waist = cyl(0.1, 0.1, mats.steel, 18); waist.position.y = 1.06; body.add(waist);
  const chest = cap(0.17, 0.2, mats.shell); chest.scale.set(1.15, 1, 0.75); chest.position.y = 1.3; body.add(chest);
  const panel = rbox(0.2, 0.16, 0.02, mats.black); panel.position.set(0, 1.33, 0.13); body.add(panel);
  const strip = rbox(0.13, 0.012, 0.004, mats.led); strip.position.set(0, 1.3, 0.142); body.add(strip);
  const dot = sphere(0.012, mats.green); dot.position.set(0.06, 1.37, 0.142); body.add(dot);
  const neck = cyl(0.04, 0.08, mats.graphite, 14); neck.position.y = 1.55; body.add(neck);
  const head = new THREE.Group(); head.position.y = 1.6; body.add(head);
  const skull = cap(0.11, 0.06, mats.shell); skull.scale.set(1, 1, 1.02); skull.position.y = 0.1; head.add(skull);
  const visor = cap(0.085, 0.05, mats.black); visor.scale.set(1.12, 0.62, 0.6); visor.position.set(0, 0.11, 0.06); head.add(visor);
  const eyes = rbox(0.11, 0.012, 0.004, mats.cyan); eyes.position.set(0, 0.115, 0.115); head.add(eyes);
  for (const s of [-1, 1]) { const ear = cyl(0.03, 0.02, mats.graphite, 14); ear.rotation.z = Math.PI / 2; ear.position.set(s * 0.115, 0.1, 0); head.add(ear); }
  const mkArm = (s: number) => {
    const sh = new THREE.Group(); sh.position.set(s * 0.25, 1.42, 0); body.add(sh);
    sh.add(sphere(0.065, mats.graphite));
    const up = cap(0.05, 0.22, mats.shell); up.position.y = -0.16; sh.add(up);
    const fore = new THREE.Group(); fore.position.y = -0.31; sh.add(fore);
    fore.add(sphere(0.048, mats.graphite));
    const lo = cap(0.044, 0.2, mats.shell); lo.position.y = -0.14; fore.add(lo);
    const hand = rbox(0.07, 0.1, 0.035, mats.graphite); hand.position.y = -0.3; fore.add(hand);
    return { sh, fore };
  };
  const r = mkArm(1), l = mkArm(-1);
  l.sh.rotation.z = -0.08; r.sh.rotation.z = 0.08;
  return { root, body, head, armR: r.sh, foreR: r.fore, armL: l.sh };
}

// ---------------------------------------------------------------- drone
interface Drone { root: THREE.Group; props: THREE.Mesh[]; base: THREE.Vector3; phase: number }
function makeDrone(mats: Mats, phase: number): Drone {
  const root = new THREE.Group();
  const body = rbox(0.16, 0.05, 0.22, mats.graphite); root.add(body);
  const top = rbox(0.12, 0.03, 0.14, mats.shell); top.position.y = 0.035; root.add(top);
  const cam = sphere(0.025, mats.black); cam.position.set(0, -0.03, 0.1); root.add(cam);
  const props: THREE.Mesh[] = [];
  for (const [x, z] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {
    const arm = rbox(0.02, 0.015, 0.2, mats.graphite); arm.position.set(x * 0.08, 0.005, z * 0.08); arm.rotation.y = Math.atan2(x, z); root.add(arm);
    const motor = cyl(0.018, 0.035, mats.steel, 12); motor.position.set(x * 0.15, 0.02, z * 0.15); root.add(motor);
    const p = new THREE.Mesh(new THREE.CircleGeometry(0.075, 24), mats.prop); p.rotation.x = -Math.PI / 2; p.position.set(x * 0.15, 0.042, z * 0.15); root.add(p); props.push(p);
    const blade = rbox(0.15, 0.003, 0.012, mats.graphite); blade.position.copy(p.position); root.add(blade); props.push(blade);
    const l = sphere(0.008, z > 0 ? mats.green : mats.led); l.position.set(x * 0.15, -0.005, z * 0.15); root.add(l);
  }
  return { root, props, base: new THREE.Vector3(), phase };
}

// ---------------------------------------------------------------- mobile robot
interface Rover { root: THREE.Group; lidar: THREE.Group }
function makeRover(mats: Mats): Rover {
  const root = new THREE.Group();
  const chassis = rbox(0.5, 0.2, 0.7, mats.shell); chassis.position.y = 0.15; root.add(chassis);
  const bumper = rbox(0.52, 0.06, 0.72, mats.graphite); bumper.position.y = 0.06; root.add(bumper);
  const strip = rbox(0.42, 0.015, 0.004, mats.led); strip.position.set(0, 0.2, 0.352); root.add(strip);
  for (const [x, z] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) { const w = cyl(0.05, 0.04, mats.black, 16); w.rotation.z = Math.PI / 2; w.position.set(x * 0.24, 0.05, z * 0.24); root.add(w); }
  const lidar = new THREE.Group(); lidar.position.set(0, 0.29, 0.22); root.add(lidar);
  lidar.add(cyl(0.045, 0.05, mats.black, 18));
  const eye = rbox(0.03, 0.012, 0.01, mats.cyan); eye.position.set(0, 0, 0.046); lidar.add(eye);
  const tote = rbox(0.36, 0.14, 0.4, mats.tote); tote.position.set(0, 0.33, -0.08); root.add(tote);
  return { root, lidar };
}

export const LabRobots: React.FC<{ mode: Mode; phone?: boolean }> = ({ mode, phone }) => {
  const mats = useMats();
  const { gl } = useThree();
  const indoor = useMemo(() => { const pm = new THREE.PMREMGenerator(gl); const t = pm.fromScene(new RoomEnvironment(), 0.04).texture; pm.dispose(); return t; }, [gl]);
  useEffect(() => { for (const m of mats.lit) { (m as THREE.MeshStandardMaterial).envMap = indoor; (m as THREE.MeshStandardMaterial).envMapIntensity = mode === 'day' ? 1.0 : 0.75; m.needsUpdate = true; } }, [mats, indoor, mode]);

  const built = useMemo(() => {
    const group = new THREE.Group(); group.name = 'lab-robots';
    // arms: on a white pedestal where the old arm stood (camera "detail" stop), at the near end of each bench, and on bench 2
    const armSpots: [number, number, number, number, number, number][] = [
      // x, y, standing height, facing (rad), phase, scale — four cobots on the benches and one large industrial arm
      [-1.5, 103.0, BENCH, Math.PI, 0, 1], [3.5, 103.0, BENCH, Math.PI, 3.3, 1], [-1.5, 95.6, BENCH, 0, 6.1, 1], [3.5, 95.6, BENCH, 0, 9.4, 1],
      [8.2, 101.2, FL + 0.32, -Math.PI / 2, 1.7, 2.1],
    ];
    // phones draw fewer robots (each part is a draw call): the bench arms, one humanoid and the rover
    const arms = (phone ? armSpots.slice(0, 4) : armSpots).map(([x, y, h, face, ph, sc]) => {
      const a = makeArm(mats, ph); a.sc = sc; a.root.scale.setScalar(sc); a.part.scale.setScalar(sc);
      a.root.position.copy(at(x, y, h)); a.root.rotation.y = face; group.add(a.root);
      const pw = 0.6 * Math.max(1, sc * 0.75);
      const ped = rbox(pw, h - FL, pw, mats.shell); ped.position.copy(at(x, y, (h + FL) / 2)); group.add(ped);
      const pedBand = rbox(pw + 0.005, 0.04, pw + 0.005, mats.graphite); pedBand.position.copy(at(x, y, h - 0.03)); group.add(pedBand);
      const sh = blob(mats, 1.1 * sc); sh.position.copy(at(x, y, FL + 0.003)); group.add(sh);
      if (sc > 1) for (const yawOff of [POSE.pick[0], POSE.place[0]]) {
        // stands at the pick and place spots, level with the arm's base
        const yw = face + yawOff, r = 0.64 * sc;
        const st = rbox(0.5, h - FL, 0.5, mats.graphite);
        st.position.set(a.root.position.x + Math.sin(yw) * r, (h + FL) / 2, a.root.position.z + Math.cos(yw) * r); group.add(st);
        const top = rbox(0.52, 0.03, 0.52, mats.shell); top.position.set(st.position.x, h - 0.015, st.position.z); group.add(top);
      }
      group.add(a.part);
      return a;
    });
    // humanoid presenting the research wall
    // humanoids: one presenting the research wall, one servicing the server racks, one at the second bench
    const humSpots: [number, number, number, 'present' | 'work' | 'type', number][] = [
      [-8.2, 100.6, -Math.PI / 2 + 0.5, 'present', 0], [8.75, 94.0, Math.PI / 2, 'work', 1.3], [4.9, 99.0, -Math.PI / 2, 'type', 2.6],
    ];
    const hums = (phone ? humSpots.slice(0, 1) : humSpots).map(([x, y, rot, role, ph]) => {
      const h = makeHumanoid(mats); h.root.position.copy(at(x, y, FL)); h.root.rotation.y = rot; group.add(h.root);
      const hs = blob(mats, 0.9); hs.position.copy(at(x, y, FL + 0.003)); group.add(hs);
      return { h, role, ph };
    });
    // drone test pad with two drones
    const padC = at(-5.6, 92.9, FL + 0.005);
    const padDisc = cyl(1.3, 0.01, mats.pad, 40); padDisc.position.copy(padC); group.add(padDisc);
    const padRing = ring(1.15, 0.012, mats.led); padRing.rotation.x = Math.PI / 2; padRing.position.copy(padC).add(new THREE.Vector3(0, 0.008, 0)); group.add(padRing);
    for (const s of [-1, 1]) { const mark = rbox(0.5, 0.004, 0.08, mats.orange); mark.position.copy(padC).add(new THREE.Vector3(0, 0.009, s * 0.6)); group.add(mark); }
    const drones = (phone ? [] : [0, 2.4]).map((ph, i) => { const d = makeDrone(mats, ph); d.base.copy(padC).add(new THREE.Vector3(i ? 0.5 : -0.5, 1.2 + i * 0.35, i ? -0.3 : 0.3)); d.root.position.copy(d.base); group.add(d.root); return d; });
    const droneShadows = drones.map(() => { const s = blob(mats, 0.5); s.position.copy(padC).add(new THREE.Vector3(0, 0.012, 0)); group.add(s); return s; });
    // mobile robot on a loop around the benches
    const rover = makeRover(mats); group.add(rover.root);
    const roverShadow = blob(mats, 0.9, 1.1); group.add(roverShadow);
    group.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { m.raycast = noRay; } });
    return { group, arms, hums, drones, droneShadows, rover, roverShadow, padC };
  }, [mats, phone]);

  const still = useRef(reduced());
  const clock = useRef(0);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const step = (dt: number) => {
    clock.current += dt; const t = clock.current;
    for (const a of built.arms) {
      const { carrying } = poseArm(a, t);
      if (carrying) { a.tip.getWorldPosition(tmp); a.part.position.copy(tmp); a.part.rotation.set(0, a.root.rotation.y + a.yaw.rotation.y, 0); }
      else {
        // rests at the pick spot or the place spot, on the bench in front of the arm
        const k = ((t + a.phase) % CYCLE + CYCLE) % CYCLE; const atPlace = k > SEQ.slice(0, 5).reduce((s, x) => s + x[2], 0) + 0.25 || k < 0.05;
        const yaw = a.root.rotation.y + (atPlace ? POSE.place[0] : POSE.pick[0]);
        a.part.position.set(a.root.position.x + Math.sin(yaw) * 0.64 * a.sc, a.root.position.y + 0.0225 * a.sc, a.root.position.z + Math.cos(yaw) * 0.64 * a.sc);
      }
    }
    // humanoid: breathing, head scanning, and a presenting gesture towards the screen every few seconds
    for (const { h, role, ph } of built.hums) {
      const tt = t + ph;
      h.body.position.y = Math.sin(tt * 1.6) * 0.004;
      if (role === 'present') {
        h.head.rotation.y = Math.sin(tt * 0.45) * 0.45; h.head.rotation.x = Math.sin(tt * 0.3) * 0.05;
        const g = Math.max(0, Math.sin(tt * 0.55)); const gs = smooth(Math.min(1, g * 1.6));
        h.armR.rotation.x = -1.15 * gs; h.armR.rotation.z = 0.08 + 0.35 * gs; h.foreR.rotation.x = -0.35 * gs;
        h.armL.rotation.x = Math.sin(tt * 0.8) * 0.04;
      } else if (role === 'work') {
        // both hands at the rack, small adjustments; looks down now and then
        h.armR.rotation.x = -1.05 + Math.sin(tt * 2.1) * 0.08; h.foreR.rotation.x = -0.6 + Math.sin(tt * 2.6) * 0.1;
        h.armL.rotation.x = -0.95 + Math.sin(tt * 1.7 + 1) * 0.07;
        h.head.rotation.x = 0.12 + Math.max(0, Math.sin(tt * 0.35)) * 0.25; h.head.rotation.y = Math.sin(tt * 0.5) * 0.15;
      } else {
        // working at the bench screen
        h.armR.rotation.x = -0.75 + Math.sin(tt * 6) * 0.03; h.foreR.rotation.x = -0.75;
        h.armL.rotation.x = -0.75 + Math.sin(tt * 6 + 2) * 0.03;
        h.head.rotation.x = 0.28; h.head.rotation.y = Math.sin(tt * 0.4) * 0.2;
      }
    }
    // drones hover and drift; propellers spin
    built.drones.forEach((d, i) => {
      const tt = t + d.phase;
      d.root.position.set(d.base.x + Math.sin(tt * 0.5) * 0.35, d.base.y + Math.sin(tt * 1.7) * 0.05, d.base.z + Math.cos(tt * 0.4) * 0.3);
      d.root.rotation.set(Math.cos(tt * 0.4) * 0.06, tt * 0.25, -Math.sin(tt * 0.5) * 0.06);
      d.props.forEach((p, k) => { p.rotation.y = (k % 2 ? 1 : -1) * t * 40; if (k % 2 === 0) p.rotation.x = -Math.PI / 2; });
      const s = built.droneShadows[i]; s.position.x = d.root.position.x; s.position.z = d.root.position.z;
    });
    // rover: an ellipse around the benches, facing the way it drives; it pauses briefly at the far side
    const r = built.rover; const sp = 0.07; const u = t * sp * Math.PI * 2;
    const cx = 1.0, cy = 99.5, rx = 5.2, ry = 5.5;
    const px = cx + Math.cos(u) * rx, py = cy + Math.sin(u) * ry;
    const dx = -Math.sin(u) * rx, dy = Math.cos(u) * ry;
    r.root.position.copy(at(px, py, FL)); r.root.rotation.y = Math.atan2(dx, -dy);
    r.lidar.rotation.y = t * 6;
    built.roverShadow.position.copy(at(px, py, FL + 0.004)); built.roverShadow.rotation.z = r.root.rotation.y;
  };
  useMemo(() => step(0.0001), [built]); // eslint-disable-line react-hooks/exhaustive-deps
  useFrame((_, dt) => { if (still.current) return; step(Math.min(dt, 0.05)); });
  return <primitive object={built.group} />;
};

/** Hides the old box-shaped robot arm that was baked into the lab room; the live arm above stands in its place. */
export const OLD_LAB_ARM = { min: [-1.85, 1.13, -104.1], max: [-1.15, 2.4, -102.7] } as const;
