/** Renders a prop into a small transparent image, so cards can show a picture of the real thing instead of an emoji. */
import * as THREE from "three";
import { ICONS, PROPS } from "./props";

let renderer: THREE.WebGLRenderer | null = null;
const cache = new Map<string, string>();

export function snapshot(key: string, size = 192): string | null {
  const hit = cache.get(key);
  if (hit) return hit;
  const build = ICONS[key] ?? PROPS[key];
  if (!build) return null;
  if (!renderer) {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = true;
  }
  renderer.setSize(size, size, false);
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xfff5e6, 0xb9c8a8, 1.0));
  const sun = new THREE.DirectionalLight(0xfff0d8, 2.2);
  sun.position.set(-3, 6, 4); sun.castShadow = true; scene.add(sun);
  const prop = build();
  prop.userData.tick?.(1.3, 0.016); // a mid-animation pose looks livelier than the rest pose
  scene.add(prop);
  const box = new THREE.Box3().setFromObject(prop);
  const center = box.getCenter(new THREE.Vector3()), sz = box.getSize(new THREE.Vector3());
  const radius = Math.max(sz.x, sz.y, sz.z) * 0.5;
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  const dist = radius / Math.tan(THREE.MathUtils.degToRad(15));
  camera.position.copy(center).add(new THREE.Vector3(0.75, 0.62, 1).normalize().multiplyScalar(dist));
  camera.lookAt(center);
  renderer.render(scene, camera);
  const url = renderer.domElement.toDataURL("image/png");
  cache.set(key, url);
  prop.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { m.geometry.dispose(); } });
  return url;
}
