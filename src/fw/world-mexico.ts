/** Mexico: the capital in the north-centre, Jalisco and Michoacán to the west, Oaxaca in the south, Yucatán and the Caribbean to the east. Objects come from graph.ts. */
import * as THREE from "three";
import { MEXICO_OBJECTS, type EnrichedRecipe } from "./graph";
import { mat, add, tree, butterfly, path, birds, lounger, type P } from "./props";
import { MEXICO_PROPS, MX, casa, cathedral, aztecPyramid, mayaPyramid, ruins, flagpole, papelPicado, saguaro, palm, marigolds, flamingo, mexican, avocadoTree } from "./props-mexico";
import { fishingBoat, pricklyPear } from "./props-italy";
import { buildWorld, seaWater, type Diorama, type LayoutCtx } from "./worldkit";

export function buildMexico(recipes: EnrichedRecipe[]): Diorama {
  return buildWorld({
    id: "mexico", W: 76, D: 56, ground: "#b8b56f", plinth: "#6b4a32", recipes, objects: MEXICO_OBJECTS, props: MEXICO_PROPS,
    small: /^(churrosCart|mariachi)$/, fallbackPlace: "fonda",
    layout: layoutMexico,
  });
}

function layoutMexico({ group, tickers, place, tint, TOP }: LayoutCtx) {
  // ground: the capital's paving, Oaxaca's red earth, Jalisco's dry gold, Yucatán's pale limestone scrub
  tint(-4, -12, 16, 10, "#c9c1ad", 0.05);
  tint(-18, 16, 18, 9, "#b5915f", -0.1);
  tint(-28, -12, 10, 12, "#c9b56a", 0.1);
  tint(22, -6, 12, 14, "#a9bf7a", 0.05);

  // ---------- the Caribbean along the east, a bay in the south-east ----------
  const waterMat = seaWater();
  tickers.push((t) => { waterMat.uniforms.uTime.value = t; });
  const shore = (pts: [number, number][]) => { const sh = new THREE.Shape(); pts.forEach(([x, z], i) => { const edge = Math.abs(x) >= 38 || Math.abs(z) >= 28; const wx = edge ? x : x + Math.sin(i * 2.7) * 0.5, wz = edge ? z : z + Math.cos(i * 1.9) * 0.5; if (i === 0) sh.moveTo(wx, wz); else sh.lineTo(wx, wz); }); sh.closePath(); return sh; };
  const seaShape = shore([[31, -28], [38, -28], [38, 28], [10, 28], [10, 22], [16, 18], [24, 16], [30, 10], [32, 2], [31, -6], [32, -16]]);
  const rimShape = shore([[29.8, -28], [38, -28], [38, 28], [8.8, 28], [8.8, 21.2], [15, 16.8], [23.4, 14.8], [28.8, 9.2], [30.8, 2], [29.8, -6], [30.8, -16]]);
  const rimM = new THREE.Mesh(new THREE.ShapeGeometry(rimShape), mat("#f1e6c4")); rimM.rotation.x = -Math.PI / 2; rimM.scale.y = -1; rimM.position.y = TOP + 0.03; rimM.receiveShadow = true; group.add(rimM);
  const seaM = new THREE.Mesh(new THREE.ShapeGeometry(seaShape), waterMat); seaM.rotation.x = -Math.PI / 2; seaM.scale.y = -1; seaM.position.y = TOP + 0.06; seaM.receiveShadow = true; group.add(seaM);
  for (const [x, z, s] of [[29, -11, 1.1], [30, -1, 0.9], [27.5, 12.5, 1.0], [21, 17.5, 1.1], [13.5, 20.5, 0.9], [33.5, 0, 0.8]] as [number, number, number][]) { const p = palm(s); place(p, x, z, x + z); tickers.push(p.userData.tick!); }
  const flamingos: P[] = [];
  for (let i = 0; i < 5; i++) { const f = flamingo(); place(f, 33 + (i % 3) * 1.2, 8 + i * 1.3, i * 1.3); f.position.y = TOP + 0.02; flamingos.push(f); }
  tickers.push((t) => flamingos.forEach((f, i) => { f.rotation.y += Math.sin(t * 0.3 + i) * 0.002; }));
  const boat = fishingBoat("#f2c14e"); place(boat, 34, -14, 0.4).position.y = TOP + 0.05; tickers.push(boat.userData.tick!);

  // ---------- Mexico City: cathedral, the zócalo and its flag, the Templo Mayor, colonial streets ----------
  place(cathedral(), 0, -21);
  add(group, new THREE.Mesh(new THREE.CircleGeometry(6.5, 32), mat("#b8b0a0")), 0, TOP + 0.02, -12).rotation.x = -Math.PI / 2;
  add(group, new THREE.Mesh(new THREE.RingGeometry(6.2, 6.5, 32), mat("#8f857a")), 0, TOP + 0.03, -12).rotation.x = -Math.PI / 2;
  const flag = flagpole(); place(flag, 0, -12); tickers.push(flag.userData.tick!);
  place(aztecPyramid(), 11, -21, 0.1);
  const casas: [string, number, number, number, boolean, number][] = [
    [MX.pink, -9, -19.5, 0.1, true, 2], [MX.blue, -9, -23, 0, false, 1], [MX.yellow, 14, -14, -0.1, true, 1], [MX.green, 14, -10, 0.1, false, 2],
    [MX.terracotta, 2, 0, 0.1, true, 1], [MX.cream, -14, -23.5, 0.05, true, 1], [MX.pink, -18, -24, -0.1, false, 2],
  ];
  for (const [c, x, z, rot, tiles, st] of casas) place(casa(c, 3.2, 2.6, 2.2, { tiles, storeys: st }), x, z, rot);
  for (const [x, z] of [[-9, -16.5], [14, -8]]) { const pp = papelPicado(6, 9, 2.6); place(pp, x, z, Math.PI / 2); tickers.push(pp.userData.tick!); }
  group.add(path([[-6, -8], [-6, -4], [-2, -1], [3, -1.5], [6, -3], [7, -7], [6, -12]], 2.0, "#cfc6ae"));
  group.add(path([[-6, -8], [-10, -8.5], [-16, -7.5], [-22, -6]], 2.0, "#cfc6ae"));
  for (let i = 0; i < 3; i++) place(tree("round", 1.0), -7.5 + i * 2.5, -6.5 + (i % 2) * 0.6, i);
  const doves = birds(6, 6, 8); doves.position.set(0, TOP, -12); group.add(doves); tickers.push(doves.userData.tick!);

  // ---------- Jalisco & Michoacán: dry hills, cacti, monarch butterflies ----------
  for (const [x, z, s] of [[-36, -2, 1.0], [-35, 9.5, 0.8], [-22, -25, 0.9], [-36, -26, 1.1], [-34, -19.5, 0.7], [-24, -13, 1.0], [-18, -21, 0.8], [-37, 16, 0.9], [-30, -27, 0.7], [-8, 22, 0.9], [-4, 25.5, 1.1], [-14, 25, 0.8], [12, -8, 0.9], [18, -13, 0.8], [8, -25, 1.0], [-36, 22, 0.8]] as [number, number, number][]) place(saguaro(s), x, z, x);
  for (const [x, z] of [[-35, -4.5], [-24, -26.5], [-36, 12], [-21, -23.5], [-33, 24], [-10, 24], [-2, 24.5], [16, -10], [-37, 19], [-27, 9], [-22, -11]]) place(pricklyPear(), x, z, x);
  for (const [x, z, s] of [[-30, 16, 1.0], [-26, 14, 0.8], [-20, -8, 0.9], [13, -19, 0.9]] as [number, number, number][]) { const a = new THREE.Group(); for (let i = 0; i < 12; i++) { const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.1 * s, 1.1 * s, 4), mat(i % 2 ? "#5f8fa0" : "#6f9fb0")); leaf.geometry.translate(0, 0.55 * s, 0); leaf.rotation.y = (i / 12) * Math.PI * 2; leaf.rotation.x = 0.6 + (i % 2) * 0.3; a.add(leaf); } place(a, x, z, 0); }   // wild agaves
  for (const [x, z, s] of [[-36, 0, 1.0], [-25, 6.5, 0.9], [-35, 6, 1.1], [-27, 0.5, 0.85]] as [number, number, number][]) place(avocadoTree(s), x, z, x + z);   // Michoacán is avocado country: trees beyond the orchard too
  const monarchs = [[-31, 4], [-27, 2], [-33, 8]].map(([x, z], i) => { const b = butterfly(i % 2 ? "#f08a2a" : "#e07a1a"); group.add(b); tickers.push(b.userData.tick!); return { b, x, z, ph: i * 1.7 }; });
  tickers.push((t) => monarchs.forEach(({ b, x, z, ph }) => { b.position.set(x + Math.sin(t * 0.6 + ph) * 2.6, TOP + 2.2 + Math.sin(t * 1.7 + ph) * 0.5, z + Math.cos(t * 0.45 + ph) * 2); b.rotation.y = t * 0.6 + ph; }));

  // ---------- Oaxaca: red earth, Monte Albán, marigolds ----------
  place(ruins(), -33, 23, 0.1);
  for (const [x, z] of [[-13, 18.5], [-6, 18], [-22, 9.5]]) place(marigolds(10), x, z, x);
  for (let i = 0; i < 3; i++) place(tree("round", 0.9), -36 + i * 1.4, 16 + (i % 2) * 1.2, i);
  group.add(path([[-13, 8.5], [-6, 8.5], [-4, 13], [-5, 16.5], [-12, 17.2], [-20, 17], [-22, 11], [-13, 8.5]], 1.8, "#c9a97a"));

  // ---------- Yucatán: El Castillo, scrub jungle ----------
  place(mayaPyramid(), 26, -21, 0);
  for (let i = 0; i < 6; i++) place(tree("round", 0.8 + (i % 3) * 0.15), 12 + (i % 3) * 3, -16 + Math.floor(i / 3) * 3, i);
  for (let i = 0; i < 4; i++) place(tree("round", 0.9), 16 + i * 2.6, 12 + (i % 2), i);
  for (const [x, z, n] of [[24, -14, 3], [20, -3, 2]] as [number, number, number][]) for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; place(mexican(["#f2c14e", "#3f6fb5", "#e8558a", "#f4f1ea"][(i + n) % 4], { hat: i === 0 }), x + Math.cos(a) * 0.5, z + Math.sin(a) * 0.5, -a - Math.PI / 2); }

  // ---------- life: strollers on the zócalo, in Oaxaca's lanes, and on the beach ----------
  const loops: [THREE.CatmullRomCurve3, string[], number][] = [
    [new THREE.CatmullRomCurve3([0, 1, 2, 3, 4, 5, 6, 7].map((i) => new THREE.Vector3(Math.cos(i / 8 * Math.PI * 2) * 4.8, 0, -12 + Math.sin(i / 8 * Math.PI * 2) * 4.8)), true), ["#3f6fb5", "#e8558a", "#f2c14e", "#f4f1ea", "#3f8f5a", "#2a2a2e", "#ec7a2b"], 0.008],
    [new THREE.CatmullRomCurve3([[-13, 8.5], [-6, 8.5], [-4, 13], [-5, 16.5], [-12, 17.2], [-20, 17], [-22, 11]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true), ["#e8558a", "#f2c14e", "#3f6fb5", "#f4f1ea", "#9b59b6"], 0.008],
    [new THREE.CatmullRomCurve3([[-6, -8], [-6, -4], [-2, -1], [3, -1.5], [6, -3], [7, -7], [6, -12], [3, -6.5], [-2, -7]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true), ["#3f8f5a", "#f4f1ea", "#c0392b", "#f2c14e"], 0.009],
  ];
  for (const [curve, colours, speed] of loops) {
    const walkers = colours.map((c, i) => mexican(c, { hat: i % 3 === 1, rebozo: i % 3 === 2 ? MX.papel[i % 6] : undefined }));
    walkers.forEach((w) => group.add(w));
    tickers.push((t) => walkers.forEach((w, i) => { const u = (t * speed + i / walkers.length) % 1; const p = curve.getPointAt(u), n = curve.getPointAt((u + 0.004) % 1); w.position.set(p.x, 0, p.z); w.rotation.y = Math.atan2(n.x - p.x, n.z - p.z); w.userData.walk?.(t + i); }));
  }
  for (const [x, z, n] of [[-4, -16.5, 2], [4, -16.5, 3], [-16, 10, 2]] as [number, number, number][]) for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; place(mexican(["#f2c14e", "#3f6fb5", "#e8558a", "#f4f1ea"][(i + Math.abs(x)) % 4], { hat: i === 1 }), x + Math.cos(a) * 0.5, z + Math.sin(a) * 0.5, -a - Math.PI / 2); }
  // beach umbrellas on the bay
  for (const [x, z, c] of [[14, 19, MX.pink], [18, 16.5, MX.yellow], [11, 21.5, MX.blue]] as [number, number, string][]) {
    add(group, new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.8, 5), mat("#f4f1ea")), x, TOP + 0.9, z);
    add(group, new THREE.Mesh(new THREE.ConeGeometry(1.0, 0.45, 10), mat(c)), x, TOP + 1.9, z);
    const lg = lounger("#f4f1ea", c); place(lg, x + 1.1, z + 0.3, -0.6); tickers.push(lg.userData.tick!);
  }
}
