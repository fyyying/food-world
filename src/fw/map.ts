/** Level 1: a paper atlas of cuisine regions. Built regions are little models; the rest sleep under clouds. */
import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import { MAP_REGIONS, type MapRegion } from "./graph";
import { wobble } from "../world/noise";
import { mat, mountain, house, tree, temple, pagoda, birds, lanternString, gate } from "./props";
import { colosseum, baroqueChurch, campanile, umbrellaPine, cypress, italianHouse } from "./props-italy";
import { palaceGate, hanok, seoulTower } from "./props-korea";
import { cathedral, aztecPyramid, casa, saguaro, palm, MX } from "./props-mexico";
import { mosque, casaMe, datePalm, camel, ME } from "./props-mideast";
import { blueDomeChurch, cycladicHouse, windmill, sailboat, koutoubia } from "./props-med";
import { tajMahal, elephant, hillFort } from "./props-india";
import { wat, karst, longtail } from "./props-seasia";
import { liberty, skyscraper, barn, goldenGate } from "./props-namerica";
import { fuji, floatingTorii, tokyoTower, pagodaJp, sakura } from "./props-japan";

export type PlacedRegion = {
  region: MapRegion;
  group: THREE.Group;
  hit: THREE.Mesh;
  labelEl: HTMLElement;
  count: number;
  clouds: THREE.Group | null;
  awake: boolean;
};

export type MapWorld = { group: THREE.Group; regions: PlacedRegion[]; tick: (t: number, dt: number) => void; wake: (r: PlacedRegion | null) => void };

function blob(radius: number, seed: number, amp = 0.22, segments = 26): THREE.Shape {
  const s = new THREE.Shape();
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    const r = radius * (1 + wobble(a, seed) * amp);
    const x = Math.cos(a) * r, y = Math.sin(a) * r * 0.8;
    if (i === 0) s.moveTo(x, y); else s.lineTo(x, y);
  }
  s.closePath();
  return s;
}

export function buildMap(counts: Map<string, number>): MapWorld {
  const group = new THREE.Group();

  // paper ocean
  const paper = new THREE.Mesh(new THREE.PlaneGeometry(700, 560), new THREE.MeshStandardMaterial({ color: "#c6dcd6", roughness: 1 }));
  paper.rotation.x = -Math.PI / 2;
  paper.position.y = -0.4;
  paper.receiveShadow = true;
  group.add(paper);
  // faint latitude lines
  const lines = new THREE.Group();
  const lineMat = new THREE.LineBasicMaterial({ color: "#c3d4d0" });
  for (let z = -120; z <= 120; z += 12) lines.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-200, -0.35, z), new THREE.Vector3(200, -0.35, z)]), lineMat));
  for (let x = -204; x <= 204; x += 12) lines.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x, -0.35, -120), new THREE.Vector3(x, -0.35, 120)]), lineMat));
  group.add(lines);

  const cloudMat = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 1, transparent: true, opacity: 0.92 });
  const sphere = new THREE.SphereGeometry(1, 9, 7);

  const regions: PlacedRegion[] = MAP_REGIONS.map((region) => {
    const g = new THREE.Group();
    g.position.set(region.pos[0], 0, region.pos[1]);
    const count = counts.get(region.id) ?? 0;
    const h = region.built ? 1.4 : 0.8;
    const geo = new THREE.ExtrudeGeometry(blob(region.size, region.seed), { depth: h, bevelEnabled: true, bevelThickness: 0.4, bevelSize: 0.45, bevelSegments: 2, curveSegments: 4 });
    geo.rotateX(-Math.PI / 2);
    const land = new THREE.Mesh(geo, mat(region.color));
    land.castShadow = true; land.receiveShadow = true;
    g.add(land);
    // sand rim
    const rimGeo = new THREE.ExtrudeGeometry(blob(region.size * 1.12, region.seed, 0.2), { depth: 0.25, bevelEnabled: true, bevelThickness: 0.2, bevelSize: 0.3, bevelSegments: 1, curveSegments: 4 });
    rimGeo.rotateX(-Math.PI / 2);
    const rim = new THREE.Mesh(rimGeo, mat("#efe4c9"));
    rim.position.y = -0.3;
    rim.receiveShadow = true;
    g.add(rim);

    let clouds: THREE.Group | null = null;
    if (region.built && region.id === "italy") {
      const s = region.size / 10;
      const col = colosseum(); col.position.set(-1.5 * s, h, 1.5 * s); col.scale.setScalar(s * 0.55); g.add(col);
      const ch = baroqueChurch(); ch.position.set(4.5 * s, h, -2 * s); ch.scale.setScalar(s * 0.5); ch.rotation.y = -0.5; g.add(ch);
      const cp = campanile(); cp.position.set(2.5 * s, h, 3.5 * s); cp.scale.setScalar(s * 0.45); g.add(cp);
      for (let i = 0; i < 5; i++) { const p = i % 2 ? umbrellaPine(s * 0.8) : cypress(s * 0.9); p.position.set((-5 + i * 2.6) * s, h, (-4 + (i % 2) * 8) * s); g.add(p); }
      const hs = italianHouse("rome", 2.2 * s, 1.8 * s, 1.3 * s, 2); hs.position.set(-5 * s, h, -1 * s); hs.rotation.y = 0.5; g.add(hs);
      const bd = birds(4, 5 * s, 5 * s); bd.position.set(0, h, 0); bd.scale.setScalar(s * 0.9); g.add(bd);
      g.userData.tick = (t: number, dt: number) => { bd.userData.tick?.(t, dt); };
    } else if (region.built && region.id === "japan") {
      const s = region.size / 10;
      const fj = fuji(); fj.position.set(0, h, 0.5 * s); fj.scale.setScalar(s * 0.5); g.add(fj);
      const tt = tokyoTower(); tt.position.set(5 * s, h, -3.5 * s); tt.scale.setScalar(s * 0.5); g.add(tt);
      const pg = pagodaJp(); pg.position.set(-5 * s, h, 2.5 * s); pg.scale.setScalar(s * 0.6); g.add(pg);
      const tr = floatingTorii(); tr.position.set(4.5 * s, h, 4 * s); tr.scale.setScalar(s * 0.5); tr.rotation.y = 0.4; g.add(tr);
      for (let i = 0; i < 3; i++) { const p = sakura(s * 0.9); p.position.set((-5.5 + i * 2.2) * s, h, (-2.5 - (i % 2)) * s); g.add(p); }
      const bd = birds(4, 5 * s, 5 * s); bd.position.set(0, h, 0); bd.scale.setScalar(s * 0.9); g.add(bd);
      g.userData.tick = (t: number, dt: number) => { bd.userData.tick?.(t, dt); fj.userData.tick?.(t, dt); tt.userData.tick?.(t, dt); };
    } else if (region.built && region.id === "north-america") {
      const s = region.size / 10;
      const lb = liberty(); lb.position.set(5 * s, h, -2.5 * s); lb.scale.setScalar(s * 0.32); lb.rotation.y = -0.6; g.add(lb);
      for (const [x, z, hh] of [[3.2, -4.5, 8], [4.6, -5.5, 11], [2.2, -6, 6]] as [number, number, number][]) { const sk = skyscraper(2.2, hh, 2.2); sk.position.set(x * s, h, z * s); sk.scale.setScalar(s * 0.4); g.add(sk); }
      const bn = barn(); bn.position.set(-1.5 * s, h, -3 * s); bn.scale.setScalar(s * 0.5); bn.rotation.y = 0.2; g.add(bn);
      const gg = goldenGate(6); gg.position.set(-5.5 * s, h, 1.5 * s); gg.scale.setScalar(s * 0.4); gg.rotation.y = Math.PI / 2 + 0.1; g.add(gg);
      for (let i = 0; i < 3; i++) { const p = tree("round", s * 0.7); p.position.set((0 + i * 2.2) * s, h, (3 + (i % 2)) * s); g.add(p); }
      const bd = birds(4, 5 * s, 5 * s); bd.position.set(0, h, 0); bd.scale.setScalar(s * 0.9); g.add(bd);
      g.userData.tick = (t: number, dt: number) => { bd.userData.tick?.(t, dt); };
    } else if (region.built && region.id === "southeast-asia") {
      const s = region.size / 10;
      const w = wat(); w.position.set(-1.5 * s, h, -1.5 * s); w.scale.setScalar(s * 0.4); w.rotation.y = 0.2; g.add(w);
      const k1 = karst(4.5, 1.4); k1.position.set(5 * s, h, -3 * s); k1.scale.setScalar(s * 0.9); g.add(k1);
      const k2 = karst(3.2, 1.1); k2.position.set(6 * s, h, 1.5 * s); k2.scale.setScalar(s * 0.9); g.add(k2);
      const lb = longtail(); lb.position.set(1.5 * s, h, 3.5 * s); lb.scale.setScalar(s * 0.6); lb.rotation.y = 0.5; g.add(lb);
      for (let i = 0; i < 3; i++) { const p = tree("round", s * 0.7); p.position.set((-5.5 + i * 2.2) * s, h, (2.5 + (i % 2)) * s); g.add(p); }
      const bd = birds(4, 5 * s, 5 * s); bd.position.set(0, h, 0); bd.scale.setScalar(s * 0.9); g.add(bd);
      g.userData.tick = (t: number, dt: number) => { bd.userData.tick?.(t, dt); w.userData.tick?.(t, dt); lb.userData.tick?.(t, dt); };
    } else if (region.built && region.id === "india") {
      const s = region.size / 10;
      const tj = tajMahal(); tj.position.set(-1.5 * s, h, -3 * s); tj.scale.setScalar(s * 0.28); tj.rotation.y = 0.2; g.add(tj);
      const ft = hillFort(); ft.position.set(-5 * s, h, 2.5 * s); ft.scale.setScalar(s * 0.3); g.add(ft);
      const el = elephant(); el.position.set(4.5 * s, h, 2.5 * s); el.scale.setScalar(s * 0.5); el.rotation.y = -0.6; g.add(el);
      for (let i = 0; i < 3; i++) { const p = tree("round", s * 0.8); p.position.set((2 + i * 2) * s, h, (-3.5 + (i % 2) * 1.5) * s); g.add(p); }
      const bd = birds(4, 5 * s, 5 * s); bd.position.set(0, h, 0); bd.scale.setScalar(s * 0.9); g.add(bd);
      g.userData.tick = (t: number, dt: number) => { bd.userData.tick?.(t, dt); tj.userData.tick?.(t, dt); el.userData.tick?.(t, dt); };
    } else if (region.built && region.id === "mediterranean") {
      const s = region.size / 10;
      const ch = blueDomeChurch(); ch.position.set(2.5 * s, h, -2 * s); ch.scale.setScalar(s * 0.5); ch.rotation.y = 0.3; g.add(ch);
      for (let i = 0; i < 3; i++) { const hs = cycladicHouse(2.2 * s, 1.8 * s, 1.4 * s, { dome: i === 1 }); hs.position.set((3 + i * 1.6) * s, h, (1 + i * 1.4) * s); hs.rotation.y = -0.4; g.add(hs); }
      const wm = windmill(); wm.position.set(5.5 * s, h, -4 * s); wm.scale.setScalar(s * 0.4); g.add(wm);
      const kt = koutoubia(); kt.position.set(-4.5 * s, h, 2.5 * s); kt.scale.setScalar(s * 0.28); g.add(kt);
      const sb = sailboat(); sb.position.set(-2 * s, h, -3 * s); sb.scale.setScalar(s * 0.6); sb.rotation.y = 0.6; g.add(sb);
      const bd = birds(4, 5 * s, 5 * s); bd.position.set(0, h, 0); bd.scale.setScalar(s * 0.9); g.add(bd);
      g.userData.tick = (t: number, dt: number) => { bd.userData.tick?.(t, dt); wm.userData.tick?.(t, dt); sb.userData.tick?.(t, dt); };
    } else if (region.built && region.id === "middle-east") {
      const s = region.size / 10;
      const mq = mosque(); mq.position.set(-1 * s, h, -1.5 * s); mq.scale.setScalar(s * 0.3); mq.rotation.y = 0.3; g.add(mq);
      for (let i = 0; i < 3; i++) { const hs = casaMe(ME.stone, 2.4 * s, 1.8 * s, 1.4 * s, { domes: i === 1 }); hs.position.set((-5 + i * 2.8) * s, h, 3.5 * s); hs.rotation.y = 0.3 - i * 0.3; g.add(hs); }
      const cm = camel(); cm.position.set(5 * s, h, 1 * s); cm.scale.setScalar(s * 0.45); cm.rotation.y = -0.6; g.add(cm);
      const pl = datePalm(s * 0.8); pl.position.set(5.5 * s, h, -3.5 * s); g.add(pl);
      const bd = birds(4, 5 * s, 5 * s); bd.position.set(0, h, 0); bd.scale.setScalar(s * 0.9); g.add(bd);
      g.userData.tick = (t: number, dt: number) => { bd.userData.tick?.(t, dt); pl.userData.tick?.(t, dt); };
    } else if (region.built && region.id === "mexico") {
      const s = region.size / 10;
      const ca = cathedral(); ca.position.set(-1.5 * s, h, -2 * s); ca.scale.setScalar(s * 0.32); ca.rotation.y = 0.2; g.add(ca);
      const py = aztecPyramid(); py.position.set(4 * s, h, 1.5 * s); py.scale.setScalar(s * 0.4); py.rotation.y = -0.3; g.add(py);
      [MX.pink, MX.yellow, MX.blue].forEach((c, i) => { const hs = casa(c, 2.4 * s, 1.8 * s, 1.4 * s, { tiles: i !== 1 }); hs.position.set((-5.5 + i * 2.6) * s, h, 3.2 * s); hs.rotation.y = 0.3 - i * 0.3; g.add(hs); });
      const cac = saguaro(s * 0.9); cac.position.set(-5.5 * s, h, -3.5 * s); g.add(cac);
      const pl = palm(s * 0.8); pl.position.set(5.5 * s, h, -3.5 * s); g.add(pl);
      const bd = birds(4, 5 * s, 5 * s); bd.position.set(0, h, 0); bd.scale.setScalar(s * 0.9); g.add(bd);
      g.userData.tick = (t: number, dt: number) => { bd.userData.tick?.(t, dt); pl.userData.tick?.(t, dt); };
    } else if (region.built && region.id === "korea") {
      const s = region.size / 10;
      const pg = palaceGate(); pg.position.set(-2 * s, h, -1 * s); pg.scale.setScalar(s * 0.42); pg.rotation.y = 0.2; g.add(pg);
      const tw = seoulTower(); tw.position.set(4.5 * s, h, -3 * s); tw.scale.setScalar(s * 0.35); g.add(tw);
      for (let i = 0; i < 3; i++) { const hk = hanok(2.6 * s, 2 * s, 1.4 * s); hk.position.set((-5 + i * 3.2) * s, h, 3.5 * s); hk.rotation.y = 0.3 - i * 0.3; g.add(hk); }
      for (let i = 0; i < 4; i++) { const p = tree(i % 2 ? "pine" : "blossom", s * 0.8); p.position.set((3 + (i % 2) * 2.5) * s, h, (1.5 + Math.floor(i / 2) * 3) * s); g.add(p); }
      const bd = birds(4, 5 * s, 5 * s); bd.position.set(0, h, 0); bd.scale.setScalar(s * 0.9); g.add(bd);
      g.userData.tick = (t: number, dt: number) => { bd.userData.tick?.(t, dt); };
    } else if (region.built) {
      // a peek of the world inside: mountains, a temple, a pagoda, lanterns and a dragon
      const s = region.size / 10;
      const m1 = mountain(2.4 * s, 4.6 * s); m1.position.set(-4.2 * s, h, -2.2 * s); g.add(m1);
      const m2 = mountain(1.8 * s, 3.2 * s, true); m2.position.set(-6.2 * s, h, 1.2 * s); g.add(m2);
      const m3 = mountain(1.5 * s, 2.6 * s, true); m3.position.set(-1.5 * s, h, -4.2 * s); g.add(m3);
      const tp = temple(); tp.position.set(2.0 * s, h, -1.2 * s); tp.scale.setScalar(s * 0.55); g.add(tp);
      const pg = pagoda(4); pg.position.set(-1.6 * s, h, 2.2 * s); pg.scale.setScalar(s * 0.5); g.add(pg);
      const gt = gate(); gt.position.set(5.2 * s, h, 3.2 * s); gt.scale.setScalar(s * 0.45); gt.rotation.y = -0.4; g.add(gt);
      const hs = house("sichuan", 2.4 * s, 1.8 * s, 1.4 * s); hs.position.set(5.6 * s, h, 0.4 * s); hs.rotation.y = 0.4; g.add(hs);
      const hs2 = house("jiangnan", 2 * s, 1.6 * s, 1.2 * s, 2); hs2.position.set(3.6 * s, h, 3.6 * s); hs2.rotation.y = -0.5; g.add(hs2);
      const ls = lanternString(6 * s, 5); ls.position.set(4.2 * s, h + 2.2 * s, 2.2 * s); ls.scale.setScalar(s * 1.1); g.add(ls);
      const dr = birds(5, 6 * s, 6 * s); dr.position.set(-1 * s, h, -0.5 * s); dr.scale.setScalar(s * 0.9); g.add(dr);
      for (let i = 0; i < 6; i++) { const tr = tree(i % 2 ? "blossom" : "bamboo", s * 0.9); tr.position.set((Math.cos(i * 1.1) * 6.5) * s, h, (Math.sin(i * 1.1) * 4.5) * s); g.add(tr); }
      g.userData.tick = (t: number, dt: number) => { dr.userData.tick?.(t, dt); ls.userData.tick?.(t, dt); tp.userData.tick?.(t, dt); };
    } else {
      clouds = new THREE.Group();
      const n = count ? 2 + Math.floor(region.size / 3) : 3 + Math.floor(region.size / 2);
      for (let i = 0; i < n; i++) {
        const c = new THREE.Mesh(sphere, cloudMat);
        const sc = region.size * (count ? 0.16 + Math.random() * 0.12 : 0.22 + Math.random() * 0.16);
        c.scale.set(sc * 1.4, sc * 0.6, sc);
        c.position.set((Math.random() - 0.5) * region.size * 1.4, 2.2 + Math.random() * 0.6, (Math.random() - 0.5) * region.size * 1.1);
        c.castShadow = true;
        clouds.add(c);
      }
      clouds.userData.baseY = 0;
      g.add(clouds);
      // a small signpost peeking out
      if (count > 0) { const tr = tree("round", region.size / 9); tr.position.set(region.size * 0.5, h, region.size * 0.3); g.add(tr); }
    }

    const hit = new THREE.Mesh(new THREE.CylinderGeometry(region.size * 1.15, region.size * 1.15, region.built ? 16 : 9, 12), new THREE.MeshBasicMaterial({ visible: false }));
    hit.position.y = region.built ? 6 : 3;
    g.add(hit);

    const labelEl = document.createElement("div");
    labelEl.className = `region-label${region.built ? "" : " unbuilt"}`;
    labelEl.innerHTML = `<div class="emo">${region.emoji.map((e) => `<span>${e}</span>`).join("")}</div><div class="n">${region.name}</div><div class="c">${region.built ? `${count} dishes · enter →` : count ? `${count} ${count === 1 ? "dish" : "dishes"} ☁︁` : "not yet"}</div>`;
    const label = new CSS2DObject(labelEl);
    label.position.set(0, h + (region.built ? 6.5 : 4.6), region.size * 0.15);
    g.add(label);

    group.add(g);
    const placed: PlacedRegion = { region, group: g, hit, labelEl, count, clouds, awake: false };
    hit.userData.region = placed;
    land.userData.region = placed;
    return placed;
  });

  function wake(r: PlacedRegion | null) {
    for (const p of regions) {
      const on = p === r;
      if (p.awake === on) continue;
      p.awake = on;
      p.labelEl.classList.toggle("awake", on);
    }
  }

  function tick(t: number, dt: number) {
    for (const p of regions) {
      const targetY = p.awake ? 0.6 : 0;
      p.group.position.y += (targetY - p.group.position.y) * Math.min(1, dt * 6);
      p.group.userData.tick?.(t, dt);
      if (p.clouds) {
        const lift = p.awake ? 1.8 : 0;
        p.clouds.position.y += (lift - p.clouds.position.y) * Math.min(1, dt * 4);
        p.clouds.children.forEach((c, i) => { c.position.x += Math.sin(t * 0.3 + i) * 0.003; c.position.y += Math.sin(t * 0.7 + i * 1.7) * 0.002; });
        const targetOpacity = p.awake ? 0.45 : 0.92;
        (p.clouds.children[0] as THREE.Mesh).material = cloudMat; // shared
        cloudMat.opacity += (targetOpacity - cloudMat.opacity) * Math.min(1, dt * 3) * (p.awake ? 1 : 0.2);
      }
    }
  }

  return { group, regions, tick, wake };
}
