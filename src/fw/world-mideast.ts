/** Middle East: Istanbul on the Bosphorus to the north, the Levant on the Mediterranean to the west, Arabia's desert to the south, Persia to the east. Objects come from graph.ts. */
import * as THREE from "three";
import { MIDEAST_OBJECTS, type EnrichedRecipe } from "./graph";
import { mat, add, tree, mountain, path, bridge, birds, type P } from "./props";
import { MIDEAST_PROPS, ME, casaMe, mosque, galataTower, ferry, petra, persianMosque, arcadeBridge, cedar, datePalm, dune, tulips, local, balloon } from "./props-mideast";
import { buildWorld, riverGeometry, seaWater, freshWater, addFish, type Diorama, type LayoutCtx } from "./worldkit";

export function buildMideast(recipes: EnrichedRecipe[]): Diorama {
  return buildWorld({
    id: "middle-east", W: 76, D: 56, ground: "#c9b98a", plinth: "#6b4a32", recipes, objects: MIDEAST_OBJECTS, props: MIDEAST_PROPS,
    small: /^(simitCart|caravan)$/, fallbackPlace: "mezze",
    layout: layoutMideast,
  });
}

function layoutMideast({ group, tickers, place, tint, TOP }: LayoutCtx) {
  // ground: Istanbul's paving, the Levant's green terraces, Arabia's sand, Persia's dry gold
  tint(8, -13, 16, 9, "#c4bba6", 0.05);
  tint(-22, 2, 14, 11, "#a9bf7a", -0.05);
  tint(-12, 21, 22, 9, "#e3cf9a", 0.1);
  tint(24, 8, 14, 16, "#cfbf86", 0.05);

  // ---------- water: the Bosphorus across the north, the Mediterranean down the west edge, the Zayandeh through Persia ----------
  const sea = seaWater(), fresh = freshWater();
  tickers.push((t) => { sea.uniforms.uTime.value = t; fresh.uniforms.uTime.value = t; });
  const shore = (pts: [number, number][]) => { const sh = new THREE.Shape(); pts.forEach(([x, z], i) => { const edge = Math.abs(x) >= 38 || Math.abs(z) >= 28; const wx = edge ? x : x + Math.sin(i * 2.7) * 0.5, wz = edge ? z : z + Math.cos(i * 1.9) * 0.5; if (i === 0) sh.moveTo(wx, wz); else sh.lineTo(wx, wz); }); sh.closePath(); return sh; };
  const medShape = shore([[-38, -9], [-34, -8], [-34.5, 0], [-34, 8], [-34.5, 16], [-34, 24], [-34.5, 28], [-38, 28]]);
  const medRim = shore([[-38, -9], [-32.8, -6.8], [-33.3, 0], [-32.8, 8], [-33.3, 16], [-32.8, 24], [-33.3, 28], [-38, 28]]);
  const rimM = new THREE.Mesh(new THREE.ShapeGeometry(medRim), mat("#eadfbd")); rimM.rotation.x = -Math.PI / 2; rimM.scale.y = -1; rimM.position.y = TOP + 0.03; group.add(rimM);
  const seaM = new THREE.Mesh(new THREE.ShapeGeometry(medShape), sea); seaM.rotation.x = -Math.PI / 2; seaM.scale.y = -1; seaM.position.y = TOP + 0.06; group.add(seaM);
  const bosphorus = new THREE.CatmullRomCurve3([new THREE.Vector3(14, 0, -28), new THREE.Vector3(13.5, 0, -26.8), new THREE.Vector3(8, 0, -26), new THREE.Vector3(0, 0, -24), new THREE.Vector3(-8, 0, -22), new THREE.Vector3(-16, 0, -20), new THREE.Vector3(-24, 0, -19), new THREE.Vector3(-32, 0, -18), new THREE.Vector3(-36.5, 0, -17.3), new THREE.Vector3(-38, 0, -17.2)]);
  add(group, new THREE.Mesh(riverGeometry(bosphorus, 7.4), mat("#d9cdaa")), 0, 0.03, 0);
  add(group, new THREE.Mesh(riverGeometry(bosphorus, 5.6), sea), 0, 0.06, 0);
  const zayandeh = new THREE.CatmullRomCurve3([new THREE.Vector3(38, 0, 8), new THREE.Vector3(36.5, 0, 8.1), new THREE.Vector3(30, 0, 9), new THREE.Vector3(20, 0, 9.5), new THREE.Vector3(12, 0, 11), new THREE.Vector3(8, 0, 14), new THREE.Vector3(6.5, 0, 16)]);
  add(group, new THREE.Mesh(riverGeometry(zayandeh, 5.4), mat("#d9cdaa")), 0, 0.03, 0);
  add(group, new THREE.Mesh(riverGeometry(zayandeh, 3.6), fresh), 0, 0.06, 0);
  add(group, new THREE.Mesh(new THREE.CircleGeometry(3.4, 20), mat("#d9cdaa")), 6.5, TOP + 0.03, 16.5).rotation.x = -Math.PI / 2;
  add(group, new THREE.Mesh(new THREE.CircleGeometry(2.6, 20), fresh), 6.5, TOP + 0.06, 16.5).rotation.x = -Math.PI / 2;
  addFish({ group, tickers, place, tint, TOP }, zayandeh, [["#d9a441", "#f4e1a1"], ["#8fa3b5", "#d9dee3"]], 1.0, 0.3);
  place(arcadeBridge(8), 15, 10.7, Math.PI / 2);
  place(bridge(6), -16, -20, Math.PI / 2);

  // ---------- Istanbul ----------
  place(mosque(), -8, -13, 0);
  place(galataTower(), -24, -25);
  for (const [x, z, rot, st] of [[-10, -27, 0.1, 2], [-30, -25, -0.1, 1], [-24, -14, 0.1, 2], [18, -21, -0.1, 1], [8, -21, 0.1, 2], [-2, -20.5, 0, 1], [-33, -22, 0.2, 1]] as [number, number, number, number][]) place(casaMe(ME.cream, 3.2, 2.6, 2.2, { storeys: st }), x, z, rot);
  add(group, new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 2.6, 10), mat("#f3ecdc")), 4, TOP + 1.3, -24.5); add(group, new THREE.Mesh(new THREE.ConeGeometry(0.6, 0.9, 10), mat(ME.lead)), 4, TOP + 3.0, -24.5); add(group, new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.5, 0.5, 12), mat(ME.stoneDark)), 4, TOP + 0.25, -24.5);   // the Maiden's Tower on its rock
  for (const [x, z] of [[-5, -3], [6, -4], [-16, -3.5]]) place(tulips(12), x, z, x);
  for (let i = 0; i < 4; i++) place(tree("round", 1.0), -20 + i * 2.6, -17.5 + (i % 2) * 0.6, i);
  place(mountain(3.2, 7, true), -34, -26);
  const ferries = [ferry(), ferry()];
  ferries.forEach((f) => { group.add(f); tickers.push(f.userData.tick!); });
  tickers.push((t) => ferries.forEach((f, i) => { const raw = (t * 0.02 + i * 0.5) % 2; const u = raw < 1 ? raw : 2 - raw; const p = bosphorus.getPointAt(Math.min(0.97, Math.max(0.03, u))), n = bosphorus.getPointAt(Math.min(0.98, Math.max(0.02, u + (raw < 1 ? 0.01 : -0.01)))); f.position.set(p.x, TOP + 0.05, p.z + (i ? 1.2 : -1.2)); f.rotation.y = Math.atan2(n.x - p.x, n.z - p.z) - Math.PI / 2; }));
  group.add(path([[4, -18.6], [12, -18.8], [20, -18.6], [22, -12], [20, -5], [12, -5], [4, -5], [2.5, -12], [4, -18.6]], 1.8, "#d3c8ad"));

  // ---------- the Levant: cedars, terraces, the mountains behind Beirut ----------
  for (const [x, z, s] of [[-9, 3, 1.1], [-7, 6.5, 0.9], [-10, 8.5, 1.0], [-30, 11, 0.9], [-32, -4, 0.8]] as [number, number, number][]) place(cedar(s), x, z, x);
  place(mountain(3.0, 6.5, false), -32, 12);
  group.add(path([[-16, -3.5], [-10, -3], [-9, 3], [-10, 11], [-19, 12], [-28, 12.5], [-31, 7], [-27, -3], [-24, -3], [-16, -3.5]], 1.8, "#d3c8ad"));

  // ---------- Arabia: dunes, Petra, palms ----------
  for (const [x, z, w, h, d] of [[-28, 16, 9, 0.55, 5], [-31, 26, 8, 0.5, 4], [-14, 26.5, 9, 0.5, 4.5], [-2, 14, 7, 0.45, 3.5], [-22, 27, 7, 0.4, 3]] as [number, number, number, number, number][]) place(dune(w, h, d), x, z, x * 0.1);
  place(petra(), 2, 24.5, 0).scale.setScalar(0.6);
  for (const [x, z, s] of [[-4, 19, 0.9], [-34, 20, 0.8], [8, 21, 0.9]] as [number, number, number][]) { const p = datePalm(s); place(p, x, z, x); tickers.push(p.userData.tick!); }

  // ---------- Persia: Isfahan's square, houses with domes, cypresses ----------
  place(persianMosque(), 24, 2, 0);
  for (const [x, z, rot] of [[32, -2, 0.1], [34, 3, -0.1], [12, -3, 0.1], [34, -6, 0.2], [30, -6, -0.1], [32, 20, 0.1], [35, 16, -0.2]] as [number, number, number][]) place(casaMe(ME.stone, 3.0, 2.6, 2.2, { domes: true }), x, z, rot);
  for (let i = 0; i < 6; i++) place(tree("pine", 0.8 + (i % 2) * 0.2), 19 + i * 2.2, -6.5, i);
  for (let i = 0; i < 4; i++) place(tree("round", 0.9), 10 + i * 1.6, 18.5 + (i % 2), i);
  group.add(path([[18, -4], [30, -4], [31, 2], [29, 7], [19, 7], [17, 2], [18, -4]], 1.6, "#d3c8ad"));

  // ---------- Cappadocia's balloons drift over Anatolia at dawn ----------
  const balloons = [["#c9302a", "#f2c14e"], ["#2f4f9f", "#f4f1ea"], ["#3f8f5a", "#e0b34c"], ["#e8558a", "#f4f1ea"], ["#e07a3a", "#2a6f6f"]].map(([a, b], i) => { const bl = balloon(a, b); bl.scale.setScalar(0.9 + (i % 3) * 0.15); group.add(bl); tickers.push(bl.userData.tick!); return { bl, x: 21 + i * 3.4, z: -12 + (i % 2) * 4.5, h: 13 + (i % 3) * 2.5, ph: i * 1.3 }; });
  tickers.push((t) => balloons.forEach(({ bl, x, z, h, ph }) => { bl.position.set(x + Math.sin(t * 0.08 + ph) * 3, TOP + h + Math.sin(t * 0.5 + ph) * 0.6, z + Math.cos(t * 0.06 + ph) * 2.5); bl.rotation.y = t * 0.05 + ph; }));

  // ---------- life ----------
  const loops: [THREE.CatmullRomCurve3, [string, string][], number][] = [
    [new THREE.CatmullRomCurve3([[4, -18.6], [12, -18.8], [20, -18.6], [22, -12], [20, -5], [12, -5], [4, -5], [2.5, -12]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true), [["#3f6fb5", "fez"], ["#c0392b", ""], ["#f4f1ea", "hijab"], ["#2a2a2e", "fez"], ["#e0b34c", ""], ["#2f5d3f", "hijab"], ["#7a4a3a", ""]], 0.008],
    [new THREE.CatmullRomCurve3([[-16, -3.5], [-10, -3], [-9, 3], [-10, 11], [-19, 12], [-28, 12.5], [-31, 7], [-27, -3], [-24, -3]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true), [["#f4f1ea", "keffiyeh"], ["#3f6fb5", ""], ["#e8558a", "hijab"], ["#2a2a2e", ""], ["#c0392b", "keffiyeh"], ["#9b59b6", "hijab"]], 0.007],
    [new THREE.CatmullRomCurve3([[18, -4], [30, -4], [31, 2], [29, 7], [19, 7], [17, 2]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true), [["#3f6fb5", "skull"], ["#f4f1ea", "hijab"], ["#2f5d3f", ""], ["#c0392b", "skull"]], 0.008],
  ];
  for (const [curve, people, speed] of loops) {
    const walkers = people.map(([c, hat]) => local(c, { fez: hat === "fez", keffiyeh: hat === "keffiyeh", skull: hat === "skull", hijab: hat === "hijab" ? ["#9b59b6", "#e8558a", "#2f4f9f"][c.length % 3] : undefined }));
    walkers.forEach((w) => group.add(w));
    tickers.push((t) => walkers.forEach((w, i) => { const u = (t * speed + i / walkers.length) % 1; const p = curve.getPointAt(u), n = curve.getPointAt((u + 0.004) % 1); w.position.set(p.x, 0, p.z); w.rotation.y = Math.atan2(n.x - p.x, n.z - p.z); w.userData.walk?.(t + i); }));
  }
  for (const [x, z, n] of [[-8, -4.5, 3], [10, -20.5, 2], [-24, 12.5, 2], [24, -4.5, 2], [-16, 21.5, 2]] as [number, number, number][]) for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; place(local(["#f4f1ea", "#3f6fb5", "#c0392b", "#2a2a2e"][(i + Math.abs(x)) % 4], { keffiyeh: z > 10 && i === 0, fez: z < -10 && i === 1 }), x + Math.cos(a) * 0.5, z + Math.sin(a) * 0.5, -a - Math.PI / 2); }
  const gulls = birds(6, 9, 8); gulls.position.set(-6, TOP, -22); group.add(gulls); tickers.push(gulls.userData.tick!);
  const gulls2 = birds(4, 7, 8); gulls2.position.set(-30, TOP, 8); group.add(gulls2); tickers.push(gulls2.userData.tick!);
}
