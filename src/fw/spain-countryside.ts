/** The land between the Spanish clusters: the holm-oak dehesa and its walled pig pen, saffron rows, a threshing
 *  floor, the apple orchard, chestnuts and oaks in the north, umbrella pines at the bay, scattered olives.
 *  Decorative only; every crop and tree that carries a card belongs to the Stand maker. */
import * as THREE from 'three';
import { add, mat, tree, pig, type P } from './props';
import { oliveTree, umbrellaPine, cypress } from './props-italy';
import { block, masonry } from './turkey-architecture';
import { SP } from './spain-architecture';
import type { LayoutCtx } from './worldkit';

/** A holm oak: a short trunk under a broad dark crown, the shape the dehesa is pruned to. */
function holmOak(s = 1): P {
  const g = new THREE.Group();
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.16 * s, .24 * s, 1.1 * s, 7), mat('#6b5440')), 0, .55 * s, 0);
  for (const [i, [x, y, z, r]] of [[0, 1.5, 0, 1.15], [.55, 1.25, .3, .72], [-.5, 1.3, -.35, .66], [.15, 1.85, -.45, .6]].entries()) {
    const crown = add(g, new THREE.Mesh(new THREE.IcosahedronGeometry(r * s, 1), mat(i % 2 ? SP.verdeOliva : '#5d6b46')), x * s, y * s, z * s);
    crown.scale.set(1.25, .72, 1.15);
  }
  return g as P;
}
/** A chestnut or oak for the wet north: taller, rounder, lighter. */
function northTree(s = 1): P {
  const g = new THREE.Group();
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.14 * s, .2 * s, 1.5 * s, 7), mat('#5f4b38')), 0, .75 * s, 0);
  for (const [i, [x, y, z, r]] of [[0, 2.1, 0, 1.0], [.45, 1.8, .3, .62], [-.42, 1.85, -.3, .58]].entries()) {
    const crown = add(g, new THREE.Mesh(new THREE.IcosahedronGeometry(r * s, 1), mat(i % 2 ? '#6f8a4c' : '#5c7a43')), x * s, y * s, z * s);
    crown.scale.set(1.1, .95, 1.1);
  }
  return g as P;
}
/** An apple tree with fruit in the crown, for the Asturian orchard. */
function appleTree(s = 1): P {
  const g = new THREE.Group();
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(.11 * s, .16 * s, 1.0 * s, 6), mat('#6a523c')), 0, .5 * s, 0);
  const crown = add(g, new THREE.Mesh(new THREE.IcosahedronGeometry(.85 * s, 1), mat('#5f8248')), 0, 1.45 * s, 0);
  crown.scale.set(1.15, .9, 1.15);
  for (let i = 0; i < 6; i++) add(g, new THREE.Mesh(new THREE.SphereGeometry(.1 * s, 6, 5), mat(i % 2 ? '#c0392b' : '#d8a33c')), Math.cos(i * 2.3) * .6 * s, (1.25 + (i % 3) * .22) * s, Math.sin(i * 2.3) * .55 * s);
  return g as P;
}

export function spainCountryside(ctx: LayoutCtx) {
  const { group, place, tint } = ctx;

  // ---------- the dehesa: holm oaks over dry grass, with a stone-walled pen of pigs ----------
  tint(-77, 19, 7, 6, '#b9ae7c');
  // Three of the five holm oaks stood south of the dehesa and of the pepper drying house, between them and the
  // camera, the nearest 2.9 away. The dehesa between the pen and the drying house is only wide enough for one
  // more tree that clears both stands' pads, so one moved to [-80.2, 7.0] and two came out, 2026-09-17.
  for (const [i, [x, z]] of [[-79.4, 10.4], [-77.6, 9.2], [-80.2, 7.0]].entries()) {
    place(holmOak(1.0 + (i % 3) * .12), x, z, x).name = 'dehesa-oak';
  }
  const pen = new THREE.Group(); pen.name = 'dehesa-pen'; pen.position.set(-79.0, 0, 4.6); group.add(pen);
  const penW = 5.2, penD = 4.0;
  add(pen, new THREE.Mesh(new THREE.PlaneGeometry(penW - .3, penD - .3), mat('#b3a173')), 0, .02, 0).rotation.x = -Math.PI / 2;
  const wall = new THREE.Group();
  for (const z of [-penD / 2, penD / 2]) add(wall, block(penW, .62, .26, SP.granitoGalego), 0, .31, z);
  for (const x of [-penW / 2, penW / 2]) add(wall, block(.26, .62, penD, SP.granitoGalego), x, .31, 0);
  for (let i = 0; i < 9; i++) add(wall, block(.4, .14, .3, '#9a9ea4'), -penW / 2 + .4 + i * (penW - .8) / 8, .69, -penD / 2);
  pen.add(masonry(wall));
  // The gate is a gap in the south wall with two posts, so the pen reads as a pen and not a box.
  add(pen, block(.22, .8, .22, SP.maderaCastano), -.8, .4, penD / 2);
  add(pen, block(.22, .8, .22, SP.maderaCastano), .8, .4, penD / 2);
  for (const [i, [x, z]] of [[-1.5, -.9], [.4, -1.2], [1.4, .5], [-.9, 1.0], [0, -.1]].entries()) {
    const p = add(pen, pig(), x, 0, z); p.rotation.y = i * 1.3; p.scale.setScalar(.85 + (i % 3) * .07); p.name = 'dehesa-pig';
  }

  // ---------- La Mancha: saffron rows, a threshing floor and the dry-plain scatter ----------
  for (let row = 0; row < 4; row++) for (let col = 0; col < 9; col++) {
    const x = -70.4 + col * .62, z = -4.4 + row * .8;
    add(group, new THREE.Mesh(new THREE.BoxGeometry(.5, .06, .5), mat('#a98f62')), x, .04, z);
    const flower = add(group, new THREE.Mesh(new THREE.IcosahedronGeometry(.13, 0), mat(row % 2 ? '#7c5ea8' : '#8f6db8')), x, .16, z);
    flower.scale.set(1, .8, 1); flower.name = 'saffron-flower';
  }
  const floor = new THREE.Mesh(new THREE.CircleGeometry(2.3, 28), mat('#d6c28a'));
  floor.rotation.x = -Math.PI / 2; floor.position.set(-70, .022, -1.2); floor.name = 'threshing-floor'; group.add(floor);
  // The three sheaves stood across the windmill spur; they now lean on the west side of the threshing floor,
  // moved again on 2026-09-17 when the cheese farm's footprint reached over two of them.
  for (const [i, [x, z]] of [[-72.8, -1.8], [-72.6, -1.2], [-73.4, -.5]].entries()) {
    const sheaf = add(group, new THREE.Mesh(new THREE.CylinderGeometry(.2, .38, .85, 10), mat(i % 2 ? '#c8a45c' : '#ddbd70')), x, .43, z);
    sheaf.name = 'grain-sheaf';
    add(group, new THREE.Mesh(new THREE.TorusGeometry(.22, .033, 5, 12), mat('#997346')), x, .48, z).rotation.x = Math.PI / 2;
  }
  // The first rock straddled the windmill spur; it moved a unit and a half off the lane.
  for (const [x, z, r] of [[-74.5, -1.5, .55], [-64.0, -1.0, .42], [-75.0, 1.0, .6], [-64.5, 15.4, .38]]) {
    const rock = add(group, new THREE.Mesh(new THREE.DodecahedronGeometry(r, 0), mat('#bfae8c')), x, r * .42, z);
    rock.scale.set(1.3, .58, .95); rock.rotation.y = x; rock.name = 'mancha-rock';
  }
  // The first olive stood four units in front of the oil mill; it moved north-east past the end of that wedge, 2026-09-17.
  for (const [x, z] of [[-65, 15], [-78.6, 7.5], [-70.6, -10.6], [-80.4, -2.4]]) place(oliveTree(.95), x, z, x).name = 'scattered-olive';

  // ---------- the olive terraces between the west road and the olive spur ----------
  for (const [i, [x, z]] of [[-55.6, 7.0], [-54.9, 7.0], [-55.5, 8.5], [-54.8, 8.5]].entries()) {
    const t = place(oliveTree(1.05 + (i % 2) * .1), x, z, x); t.position.y = z > 8 ? .3 : .18; t.name = 'olive-terrace-tree';
  }

  // ---------- the wet north: chestnuts and oaks on the green slopes, the apple orchard by the cider house ----------
  // Two chestnuts stood in front of the Herbon peppers and one in front of the cider house, 2026-09-17: one
  // moved west past the end of the peppers' wedge, the other two came out.
  for (const [i, [x, z]] of [[-66, -8], [-66.4, -17.6]].entries()) {
    place(northTree(1.0 + (i % 3) * .1), x, z, x).name = 'north-broadleaf';
  }
  // The pomarada used to climb the slope south of the cider house, which is the slope between the cider house
  // and the camera: all six trees stood in front of it, the nearest 3.4 away. It moved to the coast slope
  // north-west of the house, 2026-09-17, where it is behind the house from every angle the camera reaches and
  // still on the cider house's own ground.
  for (let row = 0; row < 2; row++) for (let col = 0; col < 3; col++) {
    place(appleTree(.95 + (col % 2) * .08), -47.4 + col * 1.4, -24.6 + row * 1.4, col).name = 'apple-tree';
  }
  // The single chestnut on the Catalan coast stood three units in front of the bread terrace and five in front
  // of the mosaic bench; it was removed, 2026-09-17.

  // ---------- the bay: umbrella pines on the sandbar and the shore behind the port ----------
  // Both bay pines are gone: the one behind the port stood seven units in front of it, and the other stood on
  // the ground the rice fire moved onto when the Albufera stands were spread apart. The bay keeps the two
  // sandbar pines at the river mouth and the cypress on the shore. 2026-09-17.
  // All three southern cypresses are gone, 2026-09-17: one stood in front of the paddies, one in front of the
  // huerta beds and one in front of the flamenco stage, and once the Albufera stands were spread apart there
  // was no ground left on that shore outside every one of their wedges.
  // Dry scrub tufts fill the open ground between the huerta and the bodega hill.
  for (let i = 0; i < 16; i++) {
    const x = -38 - (i % 4) * 3.2 + Math.sin(i) * 1.2, z = 6 + Math.floor(i / 4) * 3.4 + Math.cos(i) * 1.1;
    const tuft = add(group, new THREE.Mesh(new THREE.SphereGeometry(.22, 6, 4), mat(i % 3 ? '#8d9a63' : '#a3a878')), x, .12, z);
    tuft.scale.y = .6; tuft.name = 'scrub-tuft';
  }
  void tree;
}
