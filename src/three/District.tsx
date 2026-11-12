import React, { useEffect, useMemo } from 'react';
import * as THREE from 'three';

// The neighbourhood around the Oliskey HQ, so every direction a visitor looks shows something real instead of a blurred
// background: a business district of glass office blocks (windows lit at night), roads with lane markings, pavements,
// street lamps, trees and lawns. Built in code, lit by the same sky (environment map) as the rest of the scene.
// Coordinates here are three.js (x right, y up, z = −Blender y). The HQ plaza covers x −45…45, z 0…48.

type Mode = 'day' | 'night';
const rnd = (() => { let s = 7; return () => ((s = (s * 16807) % 2147483647) / 2147483647); })();

function facadeTexture(night: boolean) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 256;
  const g = c.getContext('2d')!;
  g.fillStyle = night ? '#1a2233' : '#c9d2dc'; g.fillRect(0, 0, 256, 256);          // mullions / spandrels
  for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
    const lit = night && rnd() < 0.3;
    g.fillStyle = night ? (lit ? (rnd() < 0.5 ? '#ffd9a0' : '#fff1d6') : '#0b1220') : (rnd() < 0.15 ? '#7f97b3' : '#93abc6');
    g.fillRect(x * 64 + 5, y * 64 + 9, 54, 46);
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4;
  return t;
}
function roadTexture() {
  const c = document.createElement('canvas'); c.width = 64; c.height = 256;
  const g = c.getContext('2d')!;
  g.fillStyle = '#3a3d42'; g.fillRect(0, 0, 64, 256);
  for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(255,255,255,${rnd() * 0.05})`; g.fillRect(rnd() * 64, rnd() * 256, 1.5, 1.5); }
  g.fillStyle = '#e9e4cf'; g.fillRect(30, 0, 4, 128);                                    // dashed centre line
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8;
  return t;
}

const District: React.FC<{ mode: Mode; env: THREE.Texture | null; lite: boolean }> = ({ mode, env, lite }) => {
  const night = mode === 'night';
  const data = useMemo(() => {
    // office blocks: a row across the front road, rows down both sides, a skyline behind
    const blocks: { x: number; z: number; w: number; d: number; h: number }[] = [];
    for (let x = -150; x <= 150; x += 26) blocks.push({ x: x + rnd() * 6, z: 92 + rnd() * 10, w: 16 + rnd() * 8, d: 18 + rnd() * 8, h: 14 + rnd() * 34 });
    for (const side of [-1, 1]) for (let z = 50; z >= -150; z -= 28) blocks.push({ x: side * (92 + rnd() * 8), z: z + rnd() * 6, w: 18 + rnd() * 8, d: 18 + rnd() * 8, h: 12 + rnd() * 30 });
    for (let x = -120; x <= 120; x += 30) blocks.push({ x: x + rnd() * 10, z: -200 - rnd() * 20, w: 20 + rnd() * 10, d: 20, h: 25 + rnd() * 40 });
    const trees: [number, number, number][] = [];
    for (let x = -140; x <= 140; x += 12) { trees.push([x + rnd() * 2, 66, 0.9 + rnd() * 0.4]); }
    for (const side of [-1, 1]) for (let z = 40; z >= -140; z -= 12) trees.push([side * (70 + rnd() * 2), z, 0.9 + rnd() * 0.4]);
    const lamps: [number, number][] = [];
    for (let x = -140; x <= 140; x += 24) lamps.push([x, 73]);
    for (const side of [-1, 1]) for (let z = 50; z >= -140; z -= 24) lamps.push([side * 76, z]);
    return { blocks: lite ? blocks.filter((_, i) => i % 2 === 0) : blocks, trees: lite ? trees.filter((_, i) => i % 2 === 0) : trees, lamps };
  }, [lite]);

  const mats = useMemo(() => {
    const facade = facadeTexture(night);
    const road = roadTexture();
    return {
      facade,
      building: new THREE.MeshStandardMaterial({ map: facade, color: new THREE.Color(night ? 0.5 : 0.82, night ? 0.5 : 0.84, night ? 0.5 : 0.88), roughness: 0.35, metalness: 0.15, emissive: new THREE.Color(night ? 0xffffff : 0x000000), emissiveMap: night ? facade : null, emissiveIntensity: night ? 0.16 : 0 }),
      roof: new THREE.MeshStandardMaterial({ color: night ? 0x1c222d : 0x8c939c, roughness: 0.9 }),
      road: new THREE.MeshStandardMaterial({ map: road, roughness: 0.85 }),
      walk: new THREE.MeshStandardMaterial({ color: night ? 0x5a5d62 : 0xbdbab3, roughness: 0.9 }),
      grass: new THREE.MeshStandardMaterial({ color: night ? 0x1d2b1a : 0x5f8a3e, roughness: 1 }),
      trunk: new THREE.MeshStandardMaterial({ color: 0x4e3b2a, roughness: 1 }),
      leaf: new THREE.MeshStandardMaterial({ color: night ? 0x1f3a1c : 0x3f6d2c, roughness: 0.95, flatShading: true }),
      pole: new THREE.MeshStandardMaterial({ color: 0x30343a, roughness: 0.4, metalness: 0.7 }),
      bulb: new THREE.MeshBasicMaterial({ color: night ? new THREE.Color(3, 2.6, 2) : new THREE.Color(0.9, 0.9, 0.85), toneMapped: !night }),
    };
  }, [night]);
  // one material per office block (its own facade repeat), made once — not on every render — so the sky's reflections reach every block
  const blockMats = useMemo(() => data.blocks.map((b) => {
    const t = mats.facade.clone(); t.repeat.set(Math.round(b.w / 3.2), Math.round(b.h / 3.6)); t.needsUpdate = true;
    const m = mats.building.clone(); m.map = t; if (night) m.emissiveMap = t;
    return m;
  }), [data, mats, night]);
  useEffect(() => () => { for (const m of blockMats) { m.map?.dispose(); m.dispose(); } }, [blockMats]);
  useEffect(() => {
    for (const m of [mats.building, mats.roof, mats.road, mats.walk, mats.grass, mats.trunk, mats.leaf, mats.pole, ...blockMats]) {
      m.envMap = env; m.envMapIntensity = night ? 0.15 : 0.75;
      // until the sky's reflections have loaded, light each surface by its own colour so nothing shows as a black shape
      if (!env && !night) { m.emissive = m.color.clone().multiplyScalar(0.55); m.emissiveIntensity = 1; if (m.map) m.emissiveMap = m.map; }
      else if (!night) { m.emissive.setRGB(0, 0, 0); m.emissiveMap = null; }
      m.needsUpdate = true;
    }
  }, [mats, blockMats, env, night]);
  useEffect(() => () => { Object.values(mats).forEach((m) => (m as THREE.Material).dispose?.()); }, [mats]);

  const geo = useMemo(() => ({ box: new THREE.BoxGeometry(1, 1, 1), leaf: new THREE.IcosahedronGeometry(1, 1), trunk: new THREE.CylinderGeometry(0.12, 0.18, 1, 8), pole: new THREE.CylinderGeometry(0.07, 0.09, 1, 8) }), []);
  const roadMesh = (w: number, l: number, pos: [number, number, number], rotY = 0, key: string) => {
    const g = new THREE.PlaneGeometry(w, l); const uv = g.attributes.uv as THREE.BufferAttribute;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i), uv.getY(i) * l / 12);   // one dash every 12 m
    return <mesh key={key} geometry={g} material={mats.road} rotation={[-Math.PI / 2, 0, rotY]} position={pos} />;
  };

  return (
    <group>
      {/* lawns and pavements around the plaza, roads around the block */}
      <mesh material={mats.grass} rotation-x={-Math.PI / 2} position={[0, -0.06, 0]}><planeGeometry args={[700, 700]} /></mesh>
      <mesh material={mats.walk} rotation-x={-Math.PI / 2} position={[0, -0.03, 64]}><planeGeometry args={[310, 6]} /></mesh>
      {roadMesh(12, 320, [0, -0.02, 73], Math.PI / 2, 'front')}
      {roadMesh(12, 220, [-82, -0.02, -40], 0, 'left')}
      {roadMesh(12, 220, [82, -0.02, -40], 0, 'right')}
      {/* office blocks */}
      {data.blocks.map((b, i) => {
        const m = blockMats[i];
        return (
          <group key={i} position={[b.x, 0, b.z]}>
            <mesh geometry={geo.box} material={m} position={[0, b.h / 2, 0]} scale={[b.w, b.h, b.d]} />
            <mesh geometry={geo.box} material={mats.roof} position={[0, b.h + 0.3, 0]} scale={[b.w + 0.4, 0.6, b.d + 0.4]} />
          </group>
        );
      })}
      {/* trees along the roads */}
      {data.trees.map(([x, z, s], i) => (
        <group key={`t${i}`} position={[x, 0, z]} scale={s}>
          <mesh geometry={geo.trunk} material={mats.trunk} position={[0, 1.6, 0]} scale={[1, 3.2, 1]} />
          <mesh geometry={geo.leaf} material={mats.leaf} position={[0, 4.2, 0]} scale={[2.2, 1.8, 2.2]} />
          <mesh geometry={geo.leaf} material={mats.leaf} position={[0.9, 3.6, 0.4]} scale={1.4} />
          <mesh geometry={geo.leaf} material={mats.leaf} position={[-0.8, 3.8, -0.5]} scale={1.5} />
        </group>
      ))}
      {/* street lamps */}
      {data.lamps.map(([x, z], i) => (
        <group key={`l${i}`} position={[x, 0, z]}>
          <mesh geometry={geo.pole} material={mats.pole} position={[0, 3.5, 0]} scale={[1, 7, 1]} />
          <mesh geometry={geo.box} material={mats.bulb} position={[0, 7.05, 0]} scale={[0.9, 0.12, 0.35]} />
        </group>
      ))}
    </group>
  );
};
export default District;
