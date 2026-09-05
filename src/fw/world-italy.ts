/** Italy: Rome in the west, Venice in the north-east, Sicily along the southern coast. Objects come from graph.ts. */
import * as THREE from "three";
import { ITALY_OBJECTS, type EnrichedRecipe } from "./graph";
import { mat, add, person, tree, butterfly, path, fish, type P } from "./props";
import { ITALY_PROPS, IT, italianHouse, umbrellaPine, cypress, colosseum, fountain, obelisk, campanile, gondola, venetianBridge, mooringPole, etna, fishingBoat, baroqueChurch, pricklyPear, oliveTree } from "./props-italy";
import { buildWorld, addWater, riverGeometry, type Diorama, type LayoutCtx } from "./worldkit";

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
  tint(18, -12, 16, 10, "#c9c4a6");

  // ---------- Rome: piazza, streets, Colosseum, pines ----------
  add(group, new THREE.Mesh(new THREE.CircleGeometry(8, 28), mat("#d9cbb0")), -10, TOP + 0.02, 0).rotation.x = -Math.PI / 2;
  add(group, new THREE.Mesh(new THREE.RingGeometry(7.6, 8, 28), mat("#b9ad98")), -10, TOP + 0.03, 0).rotation.x = -Math.PI / 2;
  place(obelisk(), -10, -1);
  place(fountain(), -8, 3.5, 0.3).scale.setScalar(0.8);
  group.add(path([[-30, -10], [-22, -8], [-14, -8], [-6, -6], [2, -4], [8, -6]], 2.6, "#cdbfa2"));
  group.add(path([[-10, 8], [-9, 12], [-6, 18], [-2, 22]], 1.8, "#cdbfa2"));
  group.add(path([[-2, -4], [4, 0], [8, 6], [10, 10]], 1.6, "#cdbfa2"));
  place(colosseum(), -28, 12, 0.3);
  for (let i = 0; i < 7; i++) place(umbrellaPine(0.9 + (i % 3) * 0.15), -34 + i * 2.4, -2 + Math.sin(i) * 1.2, i);
  for (let i = 0; i < 5; i++) place(umbrellaPine(1.0), -20 + i * 3, 20 + (i % 2) * 1.5, i);
  for (let i = 0; i < 6; i++) place(cypress(0.9 + (i % 2) * 0.2), -26 + i * 1.3, -20, i);
  for (let i = 0; i < 4; i++) place(cypress(1.0), -2 + i * 1.3, -22, i);
  // Roman streets of ochre houses around the piazza
  const houses: ["rome" | "venice" | "sicily", number, number, number, number, number, number, number][] = [
    ["rome", -20, -12, 0.1, 3.4, 2.6, 2.2, 2], ["rome", -16, -13, 0, 2.8, 2.4, 2.2, 3], ["rome", -12, -13, -0.1, 3.2, 2.6, 2.2, 2],
    ["rome", -1, -9, 0.2, 3.0, 2.4, 2.2, 2], ["rome", 3, -10, 0.1, 3.4, 2.6, 2.2, 3], ["rome", -18, 6, 0.6, 3.0, 2.4, 2.2, 2],
    ["rome", -30, 4, -0.5, 3.2, 2.6, 2.2, 2], ["rome", -32, -8, 0.3, 2.8, 2.4, 2.2, 2],
    ["sicily", -9, 20, 0.1, 3.0, 2.4, 2.2, 1], ["sicily", 7, 19.5, -0.2, 2.6, 2.2, 2.2, 2], ["sicily", 12, 18.5, 0.2, 3.2, 2.4, 2.2, 1],
    ["sicily", 16, 12, 0.6, 2.8, 2.4, 2.2, 2], ["sicily", 22, 8, -0.3, 3.0, 2.4, 2.2, 1], ["rome", 6, 4, 0.4, 2.8, 2.4, 2.2, 2],
  ];
  for (const [style, x, z, rot, w, d, h, st] of houses) place(italianHouse(style, w, d, h, st), x, z, rot);
  // a Roman ruin: broken columns
  for (let i = 0; i < 5; i++) { add(group, new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.8 + (i % 3) * 1.2, 10), mat(IT.travertine)), -22 + i * 1.4, 0.4 + (i % 3) * 0.6, 16 + (i % 2) * 1.2); }
  add(group, new THREE.Mesh(new THREE.BoxGeometry(7, 0.4, 3), mat("#d9ccb0")), -19, 0.2, 16.5);

  // ---------- Venice: lagoon with three islands, canals, bridges, gondolas, the campanile ----------
  const lagoon = new THREE.Mesh(new THREE.PlaneGeometry(34, 26), new THREE.MeshStandardMaterial({ color: "#5fa8b8", roughness: 0.3, transparent: true, opacity: 0.85 }));
  lagoon.rotation.x = -Math.PI / 2; lagoon.position.set(20, TOP + 0.03, -14); lagoon.receiveShadow = true; group.add(lagoon);
  add(group, new THREE.Mesh(new THREE.PlaneGeometry(34, 26), mat("#3f7a86")), 20, TOP - 0.02, -14).rotation.x = -Math.PI / 2;
  const island = (x: number, z: number, w: number, d: number) => { add(group, new THREE.Mesh(new THREE.BoxGeometry(w, 0.5, d), mat(IT.venCream)), x, 0.2, z); add(group, new THREE.Mesh(new THREE.BoxGeometry(w + 0.4, 0.25, d + 0.4), mat("#b9ad98")), x, 0.05, z); };
  island(12, -18, 9, 8); island(24, -20, 9, 7); island(20, -8, 10, 7); island(31, -10, 6, 6);
  place(campanile(), 24, -22).scale.setScalar(0.75);
  const vHouses: [number, number, number, number, number, number][] = [
    [9, -19, 0.2, 2.6, 2.2, 2], [13, -21, 0, 2.6, 2.2, 3], [15, -16, -0.2, 2.6, 2.2, 2],
    [21, -21, 0.1, 2.6, 2.2, 2], [27, -18, -0.1, 2.6, 2.2, 3],
    [17, -8, 0.3, 2.6, 2.2, 2], [23, -6, 0, 2.6, 2.2, 2], [31, -12, 0.2, 2.4, 2.0, 2],
  ];
  for (const [x, z, rot, w, d, st] of vHouses) place(italianHouse("venice", w, d, 2.2, st), x, z, rot).position.y = 0.45;
  place(venetianBridge(4), 18, -13.5, Math.PI / 2 + 0.1).position.y = 0.45;
  place(venetianBridge(4), 24, -14, 0.2).position.y = 0.45;
  place(venetianBridge(3.5), 27.5, -9, Math.PI / 2).position.y = 0.45;
  for (const [x, z] of [[8, -14], [15, -12], [26, -16], [17, -4], [29, -6], [34, -14]]) place(mooringPole(), x, z).position.y = 0;
  // gondolas glide along a canal loop through the islands
  const canal = new THREE.CatmullRomCurve3([new THREE.Vector3(6, 0, -12), new THREE.Vector3(12, 0, -13), new THREE.Vector3(18, 0, -13.5), new THREE.Vector3(22, 0, -14.5), new THREE.Vector3(28, 0, -14), new THREE.Vector3(34, 0, -8), new THREE.Vector3(30, 0, -4), new THREE.Vector3(24, 0, -3), new THREE.Vector3(14, 0, -4), new THREE.Vector3(8, 0, -6)], true);
  const gondolas = [0, 1, 2].map((i) => { const gd = gondola(); group.add(gd); tickers.push(gd.userData.tick!); return { gd, off: i / 3 }; });
  tickers.push((t) => gondolas.forEach(({ gd, off }) => { const u = (t * 0.008 + off) % 1; const p = canal.getPointAt(u), n = canal.getPointAt((u + 0.005) % 1); gd.position.set(p.x, TOP + 0.05, p.z); gd.rotation.y = Math.atan2(n.x - p.x, n.z - p.z) - Math.PI / 2; }));
  // people on the islands and a couple on a bridge
  for (const [x, z, c] of [[11, -16, "#e0a52c"], [25, -20.5, "#3f6b8f"], [21, -9, "#c0392b"], [19, -6, "#f4f1ea"]] as [number, number, string][]) place(person(c), x, z, x).position.y = 0.45;

  // ---------- Sicily: the coast, Etna, citrus, a baroque church ----------
  const sea = new THREE.Mesh(new THREE.PlaneGeometry(80, 9), new THREE.MeshStandardMaterial({ color: "#4f9db0", roughness: 0.3, transparent: true, opacity: 0.85 }));
  sea.rotation.x = -Math.PI / 2; sea.position.set(0, TOP + 0.03, 25.5); sea.receiveShadow = true; group.add(sea);
  add(group, new THREE.Mesh(new THREE.PlaneGeometry(80, 9), mat("#2f6a7a")), 0, TOP - 0.02, 25.5).rotation.x = -Math.PI / 2;
  add(group, new THREE.Mesh(new THREE.PlaneGeometry(80, 1.6), mat("#efe0bb")), 0, TOP + 0.01, 20.6).rotation.x = -Math.PI / 2;
  const boats = [fishingBoat("#3f6b8f"), fishingBoat("#c0392b"), fishingBoat("#f4f1ea")];
  boats.forEach((b, i) => { place(b, -12 + i * 14, 24 + (i % 2) * 1.5, 0.3 - i * 0.5); });
  place(etna(), 32, 12, 0.4);
  place(baroqueChurch(), 0, 19, 0.05);
  for (let i = 0; i < 5; i++) place(pricklyPear(), 26 + i * 2, 20 + (i % 2) * 1.5, i);
  for (let i = 0; i < 6; i++) place(oliveTree(0.9), -12 + i * 2.2, 12 + (i % 2) * 1.6, i);
  // a small harbour mole with a lighthouse
  add(group, new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 7), mat(IT.stone)), 14, 0.3, 24.5);
  add(group, new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 2.6, 10), mat("#f4f1ea")), 14, 1.6, 27.5);
  add(group, new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.4, 10), mat("#c0392b")), 14, 2.2, 27.5);
  add(group, new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.4, 10), mat("#c0392b")), 14, 1.4, 27.5);

  // ---------- life: a stroll around the piazza and down to the sea, butterflies, koi in the fountain? no, in the lagoon ----------
  const walkers = [person("#3f6b8f"), person("#e0a52c", { hat: true }), person("#c0392b"), person("#f4f1ea"), person("#2f5d3f", { pole: false })];
  walkers.forEach((w) => group.add(w));
  const loop = new THREE.CatmullRomCurve3([new THREE.Vector3(-28, 0, -9), new THREE.Vector3(-20, 0, -7.5), new THREE.Vector3(-13, 0, -7.6), new THREE.Vector3(-6, 0, -6), new THREE.Vector3(1, 0, -4.4), new THREE.Vector3(4, 0, 0), new THREE.Vector3(8, 0, 6), new THREE.Vector3(6, 0, 9), new THREE.Vector3(-2, 0, 7), new THREE.Vector3(-8.5, 0, 8.5), new THREE.Vector3(-9.5, 0, 13), new THREE.Vector3(-12, 0, 8), new THREE.Vector3(-17, 0, 2), new THREE.Vector3(-22, 0, -2), new THREE.Vector3(-27, 0, -5)], true);
  tickers.push((t) => walkers.forEach((w, i) => { const u = (t * 0.01 + i * 0.2) % 1; const p = loop.getPointAt(u), n = loop.getPointAt((u + 0.004) % 1); w.position.set(p.x, 0, p.z); w.rotation.y = Math.atan2(n.x - p.x, n.z - p.z); (w.userData as { walk?: (t: number) => void }).walk?.(t + i); }));
  const flies = [[-24, 12], [20, 18], [-6, 8]].map(([x, z], i) => { const b = butterfly(["#f2b64d", "#ffffff", "#f4a6b8"][i]); group.add(b); tickers.push(b.userData.tick!); return { b, x, z, ph: i * 2 }; });
  tickers.push((t) => flies.forEach(({ b, x, z, ph }) => { b.position.set(x + Math.sin(t * 0.6 + ph) * 2.4, TOP + 1.8 + Math.sin(t * 1.7 + ph) * 0.4, z + Math.cos(t * 0.45 + ph) * 2); b.rotation.y = t * 0.6 + ph; }));
  // seagulls over the Venetian lagoon and the Sicilian harbour
  const gulls: THREE.Group[] = [];
  for (let i = 0; i < 6; i++) { const gl = new THREE.Group(); add(gl, new THREE.Mesh(new THREE.SphereGeometry(0.1, 7, 5), mat("#f4f1ea")), 0, 0, 0).scale.set(1.3, 0.7, 1); for (const sd of [-1, 1]) add(gl, new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.03, 0.12), mat("#e6e2da")), sd * 0.25, 0.02, 0); group.add(gl); gulls.push(gl); }
  tickers.push((t) => gulls.forEach((gl, i) => { const a = t * 0.25 + i * 1.1; const cx = i < 3 ? 20 : 6, cz = i < 3 ? -12 : 24; gl.position.set(cx + Math.cos(a) * 8, 8 + Math.sin(t * 0.7 + i) * 1.2, cz + Math.sin(a) * 4); gl.rotation.y = -a; gl.children.forEach((c, k) => { if (k) c.rotation.z = Math.sin(t * 9 + i) * 0.5 * (k === 1 ? 1 : -1); }); }));
  void riverGeometry; void addWater; void fish; void IT;
}
