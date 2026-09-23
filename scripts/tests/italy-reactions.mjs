/**
 * Italy stands: the click chain, the 1.6-second camera arrival, bounded repeats and a clean return to rest.
 * Copied from thailand-reactions.mjs with the ids of docs/italy-world.md, and carrying the same checks: the
 * sight line and the 34-degree frame from the arrival camera at three azimuths, measured with every stand turned
 * to the rotation `italy-objects.ts` gives it; the gait check; and a grep of the source for anything out of the
 * 1880-1914 band.
 *
 * The ten hit-only children of the object list carry `prop: "none"` and are drawn by their parents (the Roman
 * stalls by `italyMarket`, the Sicilian ones by `sicilyMarket`, `trattoria` and `pizzeria` on `ragu` and `oven`),
 * so the harness covers thirty-six stands for forty-six registered objects.
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
const temp=await mkdtemp(join(tmpdir(),'italy-reactions-'));
try{
  await build({input:{props:'src/fw/props-italy.ts',objects:'src/fw/italy-objects.ts'},platform:'node',output:{dir:temp,format:'esm',entryFileNames:'[name].mjs',chunkFileNames:'[name].mjs',banner:'import.meta.env={VITE_STATIC:"1",BASE_URL:"/"};'}});
  const props=await import(pathToFileURL(join(temp,'props.mjs')));
  const {ITALY_PROPS,ITALY_ICONS,IT_LINES}=props;
  const {ITALY_OBJECTS}=await import(pathToFileURL(join(temp,'objects.mjs')));

  // 0. Every prop name in the Italy object list has a stand, and nothing else is exported as one.
  const rooms=['trattoria','italyMarket','pastaWorkshop','pizzeria','dairy','fishMarket','bacaro','buranoKitchen','venetoFarm',
    'friggitoria','sicilyMarket','pasticceria','tonnara'];
  const stops=['carciofaia','sheepFold','oliveGrove','wineCart','cow','chicken','porciniWood','herbGarden','valliPesca',
    'riceFieldItaly','wheatLatifondo','tomatoField','citrusGrove','almondGrove','caperTerrace'];
  const landmarks=['colosseum','pantheon','mattatoio','gelateria','rialtoBridge','campanile','etna','carretto'];
  const expected=[...rooms,...stops,...landmarks];
  assert.deepEqual(Object.keys(ITALY_PROPS).sort(),[...expected].sort(),'ITALY_PROPS holds one stand per prop name in docs/italy-world.md');
  assert.equal(expected.length,36,'36 stands: 13 rooms, 15 ingredient stops, 8 landmarks and card-only places');
  // The decor other worlds import from this file keeps its name.
  for(const name of ['italianHouse','umbrellaPine','cypress','oliveTree','citrusTree','pricklyPear','fountain','obelisk','gondola',
    'venetianBridge','mooringPole','fishingBoat','baroqueChurch','triumphalArch','basilica','treviFountain','cafeTables','colosseum','campanile'])
    assert.equal(typeof props[name],'function',`${name} is still exported for the worlds that import it`);
  assert.equal(props.vespa,undefined,'the Vespa (1946) is deleted, as the module contract ordered once nothing imported it');

  // 0b. The object list and this file agree: thirty-six objects name a prop and every one is built here; the ten
  // hit-only children carry `prop: "none"` and hang off the two markets, the trattoria and the forno.
  assert.equal(ITALY_OBJECTS.length,46,'the object list carries forty-six objects');
  const children=ITALY_OBJECTS.filter(o=>o.hitOnly);
  assert.equal(children.length,10,'ten hit-only children');
  for(const o of ITALY_OBJECTS){
    if(o.prop==='none'){assert.ok(o.hitOnly&&['romeMarket','sicilyMarket','ragu','oven'].includes(o.parent),`${o.id}: only a hit-only child of a market, the trattoria or the forno may carry no prop`);continue;}
    assert.ok(typeof ITALY_PROPS[o.prop]==='function',`${o.id}: no builder in ITALY_PROPS for prop \`${o.prop}\``);
  }
  assert.deepEqual([...new Set(ITALY_OBJECTS.map(o=>o.prop).filter(p=>p!=='none'))].sort(),[...expected].sort(),
    'the thirty-six props the object list names are exactly the thirty-six stands');

  // 0c. Nothing outside the 1880-1914 band is built. The comments say what was removed, so the grep runs over the
  // code with its comments stripped.
  // One exception, by owner ruling on 2026-09-23: a landmark may keep the reaction the visitor remembers the place
  // by even when its figures are outside the period band, because it is the memory of the place; the card text stays
  // in period. The Colosseum's gladiator and tiger are that exception, so the `colosseum` builder alone is left out
  // of the gladiator-and-beast grep, and nothing else in this file may build either.
  const source=await readFile('src/fw/props-italy.ts','utf8');
  const colosseumStart=source.indexOf('export function colosseum(): P {'), colosseumEnd=source.indexOf('\n}\n',colosseumStart);
  assert.ok(colosseumStart>0&&colosseumEnd>colosseumStart,'the colosseum builder is where the exception expects it');
  const strip=text=>text.replace(/\/\*[\s\S]*?\*\//g,'').split('\n').map(l=>l.replace(/(^|[^:"'`])\/\/.*$/,'$1'));
  const outsideColosseum=strip(source.slice(0,colosseumStart)+source.slice(colosseumEnd));
  const code=source.replace(/\/\*[\s\S]*?\*\//g,'').split('\n').map(l=>l.replace(/(^|[^:"'`])\/\/.*$/,'$1'));
  for(const [what,pattern] of [['a Vespa',/vespa/i],['a motor scooter or motorbike',/scooter|motorbik|motorcycle/i],['a motor car or lorry',/automobile|motor ?car|\bcar\b|\blorry\b|\btruck\b/i],
    ['a spritz glass',/spritz|aperol/i],['tiramisù',/tiramis/i],['carbonara',/carbonara/i],['a red-check cloth or a raffia fiasco',/check(ed)? ?cloth|gingham|fiasco|raffia/i],
    ['a gladiator or a beast outside the Colosseum\'s own reaction',/gladiator|tiger/i],['a stone loggia over the Pescaria',/loggia/i]]){
    const lines=/gladiator/.test(String(pattern))?outsideColosseum:code;
    const hits=lines.map((l,i)=>[i+1,l]).filter(([,l])=>pattern.test(l));
    assert.equal(hits.length,0,`props-italy.ts builds ${what}, which is out of the 1880-1914 band: line ${hits[0]?.[0]} ${hits[0]?.[1]?.trim()}`);
  }

  // 1. Every room object carries a card badge, and every one of the thirty-six card objects has ambient speech.
  const roomIds=['ragu','romeMarket','pasta','oven','cheese','seafood','bacaro','lagunaIt','casaVeneta','friggitoria','sicilyMarket','pastry','tonnaraIt'];
  for(const id of roomIds){
    assert.ok(typeof ITALY_ICONS[id]==='function',`${id}: needs a rendered card badge`);
    assert.ok(ITALY_ICONS[id]().children.length>0,`${id}: the badge must model something`);
  }
  const stopIds=['carciofoIt','pecoraIt','olive','vinoIt','italyBeef','italyChicken','mushrooms','basil','valliIt','riceIt','granoIt','tomato','lemon','mandorleIt','capperiIt'];
  const landmarkIds=['colosseoIt','panteonIt','quintoQuarto','gelateria','rialtoIt','campanileIt','etnaIt','carrettoIt'];
  const ids=[...roomIds,...stopIds,...landmarkIds];
  assert.equal(ids.length,36,'13 rooms, 15 stops and 8 landmarks carry ambient speech');
  for(const id of ids){
    const lines=IT_LINES[id];
    assert.ok(Array.isArray(lines)&&lines.length>=4&&lines.length<=8,`${id}: four to eight ambient speech lines, found ${lines?.length}`);
    for(const line of lines) assert.ok(/\S\s·\s\S/.test(line)&&/[A-Za-z]/.test(line.split(' · ')[1]??''),`${id}: "${line}" must carry the local language and English on one line`);
  }
  // Every stand speaks with its own object's lines, never the builder default.
  const objOf=Object.fromEntries(ITALY_OBJECTS.filter(o=>o.prop!=='none').map(o=>[o.prop,o.id]));
  const bubbleCount=root=>{let count=0;root.traverse(o=>{if(o.element?.className==='bubble')count++;});return count;};
  for(const id of expected){
    const stand=ITALY_PROPS[id]();
    stand.userData.poke();stand.userData.tick(.1,.1);stand.userData.tick(.5,.4);
    let said='';stand.traverse(o=>{if(o.element?.className==='bubble')said=o.element.textContent??'';});
    assert.ok(said&&!said.includes('Buongiorno · Good morning.'),`${id}: must speak with ${objOf[id]}'s own lines, not the builder default`);
  }

  const worldMatrix=(root,name)=>{const o=root.getObjectByName(name);assert.ok(o,`missing named reacting subject ${name}`);root.updateMatrixWorld(true);return o.matrixWorld.elements.slice();};
  const run=(stand,seconds,poke)=>{if(poke)stand.userData.poke();for(let i=1;i<=Math.round(seconds/.1);i++)stand.userData.tick(i*.1,.1);return stand;};

  // 2. The food moves before anyone speaks, and the speech arrives after the physical response.
  const ordered=props.trattoria(),pot=ordered.getObjectByName('it-oxtail-pot'),potZ=pot.position.z;
  ordered.userData.poke();assert.equal(bubbleCount(ordered),0,'speech waits for the pot');
  ordered.userData.tick(.1,.1);assert.notEqual(pot.position.z,potZ,'the copper leaves the range on the first reaction frame');
  assert.equal(bubbleCount(ordered),0,'speech stays subordinate during the first beat');
  ordered.userData.tick(.4,.3);assert.equal(bubbleCount(ordered),1,'speech follows the physical response');

  // 3. Every stand owns its reaction, and its named subject is still visibly changed when the camera arrives at 1.6 s.
  const subjects={
    trattoria:'it-oxtail-pot',italyMarket:'it-carciofo',pastaWorkshop:'it-pasta-ribbons',pizzeria:'it-pizza',dairy:'it-curd',
    fishMarket:'it-sardines',bacaro:'it-ombra',buranoKitchen:'it-moeche',venetoFarm:'it-polenta',friggitoria:'it-panelle',
    sicilyMarket:'it-swordfish',pasticceria:'it-cannolo',tonnara:'it-tuna-loin',
    carciofaia:'it-carciofo-cut',sheepFold:'it-ewe',oliveGrove:'it-olive-basket',wineCart:'it-wine-barrel',cow:'it-ox',chicken:'it-hen',
    porciniWood:'it-porcino',herbGarden:'it-basil-bunch',valliPesca:'it-eel-net',riceFieldItaly:'it-rice-sheaf',wheatLatifondo:'it-wheat-sheaf',
    tomatoField:'it-tomato-tray',citrusGrove:'harvest-fruit',almondGrove:'harvest-fruit',caperTerrace:'it-caper-tub',
    colosseum:'it-tiger',pantheon:'it-pantheon-pigeons',mattatoio:'it-hook-quarter',gelateria:'it-ice-paddle',
    rialtoBridge:'it-rialto-shutters',campanile:'it-campanile-bell',etna:'it-etna-plume',carretto:'it-carretto-body'};
  assert.deepEqual(Object.keys(subjects).sort(),[...expected].sort(),'every stand names the subject that answers a click');
  for(const [id,name] of Object.entries(subjects)){
    const still=ITALY_PROPS[id](),poked=ITALY_PROPS[id]();
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

  // 3b. The arrival camera can see the reaction, from either end of its range as well as from the middle, with the
  // stand turned to the rotation italy-objects.ts gives it; and the subject is inside main.ts's 34-degree lens.
  // main.ts has two arrivals, and each object is measured against the one it really gets:
  // - a room object (`scene` set) flies in 1.6 seconds to a horizontal offset of max(8.8, min(18, the larger
  //   footprint side x 1.05)) with the eye 1.4 above the anchor's 1.2 (`enterLivingScene`);
  // - a card-only object glides to 28 units from the anchor plus 0.8, keeping the visitor's pitch, with the target
  //   pushed 5 to the right of the screen so the card does not cover the subject (`openObject`, `glideTo`). The
  //   pitch is the arrival's own, the (2, 48, 60) direction the world camera drops in on.
  // Until 2026-09-23 every object was measured against the room arrival, which is low and close; that is what held
  // Etna to a 2.7-high mound, because a summit plume cannot sit in a 34-degree frame from 2.6 above the ground at
  // 8.8 away. OrbitControls clamps the azimuth to plus or minus 0.75 radians. Five takes each, because the shared
  // rnd() seed moves crowns and figures a little.
  const rotOf=Object.fromEntries(ITALY_OBJECTS.filter(o=>o.prop&&o.prop!=='none').map(o=>[o.prop,o.rot??0]));
  // An object's `approach` override (graph.ts) replaces the distance, pitch or bearing of the arrival it gets, exactly
  // as main.ts's approachOffset applies it: a missing field keeps the default's own value.
  const approachOf=Object.fromEntries(ITALY_OBJECTS.filter(o=>o.prop&&o.prop!=='none'&&o.approach).map(o=>[o.prop,o.approach]));
  const withApproach=(base,o)=>{
    if(!o)return base;
    const dist=o.dist??base.length(), pitch=o.pitch??Math.asin(THREE.MathUtils.clamp(base.y/Math.max(base.length(),1e-6),-1,1)), yaw=o.yaw??Math.atan2(base.x,base.z);
    return new THREE.Vector3(Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),Math.cos(yaw)*Math.cos(pitch)).multiplyScalar(dist);
  };
  const roomProp=new Set(ITALY_OBJECTS.filter(o=>o.prop&&o.prop!=='none'&&o.scene).map(o=>o.prop));
  const CARD_DIR=new THREE.Vector3(2,48,60).normalize();
  for(const [id,name] of Object.entries(subjects)) for(let take=0;take<5;take++){
    const stand=ITALY_PROPS[id]();
    stand.rotation.y=rotOf[id]??0;
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
    // the anchor is the centre of the prop's declared click footprint when it has one, as worldkit.ts places it
    const whole=stand.userData.hitBox?stand.userData.hitBox.clone().applyMatrix4(stand.matrixWorld):new THREE.Box3().setFromObject(stand), size=whole.getSize(new THREE.Vector3()), centre=whole.getCenter(new THREE.Vector3());
    const distance=Math.max(8.8,Math.min(18,Math.max(Math.max(2.2,size.x+.4),Math.max(2.2,size.z+.4))*1.05));
    const target=new THREE.Box3().setFromObject(subject).expandByScalar(.05), aim=target.getCenter(new THREE.Vector3());
    const room=roomProp.has(id);
    // main.ts keeps the visitor's compass direction, and the overview never leaves the south: the camera does
    // not turn with the stand. Every stand's `rot` is inside [-0.75, 0.75] (Stage D, 2026-09-22), so it faces it.
    for(const azimuth of [-0.75,0,0.75]){
      let eye,look;
      if(room){
        look=new THREE.Vector3(centre.x,1.2,centre.z);
        eye=look.clone().add(withApproach(new THREE.Vector3(Math.sin(azimuth)*distance,1.4,Math.cos(azimuth)*distance),approachOf[id]));
      }else{
        const flat=Math.hypot(CARD_DIR.x,CARD_DIR.z), off=withApproach(new THREE.Vector3(Math.sin(azimuth)*flat,CARD_DIR.y,Math.cos(azimuth)*flat).multiplyScalar(28),approachOf[id]);
        const right=new THREE.Vector3(Math.cos(azimuth),0,-Math.sin(azimuth));
        look=new THREE.Vector3(centre.x,.8,centre.z).addScaledVector(right,5);
        eye=look.clone().add(off);
      }
      const dir=aim.clone().sub(eye),reach=dir.length();dir.normalize();
      const entry=new THREE.Ray(eye,dir).intersectBox(target,new THREE.Vector3());
      const stop=entry?entry.distanceTo(eye):reach;
      const blocked=new THREE.Raycaster(eye,dir,0,Math.max(0,stop-.02)).intersectObjects(meshes,false)[0];
      // ITALY_DEBUG=1 names the blocker and where it stands, which is what a fix needs
      if(blocked&&process.env.ITALY_DEBUG){const w=new THREE.Vector3();blocked.object.getWorldPosition(w);const chain=[];for(let b=blocked.object;b;b=b.parent)if(b.name)chain.push(b.name);console.log(`DEBUG ${id} a=${azimuth} blocked by ${chain.join('<')||blocked.object.geometry.type} at (${w.x.toFixed(2)},${w.y.toFixed(2)},${w.z.toFixed(2)}) d=${blocked.distance.toFixed(2)}/${stop.toFixed(2)} aim(${aim.x.toFixed(2)},${aim.y.toFixed(2)},${aim.z.toFixed(2)})`);}
      assert.ok(!blocked,`${id}: ${blocked?(blocked.object.name||blocked.object.parent?.name||'a mesh of the stand'):''} hides ${name} from the arrival camera at azimuth ${azimuth} (take ${take})`);
      const lens=new THREE.PerspectiveCamera(34,16/9,.1,400);
      lens.position.copy(eye);lens.lookAt(look);lens.updateMatrixWorld(true);
      const frustum=new THREE.Frustum().setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(lens.projectionMatrix,lens.matrixWorldInverse));
      assert.ok(frustum.containsPoint(aim),`${id}: ${name} is outside the 34-degree ${room?'room':'card'} arrival frame at azimuth ${azimuth} (aim y ${aim.y.toFixed(2)})`);
    }
  }

  // 3b2. Landmarks at landmark scale (owner walkthrough on the live site, 2026-09-23): the Colosseum twice its old size,
  // the Pantheon, the Rialto and the campanile larger, Etna as it was. The card glide must still frame the whole
  // monument, not only its reacting subject: every corner of its box is inside the 34-degree frame at 16:9 from the
  // three azimuths, at the card distance and pitch or the object's own `approach` override. Each also keeps its size,
  // so a later pass cannot shrink one back into its neighbourhood.
  for(const [id,minW,minH] of [['colosseum',10,6.5],['pantheon',5.5,4.8],['rialtoBridge',4.2,6],['campanile',4.2,10],['etna',6.4,9]]){
    const stand=ITALY_PROPS[id]();stand.updateMatrixWorld(true);
    const box=new THREE.Box3().setFromObject(stand),size=box.getSize(new THREE.Vector3()),centre=box.getCenter(new THREE.Vector3());
    assert.ok(Math.max(size.x,size.z)>=minW&&size.y>=minH,`${id}: ${size.x.toFixed(1)} x ${size.z.toFixed(1)} x ${size.y.toFixed(1)} is under landmark scale (${minW} across, ${minH} high)`);
    for(const azimuth of [-0.75,0,0.75]){
      const flat=Math.hypot(CARD_DIR.x,CARD_DIR.z), off=withApproach(new THREE.Vector3(Math.sin(azimuth)*flat,CARD_DIR.y,Math.cos(azimuth)*flat).multiplyScalar(28),approachOf[id]);
      const yaw=Math.atan2(off.x,off.z), right=new THREE.Vector3(Math.cos(yaw),0,-Math.sin(yaw));
      const look=new THREE.Vector3(centre.x,.8,centre.z).addScaledVector(right,5), lens=new THREE.PerspectiveCamera(34,16/9,.1,400);
      lens.position.copy(look).add(off);lens.lookAt(look);lens.updateMatrixWorld(true);
      for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z]){
        const p=new THREE.Vector3(x,y,z).project(lens);
        assert.ok(Math.abs(p.x)<=1&&Math.abs(p.y)<=1,`${id}: its corner [${x.toFixed(1)}, ${y.toFixed(1)}, ${z.toFixed(1)}] leaves the card frame at azimuth ${azimuth}; give it an \`approach\` override`);
      }
    }
  }
  // The Colosseum's arena answers the click (owner, 2026-09-23: "the tiger and the fighter in the Colosseum are gone,
  // they should be added back"): at rest neither is shown, at the 1.6-second arrival both are out in the arena.
  {
    const still=ITALY_PROPS.colosseum(),poked=ITALY_PROPS.colosseum();
    for(const name of ['it-tiger','it-gladiator']) assert.equal(still.getObjectByName(name)?.visible,false,`colosseum: the ${name.slice(3)} waits behind its gate until the click`);
    poked.userData.poke();for(let i=1;i<=16;i++)poked.userData.tick(i*.1,.1);
    for(const name of ['it-tiger','it-gladiator']) assert.equal(poked.getObjectByName(name).visible,true,`colosseum: the ${name.slice(3)} is out in the arena at the arrival`);
    assert.equal(poked.getObjectByName('it-swifts').visible,true,'colosseum: the swifts still spiral out of the arcades');
  }

  // 3c. The painted cart answers with light as well as movement: its panels catch the sun and let it go again.
  {
    const still=ITALY_PROPS.carretto(),poked=ITALY_PROPS.carretto();
    poked.userData.poke();
    for(let i=1;i<=16;i++){still.userData.tick(i*.1,.1);poked.userData.tick(i*.1,.1);}
    const glow=root=>{let top=0;root.traverse(o=>{const m=o.material;if(m?.emissive&&m.emissive.getHex()!==0&&m.emissiveIntensity>top)top=m.emissiveIntensity;});return top;};
    assert.ok(glow(poked)>glow(still)+.3,`carretto: the click must make the panels catch the light (${glow(poked).toFixed(2)} vs ${glow(still).toFixed(2)})`);
    for(let i=17;i<=300;i++)poked.userData.tick(i*.1,.1);
    assert.ok(glow(poked)<=glow(still)+1e-6,'carretto: the panels return to their resting light');
  }

  // 4. The pours connect a real tap or lip to a real vessel, and the stream is gone once the reaction has passed.
  // The casale's whey runs and drips: it is the cold room, and a liquid without heat moves instead of steaming.
  for(const [id,name] of [['bacaro','it-wine-pour'],['dairy','it-whey']]){
    const stand=run(ITALY_PROPS[id](),1.6,true),liquid=stand.getObjectByName(name);
    assert.ok(liquid,`${id}: needs a modelled ${name}`);
    assert.equal(liquid.visible,true,`${id}: the ${name} must still be running at the 1.6 s arrival`);
    assert.ok(liquid.scale.y>.02,`${id}: the ${name} must span a real distance, not a floating line`);
    for(let i=17;i<=240;i++)stand.userData.tick(i*.1,.1);
    assert.equal(liquid.visible,false,`${id}: the ${name} must stop when the reaction has gone`);
  }
  // 4b. Each pour falls under gravity into a real vessel, rather than crossing the stand.
  for(const [id,columnName,vessel,maxGap] of [['bacaro','it-wine-pour','it-ombra',.22],['dairy','it-whey','it-whey-pail',.26]]){
    const stand=run(ITALY_PROPS[id](),1.6,true);stand.updateMatrixWorld(true);
    const column=stand.getObjectByName(columnName);
    const down=new THREE.Vector3(0,-1,0).applyQuaternion(column.getWorldQuaternion(new THREE.Quaternion()));
    assert.ok(down.y<=-.80,`${id}: the pour must fall rather than cross the stand (its axis points ${down.y.toFixed(2)} down)`);
    const head=column.getWorldPosition(new THREE.Vector3());
    const foot=head.clone().add(down.clone().multiplyScalar(column.scale.y));
    const lip=stand.getObjectByName(vessel).getWorldPosition(new THREE.Vector3());
    assert.ok(foot.distanceTo(lip)<=maxGap,`${id}: the pour must land in the real vessel (${foot.distanceTo(lip).toFixed(2)} from it)`);
  }

  // 5. Repeated clicks stay bounded and the fruit that falls is cleaned up.
  for(const id of ['citrusGrove','almondGrove']){
    const stand=ITALY_PROPS[id](),count=stand.children.length;
    for(let i=0;i<40;i++)stand.userData.poke();
    assert.ok(stand.children.length<=count+24,`${id}: repeated clicks must remain bounded`);
    for(let i=0;i<300;i++)stand.userData.tick(i/60,1/60);
    assert.equal(stand.children.length,count,`${id}: falling fruit must clean up`);
  }

  // 6. Everything that moves returns to its exact support, and the people never leave theirs.
  const settling=Object.fromEntries(Object.entries(subjects).filter(([,n])=>n!=='harvest-fruit'));
  for(const [id,name] of Object.entries(settling)){
    const stand=ITALY_PROPS[id](),subject=stand.getObjectByName(name);
    stand.userData.tick(0,0);subject.updateMatrix();const start=subject.matrix.clone();
    for(let i=0;i<6;i++){stand.userData.poke();for(let k=0;k<20;k++)stand.userData.tick((i*20+k)/60,1/60);}
    for(let i=0;i<300;i++)stand.userData.tick(10+i/60,1/60);
    subject.updateMatrix();
    assert.deepEqual(subject.matrix.elements,start.elements,`${id}: ${name} settles exactly, without drift after repeated clicks`);
  }
  for(const id of expected){
    const stand=ITALY_PROPS[id]();
    const roots=[];stand.traverse(o=>{if(o.userData.upper)roots.push([o,o.position.y]);});
    stand.userData.poke();stand.userData.tick(.2,.2);
    assert.ok(roots.every(([o,y])=>Math.abs(o.position.y-y)<1e-9),`${id}: people stay on their supports`);
  }

  // 6b. Every lamp hangs from a beam within reach, and its cord stays on the anchor while it swings.
  let lampCount=0;
  for(const id of expected){
    const root=ITALY_PROPS[id]();root.updateMatrixWorld(true);
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
    const root=ITALY_PROPS[id]();root.userData.tick(0,0);root.updateMatrixWorld(true);
    let lowest=Infinity,culprit='';
    root.traverse(o=>{if(!o.isMesh)return;let shown=true;for(let a=o;a;a=a.parent)if(!a.visible)shown=false;if(!shown)return;o.geometry.computeBoundingBox();const y=o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld).min.y;if(y<lowest){lowest=y;culprit=o.name||o.parent?.name||'mesh';}});
    assert.ok(lowest>=-.35,`${id}: ${culprit} sinks to ${lowest.toFixed(2)} below the ground`);
  }

  // 7. The thirteen room stands carry the hotpot table: six to nine people, a beam with lamps, steam at a hot
  // source. The casale is the cold room and carries neither steam nor smoke; half of Venice is cold with it.
  const hot=new Set(['trattoria','pizzeria','buranoKitchen','venetoFarm','friggitoria','tonnara']);
  const cold=['italyMarket','pastaWorkshop','dairy','fishMarket','bacaro','sicilyMarket','pasticceria'];
  assert.equal(hot.size+cold.length,13,'every room is either hot or cold');
  for(const id of rooms){
    const stand=ITALY_PROPS[id]();let people=0,lanterns=0,beams=0;
    stand.traverse(o=>{if(o.userData.upper)people++;if(o.name==='hanging-lantern')lanterns++;if(o.name==='front-beam')beams++;});
    assert.ok(people>=6&&people<=9,`${id}: six to nine people, found ${people}`);
    assert.ok(lanterns>=2,`${id}: lamps hang under the beam, found ${lanterns}`);
    assert.ok(beams>=1,`${id}: the lamps need a beam to hang from`);
    if(hot.has(id))assert.ok(stand.userData.steam,`${id}: a hot source needs a steam point`);
  }
  for(const id of cold){const stand=ITALY_PROPS[id]();assert.equal(stand.userData.steam,undefined,`${id}: nothing here is heated, so nothing steams`);}
  assert.equal(ITALY_PROPS.dairy().userData.smoke,undefined,'dairy: the casale has no fire at all');

  // 8. The ingredient stops and the landmarks are not empty: each models something and carries two or more people.
  for(const id of [...stops,...landmarks]){
    const stand=ITALY_PROPS[id]();let meshes=0,people=0;
    stand.traverse(o=>{if(o.isMesh)meshes++;if(o.userData.upper)people++;});
    assert.ok(meshes>=40,`${id}: an ingredient stop or landmark still needs a real prop, found ${meshes} meshes`);
    assert.ok(people>=2,`${id}: someone has to be there to speak, found ${people}`);
  }

  // 9. Every figure that travels swings its legs in step with the distance it covers, and every main stand has one.
  for(const id of expected){
    const stand=ITALY_PROPS[id]();
    const figures=[];stand.traverse(o=>{if(o.userData?.legs&&o.userData?.upper)figures.push(o);});
    const start=figures.map(f=>({f,at:f.position.clone(),thigh:f.userData.legs.left.thigh.rotation.x}));
    const travel=new Map(start.map(s=>[s.f,0])), swing=new Map(start.map(s=>[s.f,0]));
    for(let i=1;i<=60;i++){
      stand.userData.tick(20+i*.1,.1);
      for(const s of start){
        travel.set(s.f,Math.max(travel.get(s.f),s.f.position.distanceTo(s.at)));
        swing.set(s.f,Math.max(swing.get(s.f),Math.abs(s.f.userData.legs.left.thigh.rotation.x-s.thigh)));
      }
    }
    let walkers=0;
    for(const s of start){
      if(travel.get(s.f)<.05)continue;
      walkers++;
      assert.ok(swing.get(s.f)>.05,`${id}: a figure covered ${travel.get(s.f).toFixed(2)} units without swinging its legs`);
    }
    if(rooms.includes(id))assert.ok(walkers>=1,`${id}: a main stand needs a walker, and its steps must match the distance`);
  }

  console.log(`PASS: 36 Italy stands for 46 objects, food before speech, a clear sight line and a place in the 34-degree frame from the arrival camera at three azimuths and the blueprint's own rotations, five landmarks whole in the card frame at landmark scale, the Colosseum's tiger and gladiator out on the click, ${lampCount} lamps on real beams, pours on real taps and lips, a cold casale, legs that match the distance covered, nothing out of the 1880-1914 band and an exact return to rest.`);
}finally{await rm(temp,{recursive:true,force:true});}
