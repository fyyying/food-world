/** Ottoman / Anatolian inspired street residents, with footsteps driven by distance travelled. */
import * as THREE from 'three';
import { person, wear, add, box, cyl, ball, mat, C, type P } from './props';

type Dress = 'waistcoat'|'coat'|'entari'|'shawl';
type Headwear = 'wrap'|'cap'|'scarf'|'fez'|'hair';
type Resident = {
  dress:Dress; head:Headwear; outer:string; shirt:string; trousers:string; sash:string;
  height:number; build:number; pace:number; stride:number; elderly?:boolean; beard?:boolean;
  carry?:'basket'|'jug'|'bundle';
};
const RESIDENTS:Resident[] = [
  {dress:'waistcoat',head:'wrap',outer:'#654d48',shirt:'#ddd1b4',trousers:'#536076',sash:'#a85b42',height:1.03,build:1.02,pace:.64,stride:.67,beard:true},
  {dress:'entari',head:'scarf',outer:'#8f4655',shirt:'#e8d8b9',trousers:'#616f65',sash:'#c39c5d',height:.96,build:.93,pace:.52,stride:.57,carry:'basket'},
  {dress:'coat',head:'fez',outer:'#466779',shirt:'#d8c4a1',trousers:'#49433e',sash:'#b99158',height:1.06,build:.94,pace:.72,stride:.73,beard:true},
  {dress:'shawl',head:'scarf',outer:'#737b57',shirt:'#b88970',trousers:'#63527a',sash:'#d4b477',height:.90,build:1.10,pace:.37,stride:.45,elderly:true},
  {dress:'waistcoat',head:'cap',outer:'#a36c42',shirt:'#dbbe8c',trousers:'#5b6b70',sash:'#804744',height:.72,build:.76,pace:.77,stride:.47},
  {dress:'entari',head:'hair',outer:'#528185',shirt:'#e7d5b1',trousers:'#984f52',sash:'#cbac66',height:1.04,build:.89,pace:.60,stride:.65,carry:'jug'},
  {dress:'coat',head:'wrap',outer:'#8c7859',shirt:'#dfd0ad',trousers:'#635345',sash:'#59717e',height:.98,build:1.13,pace:.43,stride:.50,elderly:true,beard:true,carry:'bundle'},
  {dress:'waistcoat',head:'hair',outer:'#5f7160',shirt:'#e0c5a1',trousers:'#8b6556',sash:'#b07147',height:.84,build:.88,pace:.68,stride:.55},
];

type Leg = {thigh:THREE.Group;shin:THREE.Group};
type Rig = {upper:THREE.Group;hipY:number;figureScale:number;legs:{left:Leg;right:Leg};arms:{left:THREE.Group;right:THREE.Group;hand:number}};

export function turkeyResident(index:number,working=false):P {
  const style=RESIDENTS[working?[0,1,2,3,5,6][index%6]:index%RESIDENTS.length];
  const p=person(style.shirt),rig=p.userData as unknown as Rig,s=rig.figureScale;
  const hair=style.elderly?'#aca99a':index%3?'#423126':'#2b2420';
  const skin=['#d6a37c','#e4b994','#c3916d','#eac5a1'][Math.floor(index/2)%4];
  p.traverse(o=>{if(o instanceof THREE.Mesh){const m=o.material as THREE.MeshStandardMaterial;if(m.color.getHexString()===C.skin.slice(1))m.color.set(skin);}});
  const hairCap=rig.upper.children.find(o=>o instanceof THREE.Mesh&&o.geometry instanceof THREE.SphereGeometry&&o.position.z<0);
  if(hairCap instanceof THREE.Mesh)(hairCap.material as THREE.MeshStandardMaterial).color.set(hair);
  // The wider cloth belongs to the articulated legs, so loose trousers still bend at the knees.
  for(const leg of [rig.legs.left,rig.legs.right]){
    leg.thigh.traverse(o=>{
      if(!(o instanceof THREE.Mesh)||o.geometry instanceof THREE.BoxGeometry)return;
      (o.material as THREE.MeshStandardMaterial).color.set(style.trousers);
      if(o.parent===leg.thigh)o.scale.set(1.55,1,1.35);
    });
  }
  const garment=(o:THREE.Object3D,x:number,y:number,z:number)=>wear(p,o,x*s,y*s,z*s);
  garment(cyl(.181*s,.148*s,.33*s,style.outer,10),0,.64,0);
  garment(box(.105*s,.29*s,.025*s,style.shirt),0,.65,.174);
  for(const x of [-.074,.074])garment(box(.014*s,.31*s,.018*s,style.sash),x,.65,.184);
  garment(cyl(.16*s,.16*s,.08*s,style.sash,10),0,.455,0);
  if(style.dress!=='waistcoat'){
    // An open front leaves the şalvar visible. The hem clears the shoes throughout the gait.
    const length=style.dress==='coat'?.28:.37;
    garment(new THREE.Mesh(new THREE.CylinderGeometry(.153*s,.219*s,length*s,12,1,true,.36,Math.PI*2-.72),mat(style.outer,{side:THREE.DoubleSide})),0,.455-length/2,0);
    for(const x of [-.12,.12])garment(box(.014*s,length*s,.018*s,style.sash),x,.455-length/2,.14);
  }
  if(style.dress==='shawl')garment(box(.40*s,.21*s,.11*s,style.outer),0,.78,-.09);
  if(working)garment(box(.23*s,.37*s,.04*s,'#dfd4bb'),0,.57,.18);
  if(style.beard)garment(ball(.10*s,hair,8),0,.974,.097).scale.set(1,.72,.65);
  if(style.head==='wrap'){
    garment(cyl(.147*s,.16*s,.13*s,'#dfd3b9',10),0,1.17,-.01);
    for(let i=0;i<3;i++)garment(new THREE.Mesh(new THREE.TorusGeometry(.142*s,.034*s,6,12),mat(i%2?'#b9a88e':'#ece1c9')),0,1.145+i*.036,-.01).rotation.x=Math.PI/2;
  }else if(style.head==='scarf'){
    garment(ball(.17*s,style.sash,10),0,1.105,-.075).scale.set(1.05,1.12,.70);
    for(const x of [-.146,.146])garment(box(.06*s,.27*s,.20*s,style.sash),x,1.025,-.045);
    garment(box(.27*s,.24*s,.07*s,style.sash),0,.925,-.145);
  }else if(style.head==='fez'){
    garment(cyl(.105*s,.132*s,.17*s,'#963f39',10),0,1.205,-.01);
    garment(box(.014*s,.14*s,.014*s,'#43372d'),.08,1.22,-.10);
  }else if(style.head==='cap')garment(cyl(.142*s,.15*s,.09*s,'#806b51',10),0,1.17,-.018);

  const carry=working?undefined:style.carry;
  const leftHome=carry==='basket'||carry==='bundle'?-.85:0,rightHome=carry==='jug'?-.95:0;
  if(style.carry&&!working){
    const hand=style.carry==='jug'?rig.arms.right:rig.arms.left;
    const load=add(hand,new THREE.Group(),0,rig.arms.hand,0);load.scale.setScalar(s);
    load.rotation.x=style.carry==='jug'?-rightHome:-leftHome;
    if(style.carry==='basket'){
      add(load,cyl(.15,.12,.20,'#ab8151',10),0,-.21,0);
      add(load,new THREE.Mesh(new THREE.TorusGeometry(.145,.018,5,12,Math.PI),mat('#745636')),0,-.11,0);
      for(const [i,x] of [-.08,0,.08].entries())add(load,ball(.046,['#9e5541','#73834f','#cdad64'][i],7),x,-.09,.015);
    }else if(style.carry==='jug'){
      add(load,ball(.115,'#b78258',10),0,-.14,0).scale.y=1.2;
      add(load,cyl(.044,.055,.10,'#a06e48',9),0,-.025,0);
      add(load,new THREE.Mesh(new THREE.TorusGeometry(.07,.018,5,10),mat('#9a6946')),.10,-.10,0);
    }else{add(load,ball(.16,'#b69877',8),0,-.10,0).scale.set(1,.8,1.2);add(load,box(.025,.20,.27,'#6e563f'),0,-.09,0);}
  }
  p.scale.set(style.build,style.height,1);
  p.userData.turkishResident=true;p.userData.dress=style.dress;p.userData.pace=style.pace;
  p.userData.stride=style.stride;p.userData.isWalking=false;
  const homes=p.children.map(o=>({o,y:o.position.y}));
  let last:THREE.Vector3|undefined,lastTime:number|undefined,phase=index*.73;
  const pose=(t:number,dt:number)=>{
    const moved=last&&lastTime!==undefined&&t>lastTime&&dt>0?p.position.distanceTo(last):0;
    last??=new THREE.Vector3();last.copy(p.position);lastTime=t;
    const speed=dt>0?moved/dt:0,walking=speed>.025;
    if(walking)phase+=moved/(style.stride*s*style.height)*Math.PI*2;
    const strength=walking?Math.min(1,speed/.35):0,sw=Math.sin(phase)*(style.elderly?.23:style.height<.85?.45:.36)*strength;
    const {left,right}=rig.legs;
    left.thigh.rotation.x=sw;right.thigh.rotation.x=-sw;
    left.shin.rotation.x=Math.max(0,-sw)*1.05;right.shin.rotation.x=Math.max(0,sw)*1.05;
    rig.arms.left.rotation.x=leftHome-sw*(carry&&carry!=='jug'?0:.62);
    rig.arms.right.rotation.x=rightHome+sw*(carry==='jug'?0:.62);
    // Lower the whole figure enough to keep the supporting shoe on the paving.
    const bottom=(leg:Leg)=>{const a=leg.thigh.rotation.x,b=a+leg.shin.rotation.x;return rig.hipY-.22*s*Math.cos(a)-.20*s*Math.cos(b)-.035*s*Math.sin(b)-.025*s*Math.abs(Math.cos(b))-.085*s*Math.abs(Math.sin(b));};
    const groundOffset=-Math.min(bottom(left),bottom(right));
    homes.forEach(({o,y})=>{o.position.y=y+groundOffset;});
    rig.upper.rotation.x=style.elderly?.075:0;
    rig.upper.rotation.z=walking?Math.sin(phase)*.018:Math.sin(t*.7+index)*.008;
    rig.upper.rotation.y=walking?Math.sin(phase)*.022:Math.sin(t*.36+index)*.09;
    p.userData.isWalking=walking;p.userData.walkDistance=(p.userData.walkDistance??0)+moved;
  };
  pose(0,0);
  p.userData.walk=undefined; // Turkey uses the movement observer instead of the shared time-based gait.
  if(!working)p.userData.tick=pose;
  return p;
}

/** Constant walking pace, then a real stop and a gradual turn within the already-cleared route. */
export function turkeyWalk(p:P,from:[number,number],to:[number,number],range:[number,number],seed:number) {
  const [lo,hi]=range,dx=to[0]-from[0],dz=to[1]-from[1],angle=Math.atan2(dx,dz);
  const duration=Math.hypot(dx,dz)*(hi-lo)/p.userData.pace,pause=1.7+seed%4*.55,half=duration+pause,period=half*2;
  return (t:number,dt:number)=>{
    const clock=(t+(seed*.381966%1)*period)%period,returning=clock>=half,q=clock%half;
    const walking=q<duration,progress=Math.min(1,q/duration),u=lo+(hi-lo)*(returning?1-progress:progress);
    let facing=angle+(returning?Math.PI:0);
    if(!walking){const turn=THREE.MathUtils.clamp((q-duration-.35)/Math.max(.6,pause-.7),0,1);facing+=Math.PI*turn*turn*(3-2*turn);}
    p.position.set(from[0]+dx*u,.034,from[1]+dz*u);p.rotation.y=facing;
    p.userData.tick?.(t,dt);
  };
}
