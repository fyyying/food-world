/** Dish photos as plate textures, and the tiny HTML escaper the cards use. */
import * as THREE from "three";
import type { Recipe } from "../data";
import { imageUrl } from "../data";

const textureCache = new Map<string, Promise<THREE.Texture | null>>();
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

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
