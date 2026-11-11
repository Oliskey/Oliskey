// Camera stops through the Oliskey headquarters, authored in Blender coordinates (x right, y into the building, z up, metres)
// and converted to three.js (x, z, -y). A stop is where the camera rests while its text block is centred on screen;
// `via` points are passed through between stops (doorways, around furniture) but never rest.
export type V3 = [number, number, number];
export interface Shot { eye: V3; at: V3; fov: number }
export interface Stop { id: string; desk: Shot; phone?: Shot; via?: boolean; /** the move from this stop to the next is a cinematic cut */ cut?: boolean; /** phone: how far (m) to tilt the view down so the subject sits above the text card */ drop?: number }

const b = (x: number, y: number, z: number): V3 => [x, z, -y];
const s = (eye: V3, at: V3, fov: number): Shot => ({ eye: b(...eye), at: b(...at), fov });
const via = (id: string, p: V3): Stop => ({ id, via: true, desk: s(p, p, 0) });

/** Outside → entrance → showroom. The walk then continues into the room the visitor chose (see homeStops). */
const ARRIVAL: Stop[] = [
  { id: 'outside', desk: s([-13, -33, 2.2], [-5.5, 0, 6.8], 46), phone: s([-3, -60, 3.2], [0, 0, -5.5], 60) },
  { id: 'entrance', desk: s([0, -10.5, 2.1], [0, 12, 3.6], 48), phone: s([0, -12.5, 2.0], [0, 12, 4.4], 68) },
];
// walking in through the sliding doors to the showroom (only once a world is chosen)
const WALK_IN: Stop[] = [
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
  school: { id: 'school-end', desk: s([-0.8, 32.4, 2.9], [-8, 23.5, 0.9], 60), phone: s([-1.0, 32.6, 2.9], [-7, 23.5, 0.8], 76) },
  fleet: { id: 'fleet-end', desk: s([9.4, 64.6, 3.4], [-1, 47, 0.8], 58), phone: s([9.6, 64.8, 3.6], [0, 48, 0.6], 76) },
  alpha: { id: 'alpha-end', desk: s([-9.0, 86.4, 3.4], [2, 68.5, 0.9], 58), phone: s([-9.4, 86.8, 3.6], [1, 69, 0.6], 76) },
  labs: { id: 'labs-end', desk: s([-9.0, 108.4, 3.3], [4, 92, 1.0], 58), phone: s([-9.4, 108.8, 3.5], [3, 93, 0.7], 76) },
};

/** Paths to the closing view that keep clear of furniture and people. */
const TO_FINALE: Partial<Record<'school' | 'fleet' | 'alpha' | 'labs', Stop[]>> = {
  alpha: [via('alpha-side', [4.6, 79.5, 2.45]), via('alpha-back', [4.2, 85.6, 2.9])],
};

/** Home walk: arrival; then, once a world is chosen, its display in the showroom, a cut inside, three stops and a closing view. */
export function homeStops(world: 'school' | 'fleet' | 'alpha' | 'labs' | null): Stop[] {
  if (!world) return ARRIVAL;
  return [...ARRIVAL, ...WALK_IN, via('showroom-turn', [TOTEM[world][0] * 0.4, 8.5, 2.5]), preview(world), ...ROOM_STOPS[world], ...(TO_FINALE[world] ?? []), FINALE[world]];
}

// Each product page walks its own room in three steps: the room, the main display, a closer detail.
export const ROOM_STOPS: Record<'school' | 'fleet' | 'alpha' | 'labs', Stop[]> = {
  // School: class JSS 1A → hands up → through the door to JSS 2B → the school office → (cut) a parent at work, away from school
  school: [
    { id: 'room', drop: 2.6, desk: s([-0.9, 32.2, 2.35], [-6.2, 23.5, 1.3], 56), phone: s([-1.2, 32.4, 2.3], [-6.0, 23.2, 1.6], 74) },
    { id: 'display', desk: s([-2.2, 30.6, 1.95], [-6.5, 25.4, 1.25], 50), phone: s([-2.4, 31.2, 2.0], [-6.4, 25.4, 1.3], 66) },
    via('school-door', [0, 31.8, 2.15]),
    via('school-classb', [4.6, 32.0, 2.25]),
    { id: 'detail', desk: s([10.3, 31.4, 2.3], [4.5, 23.3, 1.2], 54), phone: s([10.3, 31.6, 2.3], [5.0, 23.5, 1.4], 72) },
    via('school-door2', [9.2, 32.6, 2.15]),
    via('school-office', [9.2, 34.0, 2.15]),
    { id: 'admin', cut: true, desk: s([7.0, 36.0, 2.0], [1.8, 38.7, 1.3], 52), phone: s([7.4, 35.6, 2.0], [2.0, 38.7, 1.4], 68) },
    { id: 'parent', cut: true, desk: s([-5.4, 35.2, 1.9], [-9.6, 38.9, 1.2], 50), phone: s([-5.2, 34.9, 1.95], [-9.5, 38.9, 1.3], 66) },
  ],
  fleet: [
    { id: 'room', desk: s([-4.5, 45.4, 2.7], [5, 56, 0.9], 54), phone: s([-4.8, 45.0, 2.6], [4.5, 56, 1.8], 74) },
    { id: 'display', desk: s([-1.6, 50.6, 2.1], [-11, 54.0, 2.1], 52), phone: s([-1.2, 49.6, 2.1], [-11, 53.0, 2.6], 66) },
    // a driver paying the area staff from his phone, recorded on the staff tablet
    { id: 'detail', drop: 0.25, desk: s([-0.3, 54.9, 1.85], [1.4, 53.4, 1.25], 50), phone: s([-1.5, 56.3, 1.95], [1.3, 53.4, 1.45], 62) },
    // a driver paying from his seat in the keke
    { id: 'drivers', desk: s([3.05, 56.3, 2.0], [3.75, 54.2, 1.55], 56), phone: s([3.0, 56.45, 2.05], [3.75, 54.2, 1.6], 66) },
    // the aisle between the kekes, to the bay where a keke is driving in
    { id: 'arriving', desk: s([6.6, 55.6, 2.0], [10.6, 60.0, 1.3], 54), phone: s([6.4, 55.4, 2.0], [10.6, 60.0, 1.5], 70) },
  ],
  alpha: [
    { id: 'room', drop: 3.4, desk: s([7.5, 68.6, 2.6], [-8, 77, 1.6], 54), phone: s([7.6, 68.4, 2.6], [-8, 77, 2.4], 74) },
    via('alpha-aisle1', [4.2, 71.4, 2.5]),        // through the aisle between desk rows, never over a trader's head
    { id: 'display', desk: s([0.4, 72.7, 2.25], [-11, 73.4, 2.7], 50), phone: s([3.4, 72.4, 2.2], [-11, 72.4, 3.1], 66) },
    via('alpha-aisle2', [3.2, 73.0, 2.9]),
    // over a trader's shoulder: the Alpha app, his chart and the trade he just won
    { id: 'detail', desk: s([3.25, 75.05, 2.42], [1.3, 73.9, 1.55], 50), phone: s([3.4, 75.2, 2.25], [1.3, 73.9, 1.75], 64) },
  ],
  labs: [
    { id: 'room', desk: s([7, 89.6, 2.5], [-6, 100, 1.5], 54), phone: s([7, 89.2, 2.5], [-6, 100, 2.3], 74) },
    { id: 'display', desk: s([1.0, 97.0, 2.1], [-11, 97.0, 2.6], 50), phone: s([3.4, 97.0, 2.1], [-11, 97.0, 3.0], 68) },
    { id: 'detail', desk: s([1.6, 105.2, 1.7], [-1.5, 102.6, 1.25], 46), phone: s([2.0, 106.2, 1.9], [-1.5, 102.6, 1.7], 64) },
  ],
};

/** Which GLB zones a page needs. */
export type Zone = 'hq' | 'school' | 'fleet' | 'alpha' | 'labs';

/** Phone & tablet framing: the text card covers the lower half of a tall screen, so the camera sits a little higher and
 *  looks slightly down — the subject (desks, kekes, benches, screens) lands in the visible upper half, not the ceiling. */
function framePhone(list: Stop[]) {
  for (const st of list) {
    if (!st.phone || st.via || st.id === 'outside' || st.id.endsWith('-preview')) continue;
    // the drop scales with distance, so close shots (over a trader's shoulder) keep their subject instead of looking at the floor
    const d = Math.hypot(st.phone.at[0] - st.phone.eye[0], st.phone.at[2] - st.phone.eye[2]);
    const k = d < 3 ? d / 8 : 1;
    st.phone = { ...st.phone, eye: [st.phone.eye[0], st.phone.eye[1] + 0.55 * k, st.phone.eye[2]], at: [st.phone.at[0], st.desk.at[1] - (st.drop ?? 1.3) * k, st.phone.at[2]] };
  }
}
framePhone(ARRIVAL); framePhone(WALK_IN); Object.values(ROOM_STOPS).forEach(framePhone); Object.values(FINALE).forEach((f) => framePhone([f]));
