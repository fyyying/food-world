/**
 * Britain stands: the click chain, the 1.6-second camera arrival, bounded repeats and a clean return to rest.
 * Copied from thailand-reactions.mjs with the British ids of docs/london-world.md, and carrying the same checks:
 * the reaction subject has to be unblocked **and** inside main.ts's 34-degree arrival frame, every figure that
 * travels has to step, and a grep over the source has to find nothing outside the 1880-to-1914 band. The sight
 * line is measured at the rotation `london-objects.ts` gives the object wherever that rotation leaves the stand
 * facing the visitor, and from the stand's own front wherever it does not (see 3b, and the NOTE it prints).
 *
 * Two differences from the Thailand harness, both of them this area's own:
 *
 * - The speech is English first. Thailand asserted a local phrase and its English on every line; here only the
 *   stands whose people did not speak English at work carry a two-script line, and those ids are named below.
 * - A figure carried by a moving vehicle is seated, which is what the definition of done requires of it, so the
 *   gait check accepts a seated figure in place of a stepping one and asserts that it really is seated. Nobody
 *   rides the omnibus standing: the conductor calls from the pavement.
 */
import assert from 'node:assert/strict';
import {mkdtemp,rm,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {build} from 'rolldown';
import * as THREE from 'three';
const ctx=new Proxy({}, {get:(_,key)=>key==='createLinearGradient'||key==='createRadialGradient'?()=>({addColorStop(){}}):key==='measureText'?()=>({width:20}):()=>{},set:()=>true});
globalThis.document={visibilityState:'hidden',defaultView:{Element:class {}},createElement:()=>({ownerDocument:document,getContext:()=>ctx,style:{},setAttribute(){},classList:{add(){},remove(){},toggle(){}},addEventListener(){}})};
const temp=await mkdtemp(join(tmpdir(),'london-reactions-'));
try{
  await build({input:{props:'src/fw/props-london.ts',objects:'src/fw/london-objects.ts'},platform:'node',output:{dir:temp,format:'esm',entryFileNames:'[name].mjs',chunkFileNames:'[name].mjs',banner:'import.meta.env={VITE_STATIC:"1",BASE_URL:"/"};'}});
  const props=await import(pathToFileURL(join(temp,'props.mjs')));
  const {LONDON_PROPS,LONDON_ICONS,UK_LINES}=props;
  const {LONDON_OBJECTS}=await import(pathToFileURL(join(temp,'objects.mjs')));

  // 0. Every prop name in the Britain object list has a stand, and nothing else is exported as one.
  const rooms=['pub','teaRoom','boroughMarket','pieShop','chipShop','coffeeStall','lascarKitchen','hopCookhouse',
    'daleDairy','pastyBakehouse','cockleStall','smokehouse','distillery'];
  const stops=['bakeryCe','oysterSmack','hopGarden','mushroomWood','daleFlock','forcingShed','ciderOrchard','leekBed','oatMill','herringQuay'];
  const landmarks=['bigBen','towerBridge','omnibus','pillarBox','forthBridge','engineHouse'];
  const expected=[...rooms,...stops,...landmarks];
  assert.deepEqual(Object.keys(LONDON_PROPS).sort(),[...expected].sort(),'LONDON_PROPS holds one stand per prop name in docs/london-world.md');
  assert.equal(expected.length,29,'29 stands: 13 rooms, 10 ingredient stops, 6 landmarks');
  // The owner's recastings: the London Eye is retired, the red bus is an omnibus and the kiosk is a pillar box.
  assert.ok(!LONDON_PROPS.londonEye&&!LONDON_PROPS.phoneBox&&!LONDON_PROPS.redBus,'the wheel, the kiosk and the red bus were retired or recast');
  for(const [name,what] of [['horseOmnibus','the knifeboard omnibus'],['hansomCab','the hansom cab'],['motorOmnibus','the 1907 motor omnibus'],['costerBarrow','the coster’s barrow'],['cockleDonkey','the donkey and cart']])
    assert.equal(typeof props[name],'function',`${what} is exported for the Builder’s road decor`);

  // 0b. The object list and this file agree: every object names a prop and every one of those props is built here.
  assert.equal(LONDON_OBJECTS.length,29,'the object list carries the same twenty-nine objects');
  for(const o of LONDON_OBJECTS){
    assert.ok(o.prop&&o.prop!=='none',`${o.id}: every Britain object carries a prop of its own`);
    assert.ok(typeof LONDON_PROPS[o.prop]==='function',`${o.id}: no builder in LONDON_PROPS for prop \`${o.prop}\``);
  }
  assert.deepEqual([...new Set(LONDON_OBJECTS.map(o=>o.prop))].sort(),[...expected].sort(),
    'the twenty-nine props the object list names are exactly the twenty-nine stands');

  // 0c. Nothing outside the 1880-to-1914 band is built. The period was the owner's first Stage B decision and
  // these are the objects the brief names as out of it. Comments may say what was removed and why, so the grep
  // runs over the code with its comments stripped.
  const source=await readFile('src/fw/props-london.ts','utf8');
  const code=source.replace(/\/\*[\s\S]*?\*\//g,'').split('\n').map(l=>l.replace(/(^|[^:"'`])\/\/.*$/,'$1'));
  for(const [what,pattern] of [
    ['a Routemaster',/routemaster/i],
    ['a K6 telephone kiosk',/\bk6\b|kiosk|telephone|phone ?box/i],
    ['the London Eye',/london ?eye|observation ?wheel|\bpod\b/i],
    ['a motorcar',/\bcars?\b|motor ?car|automobile|\btaxi\b|black ?cab/i],
    ['a red bus',/red ?bus|double ?decker/i],
    ['a traffic light or a road sign of the motor age',/traffic ?light|zebra|belisha|bollard ?light/i],
    ['a tarmac road or a modern surface',/tarmac|asphalt|concrete/i],
  ]){
    // Only the object ids `redBus` and `phoneBox` survive the recasting, as the speech keys of the omnibus stand
    // and the pillar-box stand, because `graph.ts` keeps them; the line that passes one to `life()` is exempt.
    const hits=code.map((l,i)=>[i+1,l]).filter(([,l])=>pattern.test(l)&&!/life\(g, ?"(redBus|phoneBox)"/.test(l));
    assert.equal(hits.length,0,`props-london.ts builds ${what}, which is outside the 1880-1914 band: line ${hits[0]?.[0]} ${hits[0]?.[1]?.trim()}`);
  }

  // 0d. The two recast landmarks are built the way the ruling describes them, not renamed in place. The omnibus
  // is horse-drawn with a knifeboard on the roof and a pair in the traces; the pillar box is the hexagonal
  // Penfold with a collection door and a gas standard beside it.
  {
    const bus=props.horseOmnibus();
    assert.ok(bus.getObjectByName('omnibus-body'),'the omnibus has a body on its own wheels');
    assert.equal(bus.userData.pair.length,2,'a pair of horses draws it, not an engine');
    assert.equal(bus.userData.wheels.length,4,'four wheels under the knifeboard');
    assert.ok(bus.userData.figures.every(f=>f.userData.seatTop!==undefined),'everyone the omnibus carries is seated');
    const cab=props.hansomCab(true);
    assert.ok(cab.getObjectByName('hansom-body'),'the hansom has a body');
    assert.equal(cab.userData.wheels.length,2,'two tall wheels and the driver up behind');
    const boxStand=LONDON_PROPS.pillarBox();
    assert.ok(boxStand.getObjectByName('pillar-post')&&boxStand.getObjectByName('pillar-door'),'the Penfold has a column and a collection door');
    assert.ok(boxStand.getObjectByName('lamplighter-pole'),'the lamplighter works the lamp with a pole');
  }

  // 1. Every room object carries a card badge, and every one of the twenty-nine objects has ambient speech.
  const roomIds=['roastPub','teaRoomUk','boroughUk','pieMashUk','chippyUk','breakfastUk','lascarUk','hopKitchenUk','dairyUk','pastyUk','cocklesUk','smokehouseUk','distilleryUk'];
  for(const id of roomIds){
    assert.ok(typeof LONDON_ICONS[id]==='function',`${id}: needs a rendered card badge`);
    assert.ok(LONDON_ICONS[id]().children.length>0,`${id}: the badge must model something`);
  }
  assert.equal(Object.keys(LONDON_ICONS).length,13,'thirteen room badges, one per painted room');
  const stopIds=['pastryCe','oystersUk','hopsUk','mushroomsCe','sheepUk','rhubarbUk','orchardUk','leeksUk','oatsUk','herringUk'];
  const landmarkIds=['bigBen','towerBridge','redBus','phoneBox','forthBridge','engineHouseUk'];
  const ids=[...roomIds,...stopIds,...landmarkIds];
  assert.equal(ids.length,29,'13 rooms, 10 ingredient stops and 6 landmarks carry ambient speech');
  for(const id of ids){
    const lines=UK_LINES[id];
    assert.ok(Array.isArray(lines)&&lines.length>=4&&lines.length<=8,`${id}: four to eight ambient speech lines, found ${lines?.length}`);
    for(const line of lines) assert.ok(line.trim().length>0&&line.length<=90,`${id}: "${line}" is not a bubble-sized line`);
  }
  assert.equal(Object.keys(UK_LINES).length,29,'UK_LINES, the Researcher’s file, covers the twenty-nine card objects');
  // The six stands whose people did not work in English carry the local language and the English on one line.
  for(const id of ['lascarUk','cocklesUk','leeksUk','pastyUk','distilleryUk']){
    const two=UK_LINES[id].filter(l=>/\S\s·\s\S/.test(l)&&/[A-Za-z]/.test(l.split(' · ')[1]??''));
    assert.ok(two.length>=1,`${id}: at least one line must carry the local language and English on one line`);
  }
  assert.deepEqual([...LONDON_OBJECTS.map(o=>o.id)].sort(),[...ids].sort(),'the object list and the speech table name the same twenty-nine objects');

  const bubbleCount=root=>{let count=0;root.traverse(o=>{if(o.element?.className==='bubble')count++;});return count;};
  const worldMatrix=(root,name)=>{const o=root.getObjectByName(name);assert.ok(o,`missing named reacting subject ${name}`);root.updateMatrixWorld(true);return o.matrixWorld.elements.slice();};
  const run=(stand,seconds,poke)=>{if(poke)stand.userData.poke();for(let i=1;i<=Math.round(seconds/.1);i++)stand.userData.tick(i*.1,.1);return stand;};

  // 2. The food moves before anyone speaks, and the speech arrives after the physical response.
  const ordered=LONDON_PROPS.pub(),slice=ordered.getObjectByName('pub-slice'),sliceX=slice.position.x;
  ordered.userData.poke();assert.equal(bubbleCount(ordered),0,'speech waits for the knife');
  ordered.userData.tick(.1,.1);assert.notEqual(slice.position.x,sliceX,'the slice moves on the first reaction frame');
  assert.equal(bubbleCount(ordered),0,'speech stays subordinate during the first beat');
  ordered.userData.tick(.4,.3);assert.equal(bubbleCount(ordered),1,'speech follows the physical response');

  // 3. Every stand owns its reaction, and its named subject is still visibly changed when the camera arrives at 1.6 s.
  const subjects={
    pub:'pub-slice',teaRoom:'tearoom-pot',boroughMarket:'market-wedge',pieShop:'pie-lid',chipShop:'chippy-basket',
    coffeeStall:'breakfast-rasher',lascarKitchen:'lascar-spice',hopCookhouse:'hop-ladle',daleDairy:'dairy-truckle',
    pastyBakehouse:'pasty-tray',cockleStall:'cockle-riddle',smokehouse:'smoke-speet',distillery:'distillery-barley',
    bakeryCe:'pastry-block',oysterSmack:'oyster-lid',hopGarden:'hop-bine',mushroomWood:'wood-cep',daleFlock:'flock-ewe',
    forcingShed:'rhubarb-stick',ciderOrchard:'harvest-fruit',leekBed:'leek-pulled',oatMill:'oat-meal',herringQuay:'herring-basket',
    bigBen:'bigben-minute',towerBridge:'bridge-bascule',omnibus:'omnibus-body',pillarBox:'pillar-door',
    forthBridge:'forth-train',engineHouse:'engine-beam'};
  assert.deepEqual(Object.keys(subjects).sort(),[...expected].sort(),'every stand names the subject that answers a click');
  for(const [id,name] of Object.entries(subjects)){
    const still=LONDON_PROPS[id](),poked=LONDON_PROPS[id]();
    assert.equal(poked.userData.ownReaction,true,`${id}: the stand animates itself, no generic bounce`);
    assert.equal(typeof poked.userData.poke,'function',`${id}: a click must do something`);
    poked.userData.poke();
    const quiet=name==='harvest-fruit'?null:worldMatrix(still,name);
    for(let i=1;i<=16;i++){still.userData.tick(i*.1,.1);poked.userData.tick(i*.1,.1);}
    const moved=worldMatrix(poked,name);
    if(quiet){
      const rest=worldMatrix(still,name);
      const delta=Math.max(...moved.map((v,i)=>Math.abs(v-rest[i])),...moved.map((v,i)=>Math.abs(v-quiet[i])));
      assert.ok(delta>.02,`${id}: ${name} must still be clearly changed when the camera arrives at 1.6 s (delta ${delta.toFixed(4)})`);
    }
  }

  // 3b. The arrival camera can see the reaction, from either end of its range as well as from the middle.
  // main.ts flies to the object in 1.6 seconds and stops on a horizontal offset of max(8.8, min(18, the larger
  // footprint side x 1.05)) with the eye 1.4 above the anchor's 1.2, and OrbitControls clamps the azimuth to
  // plus or minus 0.75 radians. From each of those three directions a ray to the reacting subject, the stand
  // turned to the rotation london-objects.ts gives it, must reach it without meeting another mesh of the same
  // stand: no roof, shade, post, beam, oast, shed or bystander. The stand's own buildings are blockers under
  // exactly the same rule as the town's, which is the playbook's Stage C note. And the subject has to be inside
  // the 34-degree lens as well as unblocked, because a thing above the roofline is off the top of the screen
  // when the flight ends. Five takes each, because the shared rnd() seed moves the figures a little every build.
  //
  // The world is only ever looked at from the +z side: `main.ts` sets the overview camera on +z and clamps the
  // orbit azimuth to plus or minus 0.75, so a stand's working front has to face +z. At Stage C the blueprint
  // turned each object toward its nearest road and 25 of 29 showed the visitor their backs; at Stage D
  // (2026-09-22) every rotation in `london-objects.ts` was brought inside [-0.75, 0.75] and roads were brought to
  // the doors instead. Inside that window a stand is also turned no further than its own sight lines allow:
  // stand rotation and camera azimuth add, and an open bay shows its gable past about a radian. The fallback
  // below, which measured a stand turned more than a radian from its own front, now finds nothing to do, and
  // the assertion after the loop keeps it that way.
  //
  // main.ts has two arrivals, and each object is measured against the one it really gets (as italy-reactions.mjs
  // does since 2026-09-23): a room object (`scene` set) flies in 1.6 s to the low, close offset above; a card-only
  // object glides to 28 units from the anchor plus 0.8 at the visitor's own pitch, the (2, 48, 60) direction the
  // world camera drops in on, with the target pushed 5 to the right so the card does not cover the subject
  // (`openObject`, `glideTo`). Measured against the room arrival, a clock tower could never be taller than the
  // stalls round it (walkthrough item 1).
  const roomProp=new Set(LONDON_OBJECTS.filter(o=>o.scene).map(o=>o.prop));
  const CARD_DIR=new THREE.Vector3(2,48,60).normalize();
  const rotOf=Object.fromEntries(LONDON_OBJECTS.map(o=>[o.prop,o.rot??0]));
  const facingAway=LONDON_OBJECTS.filter(o=>Math.abs(Math.atan2(Math.sin(o.rot??0),Math.cos(o.rot??0)))>1.0).map(o=>o.id);
  const testRot=id=>Math.abs(Math.atan2(Math.sin(rotOf[id]??0),Math.cos(rotOf[id]??0)))>1.0?0:(rotOf[id]??0);
  for(const [id,name] of Object.entries(subjects)) for(let take=0;take<5;take++){
    const stand=LONDON_PROPS[id]();
    stand.rotation.y=testRot(id);
    stand.userData.poke();
    for(let i=1;i<=16;i++)stand.userData.tick(i*.1,.1);
    stand.updateMatrixWorld(true);
    const subject=stand.getObjectByName(name);
    assert.ok(subject,`${id}: no ${name} to look at`);
    const own=new Set();subject.traverse(o=>own.add(o));
    const meshes=[];
    stand.traverse(o=>{
      if(!o.isMesh||own.has(o))return;
      let shown=true;for(let a=o;a;a=a.parent){if(!a.visible)shown=false;if(a.material&&(a.material.visible===false||a.material.opacity===0))shown=false;}
      if(shown)meshes.push(o);
    });
    const whole=new THREE.Box3().setFromObject(stand), size=whole.getSize(new THREE.Vector3()), centre=whole.getCenter(new THREE.Vector3());
    const distance=Math.max(8.8,Math.min(18,Math.max(Math.max(2.2,size.x+.4),Math.max(2.2,size.z+.4))*1.05));
    const target=new THREE.Box3().setFromObject(subject).expandByScalar(.05), aim=target.getCenter(new THREE.Vector3());
    const room=roomProp.has(id);
    for(const azimuth of [-0.75,0,0.75]){
      let eye,look;
      if(room){
        eye=new THREE.Vector3(centre.x+Math.sin(azimuth)*distance,1.2+1.4,centre.z+Math.cos(azimuth)*distance);
        look=new THREE.Vector3(centre.x,1.2,centre.z);
      }else{
        const flat=Math.hypot(CARD_DIR.x,CARD_DIR.z), off=new THREE.Vector3(Math.sin(azimuth)*flat,CARD_DIR.y,Math.cos(azimuth)*flat).multiplyScalar(28);
        const right=new THREE.Vector3(Math.cos(azimuth),0,-Math.sin(azimuth));
        look=new THREE.Vector3(centre.x,.8,centre.z).addScaledVector(right,5);
        eye=look.clone().add(off);
      }
      const dir=aim.clone().sub(eye),reach=dir.length();dir.normalize();
      const entry=new THREE.Ray(eye,dir).intersectBox(target,new THREE.Vector3());
      const stop=entry?entry.distanceTo(eye):reach;
      const blocked=new THREE.Raycaster(eye,dir,0,Math.max(0,stop-.02)).intersectObjects(meshes,false)[0];
      // LONDON_DEBUG=1 names the blocker and where it stands, which is what a fix needs
      if(blocked&&process.env.LONDON_DEBUG){const w=new THREE.Vector3();blocked.object.getWorldPosition(w);const chain=[];for(let b=blocked.object;b;b=b.parent)if(b.name)chain.push(b.name);console.log(`DEBUG ${id} a=${azimuth} blocked by ${chain.join('<')||blocked.object.geometry.type} at (${w.x.toFixed(2)},${w.y.toFixed(2)},${w.z.toFixed(2)}) local(${blocked.object.position.x.toFixed(2)},${blocked.object.position.y.toFixed(2)},${blocked.object.position.z.toFixed(2)}) d=${blocked.distance.toFixed(2)}/${stop.toFixed(2)} aim(${aim.x.toFixed(2)},${aim.y.toFixed(2)},${aim.z.toFixed(2)}) centre(${centre.x.toFixed(2)},${centre.z.toFixed(2)}) D=${distance.toFixed(2)}`);}
      assert.ok(!blocked,`${id}: ${blocked?(blocked.object.name||blocked.object.parent?.name||'a mesh of the stand'):''} hides ${name} from the arrival camera at azimuth ${azimuth} (take ${take})`);
      const lens=new THREE.PerspectiveCamera(34,16/9,.1,400);
      lens.position.copy(eye);lens.lookAt(look);lens.updateMatrixWorld(true);
      const frustum=new THREE.Frustum().setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(lens.projectionMatrix,lens.matrixWorldInverse));
      assert.ok(frustum.containsPoint(aim),`${id}: ${name} is outside the 34-degree ${room?'room':'card'} arrival frame at azimuth ${azimuth} (aim y ${aim.y.toFixed(2)})`);
      // the whole landmark, not only its subject, sits in the card's frame: the tip of Big Ben's spire and the top
      // of the Forth Bridge's towers are on the screen when the glide ends
      if(!room&&(id==='bigBen'||id==='forthBridge')){
        const whole2=new THREE.Box3().setFromObject(stand), top=new THREE.Vector3(aim.x,whole2.max.y,aim.z);
        assert.ok(frustum.containsPoint(top),`${id}: its top at ${whole2.max.y.toFixed(2)} is outside the card frame at azimuth ${azimuth}`);
      }
    }
  }

  // 3c. Two stands answer with light as well as with movement, so the light is measured too: Big Ben's dials
  // warm as at dusk, and the lamplighter's mantle takes light on the Penfold's corner.
  for(const [id,what] of [['bigBen','the dials must warm when the hand steps'],['pillarBox','the mantle must take light from the pole']]){
    const still=LONDON_PROPS[id](),poked=LONDON_PROPS[id]();
    poked.userData.poke();
    for(let i=1;i<=16;i++){still.userData.tick(i*.1,.1);poked.userData.tick(i*.1,.1);}
    const glow=root=>{let top=0;root.traverse(o=>{const m=o.material;if(m?.emissive&&m.emissive.getHex()!==0&&m.emissiveIntensity>top)top=m.emissiveIntensity;});return top;};
    assert.ok(glow(poked)>glow(still)+.3,`${id}: ${what} (${glow(poked).toFixed(2)} vs ${glow(still).toFixed(2)})`);
    for(let i=17;i<=300;i++)poked.userData.tick(i*.1,.1);
    assert.ok(glow(poked)<=glow(still)+1e-6,`${id}: the light returns to its resting value`);
  }

  // 4. The pours connect a real spout to a real vessel, and the stream is gone once the reaction has passed.
  for(const [id,name] of [['teaRoom','tearoom-pour'],['pieShop','pie-liquor'],['daleDairy','dairy-whey']]){
    const stand=run(LONDON_PROPS[id](),1.6,true),liquid=stand.getObjectByName(name);
    assert.ok(liquid,`${id}: needs a modelled ${name}`);
    assert.equal(liquid.visible,true,`${id}: the ${name} must still be running at the 1.6 s arrival`);
    assert.ok(liquid.scale.y>.02,`${id}: the ${name} must span a real distance, not a floating line`);
    for(let i=17;i<=240;i++)stand.userData.tick(i*.1,.1);
    assert.equal(liquid.visible,false,`${id}: the ${name} must stop when the reaction has gone`);
  }

  // 4b. Each pour falls under gravity from a real lip into a real vessel, rather than crossing the stand.
  for(const [id,columnName,vessel,maxGap] of [
    ['teaRoom','tearoom-pour','tearoom-cup',.22],
    ['pieShop','pie-liquor','pie-pie',.26],
    ['daleDairy','dairy-whey','dairy-pail',.26],
  ]){
    const stand=run(LONDON_PROPS[id](),1.6,true);stand.updateMatrixWorld(true);
    const column=stand.getObjectByName(columnName);
    const down=new THREE.Vector3(0,-1,0).applyQuaternion(column.getWorldQuaternion(new THREE.Quaternion()));
    assert.ok(down.y<=-.80,`${id}: the pour must fall rather than cross the stand (its axis points ${down.y.toFixed(2)} down)`);
    const head=column.getWorldPosition(new THREE.Vector3());
    const foot=head.clone().add(down.clone().multiplyScalar(column.scale.y));
    const lip=stand.getObjectByName(vessel).getWorldPosition(new THREE.Vector3());
    assert.ok(foot.distanceTo(lip)<=maxGap,`${id}: the pour must land in the real vessel (${foot.distanceTo(lip).toFixed(2)} from it)`);
  }

  // 4c. The cold room is cold. `uk_dairy` has no fire, no boiling and no steam point, and the market hall is a
  // stone and iron hall of raw food at first light. The owner read the Spanish cheese farm's own text and asked
  // why it was steaming; this is the check that keeps that answer.
  for(const id of ['daleDairy','boroughMarket','bakeryCe','oysterSmack','hopGarden','mushroomWood','daleFlock','forcingShed','ciderOrchard','leekBed','herringQuay']){
    const stand=LONDON_PROPS[id]();
    assert.equal(stand.userData.steam,undefined,`${id}: nothing here is boiled, so nothing steams`);
  }
  assert.equal(LONDON_PROPS.daleDairy().userData.smoke,undefined,'daleDairy: a cold dairy has no fire and no smoke either');

  // 5. Repeated clicks stay bounded and the fruit that falls is cleaned up.
  for(const id of ['ciderOrchard']){
    const stand=LONDON_PROPS[id](),count=stand.children.length;
    for(let i=0;i<40;i++)stand.userData.poke();
    assert.ok(stand.children.length<=count+24,`${id}: repeated clicks must remain bounded`);
    for(let i=0;i<300;i++)stand.userData.tick(i/60,1/60);
    assert.equal(stand.children.length,count,`${id}: falling fruit must clean up`);
  }

  // 6. Everything that moves returns to its exact support, and the people never leave theirs.
  const settling={pub:'pub-slice',teaRoom:'tearoom-pot',boroughMarket:'market-wedge',pieShop:'pie-ladle',
    chipShop:'chippy-basket',coffeeStall:'breakfast-rasher',lascarKitchen:'lascar-spice',hopCookhouse:'hop-ladle',
    daleDairy:'dairy-truckle',pastyBakehouse:'pasty-tray',cockleStall:'cockle-riddle',smokehouse:'smoke-speet',
    distillery:'distillery-shiel',bakeryCe:'pastry-block',oysterSmack:'oyster-lid',mushroomWood:'wood-cep',
    forcingShed:'rhubarb-stick',leekBed:'leek-pulled',oatMill:'oat-meal',herringQuay:'herring-basket',
    towerBridge:'bridge-bascule',pillarBox:'pillar-door',forthBridge:'forth-train'};
  for(const [id,name] of Object.entries(settling)){
    const stand=LONDON_PROPS[id](),subject=stand.getObjectByName(name);
    stand.userData.tick(0,0);subject.updateMatrix();const start=subject.matrix.clone();
    for(let i=0;i<6;i++){stand.userData.poke();for(let k=0;k<20;k++)stand.userData.tick((i*20+k)/60,1/60);}
    for(let i=0;i<300;i++)stand.userData.tick(10+i/60,1/60);
    subject.updateMatrix();
    assert.deepEqual(subject.matrix.elements,start.elements,`${id}: ${name} settles exactly, without drift after repeated clicks`);
  }
  for(const id of expected){
    const stand=LONDON_PROPS[id]();
    const roots=[];stand.traverse(o=>{if(o.userData.upper)roots.push([o,o.position.y]);});
    stand.userData.poke();stand.userData.tick(.2,.2);
    assert.ok(roots.every(([o,y])=>Math.abs(o.position.y-y)<1e-9),`${id}: people stay on their supports`);
  }

  // 6b. Every lamp hangs from a beam within reach, and its cord stays on the anchor while it swings.
  let lampCount=0;
  for(const id of expected){
    const root=LONDON_PROPS[id]();root.updateMatrixWorld(true);
    const meshes=[],lanterns=[];
    root.traverse(o=>{if(o.isMesh)meshes.push(o);if(o.name==='hanging-lantern')lanterns.push(o);});
    for(const lantern of lanterns){
      lampCount++;
      const anchor=lantern.localToWorld(lantern.userData.suspensionPoint.clone());
      let gap=Infinity;
      for(const mesh of meshes){
        let own=false;for(let a=mesh;a;a=a.parent)if(a===lantern)own=true;
        if(own)continue;
        mesh.geometry.computeBoundingBox();
        gap=Math.min(gap,mesh.geometry.boundingBox.clone().applyMatrix4(mesh.matrixWorld).distanceToPoint(anchor));
      }
      assert.ok(gap<=.10,`${id}: a lamp hangs in the air, ${gap.toFixed(3)} from any support`);
      const swing=lantern.children[0];
      for(const time of [0,1,7,19]){
        lantern.userData.tick(time,.016);root.updateMatrixWorld(true);
        const cord=swing.children.at(-1);cord.geometry.computeBoundingBox();
        const top=cord.localToWorld(cord.position.clone().set(0,cord.geometry.boundingBox.max.y,0));
        assert.ok(top.distanceTo(anchor)<1e-7,`${id}: a lamp cord drifts off its anchor while it sways`);
      }
    }
  }

  // 6c. Nothing sinks through the ground or the water the stand stands on.
  for(const id of expected){
    const root=LONDON_PROPS[id]();root.userData.tick(0,0);root.updateMatrixWorld(true);
    let lowest=Infinity,culprit='';
    root.traverse(o=>{if(!o.isMesh)return;let shown=true;for(let a=o;a;a=a.parent)if(!a.visible)shown=false;if(!shown)return;o.geometry.computeBoundingBox();const y=o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld).min.y;if(y<lowest){lowest=y;culprit=o.name||o.parent?.name||'mesh';}});
    assert.ok(lowest>=-.35,`${id}: ${culprit} sinks to ${lowest.toFixed(2)} below the ground`);
  }

  // 7. The thirteen room stands carry the hotpot table: six to nine people, a beam with lamps, steam at a hot
  // source. The market is a cold hall and the dairy is a cold room, and neither carries a steam point.
  const hot=new Set(['pub','teaRoom','pieShop','chipShop','coffeeStall','lascarKitchen','hopCookhouse','pastyBakehouse','cockleStall','distillery']);
  for(const id of rooms){
    const stand=LONDON_PROPS[id]();let people=0,lanterns=0,beams=0;
    stand.traverse(o=>{if(o.userData.upper)people++;if(o.name==='hanging-lantern')lanterns++;if(o.name==='front-beam')beams++;});
    assert.ok(people>=6&&people<=9,`${id}: six to nine people, found ${people}`);
    assert.ok(lanterns>=2,`${id}: lamps hang under the beam, found ${lanterns}`);
    assert.ok(beams>=1,`${id}: the lamps need a beam to hang from`);
    if(hot.has(id))assert.ok(stand.userData.steam,`${id}: a hot source needs a steam point`);
  }
  // The smoke pit is hot smoke, not boiling: it carries smoke and no steam.
  {const s=LONDON_PROPS.smokehouse();assert.ok(s.userData.smoke,'smokehouse: the pit carries smoke');assert.equal(s.userData.steam,undefined,'smokehouse: a smoke pit smokes, it does not steam');}

  // 8. The ingredient stops and the landmarks are not empty: each models something and carries two or more people.
  for(const id of [...stops,...landmarks]){
    const stand=LONDON_PROPS[id]();let meshes=0,people=0;
    stand.traverse(o=>{if(o.isMesh)meshes++;if(o.userData.upper)people++;});
    assert.ok(meshes>=40,`${id}: an ingredient stop or landmark still needs a real prop, found ${meshes} meshes`);
    assert.ok(people>=2,`${id}: someone has to be there to speak, found ${people}`);
  }

  // 9. Every figure that travels swings its legs in step with the distance it covers, and every main stand has
  // one: the hotpot table asks for a walker on a path that avoids the walls, and a figure that slides fails.
  // A figure carried by a vehicle is seated instead of stepping, which is the definition of done's own wording.
  for(const id of expected){
    const stand=LONDON_PROPS[id]();
    const figures=[];stand.traverse(o=>{if(o.userData?.legs&&o.userData?.upper)figures.push(o);});
    const start=figures.map(f=>({f,at:f.position.clone(),thigh:f.userData.legs.left.thigh.rotation.x}));
    const travel=new Map(start.map(s=>[s.f,0])), swing=new Map(start.map(s=>[s.f,0]));
    for(let i=1;i<=60;i++){
      stand.userData.tick(20+i*.1,.1);
      for(const s of start){
        s.f.updateMatrixWorld(true);
        travel.set(s.f,Math.max(travel.get(s.f),s.f.position.distanceTo(s.at)));
        swing.set(s.f,Math.max(swing.get(s.f),Math.abs(s.f.userData.legs.left.thigh.rotation.x-s.thigh)));
      }
    }
    let walkers=0;
    for(const s of start){
      if(travel.get(s.f)<.05)continue;
      if(s.f.userData.seatTop!==undefined)continue;                       // seated, and carried by what moves
      walkers++;
      assert.ok(swing.get(s.f)>.05,`${id}: a figure covered ${travel.get(s.f).toFixed(2)} units without swinging its legs`);
    }
    if(rooms.includes(id))assert.ok(walkers>=1,`${id}: a main stand needs a walker, and its steps must match the distance`);
  }
  // The omnibus rolls with its passengers aboard, and every one of them is on a seat.
  {
    const stand=LONDON_PROPS.omnibus();
    const riders=[];stand.traverse(o=>{if(o.userData?.seatTop!==undefined)riders.push(o);});
    assert.ok(riders.length>=5,`omnibus: the omnibus and the hansom carry their people seated, found ${riders.length}`);
  }

  assert.deepEqual(facingAway,[],'a Britain stand turns its front more than a radian from the +z camera side');
  console.log(`PASS: 29 Britain stands, food before speech, a clear sight line and a place in the 34-degree frame from the arrival camera at three azimuths, ${lampCount} lamps on real beams, falling pours on real lips, a cold dairy and a cold market, legs that match the distance covered, nothing outside the 1880-1914 band and an exact return to rest.`);
}finally{await rm(temp,{recursive:true,force:true});}
