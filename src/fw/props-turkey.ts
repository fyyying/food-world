/** Turkish streets and kitchens: supported furniture, open workspaces and quiet daily activity. */
import * as THREE from 'three';
import { add, mat, person, tree, bubble, ambientChat, type P } from './props';
import { oliveTree } from './props-italy';
import { local, ME } from './props-mideast';

const group = () => new THREE.Group() as P;
const box = (w: number, h: number, d: number, c: string) => new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat(c));
const cyl = (r: number, h: number, c: string) => new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,12), mat(c));
const ball = (r: number, c: string) => new THREE.Mesh(new THREE.SphereGeometry(r,10,6), mat(c));
type Figure = ReturnType<typeof person>;
function upper(p: Figure) { return p.userData.upper as THREE.Group; }
function bowl(g: THREE.Object3D, x: number, y: number, z: number, color: string, r = .20) {
  const dish=add(g,group(),x,y,z);dish.userData.foodReaction=true;
  add(dish,cyl(r,.055,'#fff2d7'),0,.0275,0);
  add(dish,cyl(r*.86,.032,color),0,.071,0);
}
function glass(g: THREE.Object3D,x: number,y: number,z: number) {
  add(g,cyl(.09,.025,'#f8e8ce'),x,y+.0125,z);
  add(g,new THREE.Mesh(new THREE.LatheGeometry([new THREE.Vector2(.045,0),new THREE.Vector2(.038,.07),new THREE.Vector2(.06,.17)],12),mat('#aa481e')),x,y+.025,z);
}
function table(g: THREE.Object3D,x: number,z: number,w = 2.4,d = 1.0) {
  const height = .75;
  add(g,box(w,.08,d,'#9a6038'),x,height-.04,z);
  for (const dx of [-w/2+.12,w/2-.12]) for (const dz of [-d/2+.1,d/2-.1]) add(g,box(.10,.67,.10,'#68442f'),x+dx,.335,z+dz);
  return height;
}
/** The pelvis rests on the stool; the stool ends behind the hanging calves. */
function sit(g: THREE.Object3D,x: number,z: number,angle: number,shirt: string): Figure {
  const p = local(shirt); p.userData.sit?.();
  const seatTop = .43;
  const seat = add(g,cyl(.22,seatTop,ME.wood),x-Math.sin(angle)*.12,seatTop/2,z-Math.cos(angle)*.12);
  seat.name = 'turkey-seat';
  const pelvis = p.children.find(c => c instanceof THREE.Mesh) as THREE.Mesh;
  pelvis.geometry.computeBoundingBox();
  const pelvisBottom = pelvis.position.y + pelvis.geometry.boundingBox!.min.y;
  add(g,p,x,seatTop-pelvisBottom,z).rotation.y = angle;
  p.name='turkey-sitter'; p.userData.seat=seat;
  return p;
}
function roomShell(g: P, color = '#e5ceab', w = 5.4) {
  // An open-front shop: back and side walls, no invisible front wall through the cook.
  add(g,box(w,.10,3.3,'#cbbb9b'),0,.05,-.7);
  add(g,box(w,2.6,.16,color),0,1.35,-2.3);
  for(const x of [-w/2+.08,w/2-.08]) add(g,box(.16,2.6,3.1,color),x,1.35,-.8);
  for(const x of [-w/2+.08,w/2-.08]) add(g,box(.20,.26,3.3,ME.wood),x,2.77,-.8);
  add(g,box(w,.34,.18,ME.wood),0,2.81,-2.3);
  for(const x of [-w/2+.16,w/2-.16]) add(g,box(.18,2.9,.18,ME.wood),x,1.45,1.9);
  for (const side of [-1,1]) {
    const roof=add(g,box(w+.4,.13,1.75,'#b3613d'),0,3.15,-1.0+side*.78);
    roof.rotation.x=side*.30;
    for(let i=0;i<12;i++) add(roof,box(.065,.04,1.74,'#cb7a50'),-w/2+i*w/11,.085,0);
  }
  // A narrow awning shades the edge; the food counter stays visible from the world camera.
  add(g,box(w+.2,.10,.65,'#ba5546'),0,2.87,1.62);
  for(const x of [-w/2+.16,w/2-.16])add(g,box(.12,.12,1.8,ME.wood),x,2.86,.75);
  add(g,box(w-.3,.26,.09,'#386d76'),0,2.72,1.9);
}
function life(g: P, people: Figure[], phrase: string, work?: (t:number,k:number)=>void) {
  g.userData.ownReaction=true;
  let reaction = 0;
  const food: {object:THREE.Object3D;y:number;rotation:THREE.Euler;scale:THREE.Vector3}[]=[];
  g.traverse(object=>{if(object.userData.foodReaction) food.push({object,y:object.position.y,rotation:object.rotation.clone(),scale:object.scale.clone()});});
  const chat = ambientChat(people[0] ?? g,[phrase]);
  g.userData.poke=()=>{reaction=1; bubble(people[0] ?? g,phrase,1.45,1800);};
  g.userData.tick=(t,dt)=>{
    reaction=Math.max(0,reaction-dt*.6);
    people.forEach((p,i)=>{upper(p).rotation.y=Math.sin(t*.45+i)*.09;upper(p).rotation.z=Math.sin(t*.7+i)*.025;});
    work?.(t,reaction);
    food.forEach(({object,y,rotation,scale},i)=>{
      const lift=Math.sin(Math.PI*reaction);
      object.position.y=y+lift*.34;object.rotation.y=rotation.y+(reaction?Math.PI*2*(1-reaction):0);
      object.scale.copy(scale).multiplyScalar(1+lift*.12);
    });
    if(reaction)people.forEach(p=>{const arms=p.userData.arms as {right:THREE.Group};arms.right.rotation.z=-Math.sin(reaction*Math.PI)*.45;});
    chat(dt);
  };
  return g;
}

export function turkishCat(): P {
  const g=group();
  add(g,ball(.24,'#c59164'),0,.22,0).scale.set(1.5,.75,.75);
  add(g,ball(.16,'#c59164'),.30,.31,0);
  for(const z of [-.085,.085]) add(g,new THREE.Mesh(new THREE.ConeGeometry(.065,.13,4),mat('#c59164')),.30,.46,z);
  for(const x of [-.21,.20]) for(const z of [-.11,.11]) add(g,box(.07,.17,.07,'#c59164'),x,.085,z);
  const tail=add(g,new THREE.Mesh(new THREE.TorusGeometry(.21,.035,6,12,Math.PI),mat('#c59164')),-.35,.28,0);tail.rotation.y=Math.PI/2;
  g.userData.tick=t=>{tail.rotation.z=Math.sin(t*.8)*.12;};
  g.userData.ownReaction=true;
  g.userData.poke=()=>bubble(g,'Mrr…',.8,1400);
  return g;
}

export function turkeyTeaGarden(): P {
  const g=group(), people:Figure[]=[];
  add(g,tree('round',1.35),-3.0,0,-1.1);
  for(const [x,z] of [[-1.5,0],[1.5,1.2]]) {
    const y=table(g,x,z,1.45,.85);glass(g,x-.25,y,z);glass(g,x+.30,y,z);
    const board=add(g,box(.45,.025,.32,'#a66f40'),x,y+.013,z-.08);
    for(let i=0;i<6;i++) add(board,cyl(.025,.018,i%2?'#fff0d1':'#433026'),-.16+i*.065,.022,(i%2-.5)*.12);
    people.push(sit(g,x,z+.94,Math.PI,'#426d85'),sit(g,x,z-.94,0,'#a34c43'));
  }
  const waiter=add(g,local('#e5daca',{apron:true}),3.0,0,-.8);people.push(waiter);
  const y=table(g,3,-2,1,.7);add(g,cyl(.18,.38,ME.copper),3,y+.19,-2);glass(g,3.3,y,-2);
  g.userData.steam=new THREE.Vector3(3,1.2,-2);
  return life(g,people,'Bir çay daha? Another tea?');
}

export function turkeySimitCart(): P {
  const g=group();
  for(const x of [-.62,.62]) for(const z of [-.4,.4]) add(g,cyl(.20,.10,'#353035'),x,.2,z).rotation.z=Math.PI/2;
  add(g,box(1.5,.65,1.0,'#b84136'),0,.65,0);
  add(g,box(1.65,.07,1.1,'#e8c280'),0,1.01,0);
  for(const x of [-.69,.69]) for(const z of [-.44,.44]) add(g,box(.045,1.0,.045,ME.wood),x,1.5,z);
  add(g,box(1.9,.13,1.4,'#b84136'),0,2.06,0);
  for(let i=0;i<12;i++) add(g,new THREE.Mesh(new THREE.TorusGeometry(.12,.04,7,14),mat('#cb8d3d')),-.5+(i%4)*.33,1.08+Math.floor(i/4)*.075,(i%2-.5)*.35).rotation.x=Math.PI/2;
  g.children.filter(o=>o instanceof THREE.Mesh && o.geometry instanceof THREE.TorusGeometry).forEach(o=>o.userData.foodReaction=true);
  const seller=add(g,local('#46718a',{apron:true}),0,0,-1.1);
  return life(g,[seller],'Sıcak simit! Warm sesame bread!');
}

function foodHouse(kind: 'kebab'|'fish'|'pide'|'baklava'|'coffee'|'yufka'|'dolma'): P {
  const g=group(); roomShell(g,kind==='fish'?'#b6cbd0':kind==='coffee'?'#c6ad91':'#e5ceab');
  const cook=add(g,local('#ece3cf',{apron:true}),-.9,.10,-.15);
  const y=table(g,0,1.0,3.8,1.0), moving:THREE.Object3D[]=[];
  const foodColours=['#bd6c38','#577747','#bd4932','#e7c37a'];
  if(kind==='kebab'||kind==='fish') {
    add(g,box(2.6,.2,.8,'#45413b'),0,y+.10,1);
    for(let i=0;i<10;i++) add(g,ball(.075,i%2?'#b5582b':'#723c27'),-1.1+i*.24,y+.24,1+(i%2-.5)*.25);
    for(let i=0;i<5;i++) {
      const sk=add(g,group(),-1+i*.50,y+.30,1);moving.push(sk);sk.userData.foodReaction=true;
      if(kind==='fish') add(sk,ball(.20,'#a9bac0'),0,0,0).scale.set(.65,.35,1.8);
      else {add(sk,box(.035,.035,1.05,'#d0c7ae'),0,0,0);for(let j=0;j<4;j++) add(sk,box(.17,.13,.17,foodColours[j%3]),0,.06,-.3+j*.20);}
    }
    g.userData.smoke=new THREE.Vector3(0,1.2,1);
  } else if(kind==='pide'||kind==='yufka') {
    add(g,box(1.5,.55,1.3,'#8e694e'),1.45,.38,-1.35);
    add(g,new THREE.Mesh(new THREE.SphereGeometry(.75,14,7,0,Math.PI*2,0,Math.PI/2),mat('#b69062')),1.45,.65,-1.35);
    add(g,box(.75,.45,.05,'#352b26'),1.45,.56,-.68);add(g,box(.5,.09,.07,'#c76628'),1.45,.38,-.64);
    for(let i=0;i<4;i++){const dough=add(g,ball(.34,'#e5bb74'),-1.2+i*.78,y+.04,1);dough.scale.set(kind==='pide'?.7:1.0,.12,1);dough.userData.foodReaction=true;}
    const pin=add(g,cyl(.045,.80,ME.wood),-.8,y+.13,.85);pin.rotation.z=Math.PI/2;moving.push(pin);
  } else if(kind==='baklava') {
    for(let i=0;i<3;i++){add(g,box(.95,.04,.8,'#bdac8d'),-1.15+i*1.15,y+.02,1);for(let j=0;j<9;j++){add(g,box(.22,.12,.20,'#d8ab50'),-1.43+i*1.15+(j%3)*.27,y+.10,.73+Math.floor(j/3)*.27);add(g,ball(.035,'#6e8745'),-1.43+i*1.15+(j%3)*.27,y+.17,.73+Math.floor(j/3)*.27);}}
  } else if(kind==='coffee') {
    for(let i=0;i<3;i++){const x=-.8+i*.8;add(g,cyl(.12,.23,ME.copper),x,y+.115,1);add(g,box(.32,.025,.035,ME.copper),x+.21,y+.22,1);bowl(g,x,y,1.3,'#54382a',.08);}
    g.userData.steam=new THREE.Vector3(0,1.1,1);
  } else {
    for(let i=0;i<7;i++){add(g,ball(.15,foodColours[i%3]),-1.1+(i%4)*.7,y+.15,.78+Math.floor(i/4)*.4);}
    add(g,cyl(.34,.27,ME.copper),1.8,y+.135,1.3);g.userData.steam=new THREE.Vector3(1.8,1.2,1.3);
  }
  if(kind==='baklava'||kind==='dolma'){
    const morsels=g.children.filter(o=>o.position.y>y+.035&&o.position.y<y+.3);
    const food=add(g,group(),0,y,1);g.updateMatrixWorld(true);morsels.forEach(o=>food.attach(o));food.userData.foodReaction=true;
  }
  const customer=add(g,local('#5d7884'),-1.8,0,2.4);customer.rotation.y=Math.PI;
  const phrases={kebab:'Afiyet olsun! Enjoy your meal!',fish:'Balık ekmek! Fish in fresh bread!',pide:'Fırından yeni çıktı! Fresh from the oven!',baklava:'Fıstıklı baklava! Pistachio baklava!',coffee:'Kahve hazır. Coffee is ready.',yufka:'Hamur dinlensin. Let the dough rest.',dolma:'Birlikte yapalım. Let’s make them together.'};
  return life(g,[cook,customer],phrases[kind],(t,k)=>{
    const arms=cook.userData.arms as {left:THREE.Group;right:THREE.Group};
    arms.right.rotation.x=-.75+Math.sin(t*1.2)*.12;arms.left.rotation.x=-.5;
    if(kind==='kebab'||kind==='fish') moving.forEach((sk,i)=>sk.rotation.z=Math.sin(t*.55+i)*(.12+k*.25));
    else moving.forEach(pin=>pin.position.z=.85+Math.sin(t*1.1)*.12);
  });
}

function familyTable(kind: 'breakfast'|'meze'|'supper'): P {
  const g=group();roomShell(g,kind==='meze'?'#b8c7ba':'#dfc4a0',6.2);
  const y=table(g,0,1.6,4.3,1.45);
  for(let i=0;i<10;i++) bowl(g,-1.7+(i%5)*.85,y,1.26+Math.floor(i/5)*.7,['#577749','#e9cf8b','#bc5934','#eee1be','#594834'][i%5],.22);
  for(const x of [-1.7,0,1.7]) glass(g,x,y,2.12);
  const people:Figure[]=[];
  for(const x of [-1.5,0,1.5]) {people.push(sit(g,x,2.95,Math.PI,'#467788'));people.push(sit(g,x,.25,0,'#a65d4d'));}
  if(kind==='supper'){add(g,cyl(.34,.20,ME.copper),0,y+.1,1.6);g.userData.steam=new THREE.Vector3(0,1.2,1.6);}
  // The vine canopy is carried by four posts and crossbeams.
  for(const x of [-3.0,3.0]) {add(g,box(.13,3.0,.13,ME.wood),x,1.5,3.5);add(g,box(.13,.13,3.6,ME.wood),x,3.0,1.75);}
  add(g,box(6.2,.13,.13,ME.wood),0,3.0,3.5);
  for(let i=0;i<7;i++) add(g,ball(.45,i%2?'#728450':'#65814b'),-2.7+i*.9,3.15,3.45).scale.set(1,.35,.65);
  return life(g,people,kind==='breakfast'?'Günaydın! Good morning!':'Sofraya buyurun! Come to the table!');
}

export function turkeyOliveGrove(): P {
  const g=group();
  for(const [x,z] of [[-2,-1],[1.5,-1.6],[2.3,1.3]]) add(g,oliveTree(1.2),x,0,z);
  for(const x of [-1,0,1]){add(g,cyl(.30,.3,'#a37c4f'),x,.15,1.3);for(let i=0;i<8;i++) add(g,ball(.045,'#526b3e'),x+Math.cos(i)*.18,.31,1.3+Math.sin(i)*.18);}
  const picker=add(g,local('#927656'),-2.5,0,.25);picker.rotation.y=.6;
  return life(g,[picker],'Zeytin zamanı. Time for the olives.',t=>{(picker.userData.arms as {right:THREE.Group}).right.rotation.x=-1.8+Math.sin(t)*.12;});
}

export function turkeyTeaHill(): P {
  const g=group();
  // Each row has a terrace beneath it; pickers stand on its surface.
  const pickers:Figure[]=[];
  for(let row=0;row<5;row++) {
    const y=row*.30,z=2.4-row*1.3;
    add(g,box(8,y+.18,1.25,'#81985a'),0,(y+.18)/2,z);
    for(let i=0;i<10;i++) add(g,ball(.36,(row+i)%2?'#43804b':'#568c4f'),-3.6+i*.8,y+.38,z-.25).scale.set(1.25,.85,.8);
    if(row%2===0){const p=add(g,local(row?'#9b6274':'#b09057'),-1.4+row*.65,y+.18,z+.36);p.rotation.y=Math.PI;pickers.push(p);add(g,cyl(.22,.34,'#b69663'),p.position.x+.45,y+.35,z+.32);}
  }
  add(g,tree('pine',1.2),5,0,-2.5);
  return life(g,pickers,'Taze yapraklar. Fresh tea leaves.',t=>pickers.forEach((p,i)=>upper(p).rotation.x=.15+Math.sin(t*.8+i)*.06));
}

export const TURKEY_PROPS: Record<string,()=>P> = {
  turkeyTeaGarden, turkeySimitCart, turkeyOliveGrove, turkeyTeaHill,
  turkeyKebab:()=>foodHouse('kebab'),turkeyFish:()=>foodHouse('fish'),turkeyPide:()=>foodHouse('pide'),
  turkeyBaklava:()=>foodHouse('baklava'),turkeyCoffee:()=>foodHouse('coffee'),turkeyYufka:()=>foodHouse('yufka'),
  turkeyDolma:()=>foodHouse('dolma'),turkeyBreakfast:()=>familyTable('breakfast'),turkeyMeze:()=>familyTable('meze'),turkeySupper:()=>familyTable('supper'),
};

/** Small 3D workshops stay in the world and answer with a card. */
export function turkeyPottery(): P {
  const g=group();roomShell(g,'#bca086');
  const maker=add(g,local('#537a85',{apron:true}),0,.1,-.1);
  add(g,cyl(.38,.52,ME.wood),0,.26,1.0);
  const wheel=add(g,cyl(.63,.07,'#967351'),0,.555,1);wheel.name='pottery-wheel';
  const pot=add(wheel,new THREE.Mesh(new THREE.LatheGeometry([new THREE.Vector2(.17,0),new THREE.Vector2(.3,.13),new THREE.Vector2(.31,.34),new THREE.Vector2(.18,.48),new THREE.Vector2(.2,.52)],20),mat('#b56e43')),0,.035,0);
  for(const x of [-1.8,1.8]){const y=table(g,x,1.2,.7,.7);add(g,cyl(.16,.34,'#b56e43'),x,y+.17,1.2);}
  return life(g,[maker],'Çamur şekil alıyor! The clay takes shape.',(t,k)=>{wheel.rotation.y=t*(.6+k*4);pot.scale.set(1-k*.08,1+k*.16,1-k*.08);(maker.userData.arms as {right:THREE.Group}).right.rotation.x=-.9;});
}
export function turkeyCopper(): P {
  const g=group();roomShell(g,'#c5b491');const smith=add(g,local('#8f694c',{apron:true}),0,.1,-.1),y=table(g,0,1.05,3.6,1.05);
  for(const x of [-1.1,0,1.1]){const dish=add(g,cyl(.33,.07,ME.copper),x,y+.035,1.05);dish.userData.foodReaction=false;}
  const hand=(smith.userData.arms as {right:THREE.Group}).right;
  const hammer=add(hand,group(),0,-.35,.15);add(hammer,box(.04,.40,.04,ME.wood),0,0,0);add(hammer,box(.2,.10,.10,'#69665c'),0,-.2,0);
  return life(g,[smith],'Bakır işliyoruz. We are working copper.',(t,k)=>{hand.rotation.x=-.9+Math.sin(t*(3+k*5))*.18;});
}
export function turkeyFountain(): P {
  const g=group();add(g,box(2.4,.18,1.5,'#b7aa8d'),0,.09,0);add(g,box(2,2,.35,'#d2c2a4'),0,1,-.5);
  add(g,box(2,.5,1,'#c0af90'),0,.25,.23);add(g,box(1.7,.025,.68,'#75acb0'),0,.51,.25);
  add(g,cyl(.07,.3,ME.copper),0,1,-.23).rotation.x=Math.PI/2;
  const stream=add(g,cyl(.025,.49,'#97c8cb'),0,.765,-.08);
  let pulse=0;g.userData.ownReaction=true;g.userData.poke=()=>{pulse=1;bubble(g,'Şırıl şırıl… Water in the lane.',2.3,1600);};
  g.userData.tick=(t,dt)=>{pulse=Math.max(0,pulse-dt);stream.scale.x=stream.scale.z=1+Math.sin(t*7)*.12+pulse*.8;};return g;
}
Object.assign(TURKEY_PROPS,{turkeyPottery,turkeyCopper,turkeyFountain,turkishCat});

export function turkeyHammam(): P {
  const g=group();add(g,box(5,2.1,4,'#d6c5a5'),0,1.05,0);
  add(g,new THREE.Mesh(new THREE.SphereGeometry(2.05,18,9,0,Math.PI*2,0,Math.PI/2),mat('#b8baa9')),0,2.1,0);
  add(g,box(1.15,1.6,.08,'#79583f'),0,.8,2.04);add(g,box(1.8,.25,.5,'#daccad'),0,1.78,2.15);
  for(const x of [-1.6,1.6]){add(g,box(.65,.9,.06,'#79a5a9'),x,1.15,2.03);add(g,box(.065,.95,.09,'#e1d4b9'),x,1.15,2.07);}
  for(const [x,z] of [[0,0],[-.8,0],[.8,0],[0,-.8],[0,.8]])add(g,ball(.13,'#b6dde0'),x,2.1+Math.sqrt(2.05**2-x*x-z*z),z);
  const visitor=add(g,local('#637c8c'),-1.5,0,2.9);g.userData.steam=new THREE.Vector3(0,4.2,0);
  return life(g,[visitor],'Hoş geldiniz. Welcome to the hammam.');
}
export function turkeyCitrus(): P {
  const g=group();
  for(const x of [-4,0,4])for(const z of [-2,2]){
    add(g,tree('round',1.1),x,0,z);
    for(let i=0;i<5;i++)add(g,ball(.10,'#de9334'),x+Math.sin(i*2.4)*.62,1.65+(i%3)*.2,z+Math.cos(i*2.4)*.62);
  }
  const picker=add(g,local('#a97853'),0,0,.1);add(g,cyl(.42,.35,'#a37c52'),1,.175,0);
  const fruit=add(g,group(),1,.39,0);fruit.userData.foodReaction=true;
  for(let i=0;i<6;i++)add(fruit,ball(.11,'#de9334'),Math.sin(i)*.24,0,Math.cos(i)*.24);
  return life(g,[picker],'Portakal zamanı! Orange season!');
}
Object.assign(TURKEY_PROPS,{turkeyHammam,turkeyCitrus});
