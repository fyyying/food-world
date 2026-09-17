/** Spain in the Mediterranean world: continuous roads clear of the water, every door on a road, walkers that
 *  cross no wall and no water over 240 simulated seconds, supported bridges and no coplanar overlapping faces. */
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'rolldown';
import * as THREE from 'three';
import { coplanarOverlaps } from './coplanar-surfaces.mjs';
const ctx=new Proxy({}, {get:(_,key)=>key==='createLinearGradient'||key==='createRadialGradient'?()=>({addColorStop(){}}):key==='measureText'?()=>({width:20}):()=>{},set:()=>true});
globalThis.document={visibilityState:'hidden',defaultView:{Element:class {}},createElement:()=>({ownerDocument:document,getContext:()=>ctx,style:{},setAttribute(){},classList:{add(){},remove(){},toggle(){}},addEventListener(){}})};
globalThis.Image=class { complete=true;naturalWidth=24;naturalHeight=14;set src(_){} };

const temp=await mkdtemp(join(tmpdir(),'spain-world-'));
try {
  await build({input:{world:'src/fw/world-med.ts',landscape:'src/fw/spain-landscape.ts',town:'src/fw/spain-town.ts',objects:'src/fw/spain-objects.ts',camera:'src/fw/world-camera.ts'},platform:'node',output:{banner:'import.meta.env={VITE_STATIC:"1",BASE_URL:"/"};',dir:temp,format:'esm',entryFileNames:'[name].mjs',chunkFileNames:'[name].mjs'}});
  const {buildMed}=await import(pathToFileURL(join(temp,'world.mjs')));
  const {SEA_SHORE,seaOutline,offsetOutline,inPolygon,riverOutline,channelOutline,RIVER_POINTS,RIVER_WIDTH,TABLE}=await import(pathToFileURL(join(temp,'landscape.mjs')));
  const {SPAIN_ROADS,SPAIN_BRIDGES,SPAIN_LANES,PLAZA,BRIDGE_SPAN}=await import(pathToFileURL(join(temp,'town.mjs')));
  const {SPAIN_OBJECTS}=await import(pathToFileURL(join(temp,'objects.mjs')));
  const {worldZoomLimit,worldFogRange}=await import(pathToFileURL(join(temp,'camera.mjs')));

  // ---------- the table and the camera ----------
  for(const [w,h] of [[390,844],[430,932],[720,1024],[667,375]]) assert.equal(worldZoomLimit('mediterranean',w,h),90,'phone worlds share one zoom-out limit');
  assert.equal(worldZoomLimit('mediterranean',1280,720),215,'the Mediterranean shares the Middle East desktop overview since Spain grew the table to 120 wide');
  // The overview has to be readable at that limit. Until 2026-09-17 the Mediterranean used the default 90/200
  // haze, so at maximum zoom-out its whole table was past the far plane and came out flat in the paper colour,
  // with only the sea left, because the water shader ignores fog. The far plane is now computed from the limit
  // plus half the table's diagonal.
  const MED_HALF=Math.hypot(120,56)/2, MED_REACH=215+MED_HALF;
  const [fogNear,fogFar]=worldFogRange('mediterranean',1280,720,MED_HALF);
  const haze=d=>Math.min(1,Math.max(0,(d-fogNear)/(fogFar-fogNear)));
  assert.ok(haze(215)<.1,`the table centre at the zoom limit is ${(haze(215)*100).toFixed(0)} percent hazed`);
  assert.ok(haze(MED_REACH)<.4,`the far corner of the table at the zoom limit is ${(haze(MED_REACH)*100).toFixed(0)} percent hazed`);
  assert.deepEqual(worldFogRange('china',1280,720,Math.hypot(112,84)/2),[90,200],'a world inside the old far plane keeps 90 and 200 exactly');
  assert.deepEqual(worldFogRange('mediterranean',390,844,MED_HALF),[90,200],'a phone keeps 90 and 200: its limit is 90');

  // ---------- the sea is one continuous shape with square caps at the table edge ----------
  const sea=seaOutline(), rim=offsetOutline(sea,1.2);
  assert.equal(sea.length,SEA_SHORE.length);
  assert.equal(rim.length,sea.length,'the rim is an inset of the same polygon, vertex by vertex');
  for(const [i,[x,z]] of SEA_SHORE.entries()){
    const [rx,rz]=rim[i];
    if(x<=TABLE.minX||x>=TABLE.maxX) assert.equal(rx,x,'a vertex on the table edge must not move, so the cap stays square');
    if(Math.abs(z)>=TABLE.maxZ) assert.equal(rz,z,'a vertex on the table edge must not move, so the cap stays square');
    assert.ok(Number.isFinite(rx)&&Number.isFinite(rz));
    assert.ok(Math.hypot(rx-sea[i][0],rz-sea[i][1])<=2.5,'the inset must not fly off at a sharp corner');
  }
  for(const [x,z] of rim) assert.ok(!inPolygon(x,z,sea)||Math.abs(x)>=TABLE.maxX,'the rim must lie outside the water');
  assert.equal(RIVER_POINTS[0][1],RIVER_POINTS[1][1],'the river leaves the table edge square');
  assert.equal(RIVER_POINTS[0][0],TABLE.minX);
  const river=riverOutline(), channel=channelOutline();
  const wet=(x,z)=>inPolygon(x,z,sea)||inPolygon(x,z,river)||inPolygon(x,z,channel);

  // ---------- roads: one continuous ribbon each, clear of the water except on a bridge ----------
  const onBridge=(x,z)=>SPAIN_BRIDGES.some(([bx,bz])=>Math.hypot(x-bx,z-bz)<BRIDGE_SPAN/2+1.4);
  const world=buildMed([]); world.group.updateMatrixWorld(true);
  const ribbons=world.group.children.filter(o=>o.isMesh&&o.name==='spanish-road');
  assert.equal(ribbons.length,SPAIN_ROADS.length,'one ribbon per route, never two overlapping strips');
  for(const road of SPAIN_ROADS){
    const mesh=ribbons.find(o=>o.userData.road===road.id);
    assert.ok(mesh,`${road.id}: no ribbon drawn`);
    const pos=mesh.geometry.attributes.position, verts=[];
    for(let i=0;i<pos.count;i++) verts.push([pos.getX(i),pos.getZ(i)]);
    // Every listed point of the route is covered by the one ribbon: the route is not cut into pieces.
    for(const [x,z] of road.points) assert.ok(verts.some(([vx,vz])=>Math.hypot(vx-x,vz-z)<=road.width/2+.35),`${road.id}: the ribbon does not reach [${x}, ${z}]`);
    // Both edges of the drawn surface stay out of the water away from the bridges.
    for(const [vx,vz] of verts){
      if(onBridge(vx,vz))continue;
      assert.ok(!wet(vx,vz),`${road.id}: the road surface reaches water at ${vx.toFixed(1)}, ${vz.toFixed(1)}`);
    }
  }
  // Every route joins the network: each road shares an end with another road or with the square.
  const inSquare=(x,z)=>Math.abs(x-PLAZA.x)<=PLAZA.w/2+1&&Math.abs(z-PLAZA.z)<=PLAZA.d/2+1;
  for(const road of SPAIN_ROADS){
    const ends=[road.points[0],road.points[road.points.length-1]];
    assert.ok(ends.some(([x,z])=>inSquare(x,z)||SPAIN_ROADS.some(other=>other!==road&&other.points.some(([ox,oz])=>Math.hypot(ox-x,oz-z)<1.6))),`${road.id}: is not connected to the rest of the network`);
  }

  // ---------- every object stands on dry land, with a road at its door and a clear pad ----------
  const spain=world.placed.filter(p=>p.obj.area==='spain');
  assert.equal(spain.length,SPAIN_OBJECTS.length,'every Spain object is placed');
  const distToRoute=(x,z,points)=>{let d=1e9;for(let i=0;i<points.length-1;i++){const [ax,az]=points[i],[bx,bz]=points[i+1];const ex=bx-ax,ez=bz-az,l2=ex*ex+ez*ez||1;const t=Math.max(0,Math.min(1,((x-ax)*ex+(z-az)*ez)/l2));d=Math.min(d,Math.hypot(x-ax-ex*t,z-az-ez*t));}return d;};
  // Two rules, because the stands as built are 4 x 4 to 12 x 14 and twenty pairs of them already overlap
  // each other at the blueprint's fixed positions: a footprint-plus-margin pad cannot be kept clear by anyone.
  //  1. the blueprint's 6 x 5 pad at every object position stays free of the Builder's scenery
  //  2. nothing the Builder placed stands inside a stand's own footprint
  const pads=spain.map(p=>{
    p.group.updateMatrixWorld(true);
    const b=new THREE.Box3().setFromObject(p.group), [x,z]=p.obj.pos;
    return {id:p.obj.id,x,z,minX:x-3,maxX:x+3,minZ:z-2.5,maxZ:z+2.5,
      foot:Number.isFinite(b.min.x)?{minX:b.min.x,maxX:b.max.x,minZ:b.min.z,maxZ:b.max.z}:null};
  });
  for(const p of spain){
    const [x,z]=p.obj.pos;
    assert.ok(!wet(x,z),`${p.obj.id}: stands in water`);
    for(let dx=-1.4;dx<=1.4;dx+=.35)for(let dz=-1.2;dz<=1.2;dz+=.3)
      assert.ok(!wet(x+dx,z+dz),`${p.obj.id}: its footprint reaches water at ${(x+dx).toFixed(1)}, ${(z+dz).toFixed(1)}`);
    const door=Math.min(inSquare(x,z)?0:1e9,...SPAIN_ROADS.map(r=>distToRoute(x,z,r.points)-r.width/2));
    assert.ok(door<=2.6,`${p.obj.id}: no road at its door (${door.toFixed(1)} away)`);
  }
  // ---------- nothing a stand is made of stands in water ----------
  // The anchor and a 2.8 by 2.4 footprint are not enough: the trencadis terrace and the pulperia arcade both
  // passed them while ninety-three meshes hung over the strait and three arches hung over the ria. Every vertex
  // of every stand is tested against the sea, the river and the acequia. The one exemption is the fishing port,
  // whose three boats are moored in the bay and belong on the water; nothing else may touch it.
  const MOORED=new Set(['fishMed']);
  const waterEdge=(x,z)=>{let d=1e9;for(const poly of [sea,river,channel])for(let i=0,j=poly.length-1;i<poly.length;j=i++){const [ax,az]=poly[j],[bx,bz]=poly[i];const ex=bx-ax,ez=bz-az,l2=ex*ex+ez*ez||1;const t=Math.max(0,Math.min(1,((x-ax)*ex+(z-az)*ez)/l2));d=Math.min(d,Math.hypot(x-ax-ex*t,z-az-ez*t));}return d;};
  const vertex=new THREE.Vector3(), meshBox=new THREE.Box3();
  for(const p of spain){
    if(MOORED.has(p.obj.id))continue;
    p.group.updateMatrixWorld(true);
    let over=null, margin=Infinity;
    p.group.traverse(o=>{
      if(!o.isMesh)return;
      meshBox.setFromObject(o);
      const cx=(meshBox.min.x+meshBox.max.x)/2, cz=(meshBox.min.z+meshBox.max.z)/2;
      // only meshes near the shore are worth a vertex pass; the rest of the area is nowhere near water
      const near=[[meshBox.min.x,meshBox.min.z],[meshBox.min.x,meshBox.max.z],[meshBox.max.x,meshBox.min.z],[meshBox.max.x,meshBox.max.z]].some(([x,z])=>wet(x,z))||wet(cx,cz)||waterEdge(cx,cz)<4;
      if(!near)return;
      const pos=o.geometry.attributes.position; if(!pos)return;
      for(let i=0;i<pos.count;i++){
        vertex.fromBufferAttribute(pos,i).applyMatrix4(o.matrixWorld);
        if(wet(vertex.x,vertex.z)){if(!over)over=`${o.name||o.parent?.name||'a mesh'} at ${vertex.x.toFixed(1)}, ${vertex.z.toFixed(1)}`;}
        else margin=Math.min(margin,waterEdge(vertex.x,vertex.z));
      }
    });
    assert.ok(!over,`${p.obj.id}: ${over} hangs over the water`);
    // The two the Stage E review caught keep a whole unit of dry ground under their outermost geometry.
    if(p.obj.id==='gaudiEs'||p.obj.id==='pulpoEs') assert.ok(margin>=1,`${p.obj.id}: its footprint comes within ${margin.toFixed(2)} of the shore, not the 1.0 the review asks for`);
  }

  const placedGroups=new Set(world.placed.map(p=>p.group));
  const decor=[];
  for(const root of world.group.children){
    if(placedGroups.has(root)||root.isSprite)continue;
    if(/^(spanish-walker|spanish-mule|mule-lead|spanish-neighbour|spanish-road|spanish-bridge|sea|sea-rim|river|irrigation-channel|raised-terrain|terrace-stairs|explore-cue|acequia-bund)$/.test(root.name||''))continue;
    if(/paving$/.test(root.name||''))continue;
    if(root.position.x<-82||root.position.x>-18||root.position.z<-27||root.position.z>27)continue;
    root.updateMatrixWorld(true);
    let box=null;
    root.traverse(o=>{
      if(!o.isMesh||o.isSprite)return;
      if(o.material&&(o.material.visible===false||o.material.opacity===0))return;   // click boxes and hidden rings are not scenery
      o.geometry.computeBoundingBox();
      const b=o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld);
      if(b.max.y<.35)return;   // ground dressing blocks nothing
      box=box?box.union(b):b;
    });
    if(box) decor.push({b:box,name:root.name||'scenery',x:root.position.x,z:root.position.z});
  }
  const blocked=new Set(), inside=new Set();
  for(const pad of pads) for(const d of decor){
    if(d.b.min.x<pad.maxX&&d.b.max.x>pad.minX&&d.b.min.z<pad.maxZ&&d.b.max.z>pad.minZ) blocked.add(`${pad.id}: ${d.name} at ${d.x.toFixed(1)}, ${d.z.toFixed(1)}`);
    if(pad.foot&&d.x>pad.foot.minX&&d.x<pad.foot.maxX&&d.z>pad.foot.minZ&&d.z<pad.foot.maxZ) inside.add(`${pad.id}: ${d.name} at ${d.x.toFixed(1)}, ${d.z.toFixed(1)}`);
  }
  assert.deepEqual([...blocked],[],"a stand's 6 x 5 pad is blocked by scenery");
  assert.deepEqual([...inside],[],'scenery stands inside a stand footprint');

  // ---------- nothing a visitor walks into: the lanes stay open and every stand keeps its approach ----------
  // Owner feedback, 2026-09-16: "wherever is explorable they are covered by other houses, can't walk into the
  // lane". An arcade is walked through, so it is exempt; a house, a farm building, the statue, a fountain or a
  // tree trunk is not. Both checks read the built world, so moving a house back onto a lane fails here.
  // A bridge deck is walked over; nothing else the Builder places may stand on a lane. The four free-standing
  // plaza arcades were the other exemption until 2026-09-16, when the owner had them removed.
  const WALK_THROUGH=/^(spanish-bridge)$/;
  const solidDecor=decor.filter(d=>!WALK_THROUGH.test(d.name));
  const onRoad=new Set();
  for(const road of SPAIN_ROADS){
    for(let i=0;i<road.points.length-1;i++){
      const [ax,az]=road.points[i],[bx,bz]=road.points[i+1];
      const steps=Math.max(1,Math.ceil(Math.hypot(bx-ax,bz-az)*4));
      for(let k=0;k<=steps;k++){
        const x=ax+(bx-ax)*k/steps, z=az+(bz-az)*k/steps;
        for(const d of solidDecor) if(x>d.b.min.x&&x<d.b.max.x&&z>d.b.min.z&&z<d.b.max.z)
          onRoad.add(`${road.id} at ${x.toFixed(1)}, ${z.toFixed(1)}: inside ${d.name} [${d.x.toFixed(1)}, ${d.z.toFixed(1)}]`);
      }
    }
  }
  assert.deepEqual([...onRoad],[],'something stands on a Spanish road');
  // Every stand has an open walk from the nearest road to its door: nothing solid on the way, and 2.5 clear
  // in front of it. The corridor is sampled from the stand position to the closest point on the road network.
  const nearestRoadPoint=(x,z)=>{
    let best=null,bd=1e9;
    for(const road of SPAIN_ROADS) for(let i=0;i<road.points.length-1;i++){
      const [ax,az]=road.points[i],[bx,bz]=road.points[i+1];
      const ex=bx-ax,ez=bz-az,l2=ex*ex+ez*ez||1;
      const t=Math.max(0,Math.min(1,((x-ax)*ex+(z-az)*ez)/l2));
      const px=ax+ex*t,pz=az+ez*t,d=Math.hypot(x-px,z-pz);
      if(d<bd){bd=d;best=[px,pz];}
    }
    return best;
  };
  const shut=new Set();
  for(const p of spain){
    const [x,z]=p.obj.pos, [rx,rz]=nearestRoadPoint(x,z);
    const steps=Math.max(1,Math.ceil(Math.hypot(rx-x,rz-z)*4));
    for(let k=0;k<=steps;k++){
      const sx=x+(rx-x)*k/steps, sz=z+(rz-z)*k/steps;
      for(const d of solidDecor) if(sx>d.b.min.x&&sx<d.b.max.x&&sz>d.b.min.z&&sz<d.b.max.z)
        shut.add(`${p.obj.id}: ${d.name} [${d.x.toFixed(1)}, ${d.z.toFixed(1)}] stands in the approach from the road`);
    }
    for(const d of solidDecor){
      const gx=Math.max(d.b.min.x-x,0,x-d.b.max.x), gz=Math.max(d.b.min.z-z,0,z-d.b.max.z);
      if(Math.hypot(gx,gz)<2.5) shut.add(`${p.obj.id}: ${d.name} [${d.x.toFixed(1)}, ${d.z.toFixed(1)}] is ${Math.hypot(gx,gz).toFixed(2)} from the stand, under the 2.5 the approach needs`);
    }
  }
  assert.deepEqual([...shut],[],'a stand has no open approach from a road');

  // ---------- nothing decorative stands between a stand and the camera ----------
  // Owner feedback, 2026-09-17: "the houses are still too crowded, there should be no house in front of a
  // clickable object". The 2026-09-16 pass only tested the single line from the arrival camera to a stand,
  // which is a ray; five stands were still hidden behind something a hand's width off that ray.
  //
  // Where the camera is. main.ts drops the visitor into the Mediterranean at the target plus (2, 48, 60) and
  // every later move keeps that offset direction: glideTo copies the current offset, a pan carries camera and
  // target together and a zoom only changes its length. So the camera always looks from azimuth
  // atan2(2, 60) = 0.033 rad, 38.7 degrees above the ground: from the south, give or take two degrees. The
  // visitor may swing it, but not freely: configureControls clamps the world azimuth to -0.75 .. +0.75 rad,
  // an 86-degree fan. The wedge is that fan plus seven degrees either side for the width of the obstacle
  // itself: 100 degrees centred on the direction from the stand to the default camera, out to 9 units.
  const CAM_AZIMUTH=Math.atan2(2,60), TO_CAMERA=[Math.sin(CAM_AZIMUTH),Math.cos(CAM_AZIMUTH)];
  const WEDGE_COS=Math.cos(Math.PI*100/360);
  // A lamp post, a sluice post or a bunch of reeds is under .6 of a unit across either way. At this camera
  // pitch it hides nothing, so a slender thing is exempt and the square keeps its light on the ground.
  const slender=d=>(d.b.max.x-d.b.min.x)<.6&&(d.b.max.z-d.b.min.z)<.6;
  // A building hides a stand at any height: a house, the Basque farmhouse, a walled pen, the statue's plinth
  // and horse, an arcade if one ever comes back. So does anything else over two units tall, which is the
  // Builder's definition of a big tree.
  const BUILDING=/^(spanish-house|baserri|dehesa-pen|plaza-arcade|plaza-statue)$/;
  const wedgeReach=(sx,sz,d)=>{
    let near=Infinity;
    for(const x of [d.b.min.x,(d.b.min.x+d.b.max.x)/2,d.b.max.x])
      for(const z of [d.b.min.z,(d.b.min.z+d.b.max.z)/2,d.b.max.z]){
        const vx=x-sx,vz=z-sz,l=Math.hypot(vx,vz);
        if(l<1e-6) return 0;
        if((vx*TO_CAMERA[0]+vz*TO_CAMERA[1])/l>=WEDGE_COS) near=Math.min(near,l);
      }
    return near;
  };
  const hiding=new Set();
  for(const p of spain){
    const [x,z]=p.obj.pos;
    for(const d of solidDecor){
      if(slender(d))continue;
      const near=wedgeReach(x,z,d);
      if(!Number.isFinite(near))continue;
      if(BUILDING.test(d.name)||d.b.max.y>2){
        if(near<=9) hiding.add(`${p.obj.id}: ${d.name} [${d.x.toFixed(1)}, ${d.z.toFixed(1)}] stands ${near.toFixed(1)} in front of it, ${d.b.max.y.toFixed(1)} tall`);
      } else if(d.b.max.y>1.2&&near<=5) hiding.add(`${p.obj.id}: ${d.name} [${d.x.toFixed(1)}, ${d.z.toFixed(1)}] is ${near.toFixed(1)} in front of it and ${d.b.max.y.toFixed(1)} tall`);
    }
  }
  assert.deepEqual([...hiding],[],'something decorative stands between a stand and the camera');

  // ---------- and no stand stands in front of another stand ----------
  // Owner feedback, 2026-09-17: the rule is that every clickable object is visible from the camera, so a stand
  // that hides another stand fails exactly as a house does. A wedge cannot express this one: the stands as
  // built are 4 x 4 to 12 x 14 and neighbours inside a cluster are five to eight units apart, so every pair
  // would be inside every other pair's wedge. What the owner actually sees is settled by occlusion, so that is
  // what is measured: ten rays per stand along the arrival direction, nine at its camera-facing front face at
  // three heights and one at the diamond cue over its anchor, and the first stand each ray meets must be the
  // stand itself. This is the same test the Builder runs in the browser against the live page.
  const CAM_RAY=new THREE.Vector3(2,48,60).normalize();
  const ownerOf=new Map();
  const standMeshes=[];
  for(const p of spain){
    p.group.updateMatrixWorld(true);
    p.group.traverse(o=>{
      if(!o.isMesh||o.isSprite||!o.geometry)return;
      if(o.material&&(o.material.visible===false||o.material.opacity===0))return;
      ownerOf.set(o,p.obj.id); standMeshes.push(o);
    });
  }
  const ray=new THREE.Raycaster(); ray.far=400;
  const back=CAM_RAY.clone().multiplyScalar(70), into=CAM_RAY.clone().negate();
  const covered=[];
  for(const p of spain){
    const b=new THREE.Box3().setFromObject(p.group);
    const floor=Math.max(b.min.y,0), [sx,sz]=p.obj.pos, aim=[];
    for(const fx of [.2,.5,.8]) for(const dy of [.8,1.5,2.2]) aim.push(new THREE.Vector3(b.min.x+(b.max.x-b.min.x)*fx, floor+dy, b.max.z-.2));
    aim.push(new THREE.Vector3(sx,b.max.y+.7,sz));
    const by={};
    for(const t of aim){
      ray.set(t.clone().add(back),into);
      const hit=ray.intersectObjects(standMeshes,false).find(h=>h.distance<69.8);
      if(!hit)continue;
      const id=ownerOf.get(hit.object);
      if(id!==p.obj.id) by[id]=(by[id]||0)+1;
    }
    for(const [id,n] of Object.entries(by)) covered.push(`${p.obj.id}: ${id} covers it on ${n} of 10 rays from the camera`);
  }
  assert.deepEqual(covered,[],'a stand stands in front of another stand');

  // ---------- the bridges carry the lanes over the river ----------
  const bridges=world.group.children.filter(o=>o.name==='spanish-bridge');
  assert.equal(bridges.length,SPAIN_BRIDGES.length);
  for(const b of bridges){
    assert.deepEqual(coplanarOverlaps(b),[],'bridge faces overlap on the same plane');
    const box=new THREE.Box3().setFromObject(b);
    assert.ok(box.min.y<=.01,'the bridge must reach the bank');
    assert.ok(box.max.z-box.min.z>=BRIDGE_SPAN-.2,'the deck must span the water');
  }
  // Buildings must not stand inside one another. A crown or an eave that reaches over its neighbour is allowed;
  // an overlap of more than 1.2 units in both directions is one solid inside another.
  const solids=decor.filter(d=>/^(plaza-statue|spanish-house|baserri|dehesa-pen|patio-fountain|valencia-fountain|ria-fountain|spanish-bridge)$/.test(d.name));
  const clashes=new Set();
  for(let i=0;i<solids.length;i++)for(let j=i+1;j<solids.length;j++){
    const a=solids[i].b,b=solids[j].b;
    const ox=Math.min(a.max.x,b.max.x)-Math.max(a.min.x,b.min.x), oz=Math.min(a.max.z,b.max.z)-Math.max(a.min.z,b.min.z);
    if(ox>1.2&&oz>1.2) clashes.add(`${solids[i].name} [${solids[i].x.toFixed(1)}, ${solids[i].z.toFixed(1)}] inside ${solids[j].name} [${solids[j].x.toFixed(1)}, ${solids[j].z.toFixed(1)}]`);
  }
  assert.deepEqual([...clashes],[],'two Spanish buildings stand in the same place');
  for(const name of ['plaza-statue','plaza-lamp','dehesa-pen','threshing-floor','apple-tree','granite-outcrop','olive-terrace-tree','dehesa-oak','saffron-flower','north-broadleaf','sandbar-pine'])
    assert.ok(world.group.getObjectByName(name),`${name}: missing from the Spanish land`);
  // Removed on the owner's word, 2026-09-16, and kept removed: the four free-standing arcades that ringed the
  // square (a tan slab on grey piers, read from above as a bridge half in the water), the barraca in the rice
  // fields and the horreo over the ria. The pulperia's arcade is part of a stand and is not touched here.
  // Removed on the owner's word and kept removed: the barraca in the rice fields and the horreo over the ria
  // (2026-09-16), the four free-standing plaza arcades (2026-09-16), and the Basque farmhouse, which stood in
  // front of four clickable objects at once (2026-09-17).
  for(const gone of ['plaza-arcade','barraca','horreo','baserri'])
    assert.equal(world.group.getObjectByName(gone),undefined,`${gone}: the owner asked for this to be gone`);
  // Owner feedback, 2026-09-16 and again 2026-09-17: twenty-four decorative houses hemmed the stands in, then
  // fourteen still did. The wedge rule above decides where a house may stand at all, and on this table it
  // leaves room for five: one Valencian, one Andalusian, one Manchegan, one Galician, one Catalan. Castile has
  // none, because the Plaza Mayor's four stands and its statue leave no wedge-free ground inside the square or
  // on any of its four sides. The cap is bounded at both ends so nobody quietly refills the clusters, and the
  // styles that are left are named so nobody quietly drops the last house of a region. See the quality
  // baseline for the numbers and docs/spain-world.md for why each one went.
  const houses=world.group.children.filter(o=>o.name==='spanish-house');
  assert.ok(houses.length>=5&&houses.length<=8,`the wedge rule leaves room for five to eight houses, found ${houses.length}`);
  const styles=new Set(houses.map(o=>o.userData.houseStyle));
  for(const style of ['valencian','andalus','mancha','galician','catalan']) assert.ok(styles.has(style),`${style}: no house in that style`);
  assert.ok(!styles.has('castile'),'a Castilian house is back in the Plaza Mayor: check it against the wedge rule first');
  for(const style of styles){
    const n=houses.filter(o=>o.userData.houseStyle===style).length;
    assert.ok(n>=1&&n<=2,`${style}: ${n} houses, a cluster wants one or two`);
  }
  // The lamps hung under the arcade beams; with the arcades gone they stand on iron posts, so each one must
  // still reach the ground rather than float where its beam used to be.
  const lamps=world.group.children.filter(o=>o.name==='plaza-lamp');
  assert.ok(lamps.length>=4,'the square needs its lamps');
  for(const lamp of lamps){
    const b=new THREE.Box3().setFromObject(lamp);
    assert.ok(b.min.y<=.02,`a square lamp starts at ${b.min.y.toFixed(2)}, not on the ground`);
    assert.ok(b.max.y>=2.2,'a square lamp must carry its lantern above head height');
  }
  // Owner feedback, 2026-09-16: the houses wanted smoke. Every style with a kitchen chimney publishes a
  // userData.smoke point at its top, and the world assembler turns each into four drifting puffs. Four sprites
  // per source is the assembler's own arithmetic, so this fails if a decor anchor stops being collected.
  const smoking=houses.filter(o=>o.userData.smoke);
  assert.ok(smoking.length>=houses.length/2,`about half the houses should smoke, ${smoking.length} of ${houses.length} do`);
  for(const h of smoking){
    assert.ok(['castile','galician','andalus','mancha','basque'].includes(h.userData.houseStyle),`${h.userData.houseStyle}: a chimney where the style has none`);
    const box=new THREE.Box3().setFromObject(h);
    const top=h.localToWorld(h.userData.smoke.clone());
    // The anchor must be the highest point of the house and clear of it: the first pass put it below the
    // Galician ridge, where the puffs were born inside the slate and the owner saw no smoke at all.
    assert.ok(top.y>=box.max.y-.35,`${h.userData.houseStyle}: the smoke starts ${(box.max.y-top.y).toFixed(2)} below the roof line`);
    assert.ok(top.y<box.max.y+.6,'the smoke must leave the chimney cap, not hang over the house');
    assert.equal(h.userData.smokeTint,'#b5aea3','a chimney is wood-smoke grey-white, at the same size and opacity as a stand\'s steam');
  }
  const sprites=world.group.children.filter(o=>o.isSprite).length;
  assert.ok(sprites>=smoking.length*4,`the world must collect every chimney: ${sprites} puff sprites for ${smoking.length} smoking houses and the stands' own steam`);

  // ---------- residents: eight profiles, women, children, distinct paces ----------
  const walkers=world.group.children.filter(o=>o.name==='spanish-walker');
  assert.equal(walkers.length,SPAIN_LANES.reduce((n,l)=>n+l.walkers,0));
  assert.ok(walkers.length>=20,'Spain needs four peopled loops');
  const residents=[];world.group.traverse(o=>{if(o.userData.spanishResident)residents.push(o)});
  assert.ok(new Set(residents.map(o=>o.userData.profile)).size>=6,'street clothing needs distinct silhouettes');
  assert.ok(new Set(residents.map(o=>o.userData.pace)).size>=5,'residents need different paces');
  assert.ok(residents.some(o=>o.userData.woman),'women walk the lanes');
  assert.ok(residents.some(o=>o.userData.child),'children walk the lanes');
  assert.ok(walkers.some(o=>o.userData.profile==='galician'),'the Galician end needs its rush capes');
  assert.equal(world.group.children.filter(o=>o.name==='spanish-mule').length,1);

  // ---------- 240 simulated seconds: walkers stay on the ground, out of water and out of walls ----------
  const obstacles=[];
  for(const root of world.group.children){
    if(root.name==='spanish-walker'||root.name==='spanish-mule'||root.name==='mule-lead'||root.name==='spanish-neighbour'||root.name==='spanish-bridge')continue;
    if(root.userData.placed||placedGroups.has(root))continue;   // a stand's box holds its own people and awnings; prop-supports.mjs owns it
    root.traverse(o=>{
      if(!o.isMesh||o.material?.visible===false||o.material?.opacity===0)return;
      o.geometry.computeBoundingBox();
      const b=o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld);
      if(b.max.y>.30&&b.min.y<1.35&&b.min.x>-84&&b.max.x<0) obstacles.push({b,owner:`${root.name||'scenery'} [${b.min.x.toFixed(1)}..${b.max.x.toFixed(1)}, ${b.min.z.toFixed(1)}..${b.max.z.toFixed(1)}]`});
    });
  }
  // Only the Builder's own people: the residents inside a stand belong to prop-supports.mjs.
  const own=world.group.children.filter(o=>o.userData.spanishResident&&o.userData.tick);
  const collisions=new Set(), gait=new Map(own.map(o=>[o,{last:o.position.clone(),stopped:0,walking:0,paused:0}]));
  // Owner feedback, 2026-09-16: "some people are moving without moving legs". Every figure on the table that
  // carries a leg rig is watched here, the Builder's walkers, the stands' own people and the sailors on the
  // sea alike: if its world position travels, its thighs must swing. A seated figure may travel (it is being
  // carried); a figure that never travels may keep its legs still. Ten paced walkers and three standing
  // sailors failed this when it was written.
  const rigged=[];
  world.group.traverse(o=>{ if(o.userData?.legs?.left?.thigh) rigged.push(o); });
  assert.ok(rigged.length>=150,`the table should be peopled, found ${rigged.length} leg rigs`);
  const label=o=>{ let p=o,trail=[]; while(p){ const pl=world.placed.find(x=>x.group===p); if(pl) return `${pl.obj.id} (${trail.join('/')||'figure'})`; if(p.name) trail.push(p.name); p=p.parent; } return trail.join('/')||`figure at ${o.position.x.toFixed(1)}, ${o.position.z.toFixed(1)}`; };
  const strides=rigged.map(o=>({o,name:label(o),seated:Boolean(o.userData.seated||o.userData.seatTop),travelled:0,swung:0,prev:null,prevLeg:0}));
  const here=new THREE.Vector3();
  for(let frame=0;frame<1200;frame++){
    world.tick(frame*.2,.2); world.group.updateMatrixWorld(true);
    for(const s of strides){
      s.o.getWorldPosition(here);
      const leg=s.o.userData.legs.left.thigh.rotation.x;
      if(s.prev){ s.travelled+=Math.hypot(here.x-s.prev.x,here.z-s.prev.z); s.swung+=Math.abs(leg-s.prevLeg); }
      s.prev=here.clone(); s.prevLeg=leg;
    }
    for(const w of walkers){
      assert.ok(w.position.y>=.033&&w.position.y<=.26,'a walker left the ground');
      assert.ok(!wet(w.position.x,w.position.z)||onBridge(w.position.x,w.position.z),`walker ${w.userData.lane} is in the water`);
      for(const {b,owner} of obstacles) if(w.position.x>b.min.x-.38&&w.position.x<b.max.x+.38&&w.position.z>b.min.z-.38&&w.position.z<b.max.z+.38) collisions.add(`${w.userData.lane}: ${owner}`);
    }
    const mule=world.group.children.find(o=>o.name==='spanish-mule');
    assert.ok(!wet(mule.position.x,mule.position.z),`the mule is in the water at ${mule.position.x.toFixed(1)}, ${mule.position.z.toFixed(1)}`);
    for(const [o,sample] of gait){
      const moved=o.position.distanceTo(sample.last); sample.last.copy(o.position);
      sample.stopped=moved<1e-7?sample.stopped+1:0;
      if(frame>1&&sample.stopped>=2){
        sample.paused++;
        for(const leg of Object.values(o.userData.legs)) assert.ok(Math.abs(leg.thigh.rotation.x)<1e-8&&Math.abs(leg.shin.rotation.x)<1e-8,'a paused resident is still stepping');
      } else if(frame>1&&moved>.01){ sample.walking++; assert.ok(o.userData.isWalking,'a moving resident has a frozen gait'); }
      const shoes=Object.values(o.userData.legs).map(l=>l.shin.children.find(c=>c.isMesh&&c.geometry.type==='BoxGeometry'));
      const soles=shoes.map(shoe=>{shoe.geometry.computeBoundingBox();return shoe.geometry.boundingBox.clone().applyMatrix4(shoe.matrixWorld).min.y;});
      const floor=o.position.clone().set(0,0,0).applyMatrix4(o.matrixWorld).y;
      assert.ok(Math.abs(Math.min(...soles)-floor)<1e-6,'resident shoes lost contact with their walking surface');
    }
  }
  assert.deepEqual([...collisions],[],'a Spanish walking route intersects an object at body height');
  for(const w of walkers){const sample=gait.get(w);assert.ok(sample.walking>0&&sample.paused>0,`${w.userData.lane}: a resident must both walk and stop`);}
  // ---------- the olive mill's mule leads with its head, and its hooves go backward while they are down ----------
  // Owner feedback, 2026-09-16: "the cow is walking backward pulling the grind". Two faults in one: the mule was
  // placed opposite the mill beam and turned the other way, so it circled the stone tail first, and its legs
  // swung on a symmetrical sine, which reads as a figure sliding rather than stepping. Both are checked here on
  // a fine time step, because the 0.2 s frames above sample barely five points per stride.
  {
    const mill=world.placed.find(p=>p.obj.id==='oliveEs').group;
    const mule=mill.getObjectByName('mill-mule');
    assert.ok(mule,'the olive mill needs its mule');
    const leg=mule.getObjectByName('mill-mule-leg');
    assert.ok(leg,'the mule needs a named leg to read its gait from');
    const facing=new THREE.Vector3(), was=new THREE.Vector3(), now=new THREE.Vector3(), travel=new THREE.Vector3(), turn=new THREE.Quaternion();
    let worst=1, back=0, forward=0, covered=0, hoofWas=null;
    mule.getWorldPosition(was);
    for(let f=0;f<900;f++){
      world.tick(400+f/60,1/60); world.group.updateMatrixWorld(true);
      mule.getWorldPosition(now); travel.subVectors(now,was); was.copy(now);
      const gone=travel.length();
      if(gone>1e-5){
        covered+=gone;
        facing.set(1,0,0).applyQuaternion(mule.getWorldQuaternion(turn)).normalize();
        worst=Math.min(worst,facing.dot(travel.normalize()));
      }
      // How far the hoof is along the mule's own forward axis: the leg hinges about z, so sin(z) is that offset.
      const hoof=Math.sin(leg.rotation.z);
      if(hoofWas!==null){ if(hoof<hoofWas-1e-9) back++; else if(hoof>hoofWas+1e-9) forward++; }
      hoofWas=hoof;
    }
    assert.ok(covered>2,`the mill mule should walk its circle, it covered ${covered.toFixed(2)}`);
    assert.ok(worst>.9,`the mill mule walks backward: its head axis scores ${worst.toFixed(2)} against its direction of travel`);
    assert.ok(back>forward*1.3,`the mill mule's hooves go forward as often as back (${back} back, ${forward} forward): the gait reads as sliding, not stepping`);
  }

  const sliding=strides.filter(s=>!s.seated&&s.travelled>1&&s.swung<1e-6).map(s=>`${s.name} covered ${s.travelled.toFixed(1)} with its legs locked`);
  assert.deepEqual(sliding,[],'a figure travels across the table without stepping');
  const marching=strides.filter(s=>s.travelled<=.05&&s.swung>.05).map(s=>`${s.name} swung its legs ${s.swung.toFixed(2)} while standing still`);
  assert.deepEqual(marching,[],'a figure steps on the spot');
  console.log(`PASS: ${SPAIN_ROADS.length} continuous roads, ${spain.length} stands with no mesh over water, ${walkers.length} walkers, ${bridges.length} bridges, 240 seconds of motion.`);
}finally{await rm(temp,{recursive:true,force:true})}
