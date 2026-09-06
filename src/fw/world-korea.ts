/** Korea: Seoul in the north, Jeonju in the south-west, Busan on the east coast, Jeju an island in the southern sea. Objects come from graph.ts. */
import * as THREE from "three";
import { KOREA_OBJECTS, type EnrichedRecipe } from "./graph";
import { mat, add, person, tree, butterfly, path, birds, fence, bridge, cow, lounger, type P } from "./props";
import { KOREA_PROPS, KR, hanok, stoneWall, palaceGate, palaceHall, templeKorea, seoulTower, dolHareubang } from "./props-korea";
import { fishingBoat } from "./props-italy";
import { buildWorld, riverGeometry, seaWater, estuaryWater, addFish, type Diorama, type LayoutCtx } from "./worldkit";

export function buildKorea(recipes: EnrichedRecipe[]): Diorama {
  return buildWorld({
    id: "korea", W: 76, D: 56, ground: "#9fbb74", plinth: "#6b4a32", recipes, objects: KOREA_OBJECTS, props: KOREA_PROPS,
    small: /^hanwoo$/, fallbackPlace: "grill",
    layout: layoutKorea,
  });
}

function layoutKorea({ group, tickers, place, tint, TOP }: LayoutCtx) {
  // ground tones: Seoul's granite grey around the palace, Jeonju's green, Busan's sandy port
  tint(-8, -12, 16, 10, "#b9b7a6", 0.05);
  tint(-16, 14, 18, 10, "#a8c47c", -0.1);
  tint(10, 6, 9, 8, "#c4b98a", 0.1);

  // ---------- water: the East Sea and the south coast as one shoreline, the Han river through the middle ----------
  const waterMat = seaWater(), riverMat = estuaryWater(-1.6, 23, 5, "z");   // fresh at the beach, exactly the sea's colour by its last point, which sits just inside the bay   // the Han turns the sea's colour over its last stretch, so its end is invisible in the sea
  tickers.push((t) => { waterMat.uniforms.uTime.value = t; riverMat.uniforms.uTime.value = t; });
  const shore = (pts: [number, number][]) => { const sh = new THREE.Shape(); pts.forEach(([x, z], i) => { const edge = Math.abs(x) >= 38 || Math.abs(z) >= 28; const wx = edge ? x : x + Math.sin(i * 2.7) * 0.5, wz = edge ? z : z + Math.cos(i * 1.9) * 0.5; if (i === 0) sh.moveTo(wx, wz); else sh.lineTo(wx, wz); }); sh.closePath(); return sh; };
  const seaShape = shore([[17, -28], [38, -28], [38, 28], [-7, 28], [-6, 25], [-3.5, 22.5], [0.5, 20], [5, 17.5], [10, 15], [15, 12.5], [17, 6], [17.5, 0], [18, -10], [17, -20]]);
  const rimShape = shore([[15.8, -28], [38, -28], [38, 28], [-8.2, 28], [-7.2, 24.4], [-4.8, 21.4], [-0.6, 18.8], [4, 16.3], [9.2, 13.8], [14, 11.3], [15.8, 5.6], [16.3, 0], [16.8, -10], [15.8, -20]]);
  const rimM = new THREE.Mesh(new THREE.ShapeGeometry(rimShape), mat("#e9dcb4")); rimM.rotation.x = -Math.PI / 2; rimM.scale.y = -1; rimM.position.y = TOP + 0.03; rimM.receiveShadow = true; group.add(rimM);
  const seaM = new THREE.Mesh(new THREE.ShapeGeometry(seaShape), waterMat); seaM.rotation.x = -Math.PI / 2; seaM.scale.y = -1; seaM.position.y = TOP + 0.06; seaM.receiveShadow = true; group.add(seaM);
  const han = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-38, 0, -3), new THREE.Vector3(-36.5, 0, -3), new THREE.Vector3(-30, 0, -1.6), new THREE.Vector3(-20, 0, -1), new THREE.Vector3(-10, 0, -0.2), new THREE.Vector3(-3, 0, 1.5),
    new THREE.Vector3(0, 0, 5), new THREE.Vector3(1, 0, 10), new THREE.Vector3(0.5, 0, 15), new THREE.Vector3(-0.8, 0, 19.5), new THREE.Vector3(-1.3, 0, 22.5), new THREE.Vector3(-1.6, 0, 25),
  ]);
  const bank = new THREE.Mesh(riverGeometry(han, 7), mat("#e9dcb4")); bank.position.y = 0.03; bank.receiveShadow = true; group.add(bank);
  const river = new THREE.Mesh(riverGeometry(han, 5), riverMat); river.position.y = 0.068; river.renderOrder = 2; group.add(river);   // a hair above the sea so the two sheets never flicker
  addFish({ group, tickers, place, tint, TOP }, han, [["#8fa3b5", "#d9dee3"], ["#d9a441", "#f4e1a1"], ["#6f8f6f", "#c9d6b0"]], 1.3, 0.34);
  // two stone bridges over the Han
  place(bridge(6), -12, -0.4, Math.PI / 2);
  place(bridge(6), 0.8, 12, 0);

  // ---------- Jeju: a volcanic island in the southern sea ----------
  const isle = new THREE.Shape(); isle.absellipse(28, 16, 8.5, 6.5, 0, Math.PI * 2, false, 0);
  const isleRim = new THREE.Shape(); isleRim.absellipse(28, 16, 9.2, 7.2, 0, Math.PI * 2, false, 0);
  const rimJ = new THREE.Mesh(new THREE.ShapeGeometry(isleRim, 32), mat("#3a3a3d")); rimJ.rotation.x = -Math.PI / 2; rimJ.scale.y = -1; rimJ.position.y = TOP + 0.075; group.add(rimJ);   // black basalt shore
  const landJ = new THREE.Mesh(new THREE.ShapeGeometry(isle, 32), mat("#8fb56c")); landJ.rotation.x = -Math.PI / 2; landJ.scale.y = -1; landJ.position.y = TOP + 0.09; landJ.receiveShadow = true; group.add(landJ);
  const halla = KOREA_PROPS.none(); void halla;
  place(hallasanProp(), 32.5, 17.5).scale.setScalar(0.62);
  place(dolHareubang(), 33.5, 12, -0.3).scale.setScalar(0.8);
  for (let i = 0; i < 5; i++) place(tree("pine", 0.7 + (i % 2) * 0.2), 22 + i * 1.6, 16.5 + (i % 2) * 0.8, i);

  // ---------- Seoul: palace, hanok lanes, the tower on Namsan ----------
  place(palaceGate(), -6, -15);
  place(palaceHall(), -6, -22.5);
  place(stoneWall(6), -14, -15); place(stoneWall(4), 1, -15);
  place(seoulTower(), 10, -20);
  const hanoks: [number, number, number][] = [[-27, -16, 0.1], [-22, -20, -0.15], [-16, -20, 0.1], [-30, -12, 0.2]];
  for (const [x, z, rot] of hanoks) place(hanok(3.4, 2.6, 1.8), x, z, rot);
  place(templeKorea(), -34, -19, 0.15);
  place(mountainProp(3.2, 6.5), -35, -12);
  place(mountainProp(4, 8), -24, -26);
  for (let i = 0; i < 4; i++) place(tree("ginkgo", 0.9), -13 + i * 2.2, -12.2, i);
  for (let i = 0; i < 3; i++) place(tree("blossom", 0.9), -20 + i * 2.6, -23.5, i);
  group.add(path([[-6, -12.6], [-6, -9], [-5, -6], [-2, -4.2], [3, -3.5], [8, -6], [9, -9]], 2.2, "#cfc6ae"));
  group.add(path([[-9.5, -9], [-6, -9]], 2, "#cfc6ae"));

  // ---------- Jeonju: hanok village, paddies, the cattle paddock ----------
  const jHanoks: [number, number, number][] = [[-20, 15.5, -0.1], [-9, 18.5, 0.2], [-15, 17, 0], [-23, 20, 0.15]];
  for (const [x, z, rot] of jHanoks) place(hanok(3.2, 2.5, 1.7), x, z, rot);
  place(stoneWall(5), -18, 19.6, 0.05);
  for (const [x, z, rot, len] of [[-31, 12.5, 0, 7], [-31, 17.5, 0, 7], [-34.5, 15, Math.PI / 2, 5], [-27.5, 15, Math.PI / 2, 5]] as [number, number, number, number][]) place(fence(len), x, z, rot);
  for (let i = 0; i < 4; i++) place(tree(i % 2 ? "persimmon" : "round", 0.9), -30 + i * 2.5, 22 + (i % 2), i);
  const calf = cow(false, false, "음메~ Moo~"); place(calf, -33, 16.5, 2.2).scale.setScalar(0.7); tickers.push((t, dt) => calf.userData.tick?.(t, dt));
  group.add(path([[-21, 11.5], [-17, 14], [-12, 14.5], [-8, 16.8], [-8, 21], [-14, 21.2], [-20, 21.8], [-24, 17], [-25, 13], [-21, 11.5]], 1.8, "#d2c7a8"));

  // ---------- Busan: the port, the hillside houses, the beach ----------
  const gam = ["#f2c6c6", "#8fc4c9", "#f2cf3a", "#a3d18a", "#f08a2a", "#c9d6ee", "#f4f1ea", "#e07aa0"];
  gam.forEach((c, i) => { const w = 1.6 + (i % 3) * 0.3, h = 1.2 + (i % 2) * 0.6; const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, 1.4), mat(c)); place(b, 5 + (i % 4) * 2.4, -2.5 + Math.floor(i / 4) * 2.2, (i % 3 - 1) * 0.1).position.y = TOP + h / 2 + Math.floor(i / 4) * 0.2; add(b, new THREE.Mesh(new THREE.BoxGeometry(w + 0.2, 0.1, 1.6), mat("#4a4a50")), 0, h / 2, 0); });
  add(group, new THREE.Mesh(new THREE.BoxGeometry(6, 0.6, 1.2), mat("#a29d95")), 19, TOP + 0.3, 2);   // the harbour mole
  add(group, new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 2.4, 10), mat("#f4f1ea")), 21.5, TOP + 1.5, 2);
  add(group, new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.4, 10), mat("#c0392b")), 21.5, TOP + 2.2, 2);
  const boats = [fishingBoat("#3f6b8f"), fishingBoat("#f4f1ea")];
  boats.forEach((b, i) => { place(b, 17.5 + i * 1.6, 4.2 + i * 0.4, 0.4 - i * 0.6).position.y = TOP + 0.05; tickers.push(b.userData.tick!); });
  const sailer = fishingBoat("#c0392b"); group.add(sailer); tickers.push(sailer.userData.tick!);
  const sail = new THREE.CatmullRomCurve3([new THREE.Vector3(21, 0, 0), new THREE.Vector3(24, 0, -8), new THREE.Vector3(31, 0, -6), new THREE.Vector3(35, 0, 0), new THREE.Vector3(33, 0, 6), new THREE.Vector3(26, 0, 5)], true);
  tickers.push((t) => { const u = (t * 0.006) % 1; const p = sail.getPointAt(u), n = sail.getPointAt((u + 0.005) % 1); sailer.position.set(p.x, TOP + 0.05, p.z); sailer.rotation.y = Math.atan2(n.x - p.x, n.z - p.z) - Math.PI / 2; });
  // Haeundae: parasols on the sand
  for (const [x, z, c] of [[8, 13.5, "#f2cf3a"], [5.5, 15.5, "#c0392b"], [3, 17, "#3f6fb0"]] as [number, number, string][]) {
    add(group, new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.8, 5), mat("#f4f1ea")), x, TOP + 0.9, z);
    add(group, new THREE.Mesh(new THREE.ConeGeometry(1.0, 0.45, 10), mat(c)), x, TOP + 1.9, z);
    const lg = lounger(c === "#c0392b" ? "#e07aa0" : "#3f6b8f", c); place(lg, x + 1.1, z + 0.3, -0.5); tickers.push(lg.userData.tick!);
  }
  group.add(path([[5, 12], [10, 12.8], [14, 12], [13, 3], [8, 2.5], [4.5, 4], [3.9, 8], [5, 12]], 1.8, "#d2c7a8"));

  // ---------- life ----------
  const loops: [THREE.CatmullRomCurve3, string[], number][] = [
    [new THREE.CatmullRomCurve3([[-8, -11.5], [-3, -11], [3, -10.5], [4.5, -7], [3.5, -3], [-2, -3.5], [-6, -4.5], [-8, -8]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true), ["#3f6b8f", "#e0a52c", "#c0392b", "#f4f1ea", "#2f5d3f", "#e07aa0", "#2a2a2e"], 0.01],
    [new THREE.CatmullRomCurve3([[-21, 11.5], [-17, 14], [-12, 14.5], [-8, 16.8], [-8, 21], [-14, 21.2], [-20, 21.8], [-24, 17], [-25, 13]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true), ["#e07aa0", "#8fc4c9", "#f2cf3a", "#3f6b8f", "#c0392b"], 0.008],
    [new THREE.CatmullRomCurve3([[5, 12], [10, 12.8], [14, 12], [13, 3], [8, 2.5], [4.5, 4], [3.9, 8]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true), ["#3f6b8f", "#f4f1ea", "#e0a52c", "#2a2a2e"], 0.009],
  ];
  for (const [curve, colours, speed] of loops) {
    const walkers = colours.map((c, i) => person(c, { hat: i % 3 === 1 }));
    walkers.forEach((w) => group.add(w));
    tickers.push((t) => walkers.forEach((w, i) => { const u = (t * speed + i / walkers.length) % 1; const p = curve.getPointAt(u), n = curve.getPointAt((u + 0.004) % 1); w.position.set(p.x, 0, p.z); w.rotation.y = Math.atan2(n.x - p.x, n.z - p.z); (w.userData as { walk?: (t: number) => void }).walk?.(t + i); }));
  }
  // hanbok couples posing by the palace, a group by the hanok village
  for (const [x, z, n] of [[-9, -12.6, 2], [-3, -12.6, 2], [-18, 12.5, 3]] as [number, number, number][]) for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; place(person(["#e07aa0", "#f2cf3a", "#8fc4c9", "#c0392b"][(i + Math.abs(x)) % 4]), x + Math.cos(a) * 0.5, z + Math.sin(a) * 0.5, -a - Math.PI / 2); }
  const flies = [[-22, 12], [24, 14], [-8, 12]].map(([x, z], i) => { const b = butterfly(["#f2b64d", "#ffffff", "#f4a6b8"][i]); group.add(b); tickers.push(b.userData.tick!); return { b, x, z, ph: i * 2 }; });
  tickers.push((t) => flies.forEach(({ b, x, z, ph }) => { b.position.set(x + Math.sin(t * 0.6 + ph) * 2.4, TOP + 1.8 + Math.sin(t * 1.7 + ph) * 0.4, z + Math.cos(t * 0.45 + ph) * 2); b.rotation.y = t * 0.6 + ph; }));
  const magpies = birds(5, 7, 9); magpies.position.set(-10, TOP, -18); group.add(magpies); tickers.push(magpies.userData.tick!);
  const gulls: THREE.Group[] = [];
  for (let i = 0; i < 6; i++) { const gl = new THREE.Group(); add(gl, new THREE.Mesh(new THREE.SphereGeometry(0.1, 7, 5), mat("#f4f1ea")), 0, 0, 0).scale.set(1.3, 0.7, 1); for (const sd of [-1, 1]) add(gl, new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.03, 0.12), mat("#e6e2da")), sd * 0.25, 0.02, 0); group.add(gl); gulls.push(gl); }
  tickers.push((t) => gulls.forEach((gl, i) => { const a = t * 0.25 + i * 1.1; const cx = i < 3 ? 22 : 28, cz = i < 3 ? 2 : 22; gl.position.set(cx + Math.cos(a) * 7, 8 + Math.sin(t * 0.7 + i) * 1.2, cz + Math.sin(a) * 4); gl.rotation.y = -a; gl.children.forEach((c, k) => { if (k) c.rotation.z = Math.sin(t * 9 + i) * 0.5 * (k === 1 ? 1 : -1); }); }));
  void KR;
}

import { mountain } from "./props";
import { hallasan } from "./props-korea";
const mountainProp = (r: number, h: number): P => mountain(r, h, true);
const hallasanProp = (): P => hallasan();
