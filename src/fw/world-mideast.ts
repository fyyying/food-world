/** Turkey occupies the connected northern half; the other Middle East areas retain their own room. */
import * as THREE from "three";
import { MIDEAST_OBJECTS, type EnrichedRecipe } from "./graph";
import { mat, add, tree, mountain, birds } from "./props";
import { MIDEAST_PROPS, ME, mosque, galataTower, ferry, petra, persianMosque, arcadeBridge, cedar, datePalm, dune, tulips, local, balloon } from "./props-mideast";
import { TURKEY_PROPS, turkishCat } from "./props-turkey";
import { turkeyHouse } from './turkey-streets';
import { seaSurface, RIVER_COURSE, waterOutline, surface, terrace, tramway } from './turkey-landscape';
import { buildWorld, seaWater, estuaryWater, addFish, type Diorama, type LayoutCtx } from "./worldkit";

type Point = [number,number];
type Lane = { id:string; from:Point; to:Point; walkers:number; walkRange?:[number,number] };
/** Straight segments share their geometry with walkers, so smoothing cannot cut through a wall. */
export const MIDEAST_LANES: Lane[] = [
  {id:'quay',from:[-54,-41],to:[-1,-41],walkers:5,walkRange:[.1,.74]},
  {id:'istanbul-lane',from:[-54,-18],to:[-11,-18],walkers:4},
  {id:'anatolia-market-lane',from:[-6,-18],to:[42,-18],walkers:3},
  {id:'turkey-lane',from:[-54,-6],to:[47,-6],walkers:6},
  {id:'west-lane',from:[-54,-41],to:[-54,-6],walkers:2,walkRange:[.12,.74]},
  {id:'coffee-lane',from:[-10.8,-41],to:[-10.8,-6],walkers:3,walkRange:[.08,.72]},
  {id:'anatolia-lane',from:[24,-36],to:[24,11],walkers:2},
  {id:'aegean-lane',from:[-27,-6],to:[-27,11],walkers:1},
  {id:'levant-lane',from:[-52,41],to:[-7,41],walkers:4},
  {id:'persia-north',from:[19,45],to:[51,45],walkers:3},
  {id:'persia-south',from:[16,56],to:[52,56],walkers:3},
  {id:'oasis-lane',from:[-32,59],to:[1,59],walkers:2},
  {id:'tram-crossing',from:[-11,-18],to:[-6,-18],walkers:0},
  {id:'upper-lane',from:[-1,-41],to:[24,-41],walkers:0},
  {id:'upper-connection',from:[24,-41],to:[24,-36],walkers:0},
  {id:'bath-approach',from:[-10,8],to:[-10,11],walkers:0},
  {id:'workshop-street',from:[-27,11],to:[47,11],walkers:0},
  {id:'east-connection',from:[47,-6],to:[47,11],walkers:0},
  {id:'south-pass',from:[0,11],to:[0,37],walkers:0},
  {id:'levant-approach',from:[0,37],to:[-7,41],walkers:0},
  {id:'persia-approach',from:[0,37],to:[16,37],walkers:0},
  {id:'persia-link',from:[16,37],to:[16,45],walkers:0},
  {id:'persia-square',from:[16,45],to:[19,45],walkers:0},
  {id:'bridge-north',from:[24,45],to:[24,47],walkers:0},
  {id:'bridge-south',from:[24,55],to:[24,56],walkers:0},
  {id:'oasis-west',from:[-52,41],to:[-54,41],walkers:0},
  {id:'oasis-approach',from:[-54,41],to:[-54,59],walkers:0},
  {id:'oasis-link',from:[-54,59],to:[-32,59],walkers:0},
];
export function buildMideast(recipes: EnrichedRecipe[]): Diorama {
  return buildWorld({
    id:"middle-east", W:124, D:132, cz:10, ground:"#caba94",plinth:"#71533c",recipes,objects:MIDEAST_OBJECTS,
    props:{...MIDEAST_PROPS,...TURKEY_PROPS},
    small:/^turkishCat$/,fallbackPlace:"mezze",layout:layoutMideast,
  });
}
function layoutMideast(ctx:LayoutCtx) {
  const {group,tickers,place,tint,TOP}=ctx;
  tint(-26,-26,31,20,'#cbbb9e');
  tint(-40,-3,17,12,'#a8b978');
  tint(14,-20,24,16,'#c6ae81');
  tint(39,-32,18,15,'#8eaa70');
  tint(-32,43,26,16,'#aaba7c');
  tint(-13,64,26,10,'#e4cd95');
  tint(36,49,24,24,'#c5b780');

  const sea=seaWater(),fresh=estuaryWater(60,51,12,'x');
  tickers.push(t=>{sea.uniforms.uTime.value=t;fresh.uniforms.uTime.value=t;});
  group.add(seaSurface(sea));
  group.add(surface(waterOutline(),fresh,.064,'zayandeh'));
  addFish(ctx,RIVER_COURSE,[['#b89760','#e5cb8c']],.9,.3);
  place(arcadeBridge(8),24,51,Math.PI/2).name='river-bridge';
  // Rock springs feed a widened pool; the river continues beyond the eastern board edge.
  for(let i=0;i<7;i++){
    const r=.6+(i%3)*.25;
    const rock=add(group,new THREE.Mesh(new THREE.DodecahedronGeometry(r,0),mat('#a1947d')),-4+Math.cos(i)*1.4,r*.65,52+Math.sin(i)*1.5);
    rock.scale.y=.8;
  }
  const spring=add(group,new THREE.Mesh(new THREE.CylinderGeometry(.16,.25,1.2,10),fresh),-2.8,.6,52);spring.name='spring-water';
  terrace(ctx,38,-34,13,9,4.5,'#719452',.6);
  for(let i=0;i<18;i++){const a=i/18*Math.PI*2,r=.77+(i%3)*.06;if(Math.sin(a)>.82)continue;const pine=place(tree('pine',.85+(i%3)*.2),38+Math.cos(a)*13*r,-34+Math.sin(a)*9*r);pine.position.y=4.5*(1-r)/.4;}
  terrace(ctx,7,-12,5.4,4.7,1,'#b9a277');
  terrace(ctx,31,-12,6,5.2,1.2,'#bca982');
  for(const [x,z,h] of [[7,-12,1],[31,-12,1.2],[38,-34,4.5]]){
    const steps=Math.ceil(h/.25),edge=z+(h>2?5.4:4.0);
    for(let i=0;i<steps;i++) add(group,new THREE.Mesh(new THREE.BoxGeometry(1.25,h*(1-i/steps),.32),mat('#c7b999')),x,h*(1-i/steps)/2,edge+i*.28);
  }
  // A solid island supports the little tower; ferries use the other side of the channel.
  add(group,new THREE.Mesh(new THREE.CylinderGeometry(.75,.85,.6,14),mat(ME.stoneDark)),-27,.3,-46.7);
  add(group,new THREE.Mesh(new THREE.CylinderGeometry(.38,.5,2.2,10),mat(ME.cream)),-27,1.7,-46.7);
  add(group,new THREE.Mesh(new THREE.ConeGeometry(.65,.85,10),mat(ME.lead)),-27,3.15,-46.7);
  for(let i=0;i<2;i++){
    const f=ferry();f.name='bosphorus-ferry';group.add(f);
    tickers.push(t=>{
      const phase=t*.045+i*Math.PI,u=(1-Math.cos(phase))/2;
      f.position.set(-56+u*37,.015,-48.7-i*1.7);
      // Slow down to turn at each end. Both courses stay within the same safe water corridor.
      f.rotation.y=Math.sin(phase)>=0?0:Math.PI;f.rotation.z=Math.sin(t*.7+i)*.008;
    });
  }

  place(mosque(),-38,-28,0,.80).name='istanbul-mosque';
  place(galataTower(),-50,-29,0,.85).name='galata';
  for(const [x,z] of [[-51,-21],[-33,-20],[-14,-13],[-2,-12],[15,-35],[29,-31],[47,-23]]) place(tulips(10),x,z);
  for(const [x,z] of [[-30,-17],[1,-31],[14,-21],[40,-22],[47,-10],[-41,7]]) place(tree('round',.85),x,z);
  for(const [i,[x,z]] of [[-47,-24],[-4,-29],[3,-33],[9,-38],[28,-25],[33,-25],[46,-18],[42,-11],[-49,7],[-43,6]].entries()) {
    const house=place(turkeyHouse(['#d4bc91','#d3d0ae','#bfa17d','#bdc7bc'][i%4],i%3===0?1:2),x,z);house.name='turkish-lane-house';
    if(z===7||x===-43){house.position.y=.8;add(group,new THREE.Mesh(new THREE.BoxGeometry(3.15,.8,2.75),mat('#b1a184')),x,.4,z);}
  }
  // Small wheat plots link the Anatolian ovens with their flour.
  for(const x of [13,21,36]){
    const soil=add(group,new THREE.Mesh(new THREE.PlaneGeometry(6,3.2),mat('#b4a373')),x,.019,0);soil.rotation.x=-Math.PI/2;
    for(let i=0;i<45;i++){const stalk=add(group,new THREE.Mesh(new THREE.CylinderGeometry(.015,.015,.6,4),mat('#c9b56c')),x-2.5+(i%9)*.6,.3,-1.2+Math.floor(i/9)*.6);stalk.name='wheat';}
  }
  tramway(ctx);
  // Mountains sit inland of the tea slopes so the sea remains visible behind the terraces.
  for(const [x,z,h] of [[53,-32,8],[54,-21,6],[47,-27,5]]) place(mountain(3.2,h,true),x,z);
  for(const [x,z] of [[29,-39],[48,-39],[28,-30],[46,-32],[52,-38],[51,-12],[37,-3],[43,2],[8,2],[14,5],[-38,6],[-50,3]])place(tree('pine',1.2),x,z);
  // Fairy chimneys stand on the Anatolian ground, with slow balloons above an open rock valley.
  for(let i=0;i<7;i++){
    const x=13+(i%3)*2.8,z=-33+Math.floor(i/3)*3,h=2.6+(i%3)*.8;
    add(group,new THREE.Mesh(new THREE.ConeGeometry(.8,h,7),mat('#b6a083')),x,h/2,z);
    add(group,new THREE.Mesh(new THREE.ConeGeometry(1.0,.8,7),mat('#837668')),x,h-.15,z);
  }
  for(const [i,colors] of [['#b94b3d','#e7bb62'],['#426d86','#edddba'],['#708957','#dcae58']].entries()){
    const b=balloon(...colors as [string,string]);b.scale.setScalar(.82);b.name='cappadocia-balloon';group.add(b);
    tickers.push(t=>{b.position.set(13+i*4+Math.sin(t*.24+i)*2.8,10+i*1.7+Math.sin(t*.42+i)*.9,-30+Math.cos(t*.20+i)*2);b.userData.tick?.(t,0);});
  }
  for(const [x,z] of [[-48,-16.6],[2,-16.6],[-40,-4.6]]){const cat=place(turkishCat(),x,z);cat.rotation.y=x*.2;}

  // The southern edge changes from an Aegean cove to cultivated foothills and a rocky eastern ridge.
  terrace(ctx,-47,6,6.2,4,.8,'#91a76a');
  place(mountain(5.0,3.2,false),-34,20);
  terrace(ctx,-20,19,9,4.3,.65,'#a7ad6d',.7);
  terrace(ctx,20,22,10,4.2,1.3,'#b8a77b',.65);
  place(mountain(4.2,5.8,false),43,22);place(mountain(3.0,8.1,true),51,25);
  for(const [x,z] of [[-37,17],[-32,16],[-27,18],[-22,20],[-17,18],[15,20],[24,21],[30,19],[40,18]])place(tree('round',.9),x,z);
  // Low walled garden beds and orchard rows fill the working landscape south of the kitchens.
  for(const [x,z] of [[-36,6],[-19,3],[29,4]]){
    add(group,new THREE.Mesh(new THREE.BoxGeometry(5,.12,3),mat('#998466')),x,.06,z);
    for(let row=0;row<3;row++)for(let col=0;col<8;col++){
      const plant=add(group,new THREE.Mesh(new THREE.SphereGeometry(.21,7,5),mat(row%2?'#6c8849':'#7d984c')),x-2.1+col*.6,.28,z-.9+row*.9);plant.scale.y=.65;
    }
    for(const dx of [-2.7,2.7])add(group,new THREE.Mesh(new THREE.BoxGeometry(.20,.36,3.4),mat('#c2b496')),x+dx,.18,z);
  }
  for(const [x,z] of [[-21,7],[-17,7]])place(tree('round',1.1),x,z);
  for(const [x,z] of [[-23,19],[-17,19],[16,23],[22,23]]){
    const h=x<0?.65:1.3;add(group,new THREE.Mesh(new THREE.BoxGeometry(3.15,h,2.75),mat('#b1a184')),x,h/2,z);const house=place(turkeyHouse('#d5bc8f',1),x,z);house.position.y=h;
  }
  // Distinct landscapes and generous unbuilt space remain around the other three areas.
  for(const [x,z] of [[-52,31],[-43,34],[-15,32],[-7,49],[-47,56]]) place(cedar(.9),x,z);
  for(const [x,z] of [[-43,66],[-30,71],[-12,71],[7,65]]) place(dune(7,.5,4),x,z);
  place(petra(),7,67,0,.7);
  for(const [x,z] of [[-38,62],[-9,55.4],[3,61]]) place(datePalm(.85),x,z);
  place(persianMosque(),36,37,0,.8).name='persian-mosque';
  for(const [x,z] of [[23,37],[49,36],[52,42],[18,65],[54,66]]) place(tree('pine',1.0),x,z);

  // Cul-de-sacs finish in furnished courtyards instead of bare, cut-off road strips.
  for(const [x,z] of [[42,-18],[51,45],[16,56],[52,56]]){
    const paving=add(group,new THREE.Mesh(new THREE.CircleGeometry(1.8,24),mat('#c8b998')),x,.045,z);paving.rotation.x=-Math.PI/2;paving.name='lane-courtyard';
    const bz=z+1.4;
    add(group,new THREE.Mesh(new THREE.BoxGeometry(1.5,.10,.55),mat('#87623f')),x,.46,bz);
    add(group,new THREE.Mesh(new THREE.BoxGeometry(1.5,.40,.08),mat('#87623f')),x,.70,bz+.23);
    for(const dx of [-.6,.6])for(const dz of [-.2,.2])add(group,new THREE.Mesh(new THREE.BoxGeometry(.08,.41,.08),mat('#624d36')),x+dx,.205,bz+dz);
  }
  for(const [index,lane] of MIDEAST_LANES.entries()){
    const [ax,az]=lane.from,[bx,bz]=lane.to;
    const length=Math.hypot(bx-ax,bz-az),angle=Math.atan2(bx-ax,bz-az);
    const road=add(group,new THREE.Mesh(new THREE.PlaneGeometry(1.6,length),mat('#d6c5a3',{polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1})),(ax+bx)/2,.032+index*.0001,(az+bz)/2);
    for(const [x,z] of [lane.from,lane.to]){const cap=add(group,new THREE.Mesh(new THREE.CircleGeometry(.8,16),road.material),x,road.position.y,z);cap.rotation.x=-Math.PI/2;}
    road.rotation.set(-Math.PI/2,0,angle);road.name='walking-lane';road.userData.lane=lane;
    for(let i=0;i<lane.walkers;i++){
      const p=local(['#426b81','#a85f4b','#dfc588','#6b835c'][i%4],i%5===3?{hijab:'#8e6488'}:{});
      p.name='lane-walker';p.userData.lane=lane.id;group.add(p);
      tickers.push(t=>{
        const phase=t*.045+i/lane.walkers*Math.PI*2,[start,end]=lane.walkRange??[.04,.96],u=start+(end-start)*(1-Math.cos(phase))/2;
        p.position.set(ax+(bx-ax)*u,.034,az+(bz-az)*u);
        p.rotation.y=angle+(Math.sin(phase)>=0?0:Math.PI);
        p.userData.walk?.(t+i*2);
      });
    }
  }
  place(birds(5,10,7),-34,-46);
  place(birds(3,6,6),-58,15);
}
