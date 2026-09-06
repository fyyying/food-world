/** Southeast Asia: Bangkok on the Chao Phraya, Hanoi in the north-east, the Mekong delta in the west, the Andaman coast and its karsts in the sea. Objects come from graph.ts. */
import * as THREE from "three";
import { SEASIA_OBJECTS, type EnrichedRecipe } from "./graph";
import { mat, add, path, birds, mountain, lounger, type P } from "./props";
import { SEASIA_PROPS, tubeHouse, stiltHouse, karst, longtail, tukTuk, motorbike, local } from "./props-seasia";
import { bananaTree } from "./props-india";
import { datePalm } from "./props-mideast";
import { buildWorld, riverGeometry, seaWater, freshWater, estuaryWater, addFish, type Diorama, type LayoutCtx } from "./worldkit";

export function buildSeasia(recipes: EnrichedRecipe[]): Diorama {
  return buildWorld({
    id: "southeast-asia", W: 76, D: 56, ground: "#8fbf6e", plinth: "#6b4a32", recipes, objects: SEASIA_OBJECTS, props: SEASIA_PROPS,
    small: /^(chickenSea)$/, fallbackPlace: "curryPaste",
    layout: layoutSeasia,
  });
}

function layoutSeasia({ group, tickers, place, tint, TOP }: LayoutCtx) {
  tint(2, -10, 14, 12, "#c4bba6", 0.05);       // Bangkok's paving
  tint(15, -21, 9, 8, "#c9c0a8", 0.05);         // Hanoi
  tint(-25, 8, 13, 12, "#7fb86a", -0.05);       // the delta's wet green
  tint(16, 12, 7, 5, "#eadfbd", 0.1);           // the beach

  // ---------- water: sea east and south, the Chao Phraya through Bangkok, a Mekong channel through the delta ----------
  const sea = seaWater(), chao = estuaryWater(-2.5, 19.5, 5, "z"), mekong = estuaryWater(-15, 20.5, 5, "z"), basin = freshWater();
  tickers.push((t) => { sea.uniforms.uTime.value = t; chao.uniforms.uTime.value = t; mekong.uniforms.uTime.value = t; basin.uniforms.uTime.value = t; });
  const shore = (pts: [number, number][]) => { const sh = new THREE.Shape(); pts.forEach(([x, z], i) => { const edge = Math.abs(x) >= 38 || Math.abs(z) >= 28; const wx = edge ? x : x + Math.sin(i * 2.7) * 0.5, wz = edge ? z : z + Math.cos(i * 1.9) * 0.5; if (i === 0) sh.moveTo(wx, wz); else sh.lineTo(wx, wz); }); sh.closePath(); return sh; };
  const seaPts: [number, number][] = [[22, -28], [38, -28], [38, 28], [-38, 28], [-38, 22], [-30, 21.5], [-20, 22], [-10, 21], [0, 20], [8, 18.5], [14, 17], [20, 14], [22, 6], [23, -6], [22, -18]];
  const inland = (pts: [number, number][], d: number) => pts.map(([x, z]) => { const edge = Math.abs(x) >= 38 || Math.abs(z) >= 28; if (edge) return [x, z] as [number, number]; const dx = x - 30, dz = z - 30; const l = Math.hypot(dx, dz) || 1; return [x + (dx / l) * d, z + (dz / l) * d] as [number, number]; });
  const rimM = new THREE.Mesh(new THREE.ShapeGeometry(shore(inland(seaPts, 1.2))), mat("#eadfbd")); rimM.rotation.x = -Math.PI / 2; rimM.scale.y = -1; rimM.position.y = TOP + 0.03; rimM.receiveShadow = true; group.add(rimM);
  const seaM = new THREE.Mesh(new THREE.ShapeGeometry(shore(seaPts)), sea); seaM.rotation.x = -Math.PI / 2; seaM.scale.y = -1; seaM.position.y = TOP + 0.06; seaM.receiveShadow = true; group.add(seaM);
  const river = new THREE.CatmullRomCurve3([new THREE.Vector3(-4, 0, -28), new THREE.Vector3(-4, 0, -26.5), new THREE.Vector3(-6, 0, -20), new THREE.Vector3(-4, 0, -12), new THREE.Vector3(-6, 0, -4), new THREE.Vector3(-3, 0, 4), new THREE.Vector3(-4, 0, 12), new THREE.Vector3(-3, 0, 17), new THREE.Vector3(-2.5, 0, 22.5)]);
  add(group, new THREE.Mesh(riverGeometry(river, 6.4), mat("#eadfbd")), 0, 0.03, 0);
  const riverM = new THREE.Mesh(riverGeometry(river, 4.5), chao); riverM.position.y = 0.068; riverM.renderOrder = 2; group.add(riverM);
  // the khlong basin where the floating market moors
  add(group, new THREE.Mesh(new THREE.CircleGeometry(7.6, 28), mat("#eadfbd")), -4, TOP + 0.03, 2).rotation.x = -Math.PI / 2;
  const basinM = new THREE.Mesh(new THREE.CircleGeometry(6.8, 28), basin); basinM.rotation.x = -Math.PI / 2; basinM.position.set(-4, TOP + 0.064, 2); basinM.renderOrder = 2; group.add(basinM);
  addFish({ group, tickers, place, tint, TOP }, river, [["#d9a441", "#f4e1a1"], ["#8fa3b5", "#d9dee3"]], 1.2, 0.32);
  const delta = new THREE.CatmullRomCurve3([new THREE.Vector3(-38, 0, 10), new THREE.Vector3(-36.5, 0, 10), new THREE.Vector3(-30, 0, 11.5), new THREE.Vector3(-24, 0, 12), new THREE.Vector3(-19, 0, 15), new THREE.Vector3(-16, 0, 19), new THREE.Vector3(-15, 0, 22.5)]);
  add(group, new THREE.Mesh(riverGeometry(delta, 5.0), mat("#eadfbd")), 0, 0.03, 0);
  const deltaM = new THREE.Mesh(riverGeometry(delta, 3.4), mekong); deltaM.position.y = 0.068; deltaM.renderOrder = 2; group.add(deltaM);
  addFish({ group, tickers, place, tint, TOP }, delta, [["#6f8f6f", "#c9d6b0"]], 1.0, 0.3);
  for (const [x, z, rot] of [[-27, 12, 0.2], [-21, 13.5, -0.3]] as [number, number, number][]) place(stiltHouse(), x, z, rot);
  const sampan = new THREE.Group(); add(sampan, new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.3, 0.7), mat("#5a3d28")), 0, 0.15, 0); add(sampan, new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.05, 0.76), mat("#a37a4f")), 0, 0.32, 0); const rower = local("#2a2a2e", { nonLa: true }); rower.userData.sit?.(); rower.scale.setScalar(0.8); rower.position.set(-0.4, 0.3, 0); rower.rotation.y = Math.PI / 2; sampan.add(rower); add(sampan, new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.6, 4), mat("#8a6a3a")), 0.3, 0.6, 0.35).rotation.z = 0.5; for (let k = 0; k < 4; k++) add(sampan, new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 5), mat(["#f2b64d", "#7fbf3a", "#c0392b", "#8fb06a"][k])), 0.4 + (k % 2) * 0.3, 0.42, -0.2 + Math.floor(k / 2) * 0.35);
  group.add(sampan);
  tickers.push((t) => { const raw = (t * 0.02) % 2; const u = raw < 1 ? raw : 2 - raw; const uu = Math.min(0.8, Math.max(0.1, 0.1 + u * 0.7)); const p = delta.getPointAt(uu), n = delta.getPointAt(Math.min(0.81, Math.max(0.09, uu + (raw < 1 ? 0.01 : -0.01)))); sampan.position.set(p.x, TOP + 0.05, p.z); sampan.rotation.y = Math.atan2(n.x - p.x, n.z - p.z) - Math.PI / 2; });

  // ---------- Bangkok ----------
  for (const [x, z, rot] of [[-9, -20, 0.1], [-11, -23.5, -0.1], [2, -22, 0.1], [12, -2, 0.2]] as [number, number, number][]) place(tubeHouse("#f3e9d2", 2), x, z, rot);
  for (const [x, z, s] of [[-8, -3, 1.0], [3, 6.5, 1.1], [-13, 2, 0.9], [9, 2, 1.0]] as [number, number, number][]) { const b = bananaTree(s); place(b, x, z, x); tickers.push(b.userData.tick!); }
  group.add(path([[-1, -19.5], [6, -19.5], [11.5, -16], [11.5, -8], [11, 0], [2, -1], [0, -8], [-1, -19.5]], 2.0, "#d3c8ad"));
  const tuks = [tukTuk("#2f6fb5"), tukTuk("#e8558a"), tukTuk("#3f8f5a")];
  tuks.forEach((tk) => group.add(tk));
  const bkk = new THREE.CatmullRomCurve3([[-1, -19.5], [6, -19.5], [11.5, -16], [11.5, -8], [11, 0], [2, -1], [0, -8]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true);
  tickers.push((t) => tuks.forEach((tk, i) => { const u = (t * 0.03 + i / 3) % 1; const p = bkk.getPointAt(u), n = bkk.getPointAt((u + 0.003) % 1); const dx = n.x - p.x, dz = n.z - p.z, l = Math.hypot(dx, dz) || 1; tk.position.set(p.x + (dz / l) * 1.1, 0, p.z - (dx / l) * 1.1); tk.rotation.y = Math.atan2(dx, dz) - Math.PI / 2; tk.rotation.z = Math.sin(t * 5 + i) * 0.02; }));
  place(mountain(4, 8, false), -30, -22); place(mountain(3.4, 7, true), -20, -25);
  for (let i = 0; i < 4; i++) { const p = datePalm(0.9); const cr = (p.userData as { dates?: THREE.Mesh[] }).dates ?? []; cr.forEach((d) => { (d.material as THREE.MeshStandardMaterial).color.set("#8fb06a"); }); place(p, -14 + i * 2.4, -16 + (i % 2), i); tickers.push(p.userData.tick!); }

  // ---------- Hanoi ----------
  for (const [x, z, rot, c] of [[13.5, -9.5, 0.1, "#e9c46a"], [20.5, -8, -0.1, "#d9a86c"], [7, -13, 0.2, "#e9c46a"]] as [number, number, number, string][]) place(tubeHouse(c, 3), x, z, rot);
  const bikes = [0, 1, 2, 3, 4, 5].map(() => motorbike(["#c0392b", "#2f6fb5", "#3f8f5a", "#e8558a", "#2a2a2e", "#f2c14e"][Math.floor(Math.random() * 6)]));
  bikes.forEach((b) => group.add(b));
  tickers.push((t) => bikes.forEach((b, i) => { const a = t * (0.35 + (i % 3) * 0.05) + i * 1.05; b.position.set(17 + Math.cos(a) * 5.0, 0, -22 + Math.sin(a) * 5.0); b.rotation.y = -a; }));
  add(group, new THREE.Mesh(new THREE.RingGeometry(4.6, 5.6, 32), mat("#d3c8ad")), 17, TOP + 0.02, -22).rotation.x = -Math.PI / 2;

  // ---------- the Andaman coast: karsts, longtails, the beach ----------
  for (const [x, z, h, r] of [[30, -10, 8, 2.4], [33.5, 4, 6, 2.0], [27, 20, 7, 2.2], [35, 15, 5, 1.8], [31, 24.5, 4, 1.5], [26, -2, 5, 1.6]] as [number, number, number, number][]) place(karst(h, r), x, z, x).position.y = TOP + 0.05;
  const boats = [longtail("#2f6fb5"), longtail("#c0392b"), longtail("#e8558a")];
  boats.forEach((b) => { group.add(b); tickers.push(b.userData.tick!); });
  const lane = new THREE.CatmullRomCurve3([[24, 10], [29, 6], [31, -3], [28, -14], [33, -20], [36, -8], [36, 9], [31, 14], [24, 14]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true);
  tickers.push((t) => boats.forEach((b, i) => { const u = (t * 0.008 + i / 3) % 1; const p = lane.getPointAt(u), n = lane.getPointAt((u + 0.005) % 1); b.position.set(p.x, TOP + 0.05, p.z); b.rotation.y = Math.atan2(n.x - p.x, n.z - p.z) - Math.PI / 2; }));
  for (const [x, z, c] of [[11, 15.5, "#e8558a"], [15, 13.5, "#f2c14e"], [18.5, 10.5, "#2f6fb5"]] as [number, number, string][]) {
    add(group, new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.8, 5), mat("#f4f1ea")), x, TOP + 0.9, z);
    add(group, new THREE.Mesh(new THREE.ConeGeometry(1.0, 0.45, 10), mat(c)), x, TOP + 1.9, z);
    const lg = lounger("#f4f1ea", c); place(lg, x + 1.1, z + 0.3, -0.6); tickers.push(lg.userData.tick!);
  }
  for (const [x, z, s] of [[8, 15, 1.1], [20, 7, 1.0], [12, 3, 0.9], [-8, 17.5, 1.0], [-30, 18, 1.1], [-34, 5, 0.9], [-12, 8, 1.0]] as [number, number, number][]) { const p = datePalm(s); const cr = (p.userData as { dates?: THREE.Mesh[] }).dates ?? []; cr.forEach((d) => { (d.material as THREE.MeshStandardMaterial).color.set("#8fb06a"); d.scale.set(1.4, 1.2, 1.4); }); place(p, x, z, x); tickers.push(p.userData.tick!); }
  for (const [x, z, s] of [[-30, 0, 1.1], [-20, 6, 1.0], [-34, 14, 1.2], [-18, 0, 0.9], [-12, 14, 1.0], [-31, -8, 1.0], [19.5, 2, 1.0], [16, -4, 0.9], [-6, 22, 1.0]] as [number, number, number][]) { const b = bananaTree(s); place(b, x, z, x + z); tickers.push(b.userData.tick!); }

  // ---------- life ----------
  const loops: [THREE.CatmullRomCurve3, [string, string][], number][] = [
    [new THREE.CatmullRomCurve3([[-1, -19.5], [6, -19.5], [11.5, -16], [11.5, -8], [11, 0], [2, -1], [0, -8]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true), [["#f4f1ea", ""], ["#e8558a", "nonLa"], ["#3f6fb5", ""], ["#2f5d3f", "nonLa"], ["#f2c14e", ""], ["#c0392b", ""]], 0.007],
    [new THREE.CatmullRomCurve3([[-14, -6], [-10, -2], [-12, 5], [-17, 10], [-24, 8], [-30, 5], [-33, -2], [-26, -6], [-20, -8]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true), [["#2a2a2e", "nonLa"], ["#f4f1ea", "nonLa"], ["#3f6fb5", ""], ["#e8558a", "nonLa"], ["#7a4a3a", ""]], 0.006],
    [new THREE.CatmullRomCurve3([[8, -16], [13, -14.5], [21, -14.5], [22, -10.5], [16, -6], [10, -5.5], [7.5, -10]].map(([x, z]) => new THREE.Vector3(x, 0, z)), true), [["#f4f1ea", "nonLa"], ["#e8558a", ""], ["#3f6fb5", "nonLa"], ["#2a2a2e", ""]], 0.008],
  ];
  for (const [curve, people, speed] of loops) {
    const walkers = people.map(([c, kind]) => local(c, { nonLa: kind === "nonLa" }));
    walkers.forEach((w) => group.add(w));
    tickers.push((t) => walkers.forEach((w, i) => { const u = (t * speed + i / walkers.length) % 1; const p = curve.getPointAt(u), n = curve.getPointAt((u + 0.004) % 1); w.position.set(p.x, 0, p.z); w.rotation.y = Math.atan2(n.x - p.x, n.z - p.z); w.userData.walk?.(t + i); }));
  }
  group.add(path([[-14, -6], [-10, -2], [-12, 5], [-17, 10], [-24, 8], [-30, 5], [-33, -2], [-26, -6], [-20, -8], [-14, -6]], 1.6, "#d9c7a0"));
  group.add(path([[8, -16], [13, -14.5], [21, -14.5], [22, -10.5], [16, -6], [10, -5.5], [7.5, -10], [8, -16]], 1.6, "#d3c8ad"));
  for (const [x, z, n] of [[4, -9, 3], [-7, 8, 2], [13, -17, 2], [-28, 15.5, 2], [18, 16, 2]] as [number, number, number][]) for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; place(local(["#f4f1ea", "#3f6fb5", "#e8558a", "#f2c14e"][(i + Math.abs(x)) % 4], { nonLa: i === 0 }), x + Math.cos(a) * 0.5, z + Math.sin(a) * 0.5, -a - Math.PI / 2); }
  const swifts = birds(6, 8, 9); swifts.position.set(4, TOP, -12); group.add(swifts); tickers.push(swifts.userData.tick!);
  const egrets = birds(4, 7, 6); egrets.position.set(-26, TOP, 8); group.add(egrets); tickers.push(egrets.userData.tick!);
}
