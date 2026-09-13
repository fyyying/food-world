/** Ottoman town vocabulary: limestone, projecting timber bays, tiles and shaded arcades. */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { add, mat, type P } from './props';

export const TR = {
  stone:'#cbbba0', cream:'#e5dcc9', mortar:'#ac9e87', wood:'#624b3e',
  roof:'#a86049', tile:'#315f80', turquoise:'#458c91', red:'#944d45', copper:'#b88152',
};
const materials=new Map<string,THREE.MeshStandardMaterial>();
function material(c:string) {
  if(!materials.has(c)) materials.set(c,mat(c));
  return materials.get(c)!;
}
export function block(w:number,h:number,d:number,c:string) {
  return new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material(c));
}
export function dome(r:number,c=TR.stone) {
  return new THREE.Mesh(new THREE.SphereGeometry(r,20,10,0,Math.PI*2,0,Math.PI/2),material(c));
}

/** Merge only a static component, keeping animated people and food outside it. */
export function masonry(g:THREE.Group):THREE.Group {
  const byMaterial=new Map<THREE.Material,THREE.BufferGeometry[]>();
  g.updateMatrixWorld(true);
  g.traverse(o=>{
    if(!(o instanceof THREE.Mesh)) return;
    const m=o.material as THREE.Material;
    const list=byMaterial.get(m)??[];
    const geo=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();
    list.push(geo.applyMatrix4(o.matrixWorld));byMaterial.set(m,list);
  });
  const result=new THREE.Group();
  for(const [m,geometries] of byMaterial){
    const geo=mergeGeometries(geometries);
    if(!geo)throw new Error('Unable to assemble Turkish masonry');
    const mesh=new THREE.Mesh(geo,m);mesh.castShadow=true;mesh.receiveShadow=true;result.add(mesh);
    geometries.forEach(geo=>geo.dispose());
  }
  // All source geometries belong exclusively to this component.
  g.traverse(o=>{if(o instanceof THREE.Mesh)o.geometry.dispose();});
  return result;
}

/** An actual open arch: a ring of wedge-shaped stones, with no wall across the opening. */
export function arch(w:number,leg:number,depth:number,color=TR.stone) {
  const g=new THREE.Group(),r=w/2,thickness=.22;
  for(const x of [-r-thickness/2,r+thickness/2])add(g,block(thickness,leg,depth,color),x,leg/2,0);
  const shape=new THREE.Shape();
  shape.absarc(0,leg,r+thickness,0,Math.PI,false);
  shape.absarc(0,leg,r,Math.PI,0,true);shape.closePath();
  const geo=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:false,curveSegments:14});
  geo.translate(0,0,-depth/2);g.add(new THREE.Mesh(geo,material(color)));
  return g;
}

export function tilePanel(w:number,h:number) {
  const g=new THREE.Group();add(g,block(w,h,.07,TR.cream),0,0,0);
  for(let x=-w/2+.15;x<w/2;x+=.3)for(let y=-h/2+.15;y<h/2;y+=.3){
    add(g,block(.115,.115,.025,TR.tile),x,y,.055).rotation.z=Math.PI/4;
    add(g,block(.04,.14,.025,TR.turquoise),x,y,.075);
  }
  for(const y of [-h/2,h/2])add(g,block(w+.06,.045,.1,TR.tile),0,y,0);
  return g;
}

function windowBay(g:THREE.Group,x:number,y:number,z:number,flowers=false) {
  add(g,block(.82,1.08,.09,TR.wood),x,y,z);
  add(g,block(.66,.9,.04,'#8ba9a5'),x,y,z+.06);
  for(const dx of [-.43,.43])add(g,block(.20,1.05,.08,'#637d72'),x+dx,y,z+.055);
  add(g,block(.055,.95,.055,TR.cream),x,y,z+.10);
  add(g,block(.7,.055,.055,TR.cream),x,y-.03,z+.10);
  if(flowers){
    add(g,block(.97,.22,.28,TR.wood),x,y-.65,z+.13);
    for(let i=0;i<5;i++){
      const leaf=add(g,new THREE.Mesh(new THREE.IcosahedronGeometry(.14,0),material(i%2?'#a9576a':'#697d50')),x-.36+i*.18,y-.48,z+.18);
      leaf.scale.y=.7;
    }
  }
}

export type HouseStyle = 'bay'|'narrow'|'timber'|'corner'|'courtyard'|'stone';

/** Four sloping faces meet a short ridge, rather than giving every house the same gable. */
export function hipRoof(w:number,d:number,y:number,color=TR.roof):THREE.Group {
  const g=new THREE.Group(),h=.95,rx=w*.24;
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute([
    -w/2,y,-d/2, w/2,y,-d/2, w/2,y,d/2, -w/2,y,d/2,
    -rx,y+h,0, rx,y+h,0,
  ],3));
  geo.setAttribute('uv',new THREE.Float32BufferAttribute([0,0,1,0,1,1,0,1,.26,.5,.74,.5],2));
  geo.setIndex([0,4,5,0,5,1,1,5,2,2,5,4,2,4,3,3,4,0]);geo.computeVertexNormals();
  g.add(new THREE.Mesh(geo,material(color)));
  for(const z of [-d/2,d/2])add(g,block(w,.12,.12,TR.wood),0,y,z);
  for(const x of [-w/2,w/2])add(g,block(.12,.12,d,TR.wood),x,y,0);
  add(g,block(rx*2,.12,.13,'#aa684e'),0,y+h,0);
  // Tile seams follow each long roof slope and terminate on its hips.
  for(let i=0;i<17;i++)for(const side of [-1,1]){
    const x=-w/2+(i+.5)*w/17,top=Math.min(1,(w/2-Math.abs(x))/(w/2-rx));
    const z0=side*d/2,z1=side*d/2*(1-top),dy=h*top,dz=z1-z0;
    const seam=add(g,block(.035,.035,Math.hypot(dy,dz),'#bd8062'),x,y+dy/2+.018,(z0+z1)/2);
    seam.rotation.x=-Math.atan2(dy,dz);
  }
  return g;
}

export function ottomanHouse(color=TR.cream,storeys=2,style:HouseStyle='bay'):P {
  const g=new THREE.Group(),floors=style==='courtyard'||style==='stone'?1:storeys,h=floors===1?2.45:2.15+2.1*(floors-1);
  const timber=style==='timber',frame=timber?'#c8b396':TR.wood;
  add(g,block(3.55,1.95,3.0,TR.stone),0,.975,0);
  if(floors>1)add(g,block(3.9,h-1.95,3.3,timber?'#80624e':color),0,(h+1.95)/2,.08);
  else add(g,block(3.55,.5,3,color),0,2.2,0);
  add(g,block(.8,1.65,.08,TR.wood),-.75,.825,1.54);
  add(g,arch(.88,1.25,.14,TR.mortar),-.75,0,1.6);
  windowBay(g,.85,1.15,1.54);
  for(let floor=1;floor<floors;floor++){
    const upper=new THREE.Group();upper.position.y=(floor-1)*2.1;g.add(upper);
    for(const x of [-1.82,0,1.82])add(upper,block(.10,2.15,3.35,frame),x,3.03,.08);
    for(const y of [1.95,4.12])add(upper,block(3.95,.12,3.38,frame),0,y,.08);
    // The projecting cumba is carried by brackets; the room behind it remains solid.
    add(upper,block(2.30,1.9,.72,timber?'#95755d':color),0,3.10,1.86);
    for(const x of [-1.12,1.12])add(upper,block(.11,1.98,.79,frame),x,3.08,1.88);
    for(const x of [-.60,.60])windowBay(upper,x,3.14,2.25,floor===1);
    for(const x of [-.90,.90]){const b=add(upper,block(.13,.74,.13,TR.wood),x,1.93,1.88);b.rotation.x=-.50;}
    for(const side of [-1,1]){
      const sideWindows=new THREE.Group();windowBay(sideWindows,0,3.1,0,style==='corner');sideWindows.rotation.y=side*Math.PI/2;sideWindows.position.x=side*1.97;upper.add(sideWindows);
    }
  }
  if(style==='corner'||style==='timber'||style==='stone')g.add(hipRoof(4.5,4.15,h+.05,style==='stone'?'#987660':TR.roof));
  else for(const side of [-1,1]){
    const roof=add(g,block(4.5,.15,2.08,TR.roof),0,h+.29,side*.9+.08);roof.rotation.x=side*.35;
    for(let i=0;i<17;i++)add(roof,block(.045,.045,2.08,'#ba795b'),-2.12+i*.265,.10,0);
  }
  if(style!=='corner'&&style!=='timber'&&style!=='stone')add(g,block(4.55,.12,.13,'#99513d'),0,h+.66,.08);
  add(g,block(.4,.85,.4,TR.stone),1.25,h+.6,-.55);
  add(g,block(.54,.1,.54,TR.roof),1.25,h+1.06,-.55);
  if(style==='courtyard'){
    // An L-shaped cottage encloses a small planted yard, with an open gate towards the lane.
    add(g,block(1.35,2.0,3.15,color),2.45,1,0);
    const wing=add(g,hipRoof(1.75,3.65,2.08),2.45,0,0);wing.name='courtyard-wing';
    add(g,block(.18,.72,2.25,TR.stone),-1.68,.36,2.53);
    add(g,block(1.7,.72,.18,TR.stone),-.88,.36,3.57);
    add(g,arch(1.2,1.35,.18),1.15,0,3.57);
    for(const x of [-1.15,2.6]){
      add(g,new THREE.Mesh(new THREE.CylinderGeometry(.24,.18,.42,9),material(TR.roof)),x,.21,2.8);
      add(g,new THREE.Mesh(new THREE.IcosahedronGeometry(.37,1),material('#7c8a52')),x,.60,2.8);
    }
  }
  if(style==='corner'){
    add(g,block(2.7,.14,.8,TR.wood),0,2.07,2.17);
    for(let i=0;i<9;i++)add(g,block(.045,.54,.045,TR.wood),-1.27+i*.318,2.41,2.55);
    add(g,block(2.65,.065,.06,TR.wood),0,2.68,2.55);
  }
  if(style==='narrow')g.scale.set(.73,1.08,.92);
  if(style==='stone')g.scale.set(1.08,.91,1.02);
  const result=masonry(g) as P;result.userData.houseStyle=style;result.userData.storeys=floors;
  return result;
}

/** Kilim hangs from a visible rail; a small sway can be applied to the whole group. */
export function kilim(w=1,h=1.6) {
  const g=new THREE.Group();add(g,block(w,h,.035,TR.red),0,-h/2,0);
  for(const x of [-w*.42,w*.42])add(g,block(.07,h-.08,.02,'#d1ad77'),x,-h/2,.03);
  for(let i=0;i<3;i++){
    const d=add(g,block(w*.32,w*.32,.025,'#d9bd8f'),0,-.3-i*(h-.6)/2,.045);d.rotation.z=Math.PI/4;
    add(g,block(w*.15,w*.15,.025,TR.tile),0,d.position.y,.065).rotation.z=Math.PI/4;
  }
  for(let i=0;i<8;i++)add(g,block(.025,.14,.025,'#d9bd8f'),-w*.43+i*w*.12,-h-.06,0);
  add(g,block(w+.18,.055,.07,TR.wood),0,.04,0);return masonry(g);
}

export function bathhouse():THREE.Group {
  const g=new THREE.Group();
  add(g,block(8.8,2.6,6.2,TR.stone),0,1.3,-.3);
  add(g,block(9.15,.23,6.5,TR.mortar),0,2.68,-.3);
  for(const [x,z,r] of [[0,-.7,2.35],[-3,-1,1.18],[3,-1,1.18],[-2.4,1.7,1.12],[2.4,1.7,1.12]]){
    const roof=add(g,dome(r,'#9babad'),x,2.82,z);roof.name='hammam-dome';
    for(let i=0;i<5;i++){
      const a=i/5*Math.PI*2,dx=Math.cos(a)*r*.45,dz=Math.sin(a)*r*.45;
      add(g,new THREE.Mesh(new THREE.SphereGeometry(.105,8,6),material('#cee2de')),x+dx,2.82+r*.895,z+dz);
    }
  }
  // Recessed door and stone arch: a recognizable bath entrance, visible from the town square.
  add(g,block(1.6,2.1,.10,'#5d5b50'),0,1.05,2.86);
  add(g,arch(1.8,1.5,.34,TR.cream),0,0,2.98);
  add(g,tilePanel(1.45,.34),0,2.77,3.10);
  for(const x of [-3.2,3.2]){
    add(g,block(.68,1.25,.08,'#769799'),x,1.38,2.83);
    add(g,arch(.78,1.0,.13,TR.cream),x,.40,2.91);
  }
  // Peştemal towels on a supported rack, clear of the doorway.
  for(const x of [2.5,4.0])add(g,block(.07,1.5,.07,TR.wood),x,.75,3.5);
  add(g,block(1.65,.07,.07,TR.wood),3.25,1.5,3.5);
  for(const x of [2.9,3.6]){
    add(g,block(.52,.84,.04,'#d9d2bf'),x,1.08,3.52);
    for(const y of [.78,.85])add(g,block(.52,.035,.02,TR.red),x,y,3.55);
  }
  return masonry(g);
}

export function iznikFountain():P {
  const g=new THREE.Group() as P,stone=new THREE.Group();
  add(stone,new THREE.Mesh(new THREE.CylinderGeometry(2.05,2.16,.16,8),material(TR.stone)),0,.08,0);
  add(stone,block(1.7,2.05,1.7,TR.cream),0,1.18,0);
  for(let side=0;side<4;side++){
    const face=new THREE.Group();add(face,tilePanel(1.3,1.3),0,1.32,.87);
    add(face,block(1.35,.34,.70,TR.stone),0,.28,1.12);
    add(face,block(1.10,.025,.44,'#6fadb3'),0,.46,1.17);
    add(face,block(.09,.1,.25,TR.copper),0,.95,.99);
    face.rotation.y=side*Math.PI/2;stone.add(face);
  }
  add(stone,block(2.4,.18,2.4,TR.wood),0,2.35,0);
  const roof=add(stone,new THREE.Mesh(new THREE.ConeGeometry(1.95,.88,4),material('#788c8c')),0,2.86,0);roof.rotation.y=Math.PI/4;
  add(stone,new THREE.Mesh(new THREE.SphereGeometry(.13,8,6),material(TR.copper)),0,3.39,0);
  g.add(masonry(stone));
  for(let i=0;i<4;i++){
    const stream=add(g,new THREE.Mesh(new THREE.CylinderGeometry(.027,.038,.46,7),material('#92c4c6')),Math.sin(i*Math.PI/2)*1.09,.71,Math.cos(i*Math.PI/2)*1.09);
    stream.name='fountain-stream';
  }
  return g;
}
