/** The town is built as street blocks around food, with an open waterfront behind it. */
import * as THREE from 'three';
import { add, mat, tree, bubble, type P } from './props';
import { bazaar, mosque } from './props-mideast';
import { TR, arch, block, dome, tilePanel, masonry, kilim, ottomanHouse, type HouseStyle } from './turkey-architecture';
import { surface, terrace, terraceStairs } from './turkey-landscape';
import { turkeyTeaCorner } from './props-turkey';
import { turkeyResident } from './turkey-people';
import type { LayoutCtx } from './worldkit';

export function turkeyBazaar():P {
  let resident=40;
  const g=bazaar((_shirt,opts)=>turkeyResident(resident++,!!opts?.apron));
  // Retain the working stalls and shoppers; replace the single shed with open stone arcades.
  for(const o of [...g.children])if(o instanceof THREE.Mesh && o.position.y>.1){g.remove(o);o.geometry.dispose();}
  const stone=new THREE.Group();
  for(const x of [-5,0,5])for(const z of [-4.5,4.5]){
    // The central entrance replaces this bay; two identical arch rings z-fight along their curves.
    if(x===0&&z===4.5)continue;
    add(stone,arch(4.5,2.75,.48),x,0,z);
  }
  for(const x of [-6,-2,2,6]){
    add(stone,block(3.95,.18,4.2,TR.stone),x,3.5,-2.2);
    add(stone,dome(1.92,'#b49d7e'),x,3.59,-2.2).scale.set(1,.63,1.07);
  }
  for(const x of [-7.5,7.5])add(stone,block(.45,3.6,9,TR.stone),x,1.8,0);
  // The side walls carry a timber lintel below the dome platforms, above the shoppers' aisle.
  add(stone,block(15.5,.24,.24,TR.wood),0,3.40,-.10);
  // A raised central entrance and tiled inscription panel anchor the market in the square.
  add(stone,arch(4.5,2.75,.65,TR.cream),0,0,4.5);
  add(stone,tilePanel(2.6,.56),0,5.25,4.86);
  add(stone,block(3.0,.17,.65,TR.stone),0,5.55,4.5);
  const arcades=masonry(stone);arcades.name='market-arcades';g.add(arcades);
  for(const [x,z] of [[-6.6,4.84],[6.6,4.84],[-7.22,1.9]]){
    const rug=add(g,kilim(.90,1.65),x,2.6,z);if(x<-7)rug.rotation.y=Math.PI/2;
  }
  // Goods spill out beside the gateways, leaving the central passage open.
  const vendors:THREE.Group[]=[];
  for(const [i,x] of [-6,6].entries()){
    const stall=new THREE.Group();stall.position.set(x,0,5.95);stall.rotation.y=i?-.12:.14;
    add(stall,block(2.1,.78,.88,TR.wood),0,.39,0);
    add(stall,block(2.24,.08,1.02,'#c89459'),0,.82,0);
    for(const sx of [-1,1])add(stall,block(.065,2.35,.065,TR.wood),sx,1.175,-.35);
    const awning=add(stall,block(2.4,.07,1.25,i?TR.turquoise:TR.red),0,2.30,.10);awning.rotation.x=.12;
    for(let j=0;j<6;j++){
      const bowl=add(stall,new THREE.Mesh(new THREE.CylinderGeometry(.19,.14,.16,9),mat('#a97e50')),-.72+j%3*.72,.94,-.22+Math.floor(j/3)*.48);
      add(bowl,new THREE.Mesh(new THREE.ConeGeometry(.17,.20,8),mat(['#ac493c','#d1a657','#708149'][j%3])),0,.16,0);
    }
    const vendor=add(stall,turkeyResident(resident++,true),.1,0,-.86);vendors.push(vendor);g.add(stall);
  }
  for(const [x,z] of [[-4.0,5.7],[3.5,6.5],[1.4,5.8]]){
    const p=add(g,turkeyResident(resident++),x,0,z);p.rotation.y=x>0?.7:-.8;vendors.push(p);
  }
  // Supported strings of mosaic lamps draw the eye into the market alley.
  for(const z of [-.5,3.8]){
    const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(-7.4,3.7,z),new THREE.Vector3(0,3.25,z),new THREE.Vector3(7.4,3.7,z)]);
    add(g,new THREE.Mesh(new THREE.TubeGeometry(curve,30,.018,4,false),mat(TR.wood)),0,0,0);
    for(let i=0;i<9;i++){
      const p=curve.getPoint((i+1)/10);add(g,block(.025,.30,.025,TR.copper),p.x,p.y-.15,z);
      const lamp=add(g,new THREE.Mesh(new THREE.SphereGeometry(.14,9,7),mat(i%2?'#dda757':'#59a1a5',{emissive:'#8b5418',emissiveIntensity:.35})),p.x,p.y-.37,z);lamp.scale.y=1.35;
    }
  }
  const tick=g.userData.tick;
  g.userData.tick=(t,dt)=>{tick?.(t,dt);vendors.forEach((p,i)=>{const torso=p.userData.upper as THREE.Group;torso.rotation.y=Math.sin(t*.65+i)*.14;});};
  return g;
}

export function turkeyMosque():P {
  const g=mosque();
  // Six slender minarets and a cascade of lead domes evoke Sultan Ahmed's skyline.
  for(const x of [-5.2,5.2]){
    add(g,new THREE.Mesh(new THREE.CylinderGeometry(.29,.38,10,12),mat(TR.stone)),x,5,10.1);
    for(const y of [6,8.1])add(g,new THREE.Mesh(new THREE.CylinderGeometry(.47,.40,.22,12),mat(TR.cream)),x,y,10.1);
    add(g,new THREE.Mesh(new THREE.ConeGeometry(.38,1.5,12),mat('#71858c')),x,10.75,10.1);
  }
  add(g,tilePanel(2.5,.75),0,2.7,4.5);
  g.scale.setScalar(.80);
  const result=new THREE.Group() as P;result.add(g);result.userData.ownReaction=true;
  result.userData.poke=()=>bubble(result,'A quiet courtyard above the food streets.',8,1800);
  return result;
}

let paving:THREE.MeshStandardMaterial|undefined;
function limestone() {
  if(paving)return paving;
  const canvas=document.createElement('canvas');canvas.width=canvas.height=256;
  const c=canvas.getContext('2d')!;c.fillStyle='#b8ac97';c.fillRect(0,0,256,256);
  for(let row=0;row<10;row++)for(let col=-1;col<8;col++){
    const x=col*38+(row%3)*13,y=row*26,j=(row*7+col*3+30)%5;
    c.fillStyle=['#d0c3aa','#cbbfa6','#cec0a7','#c8bca3','#d1c4ad'][(row*3+col+10)%5];
    c.beginPath();c.moveTo(x+1,y+1+j*.22);c.lineTo(x+36,y+1);c.lineTo(x+37,y+12);c.lineTo(x+35-j*.3,y+25);c.lineTo(x+2,y+24);c.closePath();c.fill();
  }
  const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(.26,.26);
  paving=mat('#ffffff',{map:tex,roughness:.97});return paving;
}

function square(ctx:LayoutCtx,x:number,z:number,rx:number,rz:number) {
  const outline:[number,number][]=[];
  for(let i=0;i<48;i++){const a=i/48*Math.PI*2;outline.push([x+Math.cos(a)*rx,z+Math.sin(a)*rz]);}
  ctx.group.add(surface(outline,limestone(),.021,'turkish-stone-square'));
}

/** Deliberately composed groups: shared walls and yards, varied roofs, and turns towards lanes. */
export const TOWN_HOUSES: [number,number,number,HouseStyle,number,number?][] = [
  // The Galata-side slope climbs behind the mosque and quay kitchens.
  [-49.5,-34,3,'narrow',.12],[-49.2,-29.9,2,'timber',.04],[-49.7,-25.4,2,'corner',.24],
  [-48.5,-21.2,1,'stone',-.08],[-45.2,-24.2,2,'narrow',.10],[-45.4,-29.1,2,'narrow',-.12],
  [-39.2,-37.4,2,'timber',-.08],[-35.1,-37.6,2,'narrow',.10],
  [-49,-14.3,2,'corner',.20],[-44.8,-13.3,2,'narrow',-.14],
  // Tiny blocks close the gaps beside the bazaar, with a stepped roof silhouette.
  [-30.6,-29,2,'narrow',.02],[-30.6,-24.3,2,'narrow',.14],
  [-26.3,-33.2,2,'narrow',-.07],[-13.8,-34.1,2,'narrow',-.06],
  [-26.9,-13.5,2,'narrow',.09],[-16,-13.0,2,'narrow',-.15],
  // Coffeehouse hill: buildings overlap in the view, with their feet on a solid terrace.
  [1.25,-36.1,3,'narrow',-.12,2.6],[4.65,-36.5,2,'timber',.06,2.6],
  [8.7,-34.3,2,'corner',.30,2.6],[1.4,-30,2,'narrow',-.18],
  [12.8,-24.8,1,'stone',-.13,1.2],
  [-2.1,-12.6,2,'courtyard',-.12],
  // Anatolian courtyard cluster sits above the oven lane.
  [16.3,-27.3,3,'narrow',-.16,1.2],[17.6,-22.4,2,'timber',-.07,1.2],
  [21.2,-26.9,2,'narrow',.13,1.2],
  [28.6,-22.6,1,'courtyard',.16],[35.5,-23.1,2,'timber',-.12],[40,-21.8,1,'stone',.28],
  [41.2,-12.3,2,'corner',-.18],[45.6,-13.5,1,'stone',.16],[51,-12.1,1,'courtyard',-.15],
  // Low Aegean homes gather around planted yards.
  [-49.5,6.3,1,'stone',.21],[-44.7,6.5,2,'timber',-.10],[-40.9,2.7,2,'narrow',.16],
  [-39.8,7.4,1,'stone',-.18],
  // The bath square is enclosed on two sides; workshops share its eastern lane.
  [-21.4,1.9,3,'narrow',.21],[-22.8,5.5,1,'courtyard',-.14],
  [-2.2,2.4,3,'narrow',-.16],[1.3,6.1,1,'stone',.18],
  [13.0,5.9,2,'narrow',-.1],[27.3,6.1,2,'corner',.18],
  [50.8,5.8,1,'courtyard',.25],
];

function floweringCorner(g:THREE.Group,x:number,z:number,h:number,seed:number) {
  const details=new THREE.Group();
  add(details,new THREE.Mesh(new THREE.CylinderGeometry(.30,.22,.48,10),mat('#a86d51')),x,.24,z);
  for(let i=0;i<8;i++){
    const y=.65+i*h/9,dx=Math.sin(i*1.8+seed)*.22;
    add(details,block(.045,.5,.045,'#6e7950'),x+dx*.3,y,z);
    const leaf=add(details,new THREE.Mesh(new THREE.IcosahedronGeometry(.29,1),mat(i%3?'#687b49':'#a94a77')),x+dx,y,z+.06);leaf.scale.set(1.25,.65,.85);
  }
  g.add(masonry(details));
}

export function townStreets(ctx:LayoutCtx) {
  const {group,place}=ctx;
  group.add(surface([[-53,-40],[-42,-40],[-29,-39],[-12,-40],[-12,-33],[-6,-32],[-6,-20],[23,-20],[23,-8],[4,-5],[-6,-2],[-5,10],[-17,11],[-24,8],[-27,2],[-43,3],[-52,0]],limestone(),.018,'ottoman-town-paving'));
  square(ctx,-31,-12,5,4);square(ctx,-10,5,8,5.5);square(ctx,12,7,12,3.5);
  square(ctx,-20,-19.8,10,3.0);
  place(turkeyTeaCorner(),-36.6,-3.9);
  place(turkeyTeaCorner(),-4.2,9.3);
  // A waterfront promenade connects the ferry, tea garden and simit cart.
  group.add(surface([[-54,-45],[-12,-45],[-12,-39.8],[-54,-39.8]],limestone(),.025,'bosphorus-promenade'));
  for(let i=0;i<14;i++){
    const x=-52+i*2.9;
    add(group,block(.18,.48,.22,TR.mortar),x,.24,-45.55);
    if(i<13)add(group,block(2.75,.08,.09,TR.wood),x+1.45,.39,-45.55);
  }
  // Each block leaves the connected lane and tram envelopes clear.
  const colors=[TR.cream,'#d0c3aa','#ddc4b8','#b5c4b7','#dbcba9','#c4b5a0'];
  terrace(ctx,18.1,-25.5,5.4,5.2,1.2,'#b8ad91',.93);
  // The retaining edge turns around the ground-level neighbours instead of burying their rear walls.
  const hill=new THREE.Shape();
  const edge=[[-.8,-38.7],[7,-39.2],[11.5,-37.2],[11.8,-31],[6,-31.2],[3.4,-33.5],[-.8,-33.5]];
  edge.forEach(([x,z],i)=>i?hill.lineTo(x,-z):hill.moveTo(x,-z));hill.closePath();
  const residentialTerrace=new THREE.Mesh(new THREE.ExtrudeGeometry(hill,{depth:2.6,bevelEnabled:false}),mat('#b9ae96'));
  residentialTerrace.rotation.x=-Math.PI/2;residentialTerrace.name='residential-terrace';residentialTerrace.receiveShadow=true;group.add(residentialTerrace);
  TOWN_HOUSES.forEach(([x,z,floors,style,angle,elevation=0],i)=>{
    const h=place(ottomanHouse(colors[i%colors.length],floors,style),x,z,angle);h.name='turkish-lane-house';h.position.y=elevation;
    if(elevation){
      // A masonry footing spans the complete footprint, including projecting corners.
      const b=new THREE.Box3().setFromObject(h),s=b.getSize(new THREE.Vector3()),c=b.getCenter(new THREE.Vector3());
      add(group,block(s.x+.12,elevation,s.z+.12,'#b6a68d'),c.x,elevation/2,c.z);
    }
    if(i%3===0&&!elevation){
      const b=new THREE.Box3().setFromObject(h),s=b.getSize(new THREE.Vector3()),c=b.getCenter(new THREE.Vector3());
      floweringCorner(group,c.x-s.x*.33,b.max.z+.15,Math.min(4,floors*1.8),i);
    }
  });
  for(const [x,z,h,w] of [[18,-20.5,1.2,1.9],[12.8,-22,1.2,1.1],[11.6,-31,2.6,1.1]])add(group,terraceStairs(h,w),x,0,z-.19);
  // Plane trees and planted corners frame activity, instead of filling the walking surface.
  for(const [x,z,s] of [[-29,-35.7,1.3],[-31.5,-2,1.15],[-16,1.5,1.05],[2,-23,1],[32,-2,1.2],[-42,-2.6,1.0]]){
    add(group,block(1.4,.22,1.4,TR.stone),x,.11,z);place(tree('round',s),x,z);
  }
  // Families stop beside the square, sharing the street residents' dress and varied proportions.
  for(const [i,[x,z]] of [[-31,-15.2],[-29.8,-15.2],[-17,-20],[-16,-20],[12,-20.3],[12.6,-20],[-35,-33.8],[-34.3,-33.3],[-24,-33.2],[-23.1,-33.4],[-5.5,-31.7],[-4.6,-31.6],[-12,9.4],[-11,9.6],[-3.1,8.4],[-2.2,8.1],[23,3.3],[22.7,2.6]].entries()){
    const p=turkeyResident(56+i),proportions=p.scale.clone();place(p,x,z);p.scale.copy(proportions);
    p.name='turkish-square-neighbour';
  }
}
