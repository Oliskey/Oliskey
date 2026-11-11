// Camera stops through the Oliskey headquarters, authored in Blender coordinates (x right, y into the building, z up, metres)
// and converted to three.js (x, z, -y). A stop is where the camera rests while its text block is centred on screen;
// `via` points are passed through between stops (doorways, around furniture) but never rest.
export type V3 = [number, number, number];
export interface Shot { eye: V3; at: V3; fov: number }
export interface Stop { id: string; desk: Shot; phone?: Shot; via?: boolean; /** the move from this stop to the next is a cinematic cut */ cut?: boolean }

const b = (x: number, y: number, z: number): V3 => [x, z, -y];
const s = (eye: V3, at: V3, fov: number): Shot => ({ eye: b(...eye), at: b(...at), fov });
const via = (id: string, p: V3): Stop => ({ id, via: true, desk: s(p, p, 0) });

/** Outside → entrance → showroom. The walk then continues into the room the visitor chose (see homeStops). */
const ARRIVAL: Stop[] = [
  { id: 'outside', desk: s([-13, -33, 2.2], [-5.5, 0, 6.8], 46), phone: s([-3, -60, 3.2], [0, 0, -5.5], 60) },
  { id: 'entrance', desk: s([0, -10.5, 2.1], [0, 12, 3.6], 48), phone: s([0, -12.5, 2.0], [0, 12, 4.4], 68) },
  via('door', [0, -0.8, 2.0]),
  { id: 'lobby', desk: s([-5.5, 2.6, 2.2], [2.5, 15, 3.1], 52), phone: s([-1.6, 1.6, 2.0], [0.4, 15, 4.4], 72) },
];
// In the showroom, each world has its own display. Choosing a world moves the camera up to that display first (you see
// the world you picked), then cuts straight inside it.
const TOTEM: Record<'school' | 'fleet' | 'alpha' | 'labs', [number, number]> = { school: [-7.6, 15.2], fleet: [-2.6, 16.4], alpha: [2.6, 16.4], labs: [7.6, 15.2] };
const preview = (w: 'school' | 'fleet' | 'alpha' | 'labs'): Stop => {
  const [x, y] = TOTEM[w];
  return { id: `${w}-preview`, cut: true, desk: s([x * 0.75, y - 4.6, 2.75], [x, y, 2.95], 44), phone: s([x, y - 6.2, 2.9], [x, y, 2.6], 58) };
};
// The closing view of each world: a wide, calm shot to end on.
const FINALE: Record<'school' | 'fleet' | 'alpha' | 'labs', Stop> = {
  school: { id: 'school-end', desk: s([-9.0, 42.4, 3.4], [3, 27, 0.8], 58), phone: s([-9.4, 42.8, 3.6], [2, 28, 0.6], 76) },
  fleet: { id: 'fleet-end', desk: s([9.4, 64.6, 3.4], [-1, 47, 0.8], 58), phone: s([9.6, 64.8, 3.6], [0, 48, 0.6], 76) },
  alpha: { id: 'alpha-end', desk: s([-9.0, 86.4, 3.4], [2, 68.5, 0.9], 58), phone: s([-9.4, 86.8, 3.6], [1, 69, 0.6], 76) },
  labs: { id: 'labs-end', desk: s([-9.0, 108.4, 3.3], [4, 92, 1.0], 58), phone: s([-9.4, 108.8, 3.5], [3, 93, 0.7], 76) },
};

/** Home walk: arrival; then, once a world is chosen, its display in the showroom, a cut inside, three stops and a closing view. */
export function homeStops(world: 'school' | 'fleet' | 'alpha' | 'labs' | null): Stop[] {
  if (!world) return ARRIVAL;
  return [...ARRIVAL, via('showroom-turn', [TOTEM[world][0] * 0.4, 8.5, 2.5]), preview(world), ...ROOM_STOPS[world], FINALE[world]];
}

// Each product page walks its own room in three steps: the room, the main display, a closer detail.
export const ROOM_STOPS: Record<'school' | 'fleet' | 'alpha' | 'labs', Stop[]> = {
  school: [
    { id: 'room', desk: s([8.5, 24.6, 2.6], [-6, 34, 1.6], 54), phone: s([8.6, 24.2, 2.6], [-6, 34, 2.6], 74) },
    { id: 'display', desk: s([-1.8, 33.2, 1.9], [-11, 33.0, 2.5], 48), phone: s([1.5, 33.0, 2.0], [-11, 33.0, 2.9], 66) },
    { id: 'detail', desk: s([0.8, 39.8, 1.6], [-4, 29.5, 0.6], 50), phone: s([2.0, 41.0, 1.9], [-4, 29.5, 1.2], 70) },
  ],
  fleet: [
    { id: 'room', desk: s([-4.5, 45.4, 2.7], [5, 56, 0.9], 54), phone: s([-4.8, 45.0, 2.6], [4.5, 56, 1.8], 74) },
    { id: 'display', desk: s([0.6, 54.4, 2.1], [-11, 54.3, 2.6], 52), phone: s([2.6, 51.2, 2.1], [-11, 51.2, 3.0], 66) },
    { id: 'detail', desk: s([0.0, 49.5, 1.5], [4.5, 55.5, 0.9], 50), phone: s([-0.5, 48.0, 1.7], [4.5, 55.5, 1.5], 70) },
  ],
  alpha: [
    { id: 'room', desk: s([7.5, 68.6, 2.6], [-8, 77, 1.6], 54), phone: s([7.6, 68.4, 2.6], [-8, 77, 2.4], 74) },
    { id: 'display', desk: s([1.5, 75.4, 2.2], [-11, 75.4, 2.7], 50), phone: s([3.4, 72.4, 2.2], [-11, 72.4, 3.1], 66) },
    { id: 'detail', desk: s([-3.0, 81.8, 1.55], [-0.5, 74.0, 1.15], 48), phone: s([-3.2, 82.6, 1.8], [-0.5, 74.0, 1.6], 70) },
  ],
  labs: [
    { id: 'room', desk: s([7, 89.6, 2.5], [-6, 100, 1.5], 54), phone: s([7, 89.2, 2.5], [-6, 100, 2.3], 74) },
    { id: 'display', desk: s([1.0, 97.0, 2.1], [-11, 97.0, 2.6], 50), phone: s([3.4, 97.0, 2.1], [-11, 97.0, 3.0], 68) },
    { id: 'detail', desk: s([1.6, 105.2, 1.7], [-1.5, 102.6, 1.25], 46), phone: s([2.0, 106.2, 1.9], [-1.5, 102.6, 1.7], 64) },
  ],
};

/** Which GLB zones a page needs. */
export type Zone = 'hq' | 'school' | 'fleet' | 'alpha' | 'labs';
