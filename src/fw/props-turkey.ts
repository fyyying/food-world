/** Turkish streets and kitchens: supported furniture, open workspaces and quiet daily activity. */
import * as THREE from 'three';
import { add, mat, person, tree, bubble, ambientChat, type P } from './props';
import { oliveTree, citrusTree } from './props-italy';
import { local, ME } from './props-mideast';
import { TR, block, tilePanel, masonry, bathhouse, iznikFountain, kilim, hipRoof } from './turkey-architecture';

const group = () => new THREE.Group() as P;
const box = (w: number, h: number, d: number, c: string) => new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat(c));
const cyl = (r: number, h: number, c: string) => new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,12), mat(c));
const ball = (r: number, c: string) => new THREE.Mesh(new THREE.SphereGeometry(r,10,6), mat(c));
type Figure = ReturnType<typeof person>;
function upper(p: Figure) { return p.userData.upper as THREE.Group; }
// One finite preparation cycle. Fixed geometry is reused on every click.
const beat=(k:number,start=0,end=1)=>k>0?Math.sin(Math.PI*Math.min(1,Math.max(0,((1-k)-start)/(end-start)))):0;
function transfer(g:P,name:string,color:string,from:THREE.Vector3,to:THREE.Vector3,count=7){
  const drops=Array.from({length:count},()=>{const m=add(g,ball(.035,color),...from.toArray() as [number,number,number]);m.name=name;m.visible=false;return m;});
  return (k:number)=>drops.forEach((m,i)=>{
    const p=((1-k)-i*.025)/.48;m.visible=k>0&&p>0&&p<1;
    m.position.lerpVectors(from,to,Math.max(0,Math.min(1,p)));m.position.y+=Math.sin(Math.PI*Math.max(0,Math.min(1,p)))*.13;
  });
}
function fixedStream(g:P,name:string,color:string,from:THREE.Vector3,to:THREE.Vector3,radius=.045){
  const mesh=add(g,new THREE.Mesh(new THREE.CylinderGeometry(radius,radius*1.15,1,8),mat(color,{emissive:color,emissiveIntensity:.16,transparent:true,opacity:.92})));
  mesh.name=name;mesh.visible=false;
  const direction=to.clone().sub(from),up=new THREE.Vector3(0,1,0);
  mesh.position.copy(from).add(to).multiplyScalar(.5);mesh.scale.set(1,direction.length(),1);mesh.quaternion.setFromUnitVectors(up,direction.clone().normalize());
  return {mesh,tick(k:number,start=.08,end=.76){const progress=1-k;mesh.visible=k>0&&progress>start&&progress<end;}};
}
function deferredBubble(target:THREE.Object3D,text:string,y:number,ms:number){
  let delay=-1;
  return {
    schedule(){delay=.28;},
    tick(dt:number){if(delay<0)return;delay-=dt;if(delay<=0){delay=-1;bubble(target,text,y,ms);}},
  };
}
function bowl(g: THREE.Object3D, x: number, y: number, z: number, color: string, r = .20, reacts=false) {
  const dish=add(g,group(),x,y,z);
  dish.name='food-bowl';
  add(dish,cyl(r,.055,'#fff2d7'),0,.0275,0);
  const contents=add(dish,cyl(r*.86,.032,color),0,.071,0);dish.userData.contents=contents;if(reacts){contents.userData.foodReaction='contents';contents.name='reacting-food';}
  return dish;
}
function glass(g: THREE.Object3D,x: number,y: number,z: number) {
  const setting=add(g,group(),x,y,z);
  add(setting,cyl(.09,.025,'#f8e8ce'),0,.0125,0).name='tea-saucer';
  const cup=add(setting,group(),0,0,0);
  add(cup,new THREE.Mesh(new THREE.LatheGeometry([new THREE.Vector2(.045,0),new THREE.Vector2(.038,.07),new THREE.Vector2(.06,.17)],12),mat('#aa481e')),0,.025,0);
  return cup;
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
function roomShell(g: P, color = '#e5ceab', w = 5.4, roofStyle:'gable'|'hip'|'pergola'='gable') {
  // An open-front shop: back and side walls, no invisible front wall through the cook.
  add(g,box(w,.10,3.3,'#cbbb9b'),0,.05,-.7);
  add(g,box(w,2.6,.16,color),0,1.35,-2.3);
  for(const x of [-w/2+.08,w/2-.08]) add(g,box(.16,2.6,3.1,color),x,1.35,-.8);
  for(const x of [-w/2+.08,w/2-.08]) add(g,box(.20,.26,3.3,ME.wood),x,2.77,-.8);
  add(g,box(w,.34,.18,ME.wood),0,2.81,-2.3);
  for(const x of [-w/2+.16,w/2-.16]) add(g,box(.18,2.9,.18,ME.wood),x,1.45,1.9);
  if(roofStyle==='hip')add(g,masonry(hipRoof(w+.4,3.5,3.0)),0,0,-.8);
  else if(roofStyle==='pergola'){
    const canopy=new THREE.Group();
    for(let i=0;i<9;i++)add(canopy,block(.10,.14,3.4,TR.wood),-w/2+i*w/8,2.94,-.8);
    for(let i=0;i<15;i++)add(canopy,ball(.40,i%3?'#70824e':'#8a9b64'),-w/2+.25+(i%5)*(w-.5)/4,3.17,-1.9+Math.floor(i/5)*1.1).scale.set(1.2,.45,1);
    g.add(masonry(canopy));
  }
  else for (const side of [-1,1]) {
    const roof=add(g,box(w+.4,.13,1.75,'#b3613d'),0,3.15,-1.0+side*.78);
    roof.rotation.x=side*.30;
    for(let i=0;i<12;i++) add(roof,box(.065,.04,1.74,'#cb7a50'),-w/2+i*w/11,.085,0);
  }
  // A narrow awning shades the edge; the food counter stays visible from the world camera.
  add(g,box(w+.2,.10,.65,'#ba5546'),0,2.87,1.62);
  for(const x of [-w/2+.16,w/2-.16])add(g,box(.12,.12,1.8,ME.wood),x,2.86,.75);
  add(g,box(w-.3,.26,.09,'#386d76'),0,2.72,1.9);
  const details=new THREE.Group();
  for(const x of [-w/2+.18,w/2-.18]){
    add(details,block(.12,2.6,.08,TR.wood),x,1.35,-2.19);
    add(details,block(.12,.12,3.1,TR.wood),x,1.85,-.8);
  }
  add(details,tilePanel(1.45,.65),0,1.90,-2.18);
  for(let i=0;i<Math.floor(w/.42);i+=2)add(details,block(.39,.02,.66,'#dfccb0'),-w/2+.25+i*.42,2.93,1.62);
  add(details,block(w+.10,.11,.12,TR.wood),0,2.83,1.96);
  for(const x of [-w/2+.35,w/2-.35]){
    add(details,block(.36,.28,.4,'#a66b50'),x,.14,2.2);
    add(details,ball(.26,'#758250'),x,.46,2.2);
    add(details,ball(.13,'#ac6077'),x,.63,2.2);
  }
  g.add(masonry(details));
}
function life(g: P, people: Figure[], phrase: string, work?: (t:number,k:number,dt:number)=>void, onPoke?:()=>void) {
  g.userData.ownReaction=true;
  let reaction = 0;
  const food: {object:THREE.Object3D;position:THREE.Vector3;rotation:THREE.Euler;scale:THREE.Vector3}[]=[];
  g.traverse(object=>{if(object.userData.foodReaction) food.push({object,position:object.position.clone(),rotation:object.rotation.clone(),scale:object.scale.clone()});});
  const chat = ambientChat(people[0] ?? g,[phrase]);
  const speech=deferredBubble(people[0] ?? g,phrase,1.45,1800);
  g.userData.poke=()=>{reaction=1; onPoke?.(); speech.schedule();};
  g.userData.tick=(t,dt)=>{
    // Room stands are approached for 1.6 seconds before the paper transition. Keep the physical beat
    // readable through that approach instead of letting it finish while the camera is still far away.
    reaction=Math.max(0,reaction-dt*.285);
    people.forEach((p,i)=>{upper(p).rotation.y=Math.sin(t*.45+i)*.09;upper(p).rotation.z=Math.sin(t*.7+i)*.025;});
    food.forEach(({object,position,rotation,scale},i)=>{
      const phase=Math.min(1,Math.max(0,(1-reaction-(i%3)*.09)/.73));
      const pulse=reaction>0?Math.sin(Math.PI*phase):0;
      object.position.copy(position);object.rotation.copy(rotation);object.scale.copy(scale);
      switch(object.userData.foodReaction){
        case 'simit': // One ring tips towards the customer, then settles on its stack.
          object.position.y+=pulse*.48;object.position.z+=pulse*.20;object.rotation.x+=pulse*1.15;break;
        case 'knead':
          object.scale.set(scale.x*(1+pulse*.10),scale.y*(1-pulse*.28),scale.z*(1+pulse*.12));
          object.position.y-=pulse*.01;break;
        case 'roll': // Folded vine leaves roll a little on the board; pots and boards stay put.
          object.position.y+=pulse*.34;object.position.z+=pulse*.12;object.rotation.x+=pulse*1.15;break;
        case 'grill':
          object.position.y+=pulse*.34;object.position.z+=pulse*.12;object.rotation.z+=pulse*Math.PI/2;break;
        case 'puff':
          object.scale.y=scale.y*(1+pulse*1.6);object.position.y+=pulse*.36;break;
        case 'sheet':
          object.position.y+=pulse*.52;object.rotation.z+=pulse*2.2;object.scale.x=scale.x*(1-pulse*.12);break;
        case 'serve':
          // Lift one cut piece; the tray and the rest of the pastry remain rigid and supported.
          object.position.y+=pulse*.42;object.position.z+=pulse*.12;object.rotation.x-=pulse*.42;break;
        case 'contents':
          object.scale.set(scale.x*(1+pulse*.13),scale.y*(1+pulse*.75),scale.z*(1+pulse*.13));
          object.position.y+=pulse*.24;break;
        case 'cup': case 'tea-glass':
          object.position.y+=pulse*.28;object.position.z+=pulse*.10;object.rotation.z-=pulse*.16;break;
        case 'flip':
          {const p=reaction>0?Math.min(1,(1-reaction)/.72):0;object.position.y+=Math.sin(p*Math.PI)*.65;object.rotation.z+=p*Math.PI*2;break;}
        case 'carve':
          object.rotation.y+=t*.25;break;
        default: break; // Crockery remains supported; the preparation callback moves its contents.
      }
    });
    if(people[0]) (people[0].userData.arms as {right:THREE.Group}).right.rotation.z=-beat(reaction,.52,.90)*.14;
    if(people[1]) upper(people[1]).rotation.x=beat(reaction,.58,1)*.13;
    work?.(t,reaction,dt);
    speech.tick(dt);
    chat(dt);
  };
  return g;
}

/** Reuse fruit geometry, hide the picked fruit, and let a bounded handful fall and settle. */
function harvest(g:P, trees:THREE.Object3D[], baskets:THREE.Vector3[]) {
  const falling:{mesh:THREE.Group;source:THREE.Mesh;start:THREE.Vector3;matrix:THREE.Matrix4;age:number;target:THREE.Vector3}[]=[];
  const position=new THREE.Vector3(),spin=new THREE.Matrix4(),fadeScale=new THREE.Vector3();
  let pick=0;
  return {
    poke:()=>{
      g.updateWorldMatrix(true,true);
      for(const [i,tr] of trees.slice(0,3).entries()){
        if(falling.length>=24)break;
        const fruit=(tr.userData.fruits??tr.userData.olives??[]) as THREE.Mesh[];
        const available=fruit.filter(f=>f.visible);if(!available.length)continue;
        const source=available[(pick+i)%available.length],visual=source.clone(),mesh=new THREE.Group();
        source.updateWorldMatrix(true,false);mesh.name='harvest-fruit';mesh.matrixAutoUpdate=false;g.add(mesh);
        const matrix=source.matrixWorld.clone().premultiply(g.matrixWorld.clone().invert());mesh.matrix.copy(matrix);
        visual.position.set(0,0,0);visual.quaternion.identity();visual.scale.set(1,1,1);mesh.add(visual);
        source.visible=false;
        const target=baskets[i%baskets.length].clone().add(new THREE.Vector3(Math.sin(pick+i)*.10,0,Math.cos(pick+i)*.10));
        mesh.userData.harvestTarget=target.clone();
        falling.push({mesh,source,start:new THREE.Vector3().setFromMatrixPosition(matrix),matrix,age:-i*.22,target});
      }
      pick++;
    },
    tick:(t:number,k:number,dt:number)=>{
      trees.forEach((tr,i)=>{
        const crown=(tr.userData.crown??tr) as THREE.Object3D;
        crown.rotation.z=Math.sin(t*1.3+i)*.012+(i===0?Math.sin(t*19)*.10*k:0);
        crown.rotation.x=i===0?Math.cos(t*16)*.055*k:0;
      });
      for(let i=falling.length-1;i>=0;i--){
        const f=falling[i];f.age+=dt;if(f.age<0)continue;
        const landing=1.8,p=Math.min(1,f.age/landing),after=f.age-landing;
        const bounce=after>0&&after<.28?Math.sin(after/.28*Math.PI)*.065:0;
        position.lerpVectors(f.start,f.target,p);position.y=f.start.y+(f.target.y-f.start.y)*p*p+bounce;
        const fade=Math.min(1,Math.max(0,(3.6-f.age)/.5));
        f.mesh.matrix.copy(f.matrix).setPosition(position).multiply(spin.makeRotationZ(f.age*.9)).scale(fadeScale.setScalar(fade));
        if(f.age>=3.6){g.remove(f.mesh);f.source.visible=true;falling.splice(i,1);}
      }
    },
  };
}

export function turkishCat(): P {
  const g=group();
  const body=add(g,ball(.24,'#c59164'),0,.22,0);body.scale.set(1.5,.75,.75);
  add(g,ball(.16,'#c59164'),.30,.31,0);
  for(const z of [-.085,.085]) add(g,new THREE.Mesh(new THREE.ConeGeometry(.065,.13,4),mat('#c59164')),.30,.46,z);
  for(const x of [-.21,.20]) for(const z of [-.11,.11]) add(g,box(.07,.17,.07,'#c59164'),x,.085,z);
  const tail=add(g,new THREE.Mesh(new THREE.TorusGeometry(.21,.035,6,12,Math.PI),mat('#c59164')),-.35,.28,0);tail.rotation.y=Math.PI/2;
  let k=0;const speech=deferredBubble(g,'Mrr…',.8,1400);
  g.userData.tick=(t,dt)=>{k=Math.max(0,k-dt*.6);tail.rotation.z=Math.sin(t*.8)*.12+beat(k)*Math.sin(t*12)*.5;body.scale.x=1.5+beat(k)*.25;speech.tick(dt);};
  g.userData.ownReaction=true;
  g.userData.poke=()=>{k=1;speech.schedule();};
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
  const y=table(g,3,-2,1,.7),target=new THREE.Vector3(3.34,y+.20,-2);
  const kettle=add(g,group(),3,y,-2);kettle.name='tea-kettle';
  add(kettle,cyl(.22,.42,ME.copper),0,.21,0);
  add(kettle,cyl(.13,.055,'#d59b55'),0,.45,0);
  const spout=add(kettle,new THREE.Mesh(new THREE.ConeGeometry(.085,.43,9),mat(ME.copper)),.27,.34,0);
  spout.rotation.z=-Math.PI*.34;
  const handle=add(kettle,new THREE.Mesh(new THREE.TorusGeometry(.25,.035,7,14,Math.PI*1.35),mat('#6f4933')),-.15,.28,0);
  handle.rotation.x=Math.PI/2;handle.rotation.z=Math.PI*.33;
  const servedGlass=glass(g,target.x,y,target.z);servedGlass.name='tea-glass';servedGlass.userData.foodReaction='tea-glass';
  servedGlass.parent!.getObjectByName('tea-saucer')!.name='served-tea-saucer';
  g.userData.steam=new THREE.Vector3(3,1.2,-2);
  const stream=add(g,new THREE.Mesh(new THREE.CylinderGeometry(.045,.06,1,8),mat('#c96725',{emissive:'#6e250d',emissiveIntensity:.3,transparent:true,opacity:.92})));
  stream.name='tea-stream';stream.visible=false;
  const ripple=add(servedGlass,new THREE.Mesh(new THREE.TorusGeometry(.13,.018,7,18),mat('#f0a34c',{transparent:true,opacity:.85})),0,.20,0);
  ripple.name='tea-ripple';ripple.rotation.x=Math.PI/2;ripple.visible=false;
  const base=kettle.position.clone(),tipLocal=new THREE.Vector3(.49,.42,0),tip=new THREE.Vector3(),pourTarget=target.clone(),direction=new THREE.Vector3(),midpoint=new THREE.Vector3(),up=new THREE.Vector3(0,1,0),zAxis=new THREE.Vector3(0,0,1);
  return life(g,[waiter,...people.filter(p=>p!==waiter)],'Bir çay daha? Another tea?',(_,k)=>{
    const progress=1-k,pulse=beat(k,.04,.82);
    kettle.position.copy(base);kettle.position.y+=pulse*.30;kettle.rotation.z=-pulse*.62;
    tip.copy(tipLocal).applyAxisAngle(zAxis,kettle.rotation.z).add(kettle.position);
    pourTarget.copy(target).add(servedGlass.position);direction.subVectors(pourTarget,tip);const length=direction.length();
    stream.visible=k>0&&progress>.06&&progress<.68;
    if(stream.visible){stream.position.copy(midpoint.copy(tip).add(pourTarget).multiplyScalar(.5));stream.scale.set(1,length,1);stream.quaternion.setFromUnitVectors(up,direction.normalize());}
    ripple.visible=k>0&&progress>.22&&progress<.82;
    if(ripple.visible){const spread=(progress-.22)/.60;ripple.scale.setScalar(.75+spread*.75);(ripple.material as THREE.MeshStandardMaterial).opacity=.85*(1-spread);}
  });
}

/** Small shared café nooks fit beside the square; both diners remain attached to real stools. */
export function turkeyTeaCorner():P {
  const g=group(),y=table(g,0,0,1.35,.78);
  glass(g,-.32,y,0);glass(g,.32,y,0);
  const people=[sit(g,-1.05,0,Math.PI/2,'#849291'),sit(g,1.05,0,-Math.PI/2,'#b07d63')];
  const shade=new THREE.Group();
  for(const x of [-1.55,1.55])for(const z of [-.72,.72])add(shade,block(.07,2.65,.07,TR.wood),x,1.325,z);
  for(const z of [-.72,.72])add(shade,block(3.2,.11,.10,TR.wood),0,2.64,z);
  for(let i=0;i<7;i++)add(shade,block(.08,.11,1.6,TR.wood),-1.5+i*.5,2.68,0);
  for(const x of [-1.4,-.9,.9,1.4])add(shade,ball(.35,'#688055'),x,2.79,.40).scale.set(1,.45,1);
  g.add(masonry(shade));
  return life(g,people,'Biraz oturalım. Let’s sit a while.');
}

export function turkeySimitCart(): P {
  const g=group();
  for(const x of [-.62,.62]) for(const z of [-.4,.4]) add(g,cyl(.20,.10,'#353035'),x,.2,z).rotation.z=Math.PI/2;
  add(g,box(1.5,.65,1.0,'#b84136'),0,.65,0);
  add(g,box(1.65,.07,1.1,'#e8c280'),0,1.01,0);
  for(const x of [-.69,.69]) for(const z of [-.44,.44]) add(g,box(.045,1.0,.045,ME.wood),x,1.5,z);
  add(g,box(1.9,.13,1.4,'#b84136'),0,2.06,0);
  for(let i=0;i<5;i++)add(g,box(.18,.02,1.4,'#f0dcc0'),-.8+i*.4,2.135,0);
  for(let i=0;i<12;i++) add(g,new THREE.Mesh(new THREE.TorusGeometry(.12,.04,7,14),mat('#cb8d3d')),-.5+(i%4)*.33,1.08+Math.floor(i/4)*.075,(i%2-.5)*.35).rotation.x=Math.PI/2;
  g.children.filter(o=>o instanceof THREE.Mesh && o.geometry instanceof THREE.TorusGeometry).slice(-1).forEach(o=>o.userData.foodReaction='simit');
  const seller=add(g,local('#46718a',{apron:true}),0,0,-1.1);
  return life(g,[seller],'Sıcak simit! Warm sesame bread!');
}

function foodHouse(kind: 'kebab'|'fish'|'pide'|'baklava'|'coffee'|'yufka'|'dolma'): P {
  const g=group(); roomShell(g,kind==='fish'?'#b6cbd0':kind==='coffee'?'#c6ad91':'#e5ceab',5.4,kind==='fish'||kind==='baklava'?'hip':kind==='yufka'?'pergola':'gable');
  const cook=add(g,local('#ece3cf',{apron:true}),-.9,.10,-.15);
  const y=table(g,0,1.0,3.8,1.0), moving:THREE.Object3D[]=[];
  const foodColours=['#bd6c38','#577747','#bd4932','#e7c37a'];
  if(kind==='kebab'||kind==='fish') {
    add(g,box(2.6,.2,.8,'#45413b'),0,y+.10,1);
    for(let i=0;i<10;i++) add(g,ball(.075,i%2?'#b5582b':'#723c27'),-1.1+i*.24,y+.24,1+(i%2-.5)*.25);
    for(let i=0;i<5;i++) {
      const sk=add(g,group(),-1+i*.50,y+.30,1);sk.userData.foodReaction=kind==='fish'?(i===2?'flip':false):(i===1||i===2?'grill':false);
      if(kind==='fish'&&i===2)sk.name='fish-flip';
      if(kind==='kebab'&&i===2)sk.name='charcoal-skewer';
      if(kind==='fish') add(sk,ball(.20,'#a9bac0'),0,0,0).scale.set(.65,.35,1.8);
      else {add(sk,box(.035,.035,1.05,'#d0c7ae'),0,0,0);for(let j=0;j<4;j++) add(sk,box(.17,.13,.17,foodColours[j%3]),0,.06,-.3+j*.20);}
    }
    g.userData.smoke=new THREE.Vector3(0,1.2,1);
  } else if(kind==='pide'||kind==='yufka') {
    add(g,box(1.5,.55,1.3,'#8e694e'),1.45,.38,-1.35);
    add(g,new THREE.Mesh(new THREE.SphereGeometry(.75,14,7,0,Math.PI*2,0,Math.PI/2),mat('#b69062')),1.45,.65,-1.35);
    add(g,box(.75,.45,.05,'#352b26'),1.45,.56,-.68);add(g,box(.5,.09,.07,'#c76628'),1.45,.38,-.64);
    for(let i=0;i<4;i++){const dough=add(g,ball(.34,'#e5bb74'),-1.2+i*.78,y+.04,1);dough.scale.set(kind==='pide'?.7:1.0,.12,1);dough.userData.foodReaction=i===1?(kind==='pide'?'puff':'sheet'):false;if(i===1)dough.name=kind==='pide'?'pide-loaf':'yufka-sheet';}
    if(kind==='pide') {
      const paddle=add(g,group(),-.42,y+.035,1);paddle.name='pide-paddle';
      add(paddle,box(.68,.035,.60,ME.wood),0,0,0);add(paddle,box(.10,.05,1.15,ME.wood),0,0,-.82);moving.push(paddle);
    } else {
      const pin=add(g,cyl(.045,.80,ME.wood),-.8,y+.13,.85);pin.name='yufka-pin';pin.rotation.z=Math.PI/2;moving.push(pin);
    }
  } else if(kind==='baklava') {
    for(let i=0;i<3;i++){
      const tray=add(g,group(),-1.15+i*1.15,y,1);tray.name='baklava-tray';
      add(tray,box(.95,.04,.8,'#bdac8d'),0,.02,0);
      for(let j=0;j<9;j++){
        const piece=add(tray,group(),-.28+(j%3)*.27,.10,-.27+Math.floor(j/3)*.27);
        add(piece,box(.22,.12,.20,'#d8ab50'),0,0,0);add(piece,ball(.035,'#6e8745'),0,.07,0);
        if(i===1&&j>=3&&j<=5){piece.userData.foodReaction='serve';piece.name=j===4?'baklava-serving-piece':'baklava-serving-piece-secondary';}
      }
    }
  } else if(kind==='coffee') {
    for(let i=0;i<3;i++){const x=-.8+i*.8;add(g,cyl(.12,.23,ME.copper),x,y+.115,1);add(g,box(.32,.025,.035,ME.copper),x+.21,y+.22,1);const cup=bowl(g,x,y,1.3,'#54382a',.08);if(i===1){cup.name='coffee-cup';const coffee=cup.userData.contents as THREE.Object3D;coffee.name='coffee-surface';coffee.userData.foodReaction='contents';}}
    g.userData.steam=new THREE.Vector3(0,1.1,1);
  } else {
    add(g,box(2.4,.045,.75,'#ba905c'),-.3,y+.0225,1).name='dolma-board';
    for(let i=0;i<7;i++){
      const filled=add(g,ball(.15,foodColours[i%3]),-1.1+(i%4)*.57,y+.12,.78+Math.floor(i/4)*.4);
      filled.scale.set(.75,.5,1);filled.userData.foodReaction=i<3?'roll':false;if(i<3)filled.name='dolma-roll';
    }
    add(g,cyl(.34,.27,ME.copper),1.8,y+.135,1.3).name='dolma-pot';g.userData.steam=new THREE.Vector3(1.8,1.2,1.3);
  }
  const customer=add(g,local('#5d7884'),-1.8,0,2.4);customer.rotation.y=Math.PI;
  const phrases={kebab:'Afiyet olsun! Enjoy your meal!',fish:'Balık ekmek! Fish in fresh bread!',pide:'Fırından yeni çıktı! Fresh from the oven!',baklava:'Fıstıklı baklava! Pistachio baklava!',coffee:'Kahve hazır. Coffee is ready.',yufka:'Hamur dinlensin. Let the dough rest.',dolma:'Birlikte yapalım. Let’s make them together.'};
  if(kind==='coffee'){
    // Keep the open counter readable. A complete house placed above this small shell used to put
    // the approach camera inside an oversized facade, hiding the coffee action behind blank walls.
    add(g,tilePanel(2.4,.55),0,2.12,-2.18);
    const rug=add(g,kilim(.72,1.15),2.57,2.18,-.62);rug.rotation.y=-Math.PI/2;
  }
  if(kind==='baklava'){
    add(g,kilim(.65,1.25),-2.48,2.37,1.98);
    for(let i=0;i<6;i++)bowl(g,-1.5+i*.6,y+.04,1.34,i%2?'#d0a073':'#bc7980',.13);
  }
  const pour=kind==='baklava'||kind==='coffee'?transfer(g,kind==='baklava'?'baklava-syrup':'coffee-pour',kind==='baklava'?'#bb792f':'#593320',new THREE.Vector3(-.45,y+.55,1),new THREE.Vector3(0,y+.17,kind==='coffee'?1.3:1)):undefined;
  const vessel=pour?add(g,cyl(.10,.16,ME.copper),-.45,y+.6,1):undefined;
  if(vessel)add(vessel,box(.26,.025,.03,ME.copper),-.14,.05,0);
  const streamFrom=new THREE.Vector3(-.45,y+.52,1),streamTo=new THREE.Vector3(0,y+.20,kind==='coffee'?1.3:1);
  const fixedPour=kind==='baklava'?fixedStream(g,'baklava-syrup-stream','#cf8428',streamFrom,streamTo,.045)
    :kind==='coffee'?fixedStream(g,'coffee-stream','#5b2d19',streamFrom,streamTo,.038):undefined;
  const sprinkle=kind==='baklava'?transfer(g,'pistachio-sprinkle','#688846',new THREE.Vector3(.3,y+.65,1),new THREE.Vector3(.1,y+.17,1),5):undefined;
  const lid=kind==='dolma'?add(g,cyl(.35,.04,ME.copper),1.8,y+.29,1.3):undefined;
  if(lid)lid.name='dolma-lid';
  return life(g,[cook,customer],phrases[kind],(t,k)=>{
    pour?.(k);sprinkle?.(k);fixedPour?.tick(k);if(vessel)vessel.rotation.z=-beat(k,.08,.72)*.82;if(lid)lid.position.y=y+.29+beat(k,.3,.8)*.14;
    const arms=cook.userData.arms as {left:THREE.Group;right:THREE.Group};
    const follow=beat(k,.48,.92);arms.right.rotation.x=-.75+Math.sin(t*1.2)*.08+follow*.10;arms.left.rotation.x=-.5;
    moving.forEach(tool=>{
      if(tool.name==='pide-paddle'){tool.position.z=1-follow*.52;tool.position.x=-.42+follow*.32;}
      else {tool.position.z=.85+Math.sin(t*1.1)*.12+follow*.14;tool.rotation.x=t*.4+follow*.8;}
    });
  });
}

function familyTable(kind: 'breakfast'|'meze'|'supper'): P {
  const g=group();roomShell(g,kind==='meze'?'#b8c7ba':'#dfc4a0',6.2,kind==='meze'?'pergola':kind==='supper'?'hip':'gable');
  const y=table(g,0,1.6,4.3,1.45);
  for(let i=0;i<10;i++) bowl(g,-1.7+(i%5)*.85,y,1.26+Math.floor(i/5)*.7,['#577749','#e9cf8b','#bc5934','#eee1be','#594834'][i%5],.22,i===2);
  for(const x of [-1.7,0,1.7]) glass(g,x,y,2.12);
  const people:Figure[]=[];
  for(const x of [-1.5,0,1.5]) {people.push(sit(g,x,2.95,Math.PI,'#467788'));people.push(sit(g,x,.25,0,'#a65d4d'));}
  if(kind==='supper'){add(g,cyl(.34,.20,ME.copper),0,y+.1,1.6);g.userData.steam=new THREE.Vector3(0,1.2,1.6);}
  // The vine canopy is carried by four posts and crossbeams.
  for(const x of [-3.0,3.0]) {add(g,box(.13,3.0,.13,ME.wood),x,1.5,3.5);add(g,box(.13,.13,3.6,ME.wood),x,3.0,1.75);}
  add(g,box(6.2,.13,.13,ME.wood),0,3.0,3.5);
  for(let i=0;i<7;i++) add(g,ball(.45,i%2?'#728450':'#65814b'),-2.7+i*.9,3.15,3.45).scale.set(1,.35,.65);
  const liquidColor=kind==='breakfast'?'#d89e32':kind==='meze'?'#a7a13b':'#b94c28';
  const pour=transfer(g,`${kind}-pour`,liquidColor,new THREE.Vector3(-.3,y+.58,1.26),new THREE.Vector3(0,y+.12,1.26));
  const servingStream=kind!=='supper'?fixedStream(g,`${kind}-stream`,liquidColor,new THREE.Vector3(-.3,y+.58,1.26),new THREE.Vector3(0,y+.14,1.26),.042):undefined;
  const pitcher=kind!=='supper'?add(g,group(),-.3,y+.46,1.26):undefined;
  if(pitcher){pitcher.name=`${kind}-pitcher`;add(pitcher,cyl(.13,.28,kind==='breakfast'?'#b27a36':ME.copper),0,0,0);add(pitcher,box(.28,.035,.04,ME.copper),.18,.09,0);}
  if(kind==='breakfast')add(g,ball(.18,'#d8b875'),0,y+.11,1.26).scale.set(1,.25,.75);
  const ladle=add(g,cyl(.025,.52,ME.wood),-.15,y+.26,1.35);ladle.name=`${kind}-ladle`;ladle.rotation.z=-.8;
  const sauce=add(g,new THREE.Mesh(new THREE.TorusGeometry(.19,.018,5,20,Math.PI*1.4),mat('#c45729')),0,y+.21,1.6);sauce.name=`${kind}-sauce`;sauce.rotation.x=Math.PI/2;sauce.visible=kind==='supper';
  return life(g,people,kind==='breakfast'?'Günaydın! Good morning!':'Sofraya buyurun! Come to the table!',(_,k)=>{
    pour(k);servingStream?.tick(k,.10,.78);if(pitcher)pitcher.rotation.z=-beat(k,.06,.78)*.72;
    ladle.rotation.y=beat(k,.16,.85)*1.4;sauce.rotation.z=beat(k)*2;sauce.scale.setScalar(1+beat(k)*.35);
  });
}

export function turkeyOliveGrove(): P {
  const g=group(),trees:THREE.Object3D[]=[];
  for(const [x,z] of [[-2,-1],[1.5,-1.6],[2.3,1.3]]) trees.push(add(g,oliveTree(1.2),x,0,z));
  for(const x of [-1,0,1]){add(g,cyl(.30,.3,'#a37c4f'),x,.15,1.3);for(let i=0;i<8;i++) add(g,ball(.045,'#526b3e'),x+Math.cos(i)*.18,.31,1.3+Math.sin(i)*.18);}
  const picker=add(g,local('#927656'),-2.5,0,.25);picker.rotation.y=.6;
  const crop=harvest(g,trees,[-1,0,1].map(x=>new THREE.Vector3(x,.34,1.3)));
  return life(g,[picker],'Zeytin zamanı. Time for the olives.',(t,k,dt)=>{crop.tick(t,k,dt);(picker.userData.arms as {right:THREE.Group}).right.rotation.x=-1.8+Math.sin(t*(1+k*3))*(.12+k*.15);},crop.poke);
}

export function turkeyTeaHill(): P {
  const g=group();
  // Each row has a terrace beneath it; pickers stand on its surface.
  const pickers:Figure[]=[],bushes:THREE.Object3D[]=[];
  for(let row=0;row<5;row++) {
    const y=row*.30,z=2.4-row*1.3;
    add(g,box(8,y+.18,1.25,'#81985a'),0,(y+.18)/2,z);
    for(let i=0;i<10;i++){
      const bush=add(g,ball(.36,(row+i)%2?'#43804b':'#568c4f'),-3.6+i*.8,y+.38,z-.25);bush.scale.set(1.25,.85,.8);bush.name='tea-bush';
      // A few young leaves separate from the brushed row; the terrace itself never moves.
      const leaf=add(bush,ball(.085,'#92af5f'),.1,.34,.12);leaf.scale.set(.5,1,.18);
      bush.userData.fruits=[leaf];bush.userData.harvestFloor=y+.18;
      bushes.push(bush);
    }
    if(row%2===0){const p=add(g,local(row?'#9b6274':'#b09057'),-1.4+row*.65,y+.18,z+.36);p.rotation.y=Math.PI;pickers.push(p);add(g,cyl(.22,.34,'#b69663'),p.position.x+.45,y+.35,z+.32);}
  }
  add(g,tree('pine',1.2),5,0,-2.5);
  const crop=harvest(g,bushes.slice(2,5),[new THREE.Vector3(-.95,.55,2.72)]);
  return life(g,pickers,'Taze yapraklar. Fresh tea leaves.',(t,k,dt)=>{crop.tick(t,k,dt);pickers.forEach((p,i)=>upper(p).rotation.x=.15+(i===0?beat(k,.25,1)*.15:0));},crop.poke);
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
  return life(g,[maker],'Çamur şekil alıyor! The clay takes shape.',(t,k)=>{wheel.rotation.y=t*(.6+k*4);pot.scale.set(1-beat(k)*.18,1+beat(k)*.32,1-beat(k)*.18);(pot.material as THREE.MeshStandardMaterial).roughness=.35;(maker.userData.arms as {right:THREE.Group}).right.rotation.x=-.9;});
}
export function turkeyCopper(): P {
  const g=group();roomShell(g,'#c5b491');const smith=add(g,local('#8f694c',{apron:true}),0,.1,-.1),y=table(g,0,1.05,3.6,1.05);
  const dishes=[-1.1,0,1.1].map(x=>{const dish=add(g,cyl(.33,.07,ME.copper),x,y+.035,1.05);dish.userData.foodReaction=false;return dish;});
  const hand=(smith.userData.arms as {right:THREE.Group}).right;
  const hammer=add(g,group(),0,y+.68,1.05);hammer.name='copper-hammer';add(hammer,box(.04,.40,.04,ME.wood),0,0,0);add(hammer,box(.2,.10,.10,'#69665c'),0,-.2,0);
  const ring=add(g,new THREE.Mesh(new THREE.TorusGeometry(.25,.015,5,20),mat('#ffe2a0')),0,y+.075,1.05);ring.rotation.x=Math.PI/2;ring.name='copper-ring';ring.visible=false;
  return life(g,[smith],'Bakır işliyoruz. We are working copper.',(_,k)=>{const strike=beat(k,0,.7);hammer.position.y=y+.68-strike*.36;hand.rotation.x=-.9-beat(k,.2,.85)*.3;ring.visible=strike>.85;ring.scale.setScalar(1+Math.max(0,strike-.85)*2);dishes[1].scale.y=1-strike*.09;dishes[1].position.y=y+.035*dishes[1].scale.y;});
}
export function turkeyFountain(): P {
  const g=iznikFountain(),streams=g.children.filter(o=>o.name==='fountain-stream');
  const rings=[0,1].map(i=>{const r=add(g,new THREE.Mesh(new THREE.TorusGeometry(.07+i*.03,.012,5,24),mat('#d5f0ec')),0,.478,1.17);r.rotation.x=Math.PI/2;r.name='fountain-splash';r.visible=false;return r;});
  let pulse=0;const speech=deferredBubble(g,'Şırıl şırıl… Water in the lane.',2.3,1600);
  g.userData.ownReaction=true;g.userData.poke=()=>{pulse=1;speech.schedule();};
  g.userData.tick=(t,dt)=>{pulse=Math.max(0,pulse-dt);streams.forEach(stream=>{stream.scale.x=stream.scale.z=1+Math.sin(t*7)*.12+pulse*.8;});rings.forEach((r,i)=>{r.visible=pulse>0;r.scale.setScalar(1+(1-pulse)*(1+i*.2));});speech.tick(dt);};return g;
}
Object.assign(TURKEY_PROPS,{turkeyPottery,turkeyCopper,turkeyFountain,turkishCat});

export function turkeyHammam(): P {
  const g=group();g.add(bathhouse());
  const visitor=add(g,local('#637c8c'),-1.5,0,3.3);g.userData.steam=new THREE.Vector3(0,5.25,-.7);
  const steam=Array.from({length:3},(_,i)=>{const m=add(g,ball(.25,'#e2e7df'),(i-1)*.3,5.3,-.7);m.material=(m.material as THREE.MeshStandardMaterial).clone();(m.material as THREE.MeshStandardMaterial).transparent=true;m.visible=false;return m;});
  return life(g,[visitor],'Hoş geldiniz. Welcome to the hammam.',(_,k)=>{steam.forEach((m,i)=>{const p=beat(k);m.visible=k>0;m.position.y=5.3+(1-k)*.8+i*.08;m.scale.setScalar(1+p*1.4);(m.material as THREE.MeshStandardMaterial).opacity=p*.28;});visitor.position.z=3.3-beat(k,.45,1)*.16;});
}
export function turkeyCitrus(): P {
  const g=group(),trees:THREE.Object3D[]=[];
  for(const [col,x] of [-5,-1.7,1.7,5].entries())for(const [row,z] of [-3,0,3].entries()){
    const kind=(col+row)%3===0?'lemon':'orange';
    const scale=1.4+(col+row)%3*.13;
    const fruitTree=add(g,citrusTree(kind,scale),x,0,z);
    fruitTree.name=`orchard-${kind}`;
    trees.push(fruitTree);
    // Larger fruit sits on the outside of the canopy, visible from the street.
    for(const [i,f] of (fruitTree.userData.fruits as THREE.Mesh[]).entries()){
      const dy=(i%3-1)*.33,angle=i*2.4+col+row,radius=(.7*Math.sqrt(1-(dy/.665)**2)+.035)*scale;
      f.position.set(Math.cos(angle)*radius,(1.15+dy)*scale,Math.sin(angle)*radius);
      f.scale.multiplyScalar(1.25);
    }
  }
  const picker=add(g,local('#a97853'),0,0,1.5);
  for(const [i,x] of [-.55,.55].entries()){
    add(g,cyl(.40,.35,'#a37c52'),x,.175,3.8);
    const fruit=add(g,group(),x,.39,3.8);
    for(let j=0;j<7;j++)add(fruit,ball(.13,i?'#e6c94f':'#e49330'),Math.sin(j)*.24,0,Math.cos(j)*.24);
  }
  const crop=harvest(g,[trees[5],trees[8],trees[4]],[new THREE.Vector3(-.55,.44,3.8),new THREE.Vector3(.55,.44,3.8)]);
  return life(g,[picker],'Portakal ve limon! Oranges and lemons!',crop.tick,crop.poke);
}
Object.assign(TURKEY_PROPS,{turkeyHammam,turkeyCitrus});

// ---------- Black Sea corner: three card-only stands so the tea terraces have neighbours that are not food stands ----------

/** A hazel: a low multi-stemmed crown with nuts in pale husks. `crown` and `fruits` follow the orchard convention for harvest(). */
function hazelTree(s=1):P {
  const g=group();
  for(const [dx,dz] of [[0,0],[-.12,.08],[.11,-.07]])add(g,cyl(.05*s,.9*s,'#5e4632'),dx*s,.45*s,dz*s);
  const crown=new THREE.Group();g.add(crown);
  for(const [i,[dx,dy,dz,r]] of ([[0,1.25,0,.62],[-.42,1.05,.1,.42],[.40,1.10,-.12,.44],[.05,.95,.40,.40]] as [number,number,number,number][]).entries()){
    const leaf=add(crown,ball(r*s,i%2?'#4d7a38':'#5c8a44'),dx*s,dy*s,dz*s);leaf.scale.y=.85;
  }
  const fruits:THREE.Mesh[]=[];
  for(let i=0;i<8;i++){
    const a=i*2.4,rr=.56*s,y=(.85+(i%3)*.22)*s;
    add(crown,ball(.075*s,'#9db86a'),Math.cos(a)*rr,y,Math.sin(a)*rr).scale.set(1,1.15,1);
    fruits.push(add(crown,ball(.06*s,'#8a5a2b'),Math.cos(a)*rr,y-.05*s,Math.sin(a)*rr));
  }
  g.userData.crown=crown;g.userData.fruits=fruits;
  return g;
}
/** Giresun-style hazelnut grove: tap it and the nearest trees shake nuts into the pickers' baskets. */
export function turkeyHazelnut():P {
  const g=group(),trees:THREE.Object3D[]=[];
  for(const [i,[x,z]] of ([[-2.4,-1.6],[0,-2.1],[2.4,-1.5],[-1.3,.6],[1.3,.7]] as [number,number][]).entries()){
    const tr=add(g,hazelTree(1.15+(i%3)*.12),x,0,z);tr.name='hazel-tree';tr.rotation.y=i*1.3;trees.push(tr);
  }
  const picker=add(g,local('#8e6b4a',{hijab:'#b9484a'}),.2,0,2.3);picker.rotation.y=Math.PI;
  const baskets:THREE.Vector3[]=[];
  for(const x of [-1.1,1.0]){
    add(g,cyl(.38,.34,'#a37c52'),x,.17,2.9);
    const nuts=add(g,group(),x,.36,2.9);
    for(let j=0;j<9;j++)add(nuts,ball(.07,j%2?'#8a5a2b':'#a06b35'),Math.sin(j*2.1)*.22,(j%3)*.03,Math.cos(j*2.1)*.22);
    baskets.push(new THREE.Vector3(x,.42,2.9));
  }
  // The day's pick dries on a cloth beside the baskets.
  add(g,block(1.6,.02,1.0,'#d9c9a6'),0,.012,3.9);
  for(let j=0;j<14;j++)add(g,ball(.055,'#8a5a2b'),-.6+(j%7)*.2,.06,3.7+Math.floor(j/7)*.35);
  const crop=harvest(g,[trees[1],trees[0],trees[2]],baskets);
  return life(g,[picker],'Fındık toplama zamanı! Hazelnut harvest!',crop.tick,crop.poke);
}
/** Anchovy landing on the shingle: nets drying between poles, an upturned boat, crates of hamsi that leap when tapped. */
export function turkeyHamsi():P {
  const g=group();
  for(const x of [-1.3,1.3])add(g,cyl(.05,2.3,TR.wood),x,1.15,-.6);
  add(g,cyl(.02,2.6,TR.wood),0,2.2,-.6).rotation.z=Math.PI/2;
  // A wireframe net: no transparent surface to sort against the sea behind it.
  const net=add(g,new THREE.Mesh(new THREE.PlaneGeometry(2.4,1.7,10,7),mat('#4a5a5e',{wireframe:true})),0,1.3,-.6);
  for(const [x,y] of [[-.9,1.05],[.7,.95],[-.2,.62]])add(g,ball(.09,'#c9412f'),x,y,-.58);   // cork floats caught in the mesh
  const hull=add(g,ball(.9,'#4c3a2a'),-2.6,.34,.6);hull.scale.set(1.9,.38,.72);hull.rotation.y=.35;
  add(g,block(3.2,.05,.12,'#7a5a3c'),-2.6,.68,.6).rotation.y=.35;                          // the keel of the boat drawn up on the beach
  for(const [x,z] of ([[.2,.9],[1.4,1.1],[.8,1.9]] as [number,number][])){
    add(g,block(1.0,.34,.7,'#a58a62'),x,.17,z);
    for(let j=0;j<10;j++){
      const fish=add(g,ball(.055,j%3?'#c8d0d6':'#9fb1bb'),x-.36+(j%5)*.18,.36+Math.floor(j/5)*.05,z-.15+Math.floor(j/5)*.3);
      fish.scale.set(2.6,.6,.9);fish.rotation.y=(j%2)*.3-.15;
      if(j===2)fish.userData.foodReaction='flip';                                           // one fish per crate leaps and turns
    }
  }
  const fisher=add(g,local('#41546a',{apron:true}),-.6,0,.2);fisher.rotation.y=-.6;
  const boy=add(g,local('#7b8fa3'),2.2,0,.4);boy.scale.setScalar(.72);boy.rotation.y=-2.4;
  return life(g,[fisher,boy],'Hamsi geldi! The anchovies are in!',(t)=>{
    (fisher.userData.arms as {left:THREE.Group}).left.rotation.x=-1.1+Math.sin(t*1.7)*.15;  // hands working along the net
    net.position.y=1.3+Math.sin(t*.9)*.01;
  });
}
/** A kale and maize bed on the wet slope: the heads shiver and a cob drops into the basket when tapped. */
export function turkeyKaleCorn():P {
  const g=group();
  add(g,block(2.8,.12,5.2,'#6b5742'),0,.06,0);
  const heads:THREE.Mesh[]=[];
  for(let row=0;row<4;row++)for(let col=0;col<3;col++){
    const x=-.85+col*.85,z=-1.9+row*.9;
    const head=add(g,ball(.28,row%2?'#3e6b3a':'#4b7a44'),x,.30,z);head.scale.set(1,.7,1);heads.push(head);
    for(let k=0;k<4;k++){const leaf=add(g,ball(.16,'#3a5f36'),x+Math.cos(k*1.6)*.26,.22,z+Math.sin(k*1.6)*.26);leaf.scale.set(1,.35,1.6);leaf.rotation.y=k*1.6;}
  }
  const stalks:THREE.Object3D[]=[];
  for(const [i,x] of [-.9,-.3,.3,.9].entries()){
    const stalk=add(g,group(),x,.12,2.15);const crown=new THREE.Group();stalk.add(crown);
    add(crown,cyl(.035,1.7,'#8faf58'),0,.85,0);
    for(let k=0;k<4;k++){const leaf=add(crown,ball(.28,'#7c9d4c'),Math.cos(k*2.1)*.22,.55+k*.3,Math.sin(k*2.1)*.22);leaf.scale.set(.25,.12,1);leaf.rotation.y=k*2.1;}
    add(crown,cyl(.02,.35,'#d9c48a'),0,1.85,0);
    const cob=add(crown,ball(.075,'#e3c35a'),.10,1.05+(i%2)*.15,.02);cob.scale.set(1,2.4,1);cob.rotation.z=-.3;
    add(crown,ball(.08,'#9db86a'),.10,.95+(i%2)*.15,.02).scale.set(.9,1.6,.9);
    stalk.userData.crown=crown;stalk.userData.fruits=[cob];stalks.push(stalk);
  }
  const gardener=add(g,local('#5d6e5a',{hijab:'#c8a04a'}),1.9,0,.9);gardener.rotation.y=-Math.PI/2;
  add(g,cyl(.36,.32,'#a37c52'),1.9,.16,-.1);
  const greens=add(g,group(),1.9,.34,-.1);for(let j=0;j<5;j++)add(greens,ball(.14,'#4b7a44'),Math.sin(j*2.2)*.16,0,Math.cos(j*2.2)*.16).scale.y=.6;
  const crop=harvest(g,stalks,[new THREE.Vector3(1.9,.42,-.1)]);
  return life(g,[gardener],'Karalahana ve mısır! Kale and corn for the pot.',(t,k,dt)=>{
    crop.tick(t,k,dt);
    heads.forEach((h,i)=>{h.rotation.z=Math.sin(t*1.1+i)*.03+Math.sin(t*17+i)*.06*k;});
  },crop.poke);
}
Object.assign(TURKEY_PROPS,{turkeyHazelnut,turkeyHamsi,turkeyKaleCorn});

/** Small street kitchens react in 3D before opening their food cards. */
function streetKitchen(kind:'doner'|'gozleme'):P {
  const g=group();
  add(g,box(3.2,.1,2.8,TR.stone),0,.05,0);
  for(const x of [-1.45,1.45])add(g,box(.1,2.7,.1,TR.wood),x,1.35,-1.18);
  add(g,box(3.5,.13,2.8,kind==='doner'?TR.red:'#788657'),0,2.76,-.05);
  for(let i=0;i<8;i+=2)add(g,box(.40,.025,2.8,'#e4d4b8'),-1.45+i*.42,2.84,-.05);
  const y=table(g,0,.75,2.8,.8);
  const cook=add(g,local('#dfcfb1',{apron:true}),-1,.1,-.55);
  const food=add(g,group(),.5,y,.75);food.userData.foodReaction=kind==='doner'?'carve':'flip';
  if(kind==='doner'){
    add(g,box(.75,1.7,.18,'#716c60'),.5,1.5,.35);
    add(g,cyl(.06,1.8,ME.copper),.5,y+.9,.75);
    food.name='doner-meat';
    for(let i=0;i<12;i++)add(food,new THREE.Mesh(new THREE.CylinderGeometry(.26+i*.009,.25+i*.009,.10,12),mat(i%2?'#a66543':'#bd8053')),0,.23+i*.1,0);
    bowl(g,-.6,y,.8,'#7b954d');bowl(g,-1.12,y,.8,'#b6553a');
  }else{
    add(g,cyl(.72,.12,'#504b44'),.5,y+.06,.75).name='gozleme-griddle';
    for(const x of [-.29,.29]){const bread=add(food,ball(.3,'#d1aa6e'),x,.15,0);bread.scale.set(1,.1,1.3);}
    bowl(g,-.80,y,.8,'#6a8350');
    const pin=add(g,cyl(.045,.72,TR.wood),-.72,y+.11,.55);pin.rotation.z=Math.PI/2;
  }
  const slice=kind==='doner'?add(g,box(.35,.06,.18,'#b9774d'),.75,y+.8,.75):undefined;
  if(slice){slice.name='doner-slice';slice.visible=false;add(g,ball(.26,'#d7ae6f'),.87,y+.06,.9).scale.set(1,.22,.65);}
  return life(g,[cook],kind==='doner'?'Döner hazır! Thin slices, warm bread.':'Gözleme sıcak! Hot from the griddle.',(t,k)=>{
    if(slice){const p=Math.min(1,(1-k)/.55);slice.visible=k>0;slice.position.set(.75+p*.12,y+.10+(1-p)*(1-p)*.95,.75+p*.15);slice.rotation.z=p*.6;}
    (cook.userData.arms as {right:THREE.Group}).right.rotation.x=-.85+Math.sin(t*1.5)*.13+beat(k,.55,1)*.4;
  });
}
Object.assign(TURKEY_PROPS,{turkeyDoner:()=>streetKitchen('doner'),turkeyGozleme:()=>streetKitchen('gozleme')});
