import * as THREE from 'three';
import { add, mat } from './props';
import { turkeyTram } from './turkey-streets';
import type { LayoutCtx } from './worldkit';

/** One continuous sea surface: open Black Sea in the north, western coast out to the board edge. */
export const LAND_SHORE: [number,number][] = [
  [-58,-44],[-52,-46],[-32,-46],[-12,-46],[5,-46],[18,-46],[25,-44],[33,-43],[42,-42],[48,-42],[54,-41],
  [58,-40],[60,-25],[59,-4],[60,18],[60,40],[60,58],[58,70],[53,74],[34,74],[14,73],[-6,74],[-29,74],[-51,74],[-57,68],[-58,48],[-58,29],[-52,24],[-43,21],[-40,17],[-46,13],[-54,10],[-58,6],[-58,0],
];
export function seaSurface(material:THREE.Material) {
  const outer=new THREE.Shape();outer.moveTo(-62,56);outer.lineTo(62,56);outer.lineTo(62,-76);outer.lineTo(-62,-76);outer.closePath();
  const island=new THREE.Path();LAND_SHORE.forEach(([x,z],i)=>i?island.lineTo(x,-z):island.moveTo(x,-z));island.closePath();outer.holes.push(island);
  const mesh=new THREE.Mesh(new THREE.ShapeGeometry(outer),material);mesh.rotation.x=-Math.PI/2;mesh.position.y=.065;mesh.name='coastal-sea';return mesh;
}
export const RIVER_COURSE = new THREE.CatmullRomCurve3([
  [-4,52],[3,53],[11,53],[24,51],[42,51],[62,51],
].map(([x,z])=>new THREE.Vector3(x,0,z)));
export function waterOutline(): [number,number][] {
  const left:[number,number][]=[],right:[number,number][]=[];
  for(let i=0;i<=120;i++){
    const u=i/120,p=RIVER_COURSE.getPoint(u),t=RIVER_COURSE.getTangent(u);
    // The upstream end swells into a spring lake; the downstream end leaves the board.
    const width=u<.20?Math.sin(u/.20*Math.PI/2)*5:u<.37?5-(u-.20)/.17*3:2;
    left.push([p.x-t.z*width,p.z+t.x*width]);right.push([p.x+t.z*width,p.z-t.x*width]);
  }
  return [...left,...right.reverse()];
}
export function surface(points:[number,number][],material:THREE.Material,y:number,name:string) {
  const shape=new THREE.Shape();points.forEach(([x,z],i)=>i?shape.lineTo(x,-z):shape.moveTo(x,-z));shape.closePath();
  const mesh=new THREE.Mesh(new THREE.ShapeGeometry(shape),material);mesh.rotation.x=-Math.PI/2;mesh.position.y=y;mesh.name=name;return mesh;
}
/** Solid sloping terrain with a level crown that carries a complete room and its furniture. */
export function terrace(ctx:LayoutCtx,x:number,z:number,rx:number,rz:number,h:number,color:string,crown=.85) {
  const positions:number[]=[],indices:number[]=[],segments=48;
  for(const [r,y] of [[0,h],[crown,h],[1,0]])for(let i=0;i<=segments;i++){
    const a=i/segments*Math.PI*2;positions.push(x+Math.cos(a)*rx*r,y,z+Math.sin(a)*rz*r);
  }
  for(let ring=0;ring<2;ring++)for(let i=0;i<segments;i++){
    const a=ring*(segments+1)+i,b=a+segments+1;indices.push(a,b,a+1,a+1,b,b+1);
  }
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.setIndex(indices);geo.computeVertexNormals();
  const mesh=new THREE.Mesh(geo,mat(color,{side:THREE.DoubleSide}));mesh.name='raised-terrain';mesh.receiveShadow=true;ctx.group.add(mesh);
}

/** The two carriages follow the same curved track at different arc distances. */
export const TRAM_ROUTE = new THREE.CatmullRomCurve3([
  [-52,-43],[-39,-43],[-22,-43],[-13,-43],[-9,-39],[-9,-29],[-9,-19],[-10,-11],
  [-17,-8.4],[-32,-8.4],[-46,-8.4],[-55.6,-12],[-55.6,-25],[-55.6,-38],
].map(([x,z])=>new THREE.Vector3(x,.06,z)),true,'centripetal');
export function tramway(ctx:LayoutCtx) {
  const {group,tickers}=ctx,length=TRAM_ROUTE.getLength();
  const railPaths=[-.44,.44].map(offset=>{
    const points=[];
    for(let i=0;i<=500;i++){const u=i/500,p=TRAM_ROUTE.getPointAt(u),t=TRAM_ROUTE.getTangentAt(u);points.push(p.add(new THREE.Vector3(-t.z,0,t.x).multiplyScalar(offset)));}
    return new THREE.CatmullRomCurve3(points);
  });
  for(const path of railPaths){const mesh=new THREE.Mesh(new THREE.TubeGeometry(path,500,.032,5,false),mat('#72695b'));mesh.name='tram-rail';group.add(mesh);}
  for(let distance=0;distance<length;distance+=.8){
    const u=distance/length,p=TRAM_ROUTE.getPointAt(u),t=TRAM_ROUTE.getTangentAt(u);
    const sleeper=add(group,new THREE.Mesh(new THREE.BoxGeometry(.13,.04,1.2),mat('#9e8968')),p.x,.023,p.z);sleeper.rotation.y=-Math.atan2(t.z,t.x);
  }
  const cable=TRAM_ROUTE.clone();cable.points=cable.points.map(p=>p.clone().setY(2.55));
  group.add(new THREE.Mesh(new THREE.TubeGeometry(cable,500,.015,4,true),mat('#514d43')));
  for(let distance=0;distance<length;distance+=10){
    const p=TRAM_ROUTE.getPointAt(distance/length),t=TRAM_ROUTE.getTangentAt(distance/length),n=new THREE.Vector3(-t.z,0,t.x);
    const pole=add(group,new THREE.Mesh(new THREE.CylinderGeometry(.05,.065,2.6,8),mat('#675b49')),p.x+n.x,1.3,p.z+n.z);
    const arm=add(group,new THREE.Mesh(new THREE.BoxGeometry(.06,.06,1.15),mat('#675b49')),p.x+n.x*.5,2.55,p.z+n.z*.5);arm.rotation.y=-Math.atan2(t.z,t.x);pole.name='tram-support';
  }
  const cars:THREE.Group[]=[];
  for(let i=0;i<2;i++){
    const car=turkeyTram();cars.push(car);car.name='istanbul-tram';group.add(car);
    tickers.push(t=>{const u=((t*2.4-i*4.1)/length%1+1)%1,p=TRAM_ROUTE.getPointAt(u),direction=TRAM_ROUTE.getTangentAt(u);car.position.copy(p);car.rotation.y=-Math.atan2(direction.z,direction.x);});
  }
  const coupling=new THREE.Mesh(new THREE.CylinderGeometry(.055,.055,1,8),mat('#4c463d'));coupling.name='tram-coupling';group.add(coupling);
  tickers.push(()=>{const front=cars[0].localToWorld(new THREE.Vector3(-1.7,.48,0)),back=cars[1].localToWorld(new THREE.Vector3(1.7,.48,0));group.worldToLocal(front);group.worldToLocal(back);coupling.position.copy(front).add(back).multiplyScalar(.5);coupling.scale.y=front.distanceTo(back);coupling.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),back.sub(front).normalize());});
}
