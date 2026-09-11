import * as THREE from "three";
import { flowingWaterMaterial, riverGeometry, type LayoutCtx } from "./worldkit";
import { mat } from "./props";

type Point = THREE.Vector2;

function edges(curve: THREE.CatmullRomCurve3, width: number) {
  const geometry = riverGeometry(curve, width);
  const positions = geometry.getAttribute("position");
  const sides: [Point[], Point[]] = [[], []];
  for (let i = 0; i < positions.count; i++) sides[i % 2].push(new THREE.Vector2(positions.getX(i), positions.getZ(i)));
  geometry.dispose();
  return sides;
}

/** Join a branch that begins inside the main river and leaves its positive-z bank. */
export function riverJunctionOutline(main: THREE.CatmullRomCurve3, branch: THREE.CatmullRomCurve3, mainWidth: number, branchWidth: number): Point[] {
  const [north, south] = edges(main, mainWidth);
  const branchEdges = edges(branch, branchWidth);
  const crossings = branchEdges.map(points => {
    for (let i = 0; i < south.length - 1; i++) {
      const a = south[i], r = south[i + 1].clone().sub(a);
      for (let j = 0; j < points.length - 1; j++) {
        const b = points[j], s = points[j + 1].clone().sub(b);
        const cross = r.cross(s);
        if (Math.abs(cross) < 1e-9) continue;
        const delta = b.clone().sub(a), t = delta.cross(s) / cross, u = delta.cross(r) / cross;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) return { i, j, t, point: a.clone().addScaledVector(r, t), points };
      }
    }
    throw new Error("Canal must cross the main river's south bank");
  }).sort((a, b) => a.i + a.t - b.i - b.t);
  const [left, right] = crossings;
  // Replace the bank between the two intersections with the outside of the canal.
  return [
    ...north.slice().reverse(), ...south.slice(0, left.i + 1), left.point,
    ...left.points.slice(left.j + 1), ...right.points.slice(right.j + 1).reverse(),
    right.point, ...south.slice(right.i + 1),
  ];
}

function surface(outline: Point[], y: number) {
  const shape = new THREE.Shape(outline);
  const geometry = new THREE.ShapeGeometry(shape);
  // Shape XY -> world XZ, with the normal pointing upwards.
  geometry.rotateX(Math.PI / 2);
  geometry.translate(0, y, 0);
  const index = geometry.getIndex()!;
  for (let i = 0; i < index.count; i += 3) {
    const first = index.getX(i);
    index.setX(i, index.getX(i + 2));
    index.setX(i + 2, first);
  }
  geometry.computeVertexNormals();
  return geometry;
}

export function addRiverJunction(ctx: LayoutCtx, main: THREE.CatmullRomCurve3, branch: THREE.CatmullRomCurve3) {
  const bank = new THREE.Mesh(surface(riverJunctionOutline(main, branch, 4.8, 3.2), ctx.TOP + 0.01), mat("#d9c89a"));
  bank.receiveShadow = true;
  ctx.group.add(bank);
  // Pale blue-green like the pond, with a gentler contrast between moving bands.
  const waterMaterial = flowingWaterMaterial("#dcefee", "#cfe4e3");
  const water = new THREE.Mesh(surface(riverJunctionOutline(main, branch, 3.4, 1.8), ctx.TOP + 0.03), waterMaterial);
  water.receiveShadow = true;
  ctx.group.add(water);
  ctx.tickers.push(t => { waterMaterial.uniforms.uTime.value = t; });
}
