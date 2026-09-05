import * as THREE from "three";
import type { World } from "./scene";
import { ease } from "./scene";
import type { Island } from "./island";

type Flight = { from: THREE.Vector3; to: THREE.Vector3; tFrom: THREE.Vector3; tTo: THREE.Vector3; t: number; dur: number; done?: () => void };

export class CameraDirector {
  private flight: Flight | null = null;
  focused: Island | null = null;

  constructor(private world: World) {
    world.onFrame.add((dt) => this.tick(dt));
  }

  private start(to: THREE.Vector3, target: THREE.Vector3, dur = 1.4, done?: () => void) {
    const { camera, controls } = this.world;
    controls.autoRotate = false;
    this.flight = { from: camera.position.clone(), to, tFrom: controls.target.clone(), tTo: target, t: 0, dur, done };
  }

  private tick(dt: number) {
    if (!this.flight) return;
    const f = this.flight;
    f.t = Math.min(1, f.t + dt / f.dur);
    const k = ease.inOutCubic(f.t);
    // arc upward a little so we don't clip through islands
    const arc = Math.sin(k * Math.PI) * f.from.distanceTo(f.to) * 0.12;
    this.world.camera.position.lerpVectors(f.from, f.to, k).add(new THREE.Vector3(0, arc, 0));
    this.world.controls.target.lerpVectors(f.tFrom, f.tTo, k);
    if (f.t >= 1) { this.flight = null; f.done?.(); }
  }

  /** Distance at which something `size` wide fills `fill` of the usable viewport (the tray eats the bottom third). */
  private fitDistance(size: number, fill: number): number {
    const { camera } = this.world;
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const visibleAtUnit = 2 * Math.tan(vFov / 2);
    const usable = Math.min(0.62, camera.aspect); // fraction of the vertical extent we can use
    return size / (visibleAtUnit * usable * fill);
  }

  private viewDir(): THREE.Vector3 {
    const { camera, controls } = this.world;
    const dir = camera.position.clone().sub(controls.target).setY(0);
    if (dir.lengthSq() < 0.01) dir.set(0, 0, 1);
    return dir.normalize();
  }

  /** Where to look at an island; `panel` shifts it left so the inspector doesn't cover it. */
  private islandTarget(island: Island, panel: boolean, dir: THREE.Vector3): THREE.Vector3 {
    const target = island.center.clone().add(new THREE.Vector3(0, -island.radius * 0.45, 0));
    if (panel) {
      const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), dir).normalize();
      target.add(right.multiplyScalar(island.radius * 0.55));
    }
    return target;
  }

  /** Fly down to an island, keeping the viewer's current compass direction. */
  focusIsland(island: Island, panel = false, done?: () => void) {
    this.focused = island;
    const dir = this.viewDir();
    const d = this.fitDistance(island.radius * 2.5, 0.8);
    const elevation = 0.88; // radians above the horizon
    const pos = island.center.clone()
      .add(dir.clone().multiplyScalar(Math.cos(elevation) * d))
      .add(new THREE.Vector3(0, Math.sin(elevation) * d, 0));
    this.start(pos, this.islandTarget(island, panel, dir), 1.5, done);
  }

  /** Slide the framing sideways when the inspector opens over a focused island. */
  nudgeForPanel(island: Island) {
    const dir = this.viewDir();
    const target = this.islandTarget(island, true, dir);
    const shift = target.clone().sub(this.world.controls.target);
    this.start(this.world.camera.position.clone().add(shift), target, 0.7);
  }

  /** Camera placement that shows the whole ring of islands for the current viewport shape. */
  overviewPlacement(dir = new THREE.Vector3(0, 0, 1)): { pos: THREE.Vector3; target: THREE.Vector3 } {
    const d = this.fitDistance(84, 0.95);
    const elevation = 0.66;
    const pos = dir.clone().normalize().multiplyScalar(Math.cos(elevation) * d).setY(Math.sin(elevation) * d);
    return { pos, target: new THREE.Vector3(0, -d * 0.085, 0) };
  }

  overview(done?: () => void) {
    this.focused = null;
    const { pos, target } = this.overviewPlacement(this.viewDir());
    this.start(pos, target, 1.5, () => { this.world.controls.autoRotate = true; done?.(); });
  }

  get flying() { return this.flight !== null; }
}
