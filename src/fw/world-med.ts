/** The Mediterranean: the sea in the middle, Spain to the west, Morocco to the south, Dalmatia to the north, Greece as islands in the east. Objects come from graph.ts. */
import * as THREE from "three";
import { MED_OBJECTS, type EnrichedRecipe } from "./graph";
import { mat, add, tree, path, birds, type P } from "./props";
import { MED_PROPS, MD, cycladicHouse, blueDomeChurch, windmill, parthenon, puebloHouse, alhambra, riad, koutoubia, atlas, stoneHouse, walledTown, sailboat, dolphin, islander } from "./props-med";
import { cypress, umbrellaPine } from "./props-italy";
import { datePalm } from "./props-mideast";
import { buildWorld, seaWater, type Diorama, type LayoutCtx } from "./worldkit";

export function buildMed(recipes: EnrichedRecipe[]): Diorama {
  return buildWorld({
    id: "mediterranean", W: 76, D: 56, ground: "#b9c47c", plinth: "#6b4a32", recipes, objects: MED_OBJECTS, props: MED_PROPS,
    small: /^(flamenco)$/, fallbackPlace: "taverna",
    layout: layoutMed,
  });
}

function layoutMed({ group, tickers, place, tint, TOP }: LayoutCtx) {
  tint(-27, -4, 11, 14, "#c9c08a", 0.05);      // Andalusia's dry gold
  tint(-8, 21, 22, 7, "#d9b98a", -0.05);       // Morocco's red earth
  tint(8, -22, 26, 6, "#b3bf86", 0.05);         // Dalmatia's karst green

  // ---------- the sea, with Greece's islands in it ----------
  const sea = seaWater();
  tickers.push((t) => { sea.uniforms.uTime.value = t; });
  const shore = (pts: [number, number][]) => { const sh = new THREE.Shape(); pts.forEach(([x, z], i) => { const edge = Math.abs(x) >= 38 || Math.abs(z) >= 28; const wx = edge ? x : x + Math.sin(i * 2.7) * 0.5, wz = edge ? z : z + Math.cos(i * 1.9) * 0.5; if (i === 0) sh.moveTo(wx, wz); else sh.lineTo(wx, wz); }); sh.closePath(); return sh; };
  const seaPts: [number, number][] = [[-17, -11], [-8, -14], [4, -15], [16, -14], [28, -15], [38, -14], [38, 28], [16, 28], [14, 22], [12, 14], [2, 12], [-8, 11], [-14, 6], [-17, -2]];
  const inland = (pts: [number, number][], d: number) => pts.map(([x, z]) => { const cx = 10, cz = 0; const dx = x - cx, dz = z - cz; const l = Math.hypot(dx, dz) || 1; const edge = Math.abs(x) >= 38 || Math.abs(z) >= 28; return [edge ? x : x + (dx / l) * d, edge ? z : z + (dz / l) * d] as [number, number]; });
  const rimM = new THREE.Mesh(new THREE.ShapeGeometry(shore(inland(seaPts, 1.2))), mat("#eee3bf")); rimM.rotation.x = -Math.PI / 2; rimM.scale.y = -1; rimM.position.y = TOP + 0.03; rimM.receiveShadow = true; group.add(rimM);
  const seaM = new THREE.Mesh(new THREE.ShapeGeometry(shore(seaPts)), sea); seaM.rotation.x = -Math.PI / 2; seaM.scale.y = -1; seaM.position.y = TOP + 0.06; seaM.receiveShadow = true; group.add(seaM);
  const island = (cx: number, cz: number, rx: number, rz: number, color: string) => {
    const rim = new THREE.Shape(); rim.absellipse(cx, cz, rx + 0.8, rz + 0.8, 0, Math.PI * 2, false, 0);
    const land = new THREE.Shape(); land.absellipse(cx, cz, rx, rz, 0, Math.PI * 2, false, 0);
    const r = new THREE.Mesh(new THREE.ShapeGeometry(rim, 40), mat("#eee3bf")); r.rotation.x = -Math.PI / 2; r.scale.y = -1; r.position.y = TOP + 0.075; group.add(r);
    const l = new THREE.Mesh(new THREE.ShapeGeometry(land, 40), mat(color)); l.rotation.x = -Math.PI / 2; l.scale.y = -1; l.position.y = TOP + 0.09; l.receiveShadow = true; group.add(l);
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

  // ---------- Spain ----------
  place(alhambra(), -30, -14, 0).scale.setScalar(0.85);
  for (const [x, z, rot, st] of [[-33, -2, 0.1, 2], [-29, -3, -0.1, 1], [-24, -4, 0.15, 2], [-34, 2, 0, 1], [-36, -8, 0.2, 1]] as [number, number, number, number][]) place(puebloHouse(2.8, 2.4, 2.2, { storeys: st }), x, z, rot);
  add(group, new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.1, 0.4, 12), mat(MD.stone)), -29, TOP + 0.2, 0.2); add(group, new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.1, 12), mat("#6fc0cf")), -29, TOP + 0.42, 0.2); add(group, new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 1.0, 8), mat(MD.stone)), -29, TOP + 0.9, 0.2); add(group, new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.25, 0.1, 12), mat(MD.stone)), -29, TOP + 1.4, 0.2);   // the plaza fountain
  for (const [x, z] of [[-35, -18], [-24, -19], [-36, 12]]) place(cypress(0.9), x, z, x);
  for (const [x, z] of [[-22, -9], [-35, 5.5]]) { const p = umbrellaPine(0.9); place(p, x, z, x); }
  group.add(path([[-22, -6], [-19.5, -5], [-19.5, 5.5], [-24, 8], [-31, 3.5], [-31, -5.5], [-26, -6], [-22, -6]], 1.6, "#d9cfae"));

  // ---------- Morocco ----------
  const kt = koutoubia(); place(kt, -3, 25.2, 0.1).scale.setScalar(0.75); tickers.push(kt.userData.tick!);
  for (const [x, z, rot, st, tw] of [[-30, 15, 0.1, 1, true], [-27, 26, -0.1, 2, false], [-8, 26.5, 0.1, 1, false], [-34, 26, 0.2, 1, false], [9, 26.5, -0.1, 1, true]] as [number, number, number, number, boolean][]) place(riad(3.0, 2.6, 2.2, { storeys: st, tower: tw }), x, z, rot);
  place(atlas(), -33, 20.5, 0.2).scale.setScalar(0.8);
  for (const [x, z, s] of [[-20, 13.5, 0.9], [2, 13.5, 1.0], [-10, 13, 0.8], [11, 17, 0.9]] as [number, number, number][]) { const p = datePalm(s); place(p, x, z, x); tickers.push(p.userData.tick!); }
  group.add(path([[-25.5, 14], [-26, 24], [-12, 27.2], [3, 24.5], [5, 15.5], [-8, 13.8], [-25.5, 14]], 1.8, "#d9c7a0"));

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

  // ---------- life ----------
  const loops: [THREE.CatmullRomCurve3, [string, string][], number][] = [
    [new THREE.CatmullRomCurve3([[24, 1.5], [29, 2], [32, -2.5], [28, -8.5], [24, -10], [23.5, -2]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true), [["#f4f1ea", "hat"], ["#3f6fb5", ""], ["#c0392b", "scarf"], ["#2a2a2e", ""], ["#e0a52c", "hat"]], 0.008],
    [new THREE.CatmullRomCurve3([[-22, -6], [-19.5, -5], [-19.5, 5.5], [-24, 8], [-31, 3.5], [-31, -5.5], [-26, -6]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true), [["#c0392b", "flat"], ["#f4f1ea", ""], ["#3f6fb5", "hat"], ["#e8558a", "scarf"], ["#2a2a2e", "flat"], ["#f2c14e", ""]], 0.007],
    [new THREE.CatmullRomCurve3([[-25.5, 14], [-26, 24], [-12, 27.2], [3, 24.5], [5, 15.5], [-8, 13.8]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true), [["#f4f1ea", "fez"], ["#3f6fb5", "scarf"], ["#7a4a3a", ""], ["#c0392b", "fez"], ["#2f5d3f", "scarf"], ["#e0b34c", ""]], 0.007],
    [new THREE.CatmullRomCurve3([[-14, -16], [-4, -16], [12, -16.5], [12.2, -26], [-13, -26]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true), [["#3f6fb5", ""], ["#f4f1ea", "flat"], ["#c0392b", ""], ["#2a2a2e", "hat"]], 0.008],
  ];
  for (const [curve, people, speed] of loops) {
    const walkers = people.map(([c, hat]) => islander(c, { hat: hat === "hat", fez: hat === "fez", flat: hat === "flat", scarf: hat === "scarf" ? ["#9b59b6", "#2a5fb8", "#e0b34c"][c.length % 3] : undefined }));
    walkers.forEach((w) => group.add(w));
    tickers.push((t) => walkers.forEach((w, i) => { const u = (t * speed + i / walkers.length) % 1; const p = curve.getPointAt(u), n = curve.getPointAt((u + 0.004) % 1); w.position.set(p.x, 0, p.z); w.rotation.y = Math.atan2(n.x - p.x, n.z - p.z); w.userData.walk?.(t + i); }));
  }
  for (const [x, z, n] of [[22, -1.5, 2], [-27, 1.5, 3], [-13, 16.5, 2], [14, -19.5, 2], [30, 18, 2]] as [number, number, number][]) for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; place(islander(["#f4f1ea", "#3f6fb5", "#c0392b", "#e0a52c"][(i + Math.abs(x)) % 4], { hat: i === 1, fez: z > 12 && i === 0 }), x + Math.cos(a) * 0.5, z + Math.sin(a) * 0.5, -a - Math.PI / 2); }
  void tree;
}
