/** Britain on the grown Central Europe table: one sea polygon with the island as its hole, square caps at the
 *  table edge, a strait that stays four units wide, the island river running from a tarn to its estuary, nine
 *  continuous roads clear of the water, every door on a road, a clear 2.5 corridor in front of every
 *  clickable, ten-ray visibility along the arrival direction, footprint clearance, walkers that cross no wall
 *  and no water over 240 simulated seconds, a pit pony that leads with its head, and the decor the blueprint
 *  retired staying gone.
 *
 *  A word on the object list and the stands. `graph.ts` is the Lead's file and is registered at Stage D, so at
 *  Stage C the built world does not yet carry the twenty-nine British objects: it still carries the seven old
 *  London objects at their pre-growth positions on the continent. The harness therefore takes the list from
 *  `london-objects.ts`, which is the shared contract.
 *
 *  `props-london.ts` is the Stand maker's file and did not exist when this was written, so every check that
 *  needs a stand's real geometry — its vertices against the water, stand-on-stand visibility, stand-on-stand
 *  footprint clearance — is reported as **NOT RUN** rather than skipped silently, and the object is stood in
 *  for by a 2.4 x 2.6 x 2.0 proxy box at its own position for the checks that only need somewhere to aim a
 *  ray. The moment that file lands, `STANDS` below finds it and every one of those checks runs for real.
 */
import assert from 'node:assert/strict';
import { mkdtemp, rm, readFile, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'rolldown';
import * as THREE from 'three';
import { coplanarOverlaps } from './coplanar-surfaces.mjs';
const ctx=new Proxy({}, {get:(_,key)=>key==='createLinearGradient'||key==='createRadialGradient'?()=>({addColorStop(){}}):key==='measureText'?()=>({width:20}):()=>{},set:()=>true});
globalThis.document={visibilityState:'hidden',defaultView:{Element:class {}},createElement:()=>({ownerDocument:document,getContext:()=>ctx,style:{},setAttribute(){},classList:{add(){},remove(){},toggle(){}},addEventListener(){}})};
globalThis.Image=class { complete=true;naturalWidth=24;naturalHeight=14;set src(_){} };

const has=async p=>{try{await access(p);return true;}catch{return false;}};
const PROPS_FILE='src/fw/props-london.ts', HAS_PROPS=await has(PROPS_FILE);
const notRun=[];
const measured={overWater:{},hidden:{},crowded:{}};

/** Ceilings, not licences. Each of the three tables below was measured on 2026-09-22 against
 *  `london-objects.ts` (the Researcher's fixed positions) and `props-london.ts` (the Stand maker's sizes).
 *  The Builder owns neither end of any of them: closing one is a re-blueprint or a stand resize, and the
 *  Stage C report names every entry to the lead. A listed entry may not get worse, and an unlisted one may
 *  not appear. `LONDON_DUMP=1 node scripts/tests/london-world.mjs` prints the current measurements.
 *
 *  Re-measured at Stage D (2026-09-22) after every rotation in `london-objects.ts` was brought inside the
 *  camera's swing, [-0.75, 0.75], and again after the shared-ground pass (2026-09-23), which moved the stands
 *  instead of turning them: every stand-on-stand ray and every crowded footprint is closed, so those two
 *  tables are empty and any entry that appears is a failure. docs/london-world.md, "Shared-ground pass". */
/** Vertices of a stand over water. `forthBridge` is by design: its own firth plate and span reach over the
 *  Firth of Forth it crosses. Every other stand is dry. */
const OVER_WATER={};
/** 'a<b': stand b is the first thing on n of stand a's ten arrival rays. None since 2026-09-23. */
const HIDDEN={};
/** Footprint overlap in units, positive for an overlap, for pairs under a unit apart. None since 2026-09-23. */
const CROWDED={};

/** China's gap between two areas' footprint hulls that are parted by landscape: Sichuan and Xinjiang, the owner's
 *  example ("China has a clear area for Sichuan, separated by mountains from Xinjiang"), measured on 2026-09-24 with
 *  the same hull as the check below over the props as built by `world-china.ts` (docs/london-world.md, "UK re-lay"). */
const CHINA_GAP=14.97;
const temp=await mkdtemp(join(tmpdir(),'london-world-'));
try {
  await build({input:{
    world:'src/fw/world-ceurope.ts', landscape:'src/fw/london-landscape.ts', town:'src/fw/london-town.ts',
    objects:'src/fw/london-objects.ts', camera:'src/fw/world-camera.ts', warp:'src/fw/london-warp.ts', graph:'src/fw/graph.ts',
    ...(HAS_PROPS?{props:PROPS_FILE}:{}),
  },platform:'node',output:{banner:'import.meta.env={VITE_STATIC:"1",BASE_URL:"/"};',dir:temp,format:'esm',entryFileNames:'[name].mjs',chunkFileNames:'[name].mjs'}});
  const {buildCeurope}=await import(pathToFileURL(join(temp,'world.mjs')));
  const L=await import(pathToFileURL(join(temp,'landscape.mjs')));
  const {LD_ROADS,LD_CROSSINGS,LD_BRIDGES,LD_LANES,BRIDGE_SPAN,BRIDGE_DECK_Y,TABLE,SEA_RING,ISLAND,COAST_JITTER,
    seaOutline,islandOutline,offsetOutline,insetOutline,inPolygon,edgeDistance,isWet,waterEdge,waterOutlines,
    riverOutline,riverWidth,RIVER_POINTS,RIVER_MOUTH,LD_POOLS,LD_WATERWAYS,PONY_LANE,LD_BAND,
    CHANNEL_SAND_WET,CHANNEL_SAND_DRY}=L;
  const T=await import(pathToFileURL(join(temp,'town.mjs')));
  const {LD_PAVING}=T;
  const {LONDON_OBJECTS,LONDON_CLUSTERS}=await import(pathToFileURL(join(temp,'objects.mjs')));
  const LONDON_PROPS=HAS_PROPS?(await import(pathToFileURL(join(temp,'props.mjs')))).LONDON_PROPS:null;
  const {worldZoomLimit,worldFogRange}=await import(pathToFileURL(join(temp,'camera.mjs')));
  const {W}=await import(pathToFileURL(join(temp,'warp.mjs')));
  const {CEUROPE_OBJECTS,AREAS,WORLDS,MAP_REGIONS}=await import(pathToFileURL(join(temp,'graph.mjs')));

  // ---------- the table and the camera ----------
  for(const [w,h] of [[390,844],[430,932],[720,1024],[667,375]]) assert.equal(worldZoomLimit('central-europe',w,h),90,'phone worlds share one zoom-out limit');
  assert.equal(worldZoomLimit('central-europe',1280,720),215,'the United Kingdom keeps the wide desktop overview: its table is 88 deep');
  const HALF=Math.hypot(106,112)/2, REACH=215+HALF;
  const [fogNear,fogFar]=worldFogRange('central-europe',1280,720,HALF);
  const haze=d=>Math.min(1,Math.max(0,(d-fogNear)/(fogFar-fogNear)));
  assert.ok(haze(215)<.1,`the table centre at the zoom limit is ${(haze(215)*100).toFixed(0)} percent hazed`);
  assert.ok(haze(REACH)<.4,`the far corner of the table at the zoom limit is ${(haze(REACH)*100).toFixed(0)} percent hazed`);
  assert.deepEqual(worldFogRange('central-europe',390,844,HALF),[90,200],'a phone keeps 90 and 200: its limit is 90');
  // UK re-lay, 2026-09-24: Britain has the whole table, W 68 by D 88, and nothing of the continent is on it.
  assert.deepEqual(TABLE,{minX:-103,maxX:3,minZ:-46,maxZ:66},'the table runs x -103 to 3 and z -46 to 66');
  assert.deepEqual(LD_BAND,[-103,3],'Britain owns the whole table');

  // ---------- the sea is one shape: an outer ring with the island as its hole ----------
  const sea=seaOutline(), island=islandOutline();
  assert.equal(sea.length,SEA_RING.length);
  assert.equal(island.length,ISLAND.length);
  assert.deepEqual(sea,SEA_RING.map(p=>[...p]),'the outer ring takes no wobble: three of its sides are the table edge and the fourth is the strait it is measured against');
  for(const [x,z] of sea) assert.ok((x===TABLE.minX||x===TABLE.maxX)&&(z===TABLE.minZ||z===TABLE.maxZ),`a ring vertex at ${x}, ${z} is not a table corner`);
  // Square caps: the ring's own vertices are all at the table edge, and the island never reaches one.
  for(const [x,z] of island) assert.ok(x>TABLE.minX+1&&x<TABLE.maxX-1&&z>TABLE.minZ+1&&z<TABLE.maxZ-1,`the island coast must keep sea between it and the table edge, ${x} ${z} does not`);
  // The rim is an inset of both rings, vertex by vertex, and it never folds through itself inside an inlet.
  const ringRim=offsetOutline(sea,1.2), islandRim=insetOutline(island,1.2);
  assert.equal(ringRim.length,sea.length); assert.equal(islandRim.length,island.length);
  for(const [i,[x,z]] of sea.entries()){
    const [rx,rz]=ringRim[i];
    if(x<=TABLE.minX||x>=TABLE.maxX) assert.equal(rx,x,'a vertex on the table edge must not move, so the cap stays square');
    if(z<=TABLE.minZ||z>=TABLE.maxZ) assert.equal(rz,z,'a vertex on the table edge must not move, so the cap stays square');
  }
  for(const [i,[rx,rz]] of islandRim.entries()){
    assert.ok(Number.isFinite(rx)&&Number.isFinite(rz));
    assert.ok(inPolygon(rx,rz,island),`the island rim vertex ${i} at ${rx.toFixed(2)}, ${rz.toFixed(2)} fell outside the coast: the inset folded through an inlet`);
    assert.ok(Math.hypot(rx-island[i][0],rz-island[i][1])<=2.0,'the inset must not fly off at a sharp corner');
  }
  for(const [x,z] of ringRim) assert.ok(!inPolygon(x,z,sea)||x<=TABLE.minX||x>=TABLE.maxX,'the rim must lie outside the water');

  // ---------- the sea all round: the strait went with the continent (UK re-lay, 2026-09-24) ----------
  {
    for(const [x,z] of [[TABLE.minX+.5,0],[TABLE.maxX-.5,0],[-50,TABLE.minZ+.5],[-50,TABLE.maxZ-.5],[TABLE.maxX-.5,TABLE.minZ+.5]]) assert.ok(isWet(x,z),`the sea must run round the island, it does not at ${x}, ${z}`);
    assert.ok(COAST_JITTER<=.2,'the coast may take at most 0.2 of jitter');
  }

  // ---------- every river and channel runs from a source to a mouth ----------
  // Owner, 2026-09-22: "rivers are not cut properly and it can't stop in the middle". A source is the table
  // edge, a lake or basin, or another river; a mouth is the sea, a lake or basin, or another river; and the
  // two geometries must overlap at the join. See docs/building-a-world.md, "Water rules".
  {
    const onEdge=(x,z)=>x<=TABLE.minX+.01||x>=TABLE.maxX-.01||z<=TABLE.minZ+.01||z>=TABLE.maxZ-.01;
    const toRoute=(x,z,pts)=>{let d=1e9;for(let i=0;i<pts.length-1;i++){const [ax,az]=pts[i],[bx,bz]=pts[i+1];const ex=bx-ax,ez=bz-az,l2=ex*ex+ez*ez||1;const t=Math.max(0,Math.min(1,((x-ax)*ex+(z-az)*ez)/l2));d=Math.min(d,Math.hypot(x-ax-ex*t,z-az-ez*t));}return d;};
    const inSea=(x,z)=>inPolygon(x,z,sea)&&!inPolygon(x,z,island);
    const cut=[];
    for(const way of LD_WATERWAYS) for(const [which,[x,z]] of [['source',way.points[0]],['mouth',way.points[way.points.length-1]]]){
      if(onEdge(x,z))continue;
      if(inSea(x,z))continue;
      if(LD_POOLS.some(p=>Math.hypot((x-p.x)/p.rx,(z-p.z)/p.rz)<=1))continue;
      if(LD_WATERWAYS.some(o=>o.id!==way.id&&toRoute(x,z,o.points)<=o.width/2))continue;
      cut.push(`${way.id}: its ${which} at ${x}, ${z} ends in land — it reaches no edge, no sea, no pool and no other river`);
    }
    assert.deepEqual(cut,[],'a river or channel stops in the middle');
    // And the two geometries overlap at the mouth rather than meeting on the shore line: the last vertex has
    // to be inside the sea, not on it.
    assert.ok(inSea(...RIVER_MOUTH),`the river's mouth at ${RIVER_MOUTH} is not inside the sea`);
    assert.ok(edgeDistance(RIVER_MOUTH[0],RIVER_MOUTH[1],island)>=.2,'the mouth must overlap the sea, not stop on the coast line');
    // The source is inside the tarn, by the same rule.
    const src=RIVER_POINTS[0];
    assert.ok(LD_POOLS.some(p=>Math.hypot((src[0]-p.x)/p.rx,(src[1]-p.z)/p.rz)<=.8),'the river must rise inside the tarn, not beside it');
    // The widths (re-cluster pass, 2026-09-23): 2.6 through Westminster, and wide enough under Tower Bridge for its
    // bascule span, whose piers stand at the river's edges.
    const uAt=(x,z)=>{let best=0,bd=1e9;for(let i=0;i<=400;i++){const p=L.RIVER_CURVE.getPointAt(i/400);const d=Math.hypot(p.x-x,p.z-z);if(d<bd){bd=d;best=i/400;}}return best;};
    assert.equal(riverWidth(uAt(...W(-62,8.6))),2.6,'the river is 2.6 through Westminster');
    assert.ok(riverWidth(uAt(...W(-45.5,20)))>=5.4,`the river under Tower Bridge is ${riverWidth(uAt(...W(-45.5,20))).toFixed(2)} wide, narrower than the bascule span`);
  }

  // ---------- the two inlets and the cockle sand ----------
  {
    // The Firth of Forth is cut to the Forth Bridge's width (re-cluster pass, 2026-09-23): open water under the
    // bridge, and its shore road dry just south of the bridge's front.
    assert.ok(isWet(...W(-59.6,-23.2))&&isWet(...W(-61.8,-23.2))&&isWet(...W(-56.4,-23.2)),'the Firth of Forth must be open water under the bridge');
    assert.ok(!isWet(...W(-59.6,-20.3)),'the shore road south of the firth must stay dry');
    // The Bristol Channel reaches x -72.9 and its head is wet sand, which is ground and not water.
    assert.ok(isWet(...W(-75,12.7)),'the Bristol Channel must be open water west of its head');
    assert.ok(!isWet(...W(-71.5,13)),'the cockle sand east of the channel head is ground, not water');
    assert.ok(CHANNEL_SAND_WET.length>=4&&CHANNEL_SAND_DRY.length>=4,'the channel head carries both sand polygons');
    for(const [x,z] of CHANNEL_SAND_DRY) assert.ok(!isWet(x,z),`the dry sand corner ${x}, ${z} is in the water`);
  }

  // ---------- the twenty-nine objects: dry ground, a road at the door, and the band ----------
  const UK_AREAS=new Set(['london','weald','dales','westcountry','firths']);
  const objects=LONDON_OBJECTS.filter(o=>UK_AREAS.has(o.area));
  assert.equal(objects.length,29,'thirteen rooms, ten ingredient stops and six landmarks');
  // The on-water objects, and only these: the two bridges, each built to span its water from bank to bank (Tower
  // Bridge over the river, the Forth Bridge over the firth; re-cluster pass, 2026-09-23, where the bank-to-bank rule
  // below holds them), and the two oyster smacks moored at the river quay.
  const AFLOAT=new Set(['towerBridge','oystersUk','forthBridge']);
  const distToRoute=(x,z,points)=>{let d=1e9;for(let i=0;i<points.length-1;i++){const [ax,az]=points[i],[bx,bz]=points[i+1];const ex=bx-ax,ez=bz-az,l2=ex*ex+ez*ez||1;const t=Math.max(0,Math.min(1,((x-ax)*ex+(z-az)*ez)/l2));d=Math.min(d,Math.hypot(x-ax-ex*t,z-az-ez*t));}return d;};
  const doors=[];
  for(const o of objects){
    const [x,z]=o.pos;
    assert.ok(x>=LD_BAND[0]&&x<=LD_BAND[1],`${o.id}: at x ${x}, outside Britain's band of ${LD_BAND}`);
    assert.ok(z>=TABLE.minZ+2&&z<=TABLE.maxZ-2,`${o.id}: at z ${z}, off the island`);
    if(!AFLOAT.has(o.id)){
      assert.ok(!isWet(x,z),`${o.id}: stands in water`);
      for(let dx=-1.4;dx<=1.4;dx+=.35)for(let dz=-1.2;dz<=1.2;dz+=.3)
        assert.ok(!isWet(x+dx,z+dz),`${o.id}: its footprint reaches water at ${(x+dx).toFixed(1)}, ${(z+dz).toFixed(1)}`);
    } else assert.ok(isWet(x,z),`${o.id}: the blueprint puts this one in the water and it is on dry land`);
    const door=Math.min(...LD_ROADS.map(r=>distToRoute(x,z,r.points)-r.width/2));
    doors.push([o.id,door]);
    assert.ok(door<=(AFLOAT.has(o.id)?6.2:2.6),`${o.id}: no road at its door (${door.toFixed(2)} away)`);
  }

  // ---------- the stands as built ----------
  const stands=[];
  if(LONDON_PROPS){
    for(const o of objects){
      if(o.hitOnly||o.prop==='none')continue;
      const make=LONDON_PROPS[o.prop];
      assert.ok(make,`${o.id}: no builder for prop "${o.prop}"`);
      const prop=make();
      prop.position.set(o.pos[0],o.elevation??0,o.pos[1]); prop.rotation.y=o.rot??0;
      prop.updateMatrixWorld(true);
      stands.push({id:o.id,obj:o,group:prop});
    }
    // Every vertex of every stand against every piece of British water.
    const vertex=new THREE.Vector3(), meshBox=new THREE.Box3(), soaked=[];
    for(const s of stands){
      if(AFLOAT.has(s.id))continue;
      let over=null,n=0;
      s.group.traverse(o=>{
        if(!o.isMesh)return;
        meshBox.setFromObject(o);
        const cx=(meshBox.min.x+meshBox.max.x)/2, cz=(meshBox.min.z+meshBox.max.z)/2;
        if(!(isWet(cx,cz)||waterEdge(cx,cz)<4))return;
        const pos=o.geometry?.attributes?.position; if(!pos)return;
        for(let i=0;i<pos.count;i++){
          vertex.fromBufferAttribute(pos,i).applyMatrix4(o.matrixWorld);
          if(isWet(vertex.x,vertex.z)){n++; over??=`${o.name||o.parent?.name||'a mesh'} at ${vertex.x.toFixed(1)}, ${vertex.z.toFixed(1)}`;}
        }
      });
      if(!n)continue;
      measured.overWater[s.id]=n;
      if(!(s.id in OVER_WATER)) soaked.push(`${s.id}: ${over} hangs over the water (${n} vertices)`);
      else if(n>OVER_WATER[s.id]) soaked.push(`${s.id}: ${n} vertices over water where 2026-09-22 measured ${OVER_WATER[s.id]}; a listed overhang may not get worse`);
    }
    assert.deepEqual(soaked,[],'a stand hangs over the water');
    // The oyster stand is afloat by design, but only its two smacks are: the barrel, the tray, the basket, the
    // bollards and the three people stand on the quay. The second walkthrough (2026-09-23, item 52) found a boy,
    // the tub, the tray, the basket and both mooring posts standing on the strait, which the loop above skipped
    // because it skips every afloat stand. Every mesh of oystersUk that is not inside a group named
    // `oyster-smack` must have every vertex on dry ground.
    {
      const oy=stands.find(s=>s.id==='oystersUk'); assert.ok(oy,'the oyster stand is built');
      const inSmack=o=>{for(let p=o;p;p=p.parent)if(p.name==='oyster-smack')return true;return false;};
      let smacks=0; oy.group.traverse(o=>{if(o.name==='oyster-smack')smacks++;});
      assert.equal(smacks,2,'the oyster stand keeps its two moored smacks, each a group named oyster-smack');
      const wet=[]; let decor=0;
      oy.group.traverse(o=>{
        if(!o.isMesh||inSmack(o))return; decor++;
        const pos=o.geometry?.attributes?.position; if(!pos)return;
        for(let i=0;i<pos.count;i++){ vertex.fromBufferAttribute(pos,i).applyMatrix4(o.matrixWorld); if(isWet(vertex.x,vertex.z)){ wet.push(`${o.name||o.parent?.name||'a mesh'} at ${vertex.x.toFixed(1)}, ${vertex.z.toFixed(1)}`); break; } }
      });
      assert.ok(decor>40,`the oyster stand's quay parts were not found (${decor} meshes)`);
      assert.deepEqual(wet,[],'a part of the oyster stand other than its two smacks stands on the water');
      measured.oysterQuay=decor;
    }
    // ---------- fronts face the camera side; roads come to the door ----------
    // The world is only ever seen from +z (main.ts: camera on +z, orbit clamped to plus or minus 0.75), so every
    // rotation lies in [-0.75, 0.75] and a stand never turns its back to find its road (Stage D, 2026-09-22).
    // The door is the centre of the stand's solid front: the furthest +z reach, in the stand's own frame, of
    // every mesh that is not a figure and stands above 0.35. It must meet a road edge within 2.0. Stage D left
    // three over it (Big Ben, the seamen's kitchen, the distillery) as ceilings; the shared-ground pass
    // (2026-09-23) moved them and brought the roads to every door, so the table is empty and no stand may join it.
    const DOOR_BEHIND={};   // emptied by the shared-ground pass, 2026-09-23: every front door is within 2.0
    const isFigure=o=>{for(let p=o;p;p=p.parent)if(p.userData?.legs)return true;return false;};
    const edgeOf=(x,z)=>Math.min(...LD_ROADS.map(r=>distToRoute(x,z,r.points)-r.width/2));
    const turned=[], farDoors=[];
    for(const o of objects) if(Math.abs(o.rot??0)>.75+1e-9) turned.push(`${o.id}: rot ${o.rot}`);
    for(const s of stands){
      const rot=s.group.rotation.y; s.group.rotation.y=0; s.group.updateMatrixWorld(true);
      let front=-1e9;
      s.group.traverse(m=>{ if(!m.isMesh||isFigure(m))return; const b=new THREE.Box3().setFromObject(m); if(b.max.y<.35)return; front=Math.max(front,b.max.z-s.obj.pos[1]); });
      s.group.rotation.y=rot; s.group.updateMatrixWorld(true);
      // A bridge's front is its water (Tower Bridge's coaster lies in the river, the Forth Bridge's piers in the firth),
      // so its door is the nearer of its two abutments, the ends of its deck on the banks (re-cluster pass, 2026-09-23).
      let d=edgeOf(s.obj.pos[0]+Math.sin(rot)*front, s.obj.pos[1]+Math.cos(rot)*front);
      if(/Bridge$/.test(s.id)){ const bb=new THREE.Box3().setFromObject(s.group); d=Math.min(edgeOf(bb.min.x,s.obj.pos[1]),edgeOf(bb.max.x,s.obj.pos[1])); }
      measured.doors??={}; measured.doors[s.id]=Number(d.toFixed(2));
      const cap=DOOR_BEHIND[s.id]??2.0;
      if(d>cap+.005) farDoors.push(`${s.id}: its front door is ${d.toFixed(2)} from a road, over the ${cap} allowed`);
    }
    assert.deepEqual(turned,[],'a stand turns its front away from the camera side');
    assert.deepEqual(farDoors,[],'a road does not come to a stand\'s front door');
    // ---------- footprints: what ground each stand actually stands on ----------
    const foot=g=>{
      let b=null;
      g.traverse(o=>{
        if(!o.isMesh||o.isSprite||!o.geometry)return;
        if(o.material&&(o.material.visible===false||o.material.opacity===0))return;
        o.geometry.computeBoundingBox();
        const box=o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld);
        if(box.min.y>2.5)return;
        b=b?b.union(box):box;
      });
      return b;
    };
    const clearance=(a,b)=>{
      const dx=Math.max(a.min.x-b.max.x,b.min.x-a.max.x), dz=Math.max(a.min.z-b.max.z,b.min.z-a.max.z);
      return (dx<0&&dz<0)?-Math.min(-dx,-dz):Math.hypot(Math.max(dx,0),Math.max(dz,0));
    };
    const feet=new Map(stands.map(s=>[s.id,foot(s.group)]));
    const crowded=[];
    for(let i=0;i<stands.length;i++)for(let j=i+1;j<stands.length;j++){
      const a=stands[i].id,b=stands[j].id;
      const fa=feet.get(a),fb=feet.get(b); if(!fa||!fb)continue;
      const gap=clearance(fa,fb);
      if(gap>=1)continue;
      const key=`${a}/${b}`;
      measured.crowded[key]=Number((-gap).toFixed(2));
      if(!(key in CROWDED)){ crowded.push(`${key}: ${gap<0?`overlap ${(-gap).toFixed(2)}`:`only ${gap.toFixed(2)} of clear ground`}`); continue; }
      if(-gap>CROWDED[key]+.05) crowded.push(`${key}: ${(-gap).toFixed(2)} where 2026-09-22 measured ${CROWDED[key].toFixed(2)}; a crowded pair may not get worse`);
    }
    assert.deepEqual(crowded,[],'two British stand footprints share ground');
  } else {
    notRun.push('every vertex of every stand against the sea ring, the island ring, the strait, the river at all three widths, the estuary, the Bristol Channel and the Firth of Forth: props-london.ts does not exist');
    notRun.push('stand-on-stand ten-ray visibility and stand-on-stand footprint clearance: props-london.ts does not exist');
    // A proxy box at each object position stands in, so the Builder half of the visibility rule still runs.
    for(const o of objects){
      const g=new THREE.Group();
      const m=new THREE.Mesh(new THREE.BoxGeometry(2.4,2.6,2.0),new THREE.MeshBasicMaterial());
      m.position.set(0,1.3,0); g.add(m);
      g.position.set(o.pos[0],o.elevation??0,o.pos[1]); g.rotation.y=o.rot??0; g.updateMatrixWorld(true);
      stands.push({id:o.id,obj:o,group:g,proxy:true});
    }
  }

  // ---------- roads: one continuous ribbon each, clear of the water except on a crossing ----------
  const onBridge=(x,z)=>LD_CROSSINGS.some(c=>Math.hypot(x-c.at[0],z-c.at[1])<c.span/2+1.4);
  const world=buildCeurope([]); world.group.updateMatrixWorld(true);
  const ribbons=world.group.children.filter(o=>o.isMesh&&o.name==='britain-road');
  assert.equal(ribbons.length,LD_ROADS.length,'one ribbon per route, never two overlapping strips');
  for(const r of LD_ROADS){
    const mesh=ribbons.find(o=>o.userData.road===r.id);
    assert.ok(mesh,`${r.id}: no ribbon drawn`);
    const pos=mesh.geometry.attributes.position, verts=[];
    for(let i=0;i<pos.count;i++) verts.push([pos.getX(i),pos.getZ(i)]);
    for(const [x,z] of r.points) assert.ok(verts.some(([vx,vz])=>Math.hypot(vx-x,vz-z)<=r.width/2+.55),`${r.id}: the ribbon does not reach [${x}, ${z}]`);
    for(const [vx,vz] of verts){
      if(LD_CROSSINGS.some(c=>c.road===r.id)&&onBridge(vx,vz))continue;   // only the road a crossing carries may touch the water
      assert.ok(!isWet(vx,vz),`${r.id}: the road surface reaches water at ${vx.toFixed(1)}, ${vz.toFixed(1)}`);
      assert.ok(vx>=LD_BAND[0]-1&&vx<=LD_BAND[1]+1,`${r.id}: the ribbon reaches x ${vx.toFixed(1)}, outside Britain's band`);
    }
  }
  // Every route joins the network, and the whole network is one walkable piece.
  for(const r of LD_ROADS)
    assert.ok(r.points.some(([x,z])=>LD_ROADS.some(o=>o!==r&&o.points.some(([ox,oz])=>Math.hypot(ox-x,oz-z)<1.6))),`${r.id}: is not connected to the rest of the network`);
  {
    const seen=new Set(['LD-R1']), queue=['LD-R1'];
    while(queue.length){
      const id=queue.pop(), a=LD_ROADS.find(r=>r.id===id);
      for(const b of LD_ROADS){
        if(seen.has(b.id))continue;
        if(a.points.some(([x,z])=>b.points.some(([ox,oz])=>Math.hypot(ox-x,oz-z)<1.6))){seen.add(b.id);queue.push(b.id);}
      }
    }
    assert.equal(seen.size,LD_ROADS.length,`the British network is in ${LD_ROADS.length-seen.size+1} pieces: ${LD_ROADS.filter(r=>!seen.has(r.id)).map(r=>r.id)}`);
  }

  // ---------- every road end meets something ----------
  // Another route, a bridge deck, a door at half a road width plus 2.6, the shore within 2.6, or the table
  // edge. A lane that ends at the last farm is that farm's lane; a quay or a set of river stairs finishes at
  // the water it runs down to. Every end the rule lets through, with its measured distance, is in the report.
  const centrelineGap=(x,z,r)=>{let d=1e9;for(let i=0;i<r.points.length-1;i++){const [ax,az]=r.points[i],[bx,bz]=r.points[i+1];const ex=bx-ax,ez=bz-az,l2=ex*ex+ez*ez||1;const t=Math.max(0,Math.min(1,((x-ax)*ex+(z-az)*ez)/l2));d=Math.min(d,Math.hypot(x-ax-ex*t,z-az-ez*t));}return d;};
  const isRing=r=>Math.hypot(r.points[0][0]-r.points[r.points.length-1][0],r.points[0][1]-r.points[r.points.length-1][1])<1e-6;
  const waters=waterOutlines();
  const dangling=[], ends=[];
  for(const r of LD_ROADS){
    for(const [which,[x,z]] of [['start',r.points[0]],['end',r.points[r.points.length-1]]]){
      if(z<=TABLE.minZ+.4||z>=TABLE.maxZ-.4||x<=TABLE.minX+.4||x>=TABLE.maxX-.4) continue;   // it leaves the table
      const reach=r.width/2;
      const onRoadEnd=LD_ROADS.some(o=>o!==r&&centrelineGap(x,z,o)<=reach);
      const onDeck=LD_CROSSINGS.some(c=>Math.hypot(x-c.at[0],z-c.at[1])<=reach+c.span/2)
        // or at an abutment of one of the two bridges that stand as landmarks (re-cluster pass, 2026-09-23)
        ||stands.filter(st=>/Bridge$/.test(st.id)).some(st=>{const bb=new THREE.Box3().setFromObject(st.group);return [bb.min.x,bb.max.x].some(ex=>Math.hypot(x-ex,z-st.obj.pos[1])<=reach+1.4);});
      const door=Math.min(...LONDON_OBJECTS.map(o=>Math.hypot(x-o.pos[0],z-o.pos[1])));
      const shore=Math.min(...waters.map(poly=>edgeDistance(x,z,poly)));
      if(onRoadEnd||onDeck) { ends.push(`${r.id} ${which} [${x}, ${z}]: on another route or a deck`); continue; }
      if(door<=reach+2.6) { ends.push(`${r.id} ${which} [${x}, ${z}]: at a door, ${door.toFixed(2)} of ${(reach+2.6).toFixed(2)}`); continue; }
      if(shore<=2.6) { ends.push(`${r.id} ${which} [${x}, ${z}]: on the shore, ${shore.toFixed(2)} of 2.60`); continue; }
      if(isRing(r)) continue;
      dangling.push(`${r.id} ${which} [${x}, ${z}]: meets no road, no bridge, no door within ${(reach+2.6).toFixed(1)} and no shore within 2.6`);
    }
  }
  assert.deepEqual(dangling,[],'a road ends in the grass');
  // And the drawn surfaces really overlap at the junction, so no grass shows between two ribbons.
  const surfaceOf=id=>{const m=ribbons.find(o=>o.userData.road===id),pos=m.geometry.attributes.position,v=[];for(let i=0;i<pos.count;i++)v.push([pos.getX(i),pos.getZ(i)]);return v;};
  const drawn=new Map(LD_ROADS.map(r=>[r.id,surfaceOf(r.id)]));
  const gaps=[];
  for(const r of LD_ROADS){
    if(isRing(r))continue;
    for(const [which,[x,z]] of [['start',r.points[0]],['end',r.points[r.points.length-1]]]){
      const meets=LD_ROADS.filter(o=>o!==r&&centrelineGap(x,z,o)<=r.width/2);
      if(!meets.length)continue;
      const near=(id,w)=>drawn.get(id).filter(([vx,vz])=>Math.hypot(vx-x,vz-z)<w+1.4);
      const mine=near(r.id,r.width);
      const over=meets.some(o=>mine.some(([vx,vz])=>centrelineGap(vx,vz,o)<=o.width/2)
        ||near(o.id,o.width).some(([vx,vz])=>centrelineGap(vx,vz,r)<=r.width/2));
      if(!over) gaps.push(`${r.id} ${which} [${x}, ${z}]: its surface stops short of ${meets.map(m=>m.id)}`);
    }
  }
  assert.deepEqual(gaps,[],'two road surfaces meet with grass between them');

  // ---------- the paving is squares, not blobs ----------
  const slabs=world.group.children.filter(o=>o.isMesh&&/paving$/.test(o.name||''));
  assert.equal(slabs.length,LD_PAVING.length,'one mesh per paved square');
  const houseBoxes=world.group.children.filter(o=>o.name==='britain-house').map(o=>new THREE.Box3().setFromObject(o));
  const objectPads=LONDON_OBJECTS.map(o=>new THREE.Box3(new THREE.Vector3(o.pos[0]-1.5,0,o.pos[1]-1.5),new THREE.Vector3(o.pos[0]+1.5,3,o.pos[1]+1.5)));
  const unsupported=[];
  for(const [name,cx,cz,w,d] of LD_PAVING){
    const mesh=slabs.find(o=>o.name===name);
    assert.ok(mesh,`${name}: not drawn`);
    assert.ok(Math.abs(mesh.rotation.y)<1e-9,`${name}: a paved square is axis-aligned, never turned`);
    const box=new THREE.Box3().setFromObject(mesh);
    assert.ok(Math.abs((box.max.x-box.min.x)-w)<.01&&Math.abs((box.max.z-box.min.z)-d)<.01,`${name}: drawn at a different size from LD_PAVING`);
    const sides={north:[[cx-w/2,cz-d/2],[cx+w/2,cz-d/2]],south:[[cx-w/2,cz+d/2],[cx+w/2,cz+d/2]],
                 west:[[cx-w/2,cz-d/2],[cx-w/2,cz+d/2]],east:[[cx+w/2,cz-d/2],[cx+w/2,cz+d/2]]};
    for(const [which,[a,b]] of Object.entries(sides)){
      let held=false;
      for(let k=0;k<=8&&!held;k++){
        const x=a[0]+(b[0]-a[0])*k/8, z=a[1]+(b[1]-a[1])*k/8;
        if(LD_ROADS.some(r=>centrelineGap(x,z,r)<=r.width/2+1.0)) held=true;
        if(!held&&[...houseBoxes,...objectPads].some(f=>x>=f.min.x-1.0&&x<=f.max.x+1.0&&z>=f.min.z-1.0&&z<=f.max.z+1.0)) held=true;
      }
      if(!held) unsupported.push(`${name}: its ${which} side runs over open grass, under no road and against no door`);
    }
  }
  assert.deepEqual(unsupported,[],'a paved square has a side on open grass');

  // ---------- what the Builder placed: the scenery boxes ----------
  const placedGroups=new Set(world.placed.map(p=>p.group));
  const LANDSCAPE=/^(britain-sea|britain-sea-rim|island-river|island-river-bank|west-tarn|cockle-sand-wet|cockle-sand-sheen|cockle-sand-dry|sand-rib|sand-runnel|britain-road|britain-walker|britain-neighbour|britain-pony|pony-lead|street-vehicle|explore-cue|black-sea|danube)$/;
  const decor=[];
  for(const root of world.group.children){
    if(placedGroups.has(root)||root.isSprite)continue;
    if(LANDSCAPE.test(root.name||''))continue;
    if(/paving$/.test(root.name||''))continue;
    if(root.position.x<LD_BAND[0]-2||root.position.x>LD_BAND[1]||root.position.z<TABLE.minZ||root.position.z>TABLE.maxZ)continue;   // the table
    root.updateMatrixWorld(true);
    let box=null;
    root.traverse(o=>{
      if(!o.isMesh||o.isSprite)return;
      if(o.material&&(o.material.visible===false||o.material.opacity===0))return;
      o.geometry.computeBoundingBox();
      const b=o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld);
      if(b.max.y<.35)return;   // ground dressing blocks nothing
      box=box?box.union(b):b;
    });
    if(box) decor.push({b:box,name:root.name||'scenery',x:root.position.x,z:root.position.z});
  }
  assert.ok(decor.length>=40,`Britain should be dressed, found ${decor.length} pieces of scenery`);
  // Nothing the Builder placed stands in the water.
  const drowned=[];
  for(const d of decor){
    if(d.name==='britain-bridge')continue;   // the one thing the blueprint lets stand in the river
    for(const [x,z] of [[d.b.min.x,d.b.min.z],[d.b.min.x,d.b.max.z],[d.b.max.x,d.b.min.z],[d.b.max.x,d.b.max.z],[(d.b.min.x+d.b.max.x)/2,(d.b.min.z+d.b.max.z)/2]])
      if(isWet(x,z)){ drowned.push(`${d.name} at ${d.x.toFixed(1)}, ${d.z.toFixed(1)} reaches the water at ${x.toFixed(1)}, ${z.toFixed(1)}`); break; }
  }
  assert.deepEqual(drowned,[],'something the Builder placed stands in the water');
  // Nothing the Builder placed blocks a stand's 6 x 5 pad or stands inside its footprint. A bridge is exempt
  // from this rule and from the corridor rule below for the same reason: it is a road, and every stand's door
  // is on a road. Westminster Bridge's own embankment clips the far corner of the omnibus stand's pad by 0.2
  // of a unit and blocks nothing.
  const WALK_THROUGH=/^(britain-bridge)$/;
  const solidDecor=decor.filter(d=>!WALK_THROUGH.test(d.name));
  const blocked=new Set();
  for(const o of objects) for(const d of solidDecor)
    if(d.b.min.x<o.pos[0]+3&&d.b.max.x>o.pos[0]-3&&d.b.min.z<o.pos[1]+2.5&&d.b.max.z>o.pos[1]-2.5) blocked.add(`${o.id}: ${d.name} at ${d.x.toFixed(1)}, ${d.z.toFixed(1)}`);
  assert.deepEqual([...blocked],[],"a stand's 6 x 5 pad is blocked by scenery");

  // ---------- nothing a visitor walks into: the lanes stay open and every stand keeps its approach ----------
  const onRoadNow=new Set();
  for(const r of LD_ROADS) for(let i=0;i<r.points.length-1;i++){
    const [ax,az]=r.points[i],[bx,bz]=r.points[i+1];
    const steps=Math.max(1,Math.ceil(Math.hypot(bx-ax,bz-az)*4));
    for(let k=0;k<=steps;k++){
      const x=ax+(bx-ax)*k/steps, z=az+(bz-az)*k/steps;
      for(const d of solidDecor) if(x>d.b.min.x&&x<d.b.max.x&&z>d.b.min.z&&z<d.b.max.z)
        onRoadNow.add(`${r.id} at ${x.toFixed(1)}, ${z.toFixed(1)}: inside ${d.name} [${d.x.toFixed(1)}, ${d.z.toFixed(1)}]`);
    }
  }
  assert.deepEqual([...onRoadNow],[],'something stands on a British road');
  const nearestRoadPoint=(x,z)=>{
    let best=null,bd=1e9;
    for(const r of LD_ROADS) for(let i=0;i<r.points.length-1;i++){
      const [ax,az]=r.points[i],[bx,bz]=r.points[i+1];
      const ex=bx-ax,ez=bz-az,l2=ex*ex+ez*ez||1;
      const t=Math.max(0,Math.min(1,((x-ax)*ex+(z-az)*ez)/l2));
      const px=ax+ex*t,pz=az+ez*t,d=Math.hypot(x-px,z-pz);
      if(d<bd){bd=d;best=[px,pz];}
    }
    return best;
  };
  const shut=new Set();
  for(const o of objects){
    const [x,z]=o.pos, [rx,rz]=nearestRoadPoint(x,z);
    const steps=Math.max(1,Math.ceil(Math.hypot(rx-x,rz-z)*4));
    for(let k=0;k<=steps;k++){
      const sx=x+(rx-x)*k/steps, sz=z+(rz-z)*k/steps;
      for(const d of solidDecor) if(sx>d.b.min.x&&sx<d.b.max.x&&sz>d.b.min.z&&sz<d.b.max.z)
        shut.add(`${o.id}: ${d.name} [${d.x.toFixed(1)}, ${d.z.toFixed(1)}] stands in the approach from the road`);
    }
    for(const d of solidDecor){
      const gx=Math.max(d.b.min.x-x,0,x-d.b.max.x), gz=Math.max(d.b.min.z-z,0,z-d.b.max.z);
      if(Math.hypot(gx,gz)<2.5) shut.add(`${o.id}: ${d.name} [${d.x.toFixed(1)}, ${d.z.toFixed(1)}] is ${Math.hypot(gx,gz).toFixed(2)} from the stand, under the 2.5 the approach needs`);
    }
  }
  assert.deepEqual([...shut],[],'a stand has no open approach from a road');

  // ---------- ten rays per clickable along the arrival direction ----------
  // main.ts drops the visitor in at the target plus (2, 48, 60), so the camera always looks from the south.
  // Nine rays meet the object's camera-facing front face at three heights and one meets the diamond cue over
  // its anchor; the first thing each ray meets must be that object. The Builder's own decor is an absolute
  // blocker: a house, a wall, a tree, a lamp or a barrow that covers a single ray fails here.
  const CAM_RAY=new THREE.Vector3(2,48,60).normalize();
  const ownerOf=new Map(), blockers=[];
  for(const s of stands) s.group.traverse(o=>{
    if(!o.isMesh||o.isSprite||!o.geometry)return;
    ownerOf.set(o,s.id); blockers.push(o);
  });
  const BUILDING=/^(britain-house|britain-bridge|gas-lamp|coster-barrow|dock-barrels|dock-bollard|rope-coil|fell-sheep-pen|field-gate|uk-highland|uk-upland|uk-pennine|uk-downs|uk-moor|uk-wood|uk-village|uk-barn|uk-mill|uk-pasture|drystone-wall|granite-hedgebank|hedge-bank|weald-oak|weald-hornbeam|dale-oak|moor-oak|hedgerow-oak|westminster-oak|orchard-tree|hop-row|moor-gorse|west-gorse|peat-stack|tarn-boulder)$/;
  for(const root of world.group.children){
    if(!BUILDING.test(root.name||''))continue;
    root.traverse(o=>{ if(o.isMesh&&!o.isSprite&&o.geometry&&!(o.material&&(o.material.visible===false||o.material.opacity===0))){ownerOf.set(o,root.name);blockers.push(o);} });
  }
  const standIds=new Set(stands.map(s=>s.id));
  const ray=new THREE.Raycaster(); ray.far=400;
  const back=CAM_RAY.clone().multiplyScalar(70), into=CAM_RAY.clone().negate();
  const byDecor=[], covered=[];
  for(const s of stands){
    const b=new THREE.Box3().setFromObject(s.group);
    if(!Number.isFinite(b.min.y))continue;
    const floor=Math.max(b.min.y,0), [sx,sz]=s.obj.pos, aim=[];
    for(const fx of [.2,.5,.8]) for(const dy of [.8,1.5,2.2]) aim.push(new THREE.Vector3(b.min.x+(b.max.x-b.min.x)*fx, floor+dy, b.max.z-.2));
    aim.push(new THREE.Vector3(sx,b.max.y+.7,sz));
    const by={};
    for(const t of aim){
      ray.set(t.clone().add(back),into);
      const hit=ray.intersectObjects(blockers,false).find(h=>h.distance<69.8);
      if(!hit)continue;
      const id=ownerOf.get(hit.object);
      if(id!==s.id) by[id]=(by[id]||0)+1;
    }
    for(const [id,n] of Object.entries(by)){
      if(!standIds.has(id)) { byDecor.push(`${s.id}: ${id} covers it on ${n} of 10 rays from the camera`); continue; }
      const key=`${s.id}<${id}`;
      measured.hidden[key]=n;
      if(!(key in HIDDEN)) covered.push(`${key}: covered on ${n} of 10 rays`);
      else if(n>HIDDEN[key]) covered.push(`${key}: covered on ${n} of 10 rays where 2026-09-22 measured ${HIDDEN[key]}; a listed pair may not get worse`);
    }
  }
  assert.deepEqual(byDecor,[],'something the Builder placed stands in front of a British clickable object');
  // The other half is a stand covering a stand, and at Stage C the Builder owns neither end of it: the
  // positions are fixed in `london-objects.ts` and the sizes in `props-london.ts`. Each pair below was
  // measured on 2026-09-22 and is a ceiling, not a licence — a listed pair may not get worse and an unlisted
  // pair may not appear. Closing them is a re-blueprint or a stand resize, for the lead at Stage D.
  assert.deepEqual(covered,[],'a British stand stands in front of another British stand');

  // ---------- Westminster Bridge ----------
  const bridges=world.group.children.filter(o=>o.name==='britain-bridge');
  assert.equal(bridges.length,LD_CROSSINGS.length,'one crossing in the whole of Britain, and it is Westminster Bridge');
  assert.equal(LD_BRIDGES.length,2,'both deck centres are registered: Westminster Bridge and Tower Bridge');
  assert.equal(BRIDGE_SPAN,6.0); assert.equal(BRIDGE_DECK_Y,0.9);
  for(const b of bridges){
    assert.deepEqual(coplanarOverlaps(b),[],'bridge faces overlap on the same plane');
    const box=new THREE.Box3().setFromObject(b);
    const crossing=LD_CROSSINGS.find(c=>Math.hypot(b.position.x-c.at[0],b.position.z-c.at[1])<.6);
    assert.ok(crossing,`a bridge at ${b.position.x.toFixed(1)}, ${b.position.z.toFixed(1)} is not one of the crossings`);
    assert.ok(box.min.y<=.01,'the bridge must reach the bank');
    assert.ok(Math.max(box.max.x-box.min.x,box.max.z-box.min.z)>=crossing.span-.2,'the deck must span the water');
    assert.ok(Math.max(box.max.x-box.min.x,box.max.z-box.min.z)<=crossing.span+2*1.6+.6,'the deck and its two 1.6 embankments run past their crossing');
    // It is square to the water: the deck's long axis crosses the river's own direction within 20 degrees.
    const tan=(()=>{let best=0,bd=1e9;for(let i=0;i<=400;i++){const p=L.RIVER_CURVE.getPointAt(i/400);const d=Math.hypot(p.x-crossing.at[0],p.z-crossing.at[1]);if(d<bd){bd=d;best=i/400;}}return L.RIVER_CURVE.getTangentAt(best);})();
    const ahead=[tan.x,tan.z];   // the river's direction under the bridge
    const along=[Math.cos(b.rotation.y),-Math.sin(b.rotation.y)];   // the deck's long axis is its local +x
    const cos=Math.abs((ahead[0]*along[0]+ahead[1]*along[1])/Math.hypot(...ahead));
    assert.ok(cos<Math.cos(Math.PI/180*70),`the bridge is not square to the water (${(Math.acos(cos)*180/Math.PI).toFixed(0)} degrees)`);
  }

  // ---------- the decorative houses ----------
  const houses=world.group.children.filter(o=>o.name==='britain-house');
  assert.ok(houses.length>=3&&houses.length<=5,`the blueprint caps Britain at five decorative houses, found ${houses.length}`);
  const styles=houses.map(o=>o.userData.houseStyle);
  assert.equal(new Set(styles).size,styles.length,'one house per style, one style per cluster');
  for(const style of ['londonTerrace','dockWarehouse']) assert.ok(styles.includes(style),`${style}: no house in that style, and Westminster and the Docks need one each`);
  // Cornish cob and the Welsh long house stay buildable and nothing places one: the West Country already
  // carries five objects and three of their own buildings, which is the blueprint's own reason for no house
  // there, and Spain's Plaza Mayor set the precedent.
  assert.ok(!styles.includes('cornishCob')&&!styles.includes('welshLongHouse'),'the West Country keeps no decorative house');
  const smoking=houses.filter(o=>o.userData.smoke);
  assert.ok(smoking.length>=houses.length/2,`about half the houses should smoke, ${smoking.length} of ${houses.length} do`);
  for(const h of smoking){
    const box=new THREE.Box3().setFromObject(h);
    const top=h.localToWorld(h.userData.smoke.clone());
    assert.ok(top.y>=box.max.y-.35,`${h.userData.houseStyle}: the smoke starts ${(box.max.y-top.y).toFixed(2)} below the roof line`);
    assert.ok(top.y<box.max.y+.9,'the smoke must leave the pots, not hang over the house');
    assert.equal(h.userData.smokeTint,'#b5aea3','a kitchen fire is wood-smoke grey-white, at a stand steam\'s size and opacity');
  }
  const sprites=world.group.children.filter(o=>o.isSprite).length;
  assert.ok(sprites>=smoking.length*4,`the world must collect every chimney: ${sprites} puff sprites for ${smoking.length} smoking houses`);

  // ---------- no house and no stand building in or over any water ----------
  // Owner, on the live site, 2026-09-23: "please make sure houses are not standing in the river". Every decorative
  // house and every stand's own building (each room's `uk-building`, the oast, the forcing shed and the engine house)
  // stands wholly on dry ground with at least 1.0 of it between its walls and every water edge: the sea, the strait,
  // the Firth of Forth, the Bristol Channel, the river (under Tower Bridge too), the tarn, the mill pond and the burn.
  // The footprint is every mesh of the building above 0.35, sampled on a quarter-unit grid.
  const housesAndBuildings=[];
  {
    const burnD=(x,z)=>{let d=1e9;for(const p of L.BURN_CURVE.getSpacedPoints(80))d=Math.min(d,Math.hypot(x-p.x,z-p.z));return d-L.BURN_WIDTH/2;};
    const roots=[...world.group.children.filter(o=>o.name==='britain-house').map(o=>[`house ${o.userData.houseId}`,o])];
    for(const st of stands) if(!/Bridge$/.test(st.id)) st.group.traverse(o=>{ if(/^(uk-building|hop-oast|rhubarb-shed|engine-house-building)$/.test(o.name)) roots.push([`${st.id} ${o.name}`,o]); });
    const wetBuild=[];
    for(const [label,root] of roots){
      root.updateMatrixWorld(true); let b=null;
      root.traverse(m=>{ if(!m.isMesh||m.isSprite||!m.geometry)return; if(m.material&&(m.material.visible===false||m.material.opacity===0))return; m.geometry.computeBoundingBox(); const bb=m.geometry.boundingBox.clone().applyMatrix4(m.matrixWorld); if(bb.max.y<.35)return; b=b?b.union(bb):bb; });
      if(!b)continue;
      let worst=1e9, at=null;
      for(let x=b.min.x;x<=b.max.x+1e-6;x+=.25) for(let z=b.min.z;z<=b.max.z+1e-6;z+=.25){
        const d=isWet(x,z)?-waterEdge(x,z):Math.min(waterEdge(x,z),burnD(x,z));
        if(d<worst){worst=d;at=[x,z];}
      }
      housesAndBuildings.push([label,+worst.toFixed(2)]);
      if(worst<1.0) wetBuild.push(`${label}: ${worst<0?'stands in the water':`only ${worst.toFixed(2)} from the water`} at ${at[0].toFixed(1)}, ${at[1].toFixed(1)}`);
    }
    assert.ok(roots.filter(([l])=>l.startsWith('house')).length===houses.length,'every house was tested');
    assert.ok(roots.some(([l])=>/hop-oast/.test(l))&&roots.some(([l])=>/rhubarb-shed/.test(l))&&roots.some(([l])=>/engine-house-building/.test(l))&&roots.some(([l])=>/smokehouseUk uk-building/.test(l)),'the four stand-owned buildings were found');
    assert.deepEqual(wetBuild,[],'a house or a stand building stands in or within 1.0 of the water');
  }

  // ---------- both bridges bank to bank ----------
  // Owner, 2026-09-23: "Tower Bridge is not on land on the right side", then "Tower Bridge is on the land now, doesn't
  // make sense" of a dock basin, and "the train bridge just stops in the middle". Each bridge crosses its own water:
  // both ends of the deck on dry bank, a unit clear of the water, and the middle of the span over the water. Tower
  // Bridge crosses the river itself, with nothing but the river's water between its abutments and the coaster in the
  // river at rest and at the top of its run; the Forth Bridge crosses the firth, and its train stays on the deck.
  {
    const bank=(id)=>{ const st=stands.find(x=>x.id===id); const bb=new THREE.Box3().setFromObject(st.group); return {st,bb,z:st.obj.pos[1]}; };
    for(const id of ['towerBridge','forthBridge']){
      const {bb,z,st}=bank(id);
      for(const x of [bb.min.x,bb.max.x]){ assert.ok(!isWet(x,z)&&waterEdge(x,z)>=.6,`${id}: its deck ends at ${x.toFixed(1)}, ${z} in or beside the water (edge ${waterEdge(x,z).toFixed(2)})`); }
      assert.ok(isWet(st.obj.pos[0],z),`${id}: the middle of its span is not over water`);
    }
    // Tower Bridge: the only water between its abutments is the river's, and the coaster floats on it.
    { const {bb,z,st}=bank('towerBridge');
      for(let x=bb.min.x;x<=bb.max.x;x+=.1) if(isWet(x,z)) assert.ok(L.inPolygon(x,z,L.riverOutline()),`Tower Bridge crosses water at ${x.toFixed(1)} that is not the river`);
      const coaster=st.group.getObjectByName('bridge-coaster'); assert.ok(coaster,'Tower Bridge keeps its coaster');
      const hull=new THREE.Box3().setFromObject(coaster); const dz=[0,-4.0];
      for(const shift of dz) for(const x of [hull.min.x,(hull.min.x+hull.max.x)/2,hull.max.x]) for(const zz of [hull.min.z,(hull.min.z+hull.max.z)/2,hull.max.z])
        assert.ok(isWet(x,zz+shift),`the coaster is out of the water at ${x.toFixed(1)}, ${(zz+shift).toFixed(1)}`);
      assert.ok(hull.max.z-hull.min.z>hull.max.x-hull.min.x,'the coaster lies along the river, not across it'); }
    // The Forth Bridge's train runs its whole course on the deck.
    { const {st}=bank('forthBridge'); const train=st.group.getObjectByName('forth-train'); assert.ok(train,'the Forth Bridge keeps its train');
      // the deck is merged into the bridge's steel; its reach is the span of the steel at the deck's height (3.1 to 3.3)
      let deck=null; st.group.traverse(o=>{ if(!o.isMesh||o.isSprite)return; for(let p=o;p;p=p.parent) if(p===train||p.userData?.legs) return;
        const pos=o.geometry?.attributes?.position; if(!pos)return; const v=new THREE.Vector3();
        for(let i=0;i<pos.count;i++){ v.fromBufferAttribute(pos,i).applyMatrix4(o.matrixWorld); if(v.y>3.05&&v.y<3.3){ deck??=new THREE.Box3(); deck.expandByPoint(v); } } });
      assert.ok(deck,'the Forth Bridge deck is found');
      const t0=new THREE.Box3().setFromObject(train), run=5.18;
      assert.ok(t0.min.x>=deck.min.x-.01&&t0.max.x+run<=deck.max.x+.01,`the train runs off the deck: ${t0.min.x.toFixed(2)}..${(t0.max.x+run).toFixed(2)} on a deck ${deck.min.x.toFixed(2)}..${deck.max.x.toFixed(2)}`); }
  }

  // ---------- six clusters: compact, each on its own ground, and separated ----------
  // Owner's live walkthrough, 2026-09-23: "In China, regions are nicely clustered and separated; in the UK it can be
  // messy". The shared-ground pass spread the clusters and the owner could not see them. Each cluster in
  // `LONDON_CLUSTERS` states its centre and radius, and every one of its objects stands within that radius; every
  // object belongs to exactly one cluster; each cluster has a ground tint of its own; no object stands inside
  // another cluster's hull, and the hulls of the clusters' anchors are at least 8 apart (docs/agent-team-playbook.md,
  // "Definition of done"). The gap between the clusters' footprint hulls, the ground actually left open, is printed.
  const clusterReport=[];
  {
    const ids=objects.map(o=>o.id), seen=new Map();
    for(const c of LONDON_CLUSTERS) for(const id of c.ids){ assert.ok(ids.includes(id),`${c.id}: ${id} is not a British object`); assert.ok(!seen.has(id),`${id} is in two clusters`); seen.set(id,c.id); }
    assert.equal(seen.size,objects.length,`objects in no cluster: ${ids.filter(i=>!seen.has(i))}`);
    assert.equal(new Set(LONDON_CLUSTERS.map(c=>c.tint)).size,LONDON_CLUSTERS.length,'each cluster stands on a tint of its own');
    const far=[];
    for(const c of LONDON_CLUSTERS){ let r=0; for(const id of c.ids){ const o=objects.find(x=>x.id===id); const d=Math.hypot(o.pos[0]-c.centre[0],o.pos[1]-c.centre[1]); r=Math.max(r,d); if(d>c.radius+1e-9) far.push(`${id} is ${d.toFixed(2)} from the centre of ${c.id}, over its ${c.radius}`); } clusterReport.push(`${c.id} r ${r.toFixed(2)}/${c.radius}`); }
    assert.deepEqual(far,[],'an object stands outside its cluster');
    const hull=pts=>{pts=[...pts].sort((a,b)=>a[0]-b[0]||a[1]-b[1]);const cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);const lo=[],up=[];for(const p of pts){while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],p)<=0)lo.pop();lo.push(p);}for(const p of [...pts].reverse()){while(up.length>=2&&cr(up[up.length-2],up[up.length-1],p)<=0)up.pop();up.push(p);}return lo.slice(0,-1).concat(up.slice(0,-1));};
    const segD=(p,a,b)=>{const ex=b[0]-a[0],ez=b[1]-a[1],l2=ex*ex+ez*ez||1;const t=Math.max(0,Math.min(1,((p[0]-a[0])*ex+(p[1]-a[1])*ez)/l2));return Math.hypot(p[0]-a[0]-ex*t,p[1]-a[1]-ez*t);};
    const edges=h=>h.length<2?[[h[0],h[0]]]:h.map((p,i)=>[p,h[(i+1)%h.length]]);
    const dist=(A,B)=>{let d=1e9;for(const [a,b] of edges(A))for(const p of B)d=Math.min(d,segD(p,a,b));for(const [a,b] of edges(B))for(const p of A)d=Math.min(d,segD(p,a,b));return d;};
    const anchorHull=new Map(LONDON_CLUSTERS.map(c=>[c.id,hull(c.ids.map(id=>objects.find(o=>o.id===id).pos))]));
    const feetHull=new Map(LONDON_CLUSTERS.map(c=>[c.id,hull(c.ids.flatMap(id=>{const st=stands.find(s=>s.id===id);const b=new THREE.Box3().setFromObject(st.group);return [[b.min.x,b.min.z],[b.min.x,b.max.z],[b.max.x,b.min.z],[b.max.x,b.max.z]];}))]));
    const close=[];
    for(let i=0;i<LONDON_CLUSTERS.length;i++) for(let j=i+1;j<LONDON_CLUSTERS.length;j++){
      const a=LONDON_CLUSTERS[i], b=LONDON_CLUSTERS[j], A=anchorHull.get(a.id), B=anchorHull.get(b.id);
      for(const id of b.ids){ const p=objects.find(o=>o.id===id).pos; if(A.length>=3&&inPolygon(p[0],p[1],A)) close.push(`${id} of ${b.id} stands inside the hull of ${a.id}`); }
      for(const id of a.ids){ const p=objects.find(o=>o.id===id).pos; if(B.length>=3&&inPolygon(p[0],p[1],B)) close.push(`${id} of ${a.id} stands inside the hull of ${b.id}`); }
      const d=dist(A,B), fd=dist(feetHull.get(a.id),feetHull.get(b.id));
      if(d<8&&!(['westminster','docks'].includes(a.id)&&['westminster','docks'].includes(b.id))) close.push(`${a.id} and ${b.id}: their hulls are ${d.toFixed(2)} apart, under 8`);
      // UK re-lay, 2026-09-24: the open ground between two clusters' footprint hulls is at least China's gap between
      // Sichuan and Xinjiang, the owner's own example of separated areas, and never under 10.
      // Owner round, 2026-09-24 ("Tower Bridge is not in London"): Westminster and the Docks are one city on one river,
      // two sub-clusters with town ground between them, so this one pair is exempt from the countryside gap.
      const CITY=new Set(['westminster','docks']);
      if(!(CITY.has(a.id)&&CITY.has(b.id))&&fd<Math.max(CHINA_GAP,10)) close.push(`${a.id} and ${b.id}: ${fd.toFixed(2)} of open ground between their footprints, under China's ${CHINA_GAP}`);
      if(fd<24) clusterReport.push(`${a.id}/${b.id} ${d.toFixed(1)} (ground ${fd.toFixed(1)})`);
    }
    assert.deepEqual(close,[],'two clusters run together');
  }

  // ---------- the landscape the blueprint asked for, and the decor it retired ----------
  const missingNames=[];
  for(const name of ['britain-sea','britain-sea-rim','island-river','island-river-bank','west-tarn','cockle-sand-wet','britain-bridge','britain-house','gas-lamp','street-vehicle','hop-row','drystone-wall','granite-hedgebank','peat-stack','orchard-tree','moor-bracken','britain-walker','britain-pony'])
    if(!world.group.getObjectByName(name)) missingNames.push(name);
  assert.deepEqual(missingNames,[],'missing from the British land');
  // ---------- the gulls: pale, small, over the table and off every stand's rays ----------
  // Second walkthrough 54 (2026-09-23): black gulls drew as planks over the paper past the table edge and crossed
  // the pie shop's, Tower Bridge's and the bakehouse's rays. Every British flock is named `britain-birds`. Over 240
  // seconds, sampled every 2, each bird's point on the ground behind it from the arrival camera (2, 48, 60) must
  // lie on the table, and no bird may come within 0.35 of any of the ten arrival rays of a stand that has props.
  if(LONDON_PROPS){
    const flocks=world.group.children.filter(o=>o.name==='britain-birds');
    assert.ok(flocks.length>=3,`Britain keeps its gulls: ${flocks.length} flocks`);
    for(const f of flocks){ let tone=null; f.traverse(o=>{ if(o.isMesh&&!tone) tone=o.material.color; }); const hex=tone?.getHexString()??'000000'; assert.ok([0,2,4].every(i=>parseInt(hex.slice(i,i+2),16)>=180),`a British flock is #${hex}; the gulls are pale grey-white`); }
    const D=new THREE.Vector3(2,48,60).normalize(), aimsOf=[];
    for(const st of stands){ if(st.proxy)continue; const b=new THREE.Box3().setFromObject(st.group); const floor=Math.max(b.min.y,0), aims=[];
      for(const fx of [.2,.5,.8]) for(const dy of [.8,1.5,2.2]) aims.push(new THREE.Vector3(b.min.x+(b.max.x-b.min.x)*fx,floor+dy,b.max.z-.2));
      aims.push(new THREE.Vector3(st.obj.pos[0],b.max.y+.7,st.obj.pos[1])); aimsOf.push([st.id,aims]); }
    const offTable=new Set(), crossed=new Set(), p=new THREE.Vector3(), v=new THREE.Vector3();
    for(let t=0;t<=240;t+=2){
      world.tick(1000+t,1/60); world.group.updateMatrixWorld(true);
      for(const f of flocks) for(const bird of f.children){
        bird.getWorldPosition(p);
        const gx=p.x-p.y*D.x/D.y, gz=p.z-p.y*D.z/D.y;
        if(gx<TABLE.minX+.3||gx>TABLE.maxX-.3||gz<TABLE.minZ+.3||gz>TABLE.maxZ-.3) offTable.add(`a gull draws over the paper at ${gx.toFixed(1)}, ${gz.toFixed(1)}`);
        for(const [id,aims] of aimsOf) for(const a of aims){ v.copy(p).sub(a); const along=v.dot(D); if(along<=0)continue; if(v.addScaledVector(D,-along).length()<.35) crossed.add(`${id}: a gull crosses a ray near ${p.x.toFixed(1)}, ${p.z.toFixed(1)}`); }
      }
    }
    assert.deepEqual([...offTable],[],'a gull draws over the paper beyond the table');
    assert.deepEqual([...crossed],[],'a gull crosses a stand\'s arrival ray');
    measured.gulls=flocks.reduce((n,f)=>n+f.children.length,0);
  }
  // ---------- nothing of the Builder's stands on the palace's roof line ----------
  // Second walkthrough 56 (2026-09-23): the walled pen, its ewes and the two neighbours at its gate stood 2 to 5
  // behind the palace, and the arrival camera, looking down at 39 degrees, drew them on its roof. No scenery taller
  // than 0.5 may stand within the palace's width and within 1.25 times its hall's height (4.6) plus 1.5 behind it.
  // The rhubarb forcing shed is a stand at its own position and is not the Builder's to move; it is not scenery.
  {
    const palace=world.placed.find(p=>p.obj.id==='bigBen'); assert.ok(palace,'Big Ben is placed');
    const pb=new THREE.Box3().setFromObject(palace.group), standGroups=new Set(world.placed.map(p=>p.group));
    const behind=[];
    for(const o of world.group.children){
      if(standGroups.has(o)||o.isSprite||!o.name||/^(britain-sea|britain-sea-rim|island-river|island-river-bank|britain-road|britain-birds|explore-cue)$/.test(o.name))continue;
      const b=new THREE.Box3().setFromObject(o); if(!Number.isFinite(b.min.x)||b.max.y<=.5)continue;
      if(b.max.x>pb.min.x&&b.min.x<pb.max.x&&b.max.z<=pb.min.z+.01&&b.max.z>pb.min.z-(1.25*4.6+1.5)) behind.push(`${o.name} [${b.min.x.toFixed(1)}..${b.max.x.toFixed(1)}, ${b.min.z.toFixed(1)}..${b.max.z.toFixed(1)}] ${b.max.y.toFixed(2)} high`);
    }
    assert.deepEqual(behind,[],'scenery stands on the palace roof line from the arrival camera');
  }
  // The 1907 omnibus and the two hansom cabs, and nothing else, run on the Westminster street.
  assert.equal(world.group.children.filter(o=>o.name==='street-vehicle').length,3,'one motor omnibus and two hansom cabs');
  // The decor the blueprint retired. The red bus, the black cab, the London Eye and the K6 kiosk are all
  // post-war or out of band, and none of them is built anywhere in the Builder's own files.
  {
    const strip=s=>s.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\/\/[^\n]*/g,'');
    for(const file of ['src/fw/world-ceurope.ts','src/fw/london-town.ts','src/fw/london-countryside.ts','src/fw/london-landscape.ts','src/fw/london-architecture.ts','src/fw/london-people.ts']){
      const src=strip(await readFile(file,'utf8'));
      // `redBus` survives as an object id (the omnibus stand keeps it), so it is the builder call that is barred.
      for(const gone of [/\bredBus\s*\(/,/\bblackCab\b/,/\blondonEye\b/,/\bK6\b/,/\bkiosk\b/i,/\bthames\b/i,/\bRoutemaster\b/i]) {
        assert.ok(!gone.test(src),`${file}: ${gone} is back; the blueprint retires it`);
      }
    }
  }
  // ---------- the UK table: Britain alone (owner ruling and UK re-lay, 2026-09-24) ----------
  // Budapest, the Alps and Georgia leave this table for a Central Europe world of their own: none of their objects is
  // placed, none of their water or scenery is built, and their object definitions stay in graph.ts for that world.
  {
    const OFF=new Set(['budapest','alps','georgia']);
    const onTable=world.placed.filter(p=>OFF.has(p.obj.area)).map(p=>`${p.obj.id} (${p.obj.area})`);
    assert.deepEqual(onTable,[],'a Budapest, Alps or Georgia object is on the UK table');
    assert.ok(CEUROPE_OBJECTS.filter(o=>OFF.has(o.area)).length>=15,'the continental objects must stay defined in graph.ts for the Central Europe world to come');
    for(const name of ['black-sea','danube']) assert.ok(!world.group.getObjectByName(name),`${name} is still built on the UK table`);
    assert.ok(world.placed.every(p=>UK_AREAS.has(p.obj.area)),'every object on the table is British');
    assert.equal(WORLDS['central-europe'].name,'United Kingdom','the world is called the United Kingdom');
    assert.equal(MAP_REGIONS.find(r=>r.id==='central-europe').name,'United Kingdom','the landing region is called the United Kingdom');
    const src=(await readFile('src/fw/world-ceurope.ts','utf8')).replace(/\/\*[\s\S]*?\*\//g,'').replace(/\/\/[^\n]*/g,'');
    assert.ok(/W:\s*106,\s*D:\s*112,\s*cx:\s*-50,\s*cz:\s*10/.test(src),'the table must be W 106, D 112, cx -50, cz 10');
  }

  // ---------- residents: eight profiles, women, children, distinct paces ----------
  const walkers=world.group.children.filter(o=>o.name==='britain-walker');
  assert.equal(walkers.length,LD_LANES.reduce((n,l)=>n+l.walkers,0));
  assert.ok(walkers.length>=20,'Britain needs four peopled loops');
  assert.equal(LD_LANES.filter(l=>l.pace===.009).length>0,true,'the Westminster street walks at 0.009');
  assert.ok(LD_LANES.every(l=>l.pace===.009||l.pace===.007),'every other lane walks at 0.007');
  const residents=[];world.group.traverse(o=>{if(o.userData.britishResident)residents.push(o)});
  assert.ok(new Set(residents.map(o=>o.userData.profile)).size>=6,'street clothing needs distinct silhouettes');
  assert.ok(new Set(residents.map(o=>o.userData.pace)).size>=5,'residents need different paces');
  assert.ok(residents.some(o=>o.userData.woman),'women walk the lanes');
  assert.ok(residents.some(o=>o.userData.child),'children walk the lanes');
  assert.ok(residents.some(o=>o.userData.profile==='crossing-sweeper'),'the street needs its crossing-sweeper');
  assert.equal(world.group.children.filter(o=>o.name==='britain-pony').length,1);
  assert.ok(LD_LANES.some(l=>l.id===PONY_LANE),'the pony lane must be one of the four loops');

  // ---------- 240 simulated seconds: walkers stay on the ground, out of water and out of walls ----------
  const obstacles=[];
  for(const root of world.group.children){
    if(/^(britain-walker|britain-neighbour|britain-pony|pony-lead|britain-bridge|street-vehicle)$/.test(root.name||''))continue;
    if(root.userData.placed||placedGroups.has(root))continue;
    if(root.position.x<LD_BAND[0]-2||root.position.x>LD_BAND[1])continue;
    root.traverse(o=>{
      if(!o.isMesh||o.material?.visible===false||o.material?.opacity===0)return;
      o.geometry.computeBoundingBox();
      const b=o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld);
      if(b.max.y>.30&&b.min.y<1.35) obstacles.push({b,owner:`${root.name||'scenery'} [${b.min.x.toFixed(1)}..${b.max.x.toFixed(1)}, ${b.min.z.toFixed(1)}..${b.max.z.toFixed(1)}]`});
    });
  }
  const own=world.group.children.filter(o=>o.userData.britishResident&&o.userData.tick);
  const collisions=new Set(), gait=new Map(own.map(o=>[o,{last:o.position.clone(),stopped:0,walking:0,paused:0}]));
  const rigged=[];
  world.group.traverse(o=>{ if(o.userData?.legs?.left?.thigh&&o.userData.britishResident) rigged.push(o); });
  assert.ok(rigged.length>=20,`Britain should be peopled, found ${rigged.length} leg rigs`);
  const carriedBy=o=>{ let p=o; while(p){ if(p.name==='street-vehicle') return true; p=p.parent; } return false; };
  const strides=rigged.map(o=>({o,name:o.name||`figure at ${o.position.x.toFixed(1)}, ${o.position.z.toFixed(1)}`,seated:carriedBy(o),travelled:0,swung:0,prev:null,prevLeg:0}));
  const here=new THREE.Vector3();
  const pony=world.group.children.find(o=>o.name==='britain-pony');
  const runOver=new Set();
  // A vehicle's body is its chassis and its horse, not the crew figures whose legs swing past its sides.
  const vehicles=world.group.children.filter(o=>o.name==='street-vehicle').map(v=>{
    const pos=v.position.clone(), rot=v.rotation.y; v.position.set(0,0,0); v.rotation.y=0; v.updateMatrixWorld(true);
    const local=new THREE.Box3().setFromObject(v); v.position.copy(pos); v.rotation.y=rot; v.updateMatrixWorld(true);
    return {v,local};
  });
  for(let frame=0;frame<1200;frame++){
    world.tick(frame*.2,.2); world.group.updateMatrixWorld(true);
    for(const s of strides){
      s.o.getWorldPosition(here);
      const leg=s.o.userData.legs.left.thigh.rotation.x;
      if(s.prev){ s.travelled+=Math.hypot(here.x-s.prev.x,here.z-s.prev.z); s.swung+=Math.abs(leg-s.prevLeg); }
      s.prev=here.clone(); s.prevLeg=leg;
    }
    for(const w of walkers){
      assert.ok(w.position.y>=.033&&w.position.y<=BRIDGE_DECK_Y+.01,`a walker left the ground at y ${w.position.y.toFixed(3)}`);
      assert.ok(!isWet(w.position.x,w.position.z)||onBridge(w.position.x,w.position.z),`walker ${w.userData.lane} is in the water at ${w.position.x.toFixed(1)}, ${w.position.z.toFixed(1)}`);
      for(const {b,owner} of obstacles) if(w.position.x>b.min.x-.38&&w.position.x<b.max.x+.38&&w.position.z>b.min.z-.38&&w.position.z<b.max.z+.38) collisions.add(`${w.userData.lane}: ${owner}`);
    }
    // Nobody walks through the omnibus or a cab. Tested in each vehicle's own frame, on the box it has when it
    // stands square, so a cab swinging round at the end of the street is not judged by its diagonal box.
    for(const v of vehicles){ const q=new THREE.Vector3(); for(const w of walkers){ q.copy(w.position); v.v.worldToLocal(q); if(q.x>v.local.min.x-.15&&q.x<v.local.max.x+.15&&q.z>v.local.min.z-.15&&q.z<v.local.max.z+.15) runOver.add(`${w.userData.lane} walks through a street vehicle near ${w.position.x.toFixed(1)}, ${w.position.z.toFixed(1)}`); } }
    assert.ok(!isWet(pony.position.x,pony.position.z),`the pony is in the water at ${pony.position.x.toFixed(1)}, ${pony.position.z.toFixed(1)}`);
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
  assert.deepEqual([...collisions],[],'a British walking route intersects an object at body height');
  assert.deepEqual([...runOver],[],'a walker and a street vehicle occupy the same ground');
  for(const w of walkers){const sample=gait.get(w);assert.ok(sample.walking>0&&sample.paused>0,`${w.userData.lane}: a resident must both walk and stop`);}

  // ---------- the pony leads with its head, and its hooves go backward while they are down ----------
  {
    const leg=pony.getObjectByName('pony-leg');
    assert.ok(leg,'the pony needs a named leg to read its gait from');
    const facing=new THREE.Vector3(), was=new THREE.Vector3(), now=new THREE.Vector3(), travel=new THREE.Vector3(), turn=new THREE.Quaternion();
    let worst=1, back2=0, forward=0, covered2=0, hoofWas=null;
    pony.getWorldPosition(was);
    for(let f=0;f<1800;f++){
      world.tick(400+f/60,1/60); world.group.updateMatrixWorld(true);
      pony.getWorldPosition(now); travel.subVectors(now,was); was.copy(now);
      const gone=travel.length();
      if(gone>1e-4){
        covered2+=gone;
        facing.set(1,0,0).applyQuaternion(pony.getWorldQuaternion(turn)).normalize();
        worst=Math.min(worst,facing.dot(travel.normalize()));
      }
      const hoof=Math.sin(leg.rotation.z);
      if(hoofWas!==null&&gone>1e-4){ if(hoof<hoofWas-1e-9) back2++; else if(hoof>hoofWas+1e-9) forward++; }
      hoofWas=hoof;
    }
    assert.ok(covered2>2,`the pony should walk its lane, it covered ${covered2.toFixed(2)}`);
    assert.ok(worst>.9,`the pony walks backward: its head axis scores ${worst.toFixed(2)} against its direction of travel`);
    assert.ok(back2>forward*1.3,`the pony's hooves go forward as often as back (${back2} back, ${forward} forward): the gait reads as sliding, not stepping`);
  }

  const sliding=strides.filter(s=>!s.seated&&s.travelled>1&&s.swung<1e-6).map(s=>`${s.name} covered ${s.travelled.toFixed(1)} with its legs locked`);
  assert.deepEqual(sliding,[],'a figure travels across the table without stepping');
  const marching=strides.filter(s=>!s.seated&&s.travelled<=.05&&s.swung>.05).map(s=>`${s.name} swung its legs ${s.swung.toFixed(2)} while standing still`);
  assert.deepEqual(marching,[],'a figure steps on the spot');

  console.log(`PASS: ${LD_ROADS.length} continuous roads, ${objects.length} British objects${LONDON_PROPS?` with ${stands.length} props clear of the water (the oyster stand's ${measured.oysterQuay} quay meshes on dry ground)`:' (props-london.ts absent: stand geometry NOT RUN)'}, ${houses.length} houses, ${bridges.length} crossing, ${measured.gulls??0} pale gulls over the table and off every ray, ${walkers.length} walkers, 240 seconds of motion.`);
  console.log(`      doors: ${doors.map(([id,d])=>`${id} ${d.toFixed(2)}`).join(', ')}`);
  console.log(`      road ends: ${ends.join('; ')}`);
  console.log(`      clusters: ${clusterReport.join('; ')}`);
  console.log(`      water clearance: ${housesAndBuildings.map(([l,d])=>`${l} ${d}`).join(', ')}`);
  for(const line of notRun) console.log(`      NOT RUN: ${line}`);
  if(process.env.LONDON_DUMP) console.log(JSON.stringify(measured,null,1));
  { const counts={}; for(const d of decor) counts[d.name]=(counts[d.name]||0)+1; console.log(`      decor: ${Object.entries(counts).map(([k,v])=>`${k} ${v}`).join(', ')}`); }
}finally{await rm(temp,{recursive:true,force:true})}
