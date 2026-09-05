import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";

export type World = {
  renderer: THREE.WebGLRenderer;
  labelRenderer: CSS2DRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  clock: THREE.Clock;
  onFrame: Set<(dt: number, t: number) => void>;
  sun: THREE.DirectionalLight;
};

const SKY_TOP = new THREE.Color("#f7f0e4");
const SKY_BOTTOM = new THREE.Color("#cfe9ea");

export function createWorld(canvas: HTMLCanvasElement, labelRoot: HTMLElement): World {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const labelRenderer = new CSS2DRenderer({ element: labelRoot });

  const scene = new THREE.Scene();
  scene.background = makeSkyTexture();
  scene.fog = new THREE.Fog(0xd6ecec, 90, 190);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.5, 400);
  camera.position.set(0, 56, 74);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 8;
  controls.maxDistance = 120;
  controls.minPolarAngle = 0.25;
  controls.maxPolarAngle = 1.32;
  controls.enablePan = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.35;
  controls.target.set(0, -10, 0);

  // Light: warm low sun + cool sky fill.
  const hemi = new THREE.HemisphereLight(0xfff4e0, 0x9fd0c8, 0.9);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff1dc, 2.4);
  sun.position.set(-40, 60, 30);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 10;
  sun.shadow.camera.far = 160;
  const s = 60;
  sun.shadow.camera.left = -s; sun.shadow.camera.right = s; sun.shadow.camera.top = s; sun.shadow.camera.bottom = -s;
  sun.shadow.bias = -0.0006;
  sun.shadow.normalBias = 0.02;
  scene.add(sun);
  scene.add(sun.target);

  scene.add(makeSea());
  scene.add(makeClouds());

  const clock = new THREE.Clock();
  const onFrame = new Set<(dt: number, t: number) => void>();

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    labelRenderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  renderer.setAnimationLoop(() => {
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    controls.update();
    for (const fn of onFrame) fn(dt, t);
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
  });

  return { renderer, labelRenderer, scene, camera, controls, clock, onFrame, sun };
}

function makeSkyTexture(): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = 4; c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, `#${SKY_TOP.getHexString()}`);
  g.addColorStop(0.55, "#e6eee8");
  g.addColorStop(1, `#${SKY_BOTTOM.getHexString()}`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 4, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** A calm pastel sea with slow ripples; cheap shader, no textures. */
function makeSea(): THREE.Mesh {
  const geo = new THREE.PlaneGeometry(520, 520, 1, 1);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uShallow: { value: new THREE.Color("#cdeeea") },
      uDeep: { value: new THREE.Color("#a3d9d5") },
      uFar: { value: new THREE.Color("#b9dede") },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv; varying vec3 vPos;
      void main() { vUv = uv; vec4 wp = modelMatrix * vec4(position, 1.0); vPos = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform vec3 uShallow; uniform vec3 uDeep; uniform vec3 uFar;
      varying vec3 vPos;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1,0)), f.x), mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x), f.y); }
      void main() {
        float d = length(vPos.xz);
        float n = noise(vPos.xz * 0.045 + uTime * 0.03) * 0.7 + noise(vPos.xz * 0.16 - uTime * 0.05) * 0.3;
        vec3 col = mix(uDeep, uShallow, smoothstep(0.3, 0.8, n));
        col = mix(col, uFar, smoothstep(60.0, 170.0, d));
        // glints
        float g = smoothstep(0.86, 0.93, noise(vPos.xz * 0.6 + vec2(uTime * 0.2, -uTime * 0.15)));
        col += g * 0.07;
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
  const sea = new THREE.Mesh(geo, mat);
  sea.rotation.x = -Math.PI / 2;
  sea.position.y = -0.6;
  sea.receiveShadow = false;
  sea.name = "sea";
  sea.onBeforeRender = () => { (mat.uniforms.uTime.value as number) = performance.now() / 1000; };
  return sea;
}

function makeClouds(): THREE.Group {
  const g = new THREE.Group();
  g.name = "clouds";
  const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, transparent: true, opacity: 0.85 });
  const sphere = new THREE.SphereGeometry(1, 10, 8);
  const rng = () => Math.random();
  for (let i = 0; i < 14; i++) {
    const cloud = new THREE.Group();
    const puffs = 3 + Math.floor(rng() * 4);
    for (let p = 0; p < puffs; p++) {
      const m = new THREE.Mesh(sphere, mat);
      const s = 1.6 + rng() * 2.2;
      m.scale.set(s * (1 + rng() * 0.6), s * 0.65, s);
      m.position.set((p - puffs / 2) * 2.2 + rng(), rng() * 0.6, (rng() - 0.5) * 1.5);
      cloud.add(m);
    }
    const a = rng() * Math.PI * 2, r = 45 + rng() * 60;
    cloud.position.set(Math.cos(a) * r, 22 + rng() * 10, Math.sin(a) * r);
    cloud.userData.speed = 0.4 + rng() * 0.5;
    g.add(cloud);
  }
  g.onBeforeRender = () => {
    const t = performance.now() / 1000;
    for (const c of g.children) {
      c.position.x += Math.sin(0.0001) + c.userData.speed * 0.016;
      if (c.position.x > 130) c.position.x = -130;
      c.position.y += Math.sin(t * 0.3 + c.position.z) * 0.002;
    }
  };
  return g;
}

/** Ease helpers shared by camera flights and plate animations. */
export const ease = {
  outCubic: (x: number) => 1 - Math.pow(1 - x, 3),
  inOutCubic: (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
  outBack: (x: number) => { const c1 = 1.2, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
};
