import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import type { Region, LandmarkKind, TreeKind } from "../regions";
import { hashSeed, mulberry32, wobble } from "./noise";

export type Island = {
  region: Region;
  group: THREE.Group;
  radius: number;         // plateau radius
  center: THREE.Vector3;  // world position of plateau top centre
  topY: number;
  label: CSS2DObject;
  labelEl: HTMLElement;
  ground: THREE.Mesh;     // for raycasting
  reveal: (t: number) => void; // 0..1 intro progress
};

const flat = (color: string, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
  new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.92, metalness: 0, ...extra });

function coastShape(radius: number, seed: number, amp = 0.16, segments = 40): THREE.Shape {
  const shape = new THREE.Shape();
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    const r = radius * (1 + wobble(a, seed) * amp);
    const x = Math.cos(a) * r, y = Math.sin(a) * r;
    if (i === 0) shape.moveTo(x, y); else shape.lineTo(x, y);
  }
  shape.closePath();
  return shape;
}

function slab(shape: THREE.Shape, depth: number, material: THREE.Material, bevel = 0.35): THREE.Mesh {
  const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 2, curveSegments: 6 });
  geo.rotateX(-Math.PI / 2); // extrude along +y
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export function buildIsland(region: Region, radius: number, position: THREE.Vector3): Island {
  const seed = hashSeed(region.id);
  const rng = mulberry32(seed + 7);
  const group = new THREE.Group();
  group.name = `island:${region.id}`;
  group.position.copy(position);

  const topY = 2.6;
  const plateau = slab(coastShape(radius, seed), 2.1, flat(region.grass), 0.45);
  plateau.position.y = topY - 2.1;
  const cliff = slab(coastShape(radius * 1.06, seed, 0.15), 1.9, flat(region.cliff), 0.25);
  cliff.position.y = topY - 2.1 - 1.9 + 0.3;
  const beach = slab(coastShape(radius * 1.2, seed + 3, 0.12), 0.7, flat(region.sand), 0.3);
  beach.position.y = -0.3;
  const shoal = slab(coastShape(radius * 1.42, seed + 9, 0.1), 0.5, flat("#a9dcd6", { transparent: true, opacity: 0.75 }), 0.2);
  shoal.position.y = -1.0;
  shoal.castShadow = false;
  group.add(shoal, beach, cliff, plateau);

  // patches of a second grass tone
  for (let i = 0; i < 4; i++) {
    const a = rng() * Math.PI * 2, d = rng() * radius * 0.55;
    const patch = new THREE.Mesh(new THREE.CircleGeometry(radius * (0.18 + rng() * 0.22), 9), flat(region.grassAlt));
    patch.rotation.x = -Math.PI / 2;
    patch.position.set(Math.cos(a) * d, topY + 0.012, Math.sin(a) * d);
    patch.receiveShadow = true;
    group.add(patch);
  }

  // decorations sit on the rim so plates own the middle
  const deco = new THREE.Group();
  const count = Math.round(radius * 2.2);
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + rng() * 0.3;
    if (Math.abs(((a + Math.PI) % (Math.PI * 2)) - Math.PI) < 0.45) continue; // leave a gap for the landmark
    const d = radius * (0.8 + rng() * 0.1);
    const tree = makeTree(region.tree, rng);
    tree.position.set(Math.cos(a) * d, topY, Math.sin(a) * d);
    tree.rotation.y = rng() * Math.PI * 2;
    deco.add(tree);
  }
  const landmark = makeLandmark(region.landmark, region.accent, rng);
  landmark.position.set(radius * 0.72, topY, 0);
  landmark.rotation.y = -Math.PI / 2;
  deco.add(landmark);
  group.add(deco);

  // little pier
  const pier = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.15, radius * 0.5), flat("#c9a37a"));
  pier.position.set(-radius * 1.05, 0.28, radius * 0.3);
  pier.rotation.y = Math.PI * 0.35;
  pier.castShadow = true;
  group.add(pier);

  // label
  const labelEl = document.createElement("div");
  labelEl.className = "island-label";
  labelEl.innerHTML = `<div class="name">${region.name}</div><div class="count"></div>`;
  const label = new CSS2DObject(labelEl);
  label.position.set(radius * 0.72, topY + 7.5, 0);
  group.add(label);

  group.userData.baseY = position.y;
  const island: Island = {
    region, group, radius, topY,
    center: new THREE.Vector3(position.x, position.y + topY, position.z),
    label, labelEl, ground: plateau,
    reveal: (t) => {
      const y = position.y - 14 * (1 - t);
      group.position.y = y;
      group.scale.setScalar(0.6 + 0.4 * t);
      labelEl.style.opacity = String(Math.max(0, (t - 0.6) / 0.4));
    },
  };
  plateau.userData.island = island;
  cliff.userData.island = island;
  beach.userData.island = island;
  for (const d of deco.children) d.traverse((o) => { o.userData.island = island; });
  return island;
}

// ---------- trees ----------

function makeTree(kind: TreeKind, rng: () => number): THREE.Group {
  const g = new THREE.Group();
  const s = 0.75 + rng() * 0.5;
  const trunkMat = flat("#8b5e3c");
  const add = (m: THREE.Mesh) => { m.castShadow = true; m.receiveShadow = true; g.add(m); return m; };
  switch (kind) {
    case "cactus": {
      const green = flat("#5d9e5a");
      const body = add(new THREE.Mesh(new THREE.CapsuleGeometry(0.22 * s, 1.2 * s, 2, 6), green));
      body.position.y = 0.8 * s;
      const arm = add(new THREE.Mesh(new THREE.CapsuleGeometry(0.15 * s, 0.5 * s, 2, 6), green));
      arm.position.set(0.32 * s, 0.9 * s, 0); arm.rotation.z = -0.5;
      break;
    }
    case "cypress": {
      const trunk = add(new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 0.5 * s, 5), trunkMat)); trunk.position.y = 0.25 * s;
      const cone = add(new THREE.Mesh(new THREE.ConeGeometry(0.36 * s, 2.4 * s, 6), flat("#3f6b3a"))); cone.position.y = 1.65 * s;
      break;
    }
    case "olive": {
      const trunk = add(new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.13, 0.7 * s, 5), flat("#9a7b5b"))); trunk.position.y = 0.35 * s;
      const crown = add(new THREE.Mesh(new THREE.DodecahedronGeometry(0.62 * s, 0), flat("#8fa76a"))); crown.position.y = 1.05 * s;
      break;
    }
    case "blossom": {
      const trunk = add(new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.12, 0.8 * s, 5), flat("#6b4a3a"))); trunk.position.y = 0.4 * s;
      const pink = flat(rng() > 0.5 ? "#f4b7c9" : "#f7cdd8");
      for (let i = 0; i < 3; i++) {
        const puff = add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.42 * s, 0), pink));
        puff.position.set((rng() - 0.5) * 0.5 * s, (1.05 + rng() * 0.35) * s, (rng() - 0.5) * 0.5 * s);
      }
      break;
    }
    case "palm": {
      const trunk = add(new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.12, 1.9 * s, 5), flat("#a37a4f")));
      trunk.position.y = 0.95 * s; trunk.rotation.z = (rng() - 0.5) * 0.25;
      const leaf = new THREE.ConeGeometry(0.16 * s, 1.1 * s, 3);
      for (let i = 0; i < 6; i++) {
        const l = add(new THREE.Mesh(leaf, flat("#3f9a5a")));
        const a = (i / 6) * Math.PI * 2;
        l.position.set(Math.cos(a) * 0.45 * s, 1.85 * s, Math.sin(a) * 0.45 * s);
        l.rotation.set(Math.sin(a) * 1.35, 0, -Math.cos(a) * 1.35);
      }
      break;
    }
    case "pine": {
      const trunk = add(new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 0.6 * s, 5), trunkMat)); trunk.position.y = 0.3 * s;
      const dark = flat("#2f5d3f");
      const c1 = add(new THREE.Mesh(new THREE.ConeGeometry(0.6 * s, 1.1 * s, 6), dark)); c1.position.y = 0.95 * s;
      const c2 = add(new THREE.Mesh(new THREE.ConeGeometry(0.42 * s, 0.9 * s, 6), dark)); c2.position.y = 1.6 * s;
      break;
    }
    case "orchard": {
      const trunk = add(new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.11, 0.6 * s, 5), trunkMat)); trunk.position.y = 0.3 * s;
      const crown = add(new THREE.Mesh(new THREE.SphereGeometry(0.55 * s, 7, 6), flat("#79b06a"))); crown.position.y = 1.0 * s;
      for (let i = 0; i < 4; i++) {
        const fruit = add(new THREE.Mesh(new THREE.SphereGeometry(0.08 * s, 5, 4), flat("#e8836a")));
        const a = rng() * Math.PI * 2;
        fruit.position.set(Math.cos(a) * 0.48 * s, (0.85 + rng() * 0.35) * s, Math.sin(a) * 0.48 * s);
      }
      break;
    }
  }
  return g;
}

// ---------- landmarks ----------

function makeLandmark(kind: LandmarkKind, accent: string, rng: () => number): THREE.Group {
  const g = new THREE.Group();
  const add = (m: THREE.Mesh) => { m.castShadow = true; m.receiveShadow = true; g.add(m); return m; };
  const white = flat("#fbf6ec");
  const roof = flat(accent);
  switch (kind) {
    case "barn": {
      const body = add(new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.6, 1.6), roof)); body.position.y = 0.8;
      const prism = new THREE.CylinderGeometry(1.0, 1.0, 2.3, 3, 1);
      prism.rotateX(Math.PI / 2); // axis along z → triangular roof running the barn's length
      prism.rotateZ(Math.PI / 2);
      const top = add(new THREE.Mesh(prism, white)); top.position.y = 1.95; top.scale.set(1, 0.7, 1);
      const door = add(new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.9, 0.7), white)); door.position.set(1.12, 0.45, 0);
      const silo = add(new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 2.6, 10), flat("#cfd3d8"))); silo.position.set(-1.1, 1.3, 1.2);
      const cap = add(new THREE.Mesh(new THREE.SphereGeometry(0.45, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), roof)); cap.position.set(-1.1, 2.6, 1.2);
      break;
    }
    case "tower": {
      for (let i = 0; i < 5; i++) {
        const ring = add(new THREE.Mesh(new THREE.CylinderGeometry(0.62 - i * 0.02, 0.66 - i * 0.02, 0.62, 14), i % 2 ? white : flat("#efe6d3")));
        ring.position.set(i * 0.07, 0.31 + i * 0.62, 0);
        ring.rotation.z = -0.08;
      }
      const top = add(new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.56, 0.5, 14), white)); top.position.set(0.36, 3.35, 0); top.rotation.z = -0.08;
      const cyp = flat("#3f6b3a");
      for (const x of [-1.5, 1.5]) { const c = add(new THREE.Mesh(new THREE.ConeGeometry(0.3, 2.0, 6), cyp)); c.position.set(x, 1.0, 1.0); }
      break;
    }
    case "dome": {
      const base = add(new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.3, 1.6), white)); base.position.y = 0.65;
      const dome = add(new THREE.Mesh(new THREE.SphereGeometry(0.85, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), roof)); dome.position.y = 1.3;
      const bell = add(new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.9, 0.6), white)); bell.position.set(1.25, 0.95, -0.5);
      const bellTop = add(new THREE.Mesh(new THREE.SphereGeometry(0.34, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2), roof)); bellTop.position.set(1.25, 1.9, -0.5);
      const cross = add(new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.5, 0.06), white)); cross.position.y = 2.35;
      break;
    }
    case "pagoda": {
      const red = flat("#c9413f");
      const dark = flat("#4a2f2a");
      for (let i = 0; i < 3; i++) {
        const w = 1.9 - i * 0.4;
        const body = add(new THREE.Mesh(new THREE.BoxGeometry(w * 0.7, 0.7, w * 0.7), white)); body.position.y = 0.35 + i * 1.0;
        const eave = add(new THREE.Mesh(new THREE.ConeGeometry(w, 0.5, 4), red)); eave.position.y = 0.95 + i * 1.0; eave.rotation.y = Math.PI / 4;
      }
      const spire = add(new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.7, 6), dark)); spire.position.y = 3.35;
      // torii gate
      const post = new THREE.CylinderGeometry(0.08, 0.1, 1.6, 8);
      for (const z of [-0.6, 0.6]) { const p = add(new THREE.Mesh(post, red)); p.position.set(1.6, 0.8, z); }
      const beam = add(new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.14, 1.8), red)); beam.position.set(1.6, 1.62, 0);
      const beam2 = add(new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 1.4), red)); beam2.position.set(1.6, 1.3, 0);
      break;
    }
    case "stupa": {
      const gold = flat("#e0b13c", { metalness: 0.3, roughness: 0.5 });
      const base = add(new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.3, 0.5, 12), white)); base.position.y = 0.25;
      const bell = add(new THREE.Mesh(new THREE.SphereGeometry(0.95, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), gold)); bell.position.y = 0.5;
      const spire = add(new THREE.Mesh(new THREE.ConeGeometry(0.42, 1.9, 10), gold)); spire.position.y = 2.2;
      const tip = add(new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), gold)); tip.position.y = 3.2;
      for (const [x, z] of [[1.5, 0.8], [1.5, -0.8]]) { const p = add(new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.9, 6), gold)); p.position.set(x, 0.45, z); }
      break;
    }
    case "castle": {
      const stone = flat("#9a9aa3");
      const slate = flat("#4d5566");
      const keep = add(new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.6, 1.5), stone)); keep.position.y = 0.8;
      const keepRoof = add(new THREE.Mesh(new THREE.ConeGeometry(1.25, 1.0, 4), slate)); keepRoof.position.y = 2.1; keepRoof.rotation.y = Math.PI / 4;
      for (const [x, z] of [[1.1, 0.9], [-1.1, -0.9], [1.1, -0.9]]) {
        const t = add(new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.38, 2.3, 8), stone)); t.position.set(x, 1.15, z);
        const r = add(new THREE.Mesh(new THREE.ConeGeometry(0.46, 0.9, 8), slate)); r.position.set(x, 2.75, z);
      }
      const flag = add(new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.3), flat(accent, { side: THREE.DoubleSide }))); flag.position.set(0.25, 2.85, 0);
      break;
    }
    case "windmill": {
      const body = add(new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.95, 2.4, 8), white)); body.position.y = 1.2;
      const cap = add(new THREE.Mesh(new THREE.ConeGeometry(0.85, 0.8, 8), roof)); cap.position.y = 2.8;
      const hub = new THREE.Group(); hub.position.set(0.85, 2.3, 0); hub.name = "windmill-hub";
      const blade = new THREE.BoxGeometry(0.06, 2.2, 0.4);
      for (let i = 0; i < 4; i++) { const b = new THREE.Mesh(blade, flat("#d9c5a3")); b.castShadow = true; b.rotation.x = (i * Math.PI) / 2; b.position.set(0, 0, 0); b.geometry = blade; const holder = new THREE.Group(); holder.rotation.x = (i * Math.PI) / 2; b.position.y = 1.1; holder.add(b); hub.add(holder); }
      g.add(hub);
      const door = add(new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.8, 0.5), roof)); door.position.set(0.9, 0.4, 0);
      break;
    }
  }
  // sprinkle a couple of tiny houses next to the landmark
  for (let i = 0; i < 2; i++) {
    const hw = 0.5 + rng() * 0.3;
    const h = add(new THREE.Mesh(new THREE.BoxGeometry(hw, hw * 0.9, hw), white));
    const r = add(new THREE.Mesh(new THREE.ConeGeometry(hw * 0.85, hw * 0.7, 4), roof));
    const x = -1.4 - rng() * 0.8, z = (i ? 1 : -1) * (1.2 + rng() * 0.6);
    h.position.set(x, hw * 0.45, z); r.position.set(x, hw * 0.9 + hw * 0.35, z); r.rotation.y = Math.PI / 4;
  }
  return g;
}

/** Place islands on a ring; bigger islands get more angular room. */
export function layoutIslands(sizes: { radius: number }[], ringRadius: number): THREE.Vector3[] {
  const weights = sizes.map((s) => s.radius * 1.9 + 4);
  const total = weights.reduce((a, b) => a + b, 0);
  const positions: THREE.Vector3[] = [];
  let angle = -Math.PI / 2 - (weights[0] / total) * Math.PI; // start so the first island faces the camera
  for (let i = 0; i < sizes.length; i++) {
    const span = (weights[i] / total) * Math.PI * 2;
    const a = angle + span / 2;
    const r = ringRadius + (i % 2 ? 3 : -3);
    positions.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
    angle += span;
  }
  return positions;
}
