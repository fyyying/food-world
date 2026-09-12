import * as THREE from 'three';
import { add, mat, person, type P } from './props';

const box=(w:number,h:number,d:number,c:string)=>new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c));
/** Timber bays and tiled roofs give the small lanes a domestic scale. */
export function turkeyHouse(color:string,storeys=2):P {
  const g=new THREE.Group() as P,h=storeys*1.65;
  add(g,box(3,h,2.6,color),0,h/2,0);
  add(g,box(.60,1.25,.035,'#74583f'),-.65,.625,1.32);
  for(let floor=0;floor<storeys;floor++){
    const y=.90+floor*1.65;
    for(const x of [-.84,.72]){
      add(g,box(.67,.83,.06,'#6e604f'),x,y,1.35);
      add(g,box(.52,.66,.065,'#7aabae'),x,y,1.39);
      add(g,box(.045,.69,.07,'#e8d5b6'),x,y,1.43);
      add(g,box(.54,.04,.07,'#e8d5b6'),x,y,1.43);
    }
    add(g,box(3.04,.08,2.64,'#ad9270'),0,(floor+1)*1.65-.08,0);
  }
  if(storeys===2){
    add(g,box(1.2,1.2,.4,color),.25,2.52,1.42);
    for(const x of [-.08,.52])add(g,box(.4,.65,.035,'#7aabae'),x,2.55,1.64);
    for(const x of [-.2,.7]){const bracket=add(g,box(.1,.65,.1,'#7b5d43'),x,1.82,1.4);bracket.rotation.x=-.4;}
  }
  for(const side of [-1,1]){const roof=add(g,box(3.5,.13,1.75,'#b26747'),0,h+.22,side*.78);roof.rotation.x=side*.32;}
  add(g,box(.35,.7,.35,'#bda488'),.9,h+.4,-.6);
  return g;
}

/** A compact electric tram on its own clear track, separate from walking lanes. */
export function turkeyTram():P {
  const g=new THREE.Group() as P;
  add(g,box(3.4,.38,1.2,'#ab3f36'),0,.57,0);
  add(g,box(3.3,1.25,1.16,'#bb493d'),0,1.15,0);
  for(const x of [-1.1,-.38,.38,1.1])for(const z of [-.59,.59])add(g,box(.57,.60,.035,'#acd0d3'),x,1.30,z);
  for(const x of [-1.67,1.67]){add(g,box(.035,.62,.87,'#acd0d3'),x,1.30,0);add(g,box(.04,.13,.18,'#f5db99'),x,.85,0);}
  add(g,box(3.65,.14,1.37,'#eee0bc'),0,1.86,0);
  for(const x of [-1.03,1.03])for(const z of [-.47,.47])add(g,new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.12,12),mat('#464039')),x,.24,z).rotation.x=Math.PI/2;
  // A connected pantograph reaches the wire instead of a floating electrical fitting.
  for(const side of [-1,1]){const arm=add(g,box(.055,.65,.055,'#50483c'),side*.14,2.17,0);arm.rotation.z=side*.45;}
  add(g,box(.75,.05,.08,'#50483c'),0,2.48,0);
  const driver=add(g,person('#4a6c7a'),1.25,.48,0);driver.scale.setScalar(.72);driver.rotation.y=Math.PI/2;
  return g;
}
