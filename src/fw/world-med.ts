/** The Mediterranean: the sea in the middle, Spain across the whole west, Morocco to the south, Dalmatia to the north, Greece as islands in the east. Objects come from graph.ts. */
import * as THREE from "three";
import { MED_OBJECTS, type EnrichedRecipe } from "./graph";
import { add, birds, type P } from "./props";
import { MED_PROPS, MD, cycladicHouse, blueDomeChurch, windmill, parthenon, riad, koutoubia, atlas, stoneHouse, walledTown, sailboat, dolphin, islander } from "./props-med";
import { cypress, umbrellaPine } from "./props-italy";
import { datePalm } from "./props-mideast";
import { SPAIN_PROPS } from "./props-spain";
import { spainLandscape } from "./spain-landscape";
import { spainTown, SPAIN_LANES, SPAIN_BRIDGES, BRIDGE_SPAN, BRIDGE_DECK_Y, type Lane } from "./spain-town";
import { spainCountryside } from "./spain-countryside";
import { spainResident, spainWalk, spainMule, followMule } from "./spain-people";
import { path, tree } from "./props";
import { buildWorld, seaWater, type Diorama, type LayoutCtx } from "./worldkit";

export function buildMed(recipes: EnrichedRecipe[]): Diorama {
  return buildWorld({
    id: "mediterranean", W: 120, D: 56, cx: -22, ground: "#b9c47c", plinth: "#6b4a32", recipes,
    objects: MED_OBJECTS, props: { ...MED_PROPS, ...SPAIN_PROPS },
    small: /^(flamenco)$/, fallbackPlace: "taverna", discoveryCues: true,
    layout: layoutMed,
  });
}

/** How far a walker is raised while it is on a bridge deck, and the ramp at each end. */
function bridgeLift(lane: Lane): ((u: number) => number) | undefined {
  const dx = lane.to[0] - lane.from[0], dz = lane.to[1] - lane.from[1], length = Math.hypot(dx, dz) || 1;
  for (const [bx, bz] of SPAIN_BRIDGES) {
    const t = ((bx - lane.from[0]) * dx + (bz - lane.from[1]) * dz) / (length * length);
    if (t < 0 || t > 1) continue;
    const off = Math.hypot(lane.from[0] + dx * t - bx, lane.from[1] + dz * t - bz);
    if (off > 1.2) continue;
    const half = BRIDGE_SPAN / 2 / length, ramp = .8 / length;
    return (u: number) => {
      const d = Math.abs(u - t);
      return d > half ? 0 : d < half - ramp ? BRIDGE_DECK_Y : BRIDGE_DECK_Y * (half - d) / ramp;
    };
  }
  return undefined;
}

function layoutMed(ctx: LayoutCtx) {
  const { group, tickers, place, tint, TOP } = ctx;
  tint(-8, 21, 22, 7, "#d9b98a", -0.05);       // Morocco's red earth
  tint(8, -22, 26, 6, "#b3bf86", 0.05);        // Dalmatia's karst green

  // ---------- Spain: its own ground, water, roads, town and fields ----------
  spainLandscape(ctx);

  // ---------- the old sea, with Greece's islands in it ----------
  const sea = seaWater();
  tickers.push((t) => { sea.uniforms.uTime.value = t; });
  const island = (cx: number, cz: number, rx: number, rz: number, color: string) => {
    const rim = new THREE.Shape(); rim.absellipse(cx, cz, rx + 0.8, rz + 0.8, 0, Math.PI * 2, false, 0);
    const land = new THREE.Shape(); land.absellipse(cx, cz, rx, rz, 0, Math.PI * 2, false, 0);
    const r = new THREE.Mesh(new THREE.ShapeGeometry(rim, 40), new THREE.MeshStandardMaterial({ color: "#eee3bf" })); r.rotation.x = -Math.PI / 2; r.scale.y = -1; r.position.y = TOP + 0.075; group.add(r);
    const l = new THREE.Mesh(new THREE.ShapeGeometry(land, 40), new THREE.MeshStandardMaterial({ color })); l.rotation.x = -Math.PI / 2; l.scale.y = -1; l.position.y = TOP + 0.09; l.receiveShadow = true; group.add(l);
  };
  island(26, -4, 10, 7, "#c4b78a");   // the Attic rock and the Cyclades
  island(25, 15, 7.5, 6, "#a9bf7a");  // a green island of olives

  // ---------- Greece ----------
  place(parthenon(), 19, -6, 0.1).scale.setScalar(0.55);
  place(blueDomeChurch(), 21, 0.5, 0.2).scale.setScalar(0.8);
  const mill = windmill(); place(mill, 33.5, -1.5, -0.6).scale.setScalar(0.8); tickers.push(mill.userData.tick!);
  for (const [x, z, rot, st, dm] of [[30, -9.5, 0.1, 1, true], [24, -9.5, -0.2, 2, false], [21, 17.5, 0.1, 1, true], [35, -5, 0.3, 1, false]] as [number, number, number, number, boolean][]) place(cycladicHouse(2.4, 2.0, 1.9, { storeys: st, dome: dm }), x, z, rot);
  for (const [x, z] of [[24, 2.2], [31, 2], [29, -10.5]]) place(cypress(0.7), x, z, x);
  group.add(path([[24, 1.5], [29, 2], [32, -2.5], [28, -8.5], [24, -10], [23.5, -2], [24, 1.5]], 1.4, "#d9cfae"));

  // ---------- Spain: the six clusters and the land between them ----------
  spainTown(ctx);
  spainCountryside(ctx);

  // ---------- Morocco. Three items moved east: the grown table put them inside the Valencian huerta ----------
  const kt = koutoubia(); place(kt, -3, 25.2, 0.1).scale.setScalar(0.75); tickers.push(kt.userData.tick!);
  // The fourth riad stood at [-34, 26], four units west of the Moroccan tint and on Spanish green ground with
  // Andalusian houses beside it; it now stands inside the cluster, east of the x -18 line Spain owns to.
  // Two more still stood on Spanish ground on 2026-09-17, at [-21, 25] and [-27, 26]; the second of them was a
  // two-storey riad nine units in front of the huerta beds, which is a Spanish stand, so both crossed the line
  // as well. Nothing Moroccan now stands west of x -18.
  for (const [x, z, rot, st, tw] of [[-17.6, 26.4, 0.1, 1, true], [-11.5, 26.6, -0.1, 2, false], [-8, 26.5, 0.1, 1, false], [-13, 23.5, 0.2, 1, false], [9, 26.5, -0.1, 1, true]] as [number, number, number, number, boolean][]) place(riad(3.0, 2.6, 2.2, { storeys: st, tower: tw }), x, z, rot);
  place(atlas(), -17, 24.5, 0.2).scale.setScalar(0.8);
  for (const [x, z, s] of [[-15, 14, 0.9], [2, 13.5, 1.0], [-10, 13, 0.8], [11, 17, 0.9]] as [number, number, number][]) { const p = datePalm(s); place(p, x, z, x); tickers.push(p.userData.tick!); }
  // The Moroccan loop used to run west to x -26, across Spanish ground and the edge of the Valencian huerta.
  // It now turns north at x -16.5, east of the x -18 line, and touches neither.
  group.add(path([[-16.5, 15.5], [-17.5, 24.5], [-12, 27.2], [3, 24.5], [5, 15.5], [-8, 13.8], [-16.5, 15.5]], 1.8, "#d9c7a0"));

  // ---------- Dalmatia ----------
  place(walledTown(), 4, -22, 0).scale.setScalar(0.9);
  for (const [x, z, rot, st] of [[24, -22, 0.1, 2], [28, -24.5, -0.1, 1], [32, -21, 0.2, 1], [-16, -25, 0.1, 1]] as [number, number, number, number][]) place(stoneHouse(2.8, 2.2, 2.0, { storeys: st }), x, z, rot);
  for (let i = 0; i < 5; i++) place(cypress(0.8 + (i % 2) * 0.2), 20 + i * 3.4, -26.5, i);
  for (const [x, z] of [[-3, -26.5], [14, -18]]) place(umbrellaPine(0.8), x, z, x);
  group.add(path([[-14, -16], [-4, -16], [12, -16.5], [12.2, -26], [-13, -26], [-14, -16]], 1.6, "#d9cfae"));

  // ---------- on the water: sailboats, a ferry line, dolphins, gulls ----------
  const boats = [sailboat(MD.white), sailboat("#f2c14e"), sailboat("#c0392b")];
  boats.forEach((b) => { group.add(b); tickers.push(b.userData.tick!); });
  const lane = new THREE.CatmullRomCurve3([[-12, -2], [-4, -8], [8, -9], [14, -2], [12, 6], [2, 8], [-8, 6]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true);
  tickers.push((t) => boats.forEach((b, i) => { const u = (t * 0.006 + i / 3) % 1; const p = lane.getPointAt(u), n = lane.getPointAt((u + 0.005) % 1); b.position.set(p.x, TOP + 0.05, p.z); b.rotation.y = Math.atan2(n.x - p.x, n.z - p.z) - Math.PI / 2; }));
  const pod = [0, 1, 2].map(() => { const d = dolphin(); group.add(d); return d; });
  tickers.push((t) => pod.forEach((d, i) => { const ph = t * 0.9 + i * 1.2; const a = ph * 0.35; const cx = 20 + Math.cos(a) * 9, cz = 12 + Math.sin(a) * 4; const jump = Math.max(0, Math.sin(ph)); d.position.set(cx, TOP - 0.3 + jump * 1.4, cz); d.rotation.y = -a + Math.PI / 2; d.rotation.z = Math.cos(ph) * 0.9; d.visible = jump > 0.05; }));
  const gulls = birds(6, 9, 8); gulls.position.set(4, TOP, -4); group.add(gulls); tickers.push(gulls.userData.tick!);
  const gulls2 = birds(4, 6, 7); gulls2.position.set(-16, TOP, 2); group.add(gulls2); tickers.push(gulls2.userData.tick!);
  // The Cantabrian gulls circle over the water, clear of the quay and the terrace below them.
  const gulls3 = birds(5, 4, 7); gulls3.position.set(-28, TOP, -26); group.add(gulls3); tickers.push(gulls3.userData.tick!);

  // ---------- Spanish life: four walker loops on the lanes, one with a pack mule ----------
  const mules: [P, P][] = [];
  for (const walkLane of SPAIN_LANES) {
    const lift = bridgeLift(walkLane);
    for (let i = 0; i < walkLane.walkers; i++) {
      const seed = walkLane.seed + i;
      const p = spainResident(seed);
      p.name = 'spanish-walker'; p.userData.lane = walkLane.id; group.add(p);
      tickers.push(spainWalk(p, walkLane.from, walkLane.to, walkLane.range, seed + i * 5, lift));
      if (walkLane.id === 'valencia-lane-2' && i === 0) { const m = spainMule(); m.name = 'spanish-mule'; group.add(m); mules.push([m, p]); }
    }
  }
  for (const [mule, leader] of mules) tickers.push(followMule(mule, leader, group));
  // Neighbours who stand and talk: the square, the fair, the quay and the bodega door.
  for (const [i, [x, z, n]] of ([[-44.6, -6.2, 3], [-51.4, -18.4, 2], [-32.6, -21.4, 2], [-46.8, 17.4, 2], [-27.4, 9.4, 2]] as [number, number, number][]).entries()) {
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2 + i;
      const person = place(spainResident(40 + i * 3 + k), x + Math.cos(a) * 0.55, z + Math.sin(a) * 0.55, -a - Math.PI / 2);
      person.name = 'spanish-neighbour';
    }
  }

  // ---------- the rest of the old Mediterranean life ----------
  const loops: [THREE.CatmullRomCurve3, [string, string][], number][] = [
    [new THREE.CatmullRomCurve3([[24, 1.5], [29, 2], [30.5, -0.5], [31.5, -4.5], [28.5, -6], [26.2, -7.6], [24.2, -5.5], [23.5, -2]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true), [["#f4f1ea", "hat"], ["#3f6fb5", ""], ["#c0392b", "scarf"], ["#2a2a2e", ""], ["#e0a52c", "hat"]], 0.008],
    [new THREE.CatmullRomCurve3([[-16.5, 15.5], [-16.5, 23.5], [-12, 24.6], [-7, 22.8], [-1, 22.6], [2.5, 16.5], [-8, 13.8]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true), [["#f4f1ea", "fez"], ["#3f6fb5", "scarf"], ["#7a4a3a", ""], ["#c0392b", "fez"], ["#2f5d3f", "scarf"], ["#e0b34c", ""]], 0.007],
    [new THREE.CatmullRomCurve3([[-14, -16], [-4, -16], [12, -16.5], [12.2, -26], [-13, -26]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true), [["#3f6fb5", ""], ["#f4f1ea", "flat"], ["#c0392b", ""], ["#2a2a2e", "hat"]], 0.008],
  ];
  for (const [curve, people, speed] of loops) {
    const walkers = people.map(([c, hat]) => islander(c, { hat: hat === "hat", fez: hat === "fez", flat: hat === "flat", scarf: hat === "scarf" ? ["#9b59b6", "#2a5fb8", "#e0b34c"][c.length % 3] : undefined }));
    walkers.forEach((w) => group.add(w));
    tickers.push((t) => walkers.forEach((w, i) => { const u = (t * speed + i / walkers.length) % 1; const p = curve.getPointAt(u), n = curve.getPointAt((u + 0.004) % 1); w.position.set(p.x, 0, p.z); w.rotation.y = Math.atan2(n.x - p.x, n.z - p.z); w.userData.walk?.(t + i); }));
  }
  for (const [x, z, n] of [[22, -1.5, 2], [-13, 16.5, 2], [14, -19.5, 2], [30, 18, 2]] as [number, number, number][]) for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; place(islander(["#f4f1ea", "#3f6fb5", "#c0392b", "#e0a52c"][(i + Math.abs(x)) % 4], { hat: i === 1, fez: z > 12 && i === 0 }), x + Math.cos(a) * 0.5, z + Math.sin(a) * 0.5, -a - Math.PI / 2); }
  void add; void tree;
}
