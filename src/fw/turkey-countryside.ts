/** The compact town opens into distinct cultivated and uncultivated Turkish landscapes. */
import * as THREE from 'three';
import {add, mat, tree} from './props';
import {oliveTree, cypress} from './props-italy';
import {block, TR} from './turkey-architecture';
import {terrace} from './turkey-landscape';
import type {LayoutCtx} from './worldkit';

function rock(g:THREE.Group,x:number,z:number,r:number,color='#b5a68d',ground=0){
  const m=add(g,new THREE.Mesh(new THREE.DodecahedronGeometry(r,0),mat(color)),x,ground+r*.42,z);
  m.scale.set(1.35,.58,.9);m.rotation.y=x*.7;m.name='countryside-rock';return m;
}

export function turkeyCountryside(ctx:LayoutCtx){
  const {group,place,tint}=ctx;
  tint(-37,11,7,4.6,'#a8b97b');
  tint(45,-12,10,5.7,'#b6b985');
  // Aegean olive land: low rounded ground, silver crowns and rough limestone, beside the coastal grove.
  terrace(ctx,-46,7,6.5,3.3,.55,'#9dba77',.75);
  for(const [i,[x,z]] of [[-49,6.6],[-46.1,7.9],[-43.1,6.7]].entries()){
    const tr=place(oliveTree(1.1+i*.09),x,z);tr.position.y=.55;tr.name='aegean-terrace-olive';
  }
  for(const [x,z,r] of [[-51,7,.48],[-50,8.7,.32],[-41.4,8,.48],[-43,9.7,.34]])rock(group,x,z,r);
  // A planted village garden occupies a former house footprint, with paths between full, leafy beds.
  // The bed fits between the coppersmith (x 5.3..10.7) and the potter (x 15.3..20.7); a wider bed shared the shops' floor height and z-fought.
  const garden=new THREE.Group();garden.name='turkish-kitchen-garden';garden.position.set(13,0,6);
  add(garden,block(4,.10,4.3,'#aa9675'),0,.05,0);
  for(const z of [-2.25,2.25])add(garden,block(4.4,.28,.22,TR.stone),0,.14,z);
  for(const x of [-2.1,2.1])add(garden,block(.22,.28,4.3,TR.stone),x,.14,0);
  for(let row=0;row<3;row++)for(let col=0;col<5;col++){
    const x=-1.6+col*.8,z=-1.45+row*1.4;
    const greens=add(garden,new THREE.Mesh(new THREE.SphereGeometry(.27,7,5),mat(row===1?'#527c46':'#729753')),x,.31,z);
    greens.scale.set(1,.75,1);
    if(row!==1)add(garden,new THREE.Mesh(new THREE.SphereGeometry(.10,6,4),mat(row?'#d7b344':'#bb5639')),x+.16,.42,z+.15);
  }
  group.add(garden);
  // The inland edge has dry grass, exposed rock and scattered crowns, rather than another housing row.
  terrace(ctx,45,-12,8,3.8,.65,'#b2b885',.72);
  for(const [i,[x,z]] of [[40.8,-12.5],[44,-11.5],[47.8,-12.2]].entries()){
    const tr=place(i===1?cypress(.78):oliveTree(1.05),x,z);tr.position.y=.65;tr.name='inland-grove-tree';
  }
  for(const [x,z,r] of [[50.6,-12,.9],[49.7,-10.8,.6],[42.5,-13.8,.45],[46,-14,.36]])rock(group,x,z,r,'#c1b091',.65);
  tint(38,-22.5,6.3,2.5,'#aab677');
  for(const [i,[x,z]] of [[34.1,-22.5],[37,-22.3],[40.3,-22.1],[43,-22.6]].entries()){
    const tr=place(tree('round',.95+i%2*.25),x,z);tr.name='dry-orchard-tree';
    for(let j=0;j<5;j++)add(tr,new THREE.Mesh(new THREE.SphereGeometry(.08,6,4),mat('#d6a758')),Math.sin(j*2.4)*.55,1.3+(j%2)*.25,Math.cos(j*2.4)*.55);
  }
  // Rainy Black Sea slopes carry broadleaf woodland as well as the existing conifers.
  for(const [i,[x,z]] of [[33,-40],[37,-40.6],[43,-39],[46,-36],[28,-34],[29,-30]].entries()){
    const r=Math.hypot((x-38)/13,(z+34)/9),height=r<=.6?4.5:4.5*(1-r)/.4;
    const tr=place(tree('round',1.1+i%3*.15),x,z);tr.position.y=height;tr.name='black-sea-woodland';
  }
  // Taller, uneven eroded rock gives the balloon valley a geological silhouette behind the roofs.
  for(const [i,[x,z,h,r]] of [[14.5,-37.5,7.5,1.15],[18.3,-38.1,5.3,1.2],[21.1,-36.8,6.8,.88],[19.4,-33,4.5,.9],[14.9,-32.2,5.1,.8]].entries()){
    const spire=new THREE.Mesh(new THREE.CylinderGeometry(r*.24,r,h,7),mat(i%2?'#c3ac89':'#b89f7f'));
    spire.position.set(x,h/2,z);spire.rotation.y=i*.73;spire.name='cappadocia-rock-spire';group.add(spire);
    const cap=add(group,new THREE.Mesh(new THREE.DodecahedronGeometry(r*.66,0),mat('#8f7c64')),x,h-.02,z);cap.scale.y=.56;
  }
  // The already-supported southern terraces become vines and grain instead of four more houses.
  for(const z of [18,20]){
    for(const x of [-25,-22.5,-20,-17.5,-15]){
      add(group,block(.09,1.05,.09,TR.wood),x,1.175,z);
      const vine=add(group,new THREE.Mesh(new THREE.SphereGeometry(.68,8,5),mat('#638249')),x,1.64,z);vine.scale.set(1.8,.5,.70);vine.name='terrace-vine';
      for(let i=0;i<3;i++)add(group,new THREE.Mesh(new THREE.SphereGeometry(.10,6,4),mat('#695679')),x+(i-1)*.32,1.42,z+.36);
    }
    add(group,block(12,.07,.07,TR.wood),-20,1.50,z);
  }
  // A sandy threshing floor and straw bundles connect the wheat plots with the village ovens.
  const floor=new THREE.Mesh(new THREE.CircleGeometry(2.4,28),mat('#d4bc7b'));floor.rotation.x=-Math.PI/2;floor.position.set(20,1.315,22);floor.name='anatolian-threshing-floor';group.add(floor);
  for(const [i,[x,z]] of [[17,21],[17.5,23],[22.7,22.8]].entries()){
    const sheaf=add(group,new THREE.Mesh(new THREE.CylinderGeometry(.22,.42,.9,10),mat(i%2?'#c8a45c':'#ddbd70')),x,1.75,z);sheaf.name='grain-sheaf';
    add(group,new THREE.Mesh(new THREE.TorusGeometry(.24,.035,5,12),mat('#997346')),x,1.80,z).rotation.x=Math.PI/2;
  }
  // Flowering ground and tall, narrow cypresses soften the transition to the southern pass.
  for(const [x,z] of [[-38,12],[-33,14],[-29,16],[32,17],[37,15],[52,4]]){
    place(cypress(.65),x,z);
    for(let i=0;i<5;i++){
      const tuft=add(group,new THREE.Mesh(new THREE.SphereGeometry(.18,6,4),mat(i%2?'#8c81a5':'#829066')),x+Math.sin(i*2.4)*.8,.14,z+Math.cos(i*2.4)*.7);tuft.scale.y=.65;
    }
  }
  // One irregular patch of herb-rich ground replaces the far eastern courtyard house.
  tint(51,5,4.7,4,'#a8b777');
  for(const [x,z,r] of [[51,5,.5],[53,6,.3],[49,7,.25]])rock(group,x,z,r);
}
