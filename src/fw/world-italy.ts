/** Italy: Rome in the west, Venice in the north-east, Sicily along the southern coast. Objects come from graph.ts. */
import * as THREE from "three";
import { ITALY_OBJECTS, type EnrichedRecipe } from "./graph";
import { mat, add, person, tree, butterfly, path, fish, type P } from "./props";
import { ITALY_PROPS, IT, italianHouse, umbrellaPine, cypress, colosseum, fountain, obelisk, campanile, gondola, venetianBridge, mooringPole, etna, fishingBoat, baroqueChurch, pricklyPear, oliveTree, pantheon, triumphalArch, basilica, treviFountain, vespa, cafeTables } from "./props-italy";
import { buildWorld, addWater, riverGeometry, flowingWaterMaterial, addFish, type Diorama, type LayoutCtx } from "./worldkit";

void tree;

export function buildItaly(recipes: EnrichedRecipe[]): Diorama {
  return buildWorld({
    id: "italy", W: 76, D: 56, ground: "#a9bf7a", plinth: "#7a5232", recipes, objects: ITALY_OBJECTS, props: ITALY_PROPS,
    small: /^(cow|chicken)$/, fallbackPlace: "ragu",
    layout: layoutItaly,
  });
}

function layoutItaly({ group, tickers, place, tint, TOP }: LayoutCtx) {
  // ground tones: Roman ochre-green, Venetian pale stone, Sicilian sun-dried gold
  tint(-14, -2, 22, 16, "#b3c47c", 0.1);
  tint(2, 14, 20, 11, "#c9b978", -0.2);


  // ---------- Rome: piazza, streets, Colosseum, pines ----------
  add(group, new THREE.Mesh(new THREE.CircleGeometry(8, 28), mat("#d9cbb0")), -10, TOP + 0.02, 0).rotation.x = -Math.PI / 2;
  add(group, new THREE.Mesh(new THREE.RingGeometry(7.6, 8, 28), mat("#b9ad98")), -10, TOP + 0.03, 0).rotation.x = -Math.PI / 2;
  place(obelisk(), -10, -1);
  place(fountain(), -8, 3.5, 0.3).scale.setScalar(0.8);
  place(pantheon(), -4, -17, 0.05);
  place(triumphalArch(), -26, -9, -0.1);
  place(basilica(), -26, -21, 0.05).scale.setScalar(0.85);
  place(treviFountain(), -32, 2, Math.PI / 2).scale.setScalar(0.7);   // smaller, at the quiet west end, facing the piazza
  place(cafeTables(), -15, -4.6, 0);
  for (const [x, z, rot, len] of [[-20, 9.2, 0, 6], [-20, 14.8, 0, 6], [-23, 12, Math.PI / 2, 5.6], [-17, 12, Math.PI / 2, 5.6]] as [number, number, number, number][]) { const f = new THREE.Group(); const n = Math.round(len / 1.1); for (let i = 0; i <= n; i++) add(f, new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.7, 0.09), mat("#6e4a2c")), -len / 2 + (i / n) * len, 0.35, 0); add(f, new THREE.Mesh(new THREE.BoxGeometry(len, 0.06, 0.05), mat("#8b5e3c")), 0, 0.55, 0); add(f, new THREE.Mesh(new THREE.BoxGeometry(len, 0.06, 0.05), mat("#8b5e3c")), 0, 0.3, 0); place(f, x, z, rot); }
  group.add(path([[-30, -10], [-22, -8], [-14, -8], [-6, -6], [2, -4], [8, -6]], 2.6, "#cdbfa2"));
  group.add(path([[-10, 8], [-9, 12], [-6, 18], [-2, 22]], 1.8, "#cdbfa2"));
  group.add(path([[-2, -4], [4, 0], [5.5, 5], [6, 9]], 1.6, "#cdbfa2"));
  place(colosseum(), -28, 12, 0.3);
  for (let i = 0; i < 6; i++) place(umbrellaPine(0.9 + (i % 3) * 0.15), -30 + i * 2.4, -4.6 + Math.sin(i) * 0.8, i);
  for (let i = 0; i < 5; i++) place(umbrellaPine(1.0), -22 + i * 3, 18.4 + (i % 2) * 0.8, i);
  for (let i = 0; i < 5; i++) place(cypress(0.9 + (i % 2) * 0.2), -14 + i * 1.3, -22, i);
  for (let i = 0; i < 4; i++) place(cypress(1.0), -2 + i * 1.3, -22, i);
  // Roman streets of ochre houses around the piazza
  const houses: ["rome" | "venice" | "sicily", number, number, number, number, number, number, number][] = [
    ["rome", -16, -13, 0, 2.8, 2.4, 2.2, 3], ["rome", -12, -13, -0.1, 3.2, 2.6, 2.2, 2],
    ["rome", 3, -10, 0.1, 3.4, 2.6, 2.2, 3], ["rome", 20.5, 1.2, 0.2, 3.0, 2.4, 2.2, 2],
    ["rome", -33, -5, 0.3, 2.8, 2.4, 2.2, 2],
    ["sicily", -9, 20, 0.1, 3.0, 2.4, 2.2, 1], ["sicily", 7, 19.5, -0.2, 2.6, 2.2, 2.2, 2], ["sicily", 12, 18.5, 0.2, 3.2, 2.4, 2.2, 1],
    ["sicily", 16, 12, 0.6, 2.8, 2.4, 2.2, 2], ["rome", 24.5, 0.6, 0.4, 2.8, 2.4, 2.2, 2],
  ];
  for (const [style, x, z, rot, w, d, h, st] of houses) place(italianHouse(style, w, d, h, st), x, z, rot);
  // a Roman ruin: broken columns
  for (let i = 0; i < 5; i++) { add(group, new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.8 + (i % 3) * 1.2, 10), mat(IT.travertine)), -22 + i * 1.4, 0.4 + (i % 3) * 0.6, 16 + (i % 2) * 1.2); }
  add(group, new THREE.Mesh(new THREE.BoxGeometry(7, 0.4, 3), mat("#d9ccb0")), -19, 0.2, 16.5);

  // ---------- Venice: lagoon with three islands, canals, bridges, gondolas, the campanile ----------
  // one body of water: the lagoon, a channel down the east edge, and the sea along the south
  const waterMat = flowingWaterMaterial("#6ab3c2", "#3f8fa4");   // solid, flowing, right to the table edge
  tickers.push((t) => { waterMat.uniforms.uTime.value = t; });
  const bedMat = mat("#3f7a86"); void bedMat;
  const water = (w: number, d: number, x: number, z: number) => {
    const bed = new THREE.Mesh(new THREE.PlaneGeometry(w, d), bedMat); bed.rotation.x = -Math.PI / 2; bed.position.set(x, TOP + 0.012, z); bed.receiveShadow = true; group.add(bed);
    const top = new THREE.Mesh(new THREE.PlaneGeometry(w, d), waterMat); top.rotation.x = -Math.PI / 2; top.position.set(x, TOP + 0.06, z); top.renderOrder = 2; group.add(top);
  };
  void water;
  // natural shorelines: the lagoon and sea are one wobbly polygon reaching the table's edge, the channel a river ribbon
  // shoreline points wobble a little; points on the table edge (|x| = 38, |z| = 28) stay exactly on it so the fill is complete
  const shore = (pts: [number, number][]) => { const sh = new THREE.Shape(); pts.forEach(([x, z], i) => { const edge = Math.abs(x) >= 38 || Math.abs(z) >= 28; const wx = edge ? x : x + Math.sin(i * 2.7) * 0.6, wz = edge ? z : z + Math.cos(i * 1.9) * 0.6; if (i === 0) sh.moveTo(wx, wz); else sh.lineTo(wx, wz); }); sh.closePath(); return sh; };
  const lagoonShape = shore([[7, -28], [38, -28], [38, 2], [36, 4], [33, 0], [30, -2], [24, -1], [18, -2], [12, -1], [9, -3], [7, -6], [6.5, -12], [7, -20]]);
  const seaShape = shore([[-38, 28], [38, 28], [38, 22], [34, 21], [26, 21.5], [18, 20.6], [10, 21.2], [2, 20.4], [-6, 21], [-14, 20.5], [-22, 21.2], [-30, 20.6], [-38, 21]]);
  for (const [shape, name] of [[lagoonShape, "lagoon"], [seaShape, "sea"]] as [THREE.Shape, string][]) {
    void name;
    const topM = new THREE.Mesh(new THREE.ShapeGeometry(shape), waterMat); topM.rotation.x = -Math.PI / 2; topM.scale.y = -1; topM.position.y = TOP + 0.06; topM.receiveShadow = true; group.add(topM);
  }
  const channel = new THREE.CatmullRomCurve3([new THREE.Vector3(34, 0, 1), new THREE.Vector3(36.5, 0, 6), new THREE.Vector3(35, 0, 12), new THREE.Vector3(36, 0, 18), new THREE.Vector3(33, 0, 23)]);
  const rib = new THREE.Mesh(riverGeometry(channel, 9), waterMat); rib.position.y = 0.06; group.add(rib);
  // and a straight strip along the eastern edge so the channel fills to the rim
  const east = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 26), waterMat); east.rotation.x = -Math.PI / 2; east.position.set(35.75, TOP + 0.06, 11); group.add(east);
  const island = (x: number, z: number, w: number, d: number) => { add(group, new THREE.Mesh(new THREE.BoxGeometry(w, 0.5, d), mat(IT.venCream)), x, 0.2, z); add(group, new THREE.Mesh(new THREE.BoxGeometry(w + 0.4, 0.25, d + 0.4), mat("#b9ad98")), x, 0.05, z); };
  island(12, -18, 9, 8); island(24, -20, 9, 7); island(20, -8, 10, 7); island(31, -10, 6, 6);
  place(campanile(), 24, -22).scale.setScalar(0.75);
  const vHouses: [number, number, number, number, number, number][] = [
    [9, -19, 0.2, 2.6, 2.2, 2], [13, -21, 0, 2.6, 2.2, 3], [15, -16, -0.2, 2.6, 2.2, 2],
    [21, -21, 0.1, 2.6, 2.2, 2], [27, -18, -0.1, 2.6, 2.2, 3],
    [17, -8, 0.3, 2.6, 2.2, 2], [31, -12, 0.2, 2.4, 2.0, 2],
  ];
  for (const [x, z, rot, w, d, st] of vHouses) place(italianHouse("venice", w, d, 2.2, st), x, z, rot).position.y = 0.45;
  // bridges span the actual gaps between the four quays
  place(venetianBridge(4.2), 18, -18, 0).position.y = 0.45;            // west island ↔ campanile island
  place(venetianBridge(6.2), 22, -14, Math.PI / 2).position.y = 0.45;   // campanile island ↔ fish-market island
  place(venetianBridge(4.2), 26.5, -9.2, 0).position.y = 0.45;          // fish-market island ↔ eastern quay
  place(venetianBridge(3.6), 15.8, -12.7, Math.PI / 2).position.y = 0.45;   // west island ↔ fish-market island
  for (const [x, z] of [[9.5, -14], [15, -12], [26, -16], [17, -4], [29, -6], [34, -14]]) place(mooringPole(), x, z).position.y = 0;
  // gondolas glide along a canal loop through the islands
  // the canal route threads the water lanes between the four islands and never crosses a quay
  const canal = new THREE.CatmullRomCurve3([
    new THREE.Vector3(9, 0, -12.5), new THREE.Vector3(12, 0, -12.6), new THREE.Vector3(18, 0, -12.5), new THREE.Vector3(18, 0, -18), new THREE.Vector3(18, 0, -24),
    new THREE.Vector3(24, 0, -25.5), new THREE.Vector3(31, 0, -24.5), new THREE.Vector3(35.5, 0, -19), new THREE.Vector3(36.5, 0, -12), new THREE.Vector3(36, 0, -5),
    new THREE.Vector3(30, 0, -3), new THREE.Vector3(26.6, 0, -6), new THREE.Vector3(26.6, 0, -11), new THREE.Vector3(22, 0, -12.6), new THREE.Vector3(10, 0, -12.8), new THREE.Vector3(9, 0, -10),
  ], true);
  const gondolas = [0, 1, 2].map((i) => { const gd = gondola(); group.add(gd); tickers.push(gd.userData.tick!); return { gd, off: i / 3 }; });
  tickers.push((t) => gondolas.forEach(({ gd, off }) => { const u = (t * 0.008 + off) % 1; const p = canal.getPointAt(u), n = canal.getPointAt((u + 0.005) % 1); gd.position.set(p.x, TOP + 0.05, p.z); gd.rotation.y = Math.atan2(n.x - p.x, n.z - p.z) - Math.PI / 2; }));
  // people on the islands and a couple on a bridge
  for (const [x, z, c] of [[11, -16, "#e0a52c"], [25, -20.5, "#3f6b8f"], [21, -9, "#c0392b"], [19, -6, "#f4f1ea"]] as [number, number, string][]) place(person(c), x, z, x).position.y = 0.45;

  addFish({ group, tickers, place, tint, TOP }, canal, [["#8a949c", "#c9d0d4"], ["#5c7f9a", "#c9d0d4"], ["#b3bfc9", "#8a949c"], ["#8a949c", "#dfe3e6"], ["#5c7f9a", "#dfe3e6"], ["#c9d0d4", "#8a949c"]], 1.2, 0.34);
  const seaLane = new THREE.CatmullRomCurve3([new THREE.Vector3(-34, 0, 24), new THREE.Vector3(-20, 0, 26), new THREE.Vector3(-6, 0, 23.5), new THREE.Vector3(8, 0, 26), new THREE.Vector3(22, 0, 24), new THREE.Vector3(34, 0, 26), new THREE.Vector3(36, 0, 18), new THREE.Vector3(30, 0, 27.5), new THREE.Vector3(12, 0, 27), new THREE.Vector3(-10, 0, 27.5), new THREE.Vector3(-30, 0, 27)], true);
  addFish({ group, tickers, place, tint, TOP }, seaLane, [["#3f8fa4", "#dfe3e6"], ["#8a949c", "#c9d0d4"], ["#e8912a", "#f4f1ea"], ["#5c7f9a", "#dfe3e6"], ["#b3bfc9", "#8a949c"], ["#3f8fa4", "#c9d0d4"], ["#8a949c", "#dfe3e6"], ["#5c7f9a", "#c9d0d4"]], 1.6, 0.36);

  // ---------- Sicily: the coast, Etna, citrus, a baroque church ----------
  add(group, new THREE.Mesh(new THREE.PlaneGeometry(64, 1.6), mat("#efe0bb")), -8, TOP + 0.02, 20.6).rotation.x = -Math.PI / 2;   // beach
  const boats = [fishingBoat("#3f6b8f"), fishingBoat("#c0392b"), fishingBoat("#f4f1ea")];
  boats.forEach((b, i) => { place(b, -12 + i * 14, 24 + (i % 2) * 1.5, 0.3 - i * 0.5); });
  const sailer = fishingBoat("#e0a52c"); group.add(sailer); tickers.push(sailer.userData.tick!);
  const sail = new THREE.CatmullRomCurve3([new THREE.Vector3(32, 0, -3), new THREE.Vector3(36, 0, 6), new THREE.Vector3(35.5, 0, 16), new THREE.Vector3(30, 0, 25), new THREE.Vector3(18, 0, 26), new THREE.Vector3(24, 0, 23), new THREE.Vector3(34, 0, 20), new THREE.Vector3(36.5, 0, 10)], true);
  tickers.push((t) => { const u = (t * 0.006) % 1; const p = sail.getPointAt(u), n = sail.getPointAt((u + 0.005) % 1); sailer.position.set(p.x, TOP + 0.05, p.z); sailer.rotation.y = Math.atan2(n.x - p.x, n.z - p.z) - Math.PI / 2; });
  place(etna(), 26.5, 9, 0.4).scale.setScalar(0.8);
  place(baroqueChurch(), 0, 19, 0.05);

  // a small harbour mole with a lighthouse
  add(group, new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 7), mat(IT.stone)), 14, 0.3, 24.5);
  add(group, new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 2.6, 10), mat("#f4f1ea")), 14, 1.6, 27.5);
  add(group, new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.4, 10), mat("#c0392b")), 14, 2.2, 27.5);
  add(group, new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.4, 10), mat("#c0392b")), 14, 1.4, 27.5);

  // ---------- life: a stroll around the piazza and down to the sea, butterflies, koi in the fountain? no, in the lagoon ----------
  const walkers = ["#3f6b8f", "#e0a52c", "#c0392b", "#f4f1ea", "#2f5d3f", "#e07aa0", "#7a4a3a", "#2a2a2e", "#6a7fb0", "#e9d7b8"].map((c, i) => person(c, { hat: i % 4 === 1 }));
  walkers.forEach((w) => group.add(w));
  const loop = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-26, 0, -9), new THREE.Vector3(-20, 0, -8), new THREE.Vector3(-13, 0, -8), new THREE.Vector3(-6, 0, -7), new THREE.Vector3(0, 0, -6.5), new THREE.Vector3(6, 0, -7.5),
    new THREE.Vector3(3, 0, -5), new THREE.Vector3(4, 0, 0), new THREE.Vector3(5.5, 0, 5), new THREE.Vector3(6, 0, 9), new THREE.Vector3(3, 0, 10.5), new THREE.Vector3(-2, 0, 8),
    new THREE.Vector3(-7, 0, 7), new THREE.Vector3(-11, 0, 7.8), new THREE.Vector3(-16, 0, 8), new THREE.Vector3(-21, 0, 6.8), new THREE.Vector3(-26.5, 0, 3), new THREE.Vector3(-28, 0, -2), new THREE.Vector3(-27, 0, -6),
  ], true);
  tickers.push((t) => walkers.forEach((w, i) => { const u = (t * 0.01 + i * 0.1) % 1; const p = loop.getPointAt(u), n = loop.getPointAt((u + 0.004) % 1); w.position.set(p.x, 0, p.z); w.rotation.y = Math.atan2(n.x - p.x, n.z - p.z); (w.userData as { walk?: (t: number) => void }).walk?.(t + i); }));
  // a second stroll: Pantheon, the arch, the basilica square
  const sight = ["#c0392b", "#f4f1ea", "#3f6b8f", "#e0a52c", "#2a2a2e", "#e07aa0"].map((c) => person(c));
  sight.forEach((w) => group.add(w));
  const loop2 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3, 0, -9.4), new THREE.Vector3(-9, 0, -9.6), new THREE.Vector3(-15, 0, -9.8), new THREE.Vector3(-21, 0, -9.4), new THREE.Vector3(-26, 0, -9), new THREE.Vector3(-29, 0, -11.5),
    new THREE.Vector3(-26, 0, -14.5), new THREE.Vector3(-23, 0, -12), new THREE.Vector3(-19, 0, -10.4), new THREE.Vector3(-12, 0, -10.3), new THREE.Vector3(-6, 0, -10.5),
  ], true);
  tickers.push((t) => sight.forEach((w, i) => { const u = (t * 0.008 + i * 0.17) % 1; const p = loop2.getPointAt(u), n = loop2.getPointAt((u + 0.004) % 1); w.position.set(p.x, 0, p.z); w.rotation.y = Math.atan2(n.x - p.x, n.z - p.z); (w.userData as { walk?: (t: number) => void }).walk?.(t + i); }));
  // Vespas buzzing round the street loop, faster than anyone on foot
  const scooters = [vespa("#8fc4c9"), vespa("#c0392b")];
  scooters.forEach((v) => group.add(v));
  tickers.push((t) => scooters.forEach((v, i) => { const u = (t * 0.03 + i * 0.5) % 1; const p = loop.getPointAt(u), n = loop.getPointAt((u + 0.003) % 1); v.position.set(p.x, 0, p.z); v.rotation.y = Math.atan2(n.x - p.x, n.z - p.z) - Math.PI / 2; v.rotation.z = Math.sin(t * 3 + i) * 0.03; }));
  // standing groups chatting on the piazza
  for (const [x, z, n] of [[-13, -3, 3], [-7, -4, 2], [-12, 5, 3], [-1, -1, 2]] as [number, number, number][]) for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; place(person(["#3f6b8f", "#e0a52c", "#c0392b", "#f4f1ea", "#e07aa0", "#7a4a3a"][(x + i) % 6 < 0 ? -((x + i) % 6) : (x + i) % 6]), x + Math.cos(a) * 0.6, z + Math.sin(a) * 0.6, -a - Math.PI / 2); }
  const flies = [[-24, 12], [20, 18], [-6, 8]].map(([x, z], i) => { const b = butterfly(["#f2b64d", "#ffffff", "#f4a6b8"][i]); group.add(b); tickers.push(b.userData.tick!); return { b, x, z, ph: i * 2 }; });
  tickers.push((t) => flies.forEach(({ b, x, z, ph }) => { b.position.set(x + Math.sin(t * 0.6 + ph) * 2.4, TOP + 1.8 + Math.sin(t * 1.7 + ph) * 0.4, z + Math.cos(t * 0.45 + ph) * 2); b.rotation.y = t * 0.6 + ph; }));
  // seagulls over the Venetian lagoon and the Sicilian harbour
  const gulls: THREE.Group[] = [];
  for (let i = 0; i < 6; i++) { const gl = new THREE.Group(); add(gl, new THREE.Mesh(new THREE.SphereGeometry(0.1, 7, 5), mat("#f4f1ea")), 0, 0, 0).scale.set(1.3, 0.7, 1); for (const sd of [-1, 1]) add(gl, new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.03, 0.12), mat("#e6e2da")), sd * 0.25, 0.02, 0); group.add(gl); gulls.push(gl); }
  tickers.push((t) => gulls.forEach((gl, i) => { const a = t * 0.25 + i * 1.1; const cx = i < 3 ? 20 : 6, cz = i < 3 ? -12 : 24; gl.position.set(cx + Math.cos(a) * 8, 8 + Math.sin(t * 0.7 + i) * 1.2, cz + Math.sin(a) * 4); gl.rotation.y = -a; gl.children.forEach((c, k) => { if (k) c.rotation.z = Math.sin(t * 9 + i) * 0.5 * (k === 1 ? 1 : -1); }); }));
  void riverGeometry; void addWater; void fish; void IT; void addFish;
}
