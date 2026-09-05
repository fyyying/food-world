/** Renders a prop into a small transparent image, so cards can show a picture of the real thing instead of an emoji. */
import * as THREE from "three";
import { ICONS, PROPS } from "./props";
import { ITALY_ICONS, ITALY_PROPS } from "./props-italy";
import { KOREA_ICONS, KOREA_PROPS } from "./props-korea";
import { MEXICO_ICONS, MEXICO_PROPS } from "./props-mexico";

let renderer: THREE.WebGLRenderer | null = null;
const cache = new Map<string, string>();

export function snapshot(key: string, size = 192): string | null {
  const hit = cache.get(key);
  if (hit) return hit;
  const build = ICONS[key] ?? ITALY_ICONS[key] ?? KOREA_ICONS[key] ?? MEXICO_ICONS[key] ?? PROPS[key] ?? ITALY_PROPS[key] ?? KOREA_PROPS[key] ?? MEXICO_PROPS[key];
  if (!build) return null;
  const url = snapshotObject(build(), size);
  cache.set(key, url);
  return url;
}

/** Render any prop to an image (debugging and cards). */
export function snapshotObject(prop: THREE.Object3D, size = 192, azimuth = 0.75): string {
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
  (prop as { userData: { tick?: (t: number, dt: number) => void } }).userData.tick?.(1.3, 0.016); // a mid-animation pose looks livelier than the rest pose
  scene.add(prop);
  const box = new THREE.Box3().setFromObject(prop);
  const center = box.getCenter(new THREE.Vector3()), sz = box.getSize(new THREE.Vector3());
  const radius = Math.max(sz.x, sz.y, sz.z) * 0.5;
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  const dist = radius / Math.tan(THREE.MathUtils.degToRad(15));
  camera.position.copy(center).add(new THREE.Vector3(azimuth, 0.45, 1).normalize().multiplyScalar(dist));
  camera.lookAt(center);
  renderer.render(scene, camera);
  const url = renderer.domElement.toDataURL("image/png");
  prop.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { m.geometry.dispose(); } });
  return url;
}
