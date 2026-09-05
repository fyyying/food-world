import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import type { Recipe } from "../data";
import { imageUrl } from "../data";
import type { Island } from "./island";
import { minutesLabel } from "../data";
import { ease } from "./scene";

export type Plate = {
  recipe: Recipe;
  island: Island;
  group: THREE.Group;
  dish: THREE.Mesh;
  rim: THREE.Mesh;
  hit: THREE.Mesh;
  label: CSS2DObject;
  labelEl: HTMLElement;
  home: THREE.Vector3;   // rest position (island-local)
  phase: number;
  state: { hover: boolean; selected: boolean; dimmed: boolean; planned: boolean; intro: number };
};

const PLATE_R = 1.12;
const rimGeo = new THREE.CylinderGeometry(PLATE_R + 0.18, PLATE_R + 0.1, 0.16, 36);
const dishGeo = new THREE.CircleGeometry(PLATE_R, 36);
const hitGeo = new THREE.CylinderGeometry(PLATE_R + 0.3, PLATE_R + 0.3, 0.8, 12);
const shadowGeo = new THREE.CircleGeometry(PLATE_R + 0.25, 24);
const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.16, depthWrite: false });
const hitMat = new THREE.MeshBasicMaterial({ visible: false });
const badgeGeo = new THREE.SphereGeometry(0.17, 12, 10);
const badgeMat = new THREE.MeshStandardMaterial({ color: 0xe8836a, roughness: 0.5, emissive: 0xe8836a, emissiveIntensity: 0.35 });

const textureCache = new Map<string, Promise<THREE.Texture | null>>();

/** Photo → square 256px texture (centre-cropped). Missing photo → a warm painted plate. */
export function plateTexture(recipe: Recipe): Promise<THREE.Texture | null> {
  if (!recipe.imageUrl) return Promise.resolve(null);
  let p = textureCache.get(recipe.id);
  if (p) return p;
  p = new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const size = 256;
      const c = document.createElement("canvas");
      c.width = c.height = size;
      const ctx = c.getContext("2d")!;
      const s = Math.min(img.naturalWidth, img.naturalHeight);
      const sx = (img.naturalWidth - s) / 2, sy = (img.naturalHeight - s) / 2;
      ctx.drawImage(img, sx, sy, s, s, 0, 0, size, size);
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      resolve(tex);
    };
    img.onerror = () => resolve(null);
    img.src = imageUrl(recipe.id);
  });
  textureCache.set(recipe.id, p);
  return p;
}

function fallbackTexture(recipe: Recipe, accent: string): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#f6ecdc";
  ctx.fillRect(0, 0, 128, 128);
  ctx.fillStyle = accent;
  ctx.beginPath(); ctx.arc(64, 64, 40, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#fffaf1";
  ctx.font = "700 44px Fraunces, Georgia, serif";
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(recipe.title.trim().charAt(0).toUpperCase(), 64, 68);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Sunflower spiral inside the plateau, leaving the rim to trees. */
function spiralPositions(n: number, radius: number): THREE.Vector3[] {
  const out: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  const usable = radius * 0.66;
  const minGap = 2.75;
  // scale so neighbours don't collide when the island is small relative to n
  const scale = Math.max(usable, minGap * Math.sqrt(n) / 1.9);
  for (let i = 0; i < n; i++) {
    const r = n === 1 ? 0 : scale * Math.sqrt((i + 0.5) / n);
    const a = i * golden;
    out.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
  }
  return out;
}

export function buildPlates(island: Island, recipes: Recipe[]): Plate[] {
  const positions = spiralPositions(recipes.length, island.radius);
  const plates: Plate[] = [];
  recipes.forEach((recipe, i) => {
    const group = new THREE.Group();
    const home = positions[i].clone();
    home.y = island.topY;
    group.position.copy(home);

    const rim = new THREE.Mesh(rimGeo, new THREE.MeshStandardMaterial({ color: 0xfffaf1, roughness: 0.35, emissive: 0x000000 }));
    rim.position.y = 0.42;
    rim.castShadow = true;
    rim.receiveShadow = true;

    const dishMat = new THREE.MeshStandardMaterial({ map: fallbackTexture(recipe, island.region.accent), roughness: 0.6 });
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.rotation.x = -Math.PI / 2;
    dish.position.y = 0.505;
    plateTexture(recipe).then((tex) => { if (tex) { dishMat.map = tex; dishMat.needsUpdate = true; } });

    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.02;

    const hit = new THREE.Mesh(hitGeo, hitMat);
    hit.position.y = 0.5;

    const badge = new THREE.Mesh(badgeGeo, badgeMat);
    badge.position.set(PLATE_R * 0.72, 0.62, -PLATE_R * 0.72);
    badge.visible = false;
    badge.name = "badge";

    const labelEl = document.createElement("div");
    labelEl.className = "plate-label";
    labelEl.innerHTML = `<div class="card"><div class="t">${escapeHtml(recipe.title)}</div><div class="m">${minutesLabel(recipe)}${recipe.effort ? ` · ${recipe.effort}` : ""}${recipe.stars ? ` · ${"★".repeat(recipe.stars)}` : ""}</div></div>`;
    const label = new CSS2DObject(labelEl);
    label.position.y = 1.0;

    group.add(shadow, rim, dish, hit, badge, label);
    island.group.add(group);

    const plate: Plate = {
      recipe, island, group, dish, rim, hit, label, labelEl, home,
      phase: Math.random() * Math.PI * 2,
      state: { hover: false, selected: false, dimmed: false, planned: false, intro: 0 },
    };
    hit.userData.plate = plate;
    rim.userData.plate = plate;
    dish.userData.plate = plate;
    plates.push(plate);
  });
  return plates;
}

const HOVER = new THREE.Color(0xe8836a);
const NONE = new THREE.Color(0x000000);
const tmp = new THREE.Color();

/** Per-frame: bob, lift on hover, glow on select, sink when filtered out. */
export function animatePlates(plates: Plate[], t: number, dt: number) {
  for (const p of plates) {
    const s = p.state;
    const intro = ease.outBack(Math.min(1, s.intro));
    const lift = (s.hover ? 0.55 : 0) + (s.selected ? 0.75 : 0);
    const bob = s.dimmed ? 0 : Math.sin(t * 1.4 + p.phase) * 0.06;
    const targetY = p.home.y + (s.dimmed ? -0.42 : 0) + lift + bob;
    p.group.position.y += (targetY - p.group.position.y) * Math.min(1, dt * 9);
    const targetScale = (s.dimmed ? 0.72 : s.selected ? 1.18 : s.hover ? 1.08 : 1) * intro;
    const sc = p.group.scale.x + (targetScale - p.group.scale.x) * Math.min(1, dt * 9);
    p.group.scale.setScalar(Math.max(0.0001, sc));
    if (s.selected) p.group.rotation.y += dt * 0.6; else p.group.rotation.y *= 1 - Math.min(1, dt * 4);

    const mat = p.rim.material as THREE.MeshStandardMaterial;
    tmp.copy(s.selected || s.hover ? HOVER : NONE);
    mat.emissive.lerp(tmp, Math.min(1, dt * 10));
    mat.emissiveIntensity = s.selected ? 0.55 : 0.35;
    const dishMat = p.dish.material as THREE.MeshStandardMaterial;
    const targetOpacity = s.dimmed ? 0.35 : 1;
    if (Math.abs(dishMat.opacity - targetOpacity) > 0.01) {
      dishMat.transparent = true;
      dishMat.opacity += (targetOpacity - dishMat.opacity) * Math.min(1, dt * 8);
      mat.transparent = true; mat.opacity = dishMat.opacity;
    }
    const badge = p.group.getObjectByName("badge");
    if (badge) badge.visible = s.planned && !s.dimmed;
  }
}

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
