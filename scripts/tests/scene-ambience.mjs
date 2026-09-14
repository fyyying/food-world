import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {build} from 'rolldown';

const temp=await mkdtemp(join(tmpdir(),'room-ambience-'));
try {
  await build({input:{painted:'src/fw/scene-painted.ts',ambience:'src/fw/scene-ambience.ts',config:'src/fw/turkey-ambience.ts'},platform:'node',output:{dir:temp,entryFileNames:'[name].mjs',chunkFileNames:'[name].mjs',format:'esm',banner:'import.meta.env={BASE_URL:"/"};'}});
  globalThis.ImageData=class {constructor(data,width,height){this.data=data;this.width=width;this.height=height}};
  let partialMaskWrites=0;
  globalThis.document={createElement(){
    const canvas={width:0,height:0};
    canvas.getContext=()=>({
      drawImage(){},putImageData(imageData){
        let opaque=0;for(let i=3;i<imageData.data.length;i+=4)if(imageData.data[i])opaque++;
        if(opaque>0&&opaque<imageData.data.length/4)partialMaskWrites++;
      },
      getImageData(){
        const data=new Uint8ClampedArray(canvas.width*canvas.height*4);
        const samples=[[160,24,30],[210,180,140],[100,85,65],[40,100,50]];
        for(let i=0;i<data.length;i+=4){const c=samples[(i/4)%samples.length];data[i]=c[0];data[i+1]=c[1];data[i+2]=c[2];data[i+3]=255}
        return {data,width:canvas.width,height:canvas.height};
      },
    });
    return canvas;
  }};
  globalThis.Image=class {
    complete=true;naturalWidth=320;naturalHeight=180;
    set src(url){if(url.includes('/portrait.jpg')){this.naturalWidth=180;this.naturalHeight=320}this.onload?.()}
  };
  const {paintedScene}=await import(pathToFileURL(join(temp,'painted.mjs')));
  const scene=paintedScene({id:'ambience_test',folder:'tr_coffee',title:'Test',zh:'',caption:'',painting:true,hotspots:[],
    steam:[{x:200,y:600,w:40,rate:8}],portrait:{steam:[{x:1100,y:400,w:30,rate:6}]},
    lamps:[{x:800,y:100,r:50}],fire:[{x:900,y:600,rx:40,ry:20}],light:{x:800,y:100,color:'#fff'}});
  let gradients=[];
  const ctx=new Proxy({}, {get:(_,key)=>key==='createRadialGradient'?(...args)=>{gradients.push(args);return {addColorStop(){}}}:()=>{},set:()=>true});
  scene.fx(ctx,0,0,false);
  assert.ok(gradients.length>=8,'steam must already be visible on entry, with zero elapsed time and no click');
  assert.ok(gradients.every(([x,y])=>x>=180&&x<=220&&y<600),'initial wide steam must rise from its own vessel');
  gradients=[];scene.fx(ctx,.1,0,true);
  assert.ok(gradients.length>=6,'portrait needs its own established plume');
  assert.ok(gradients.every(([x,y])=>x>=1085&&x<=1115&&y<400),'rotation must remove steam from old wide coordinates');
  const lamp={opacity:'',setAttribute(_name,value){this.opacity=value}},fire={...lamp};
  const tick=scene.animate({querySelectorAll:selector=>selector==='[id^=lamp-]'?[lamp]:selector==='[id^=fire-]'?[fire]:[]});
  tick(0,0);const first=[lamp.opacity,fire.opacity];tick(1,.016);
  assert.notDeepEqual([lamp.opacity,fire.opacity],first,'lamp and fire must move without an interaction');
  assert.ok([lamp.opacity,fire.opacity].every(n=>Number(n)>0&&Number(n)<=1));
  const {ambientPainter, isBreezePixel, PAINTED_SIGNATURES, XINJIANG_AMBIENCE}=await import(pathToFileURL(join(temp,'ambience.mjs')));
  assert.equal(isBreezePixel('chilli',160,24,30),true);
  assert.equal(isBreezePixel('garlic',210,180,140),true);
  assert.equal(isBreezePixel('bell',100,85,65),true);
  assert.equal(isBreezePixel('grape',160,24,30),true);
  assert.equal(isBreezePixel('leaves',40,100,50),true);
  assert.equal(isBreezePixel('chilli',40,100,50),false,'green wall and foliage pixels stay in the static painting');
  assert.equal(Object.keys(PAINTED_SIGNATURES ?? {}).length,53,'all rooms except the preserved hotpot benchmark need an authored signature');
  for(const [id,patch] of Object.entries(PAINTED_SIGNATURES)) {
    for(const orientation of ['wide','phone']) {
      assert.equal(patch[orientation]?.length,4,`${id} needs a ${orientation} anchor`);
      assert.ok(patch[orientation].every(n=>n>=0&&n<=1),`${id} anchors stay inside painting`);
      if(patch.kind==='stream-glint'||patch.kind==='waterfall-glint')
        assert.ok(patch.paths?.[orientation==='phone'?1:0]?.every(path=>path.length>=2&&path.flat().every(n=>n>=0&&n<=1)),`${id} ${orientation} liquid must have an explicitly traced painted path`);
    }
  }
  assert.equal(PAINTED_SIGNATURES.tr_simit.kind,'birds','Simit must animate the open sky, not invent moving food or a wake over people');
  assert.equal(PAINTED_SIGNATURES.tr_market.kind,'breeze','the market must move an existing tied chilli string, not fabricate a canopy');
  assert.ok(PAINTED_SIGNATURES.tr_kebab.wide[0]>=.285&&PAINTED_SIGNATURES.tr_kebab.wide[2]<=.34,
    'charcoal counter wide chilli crop must exclude both wall lanterns and the garlic braid');
  assert.ok(PAINTED_SIGNATURES.tr_kebab.phone[0]>=.12&&PAINTED_SIGNATURES.tr_kebab.phone[2]<=.22,
    'charcoal counter phone chilli crop must exclude the wall, lamp and neighbouring hanging produce');
  assert.equal(PAINTED_SIGNATURES.tr_tea.kind,'birds','the tea painting must leave the boat-filled Bosphorus static and use its open sky');
  assert.equal(PAINTED_SIGNATURES.tr_fish.kind,'light','the fish room must keep motion on its pictured grill, away from boats and people');
  assert.equal(PAINTED_SIGNATURES.tr_baklava.kind,'sunray','baklava needs a clearly readable doorway sun ray above its quieter flour effect');
  const chinaNaturalSignatures={
    noodle_shop:'sunray',teahouse:'breeze',market:'breeze',home_kitchen:'breeze',tower:'birds',
    bao_shop:'dust',stone_bridge:'mist',crab_pond:'leaves',jiangnan_home:'birds',lotus_garden:'sunray',
    rice_wine:'sunray',river_market:'sunray',riverside_restaurant:'birds',tea_hill:'birds',
    skewer_courtyard:'leaves',mantou_kitchen:'dust',dumpling_house:'dust',winter_table:'snow',
    courtyard_kitchen:'snow',hutong:'leaves',bing_stall:'dust',north_market:'sunray',
    noodle_workshop:'leaves',roast_duck:'light',vinegar_workshop:'sunray',wheat_harvest:'sunray',
  };
  for(const [id,kind] of Object.entries(chinaNaturalSignatures)) {
    assert.equal(PAINTED_SIGNATURES[id].kind,kind,
      `${id} must move a pictured detail or a natural environmental cue, never draw substitute food or scenery`);
  }
  assert.ok(PAINTED_SIGNATURES.winter_table.wide[0]>=.66&&PAINTED_SIGNATURES.winter_table.wide[3]<=.20,
    'winter table wide snow must stay outside in the upper doorway, away from the family and table');
  assert.ok(PAINTED_SIGNATURES.winter_table.phone[0]>=.62&&PAINTED_SIGNATURES.winter_table.phone[1]>=.12&&PAINTED_SIGNATURES.winter_table.phone[3]<=.30,
    'winter table phone snow must stay outside within the doorway');
  for(const id of ['market','home_kitchen']) {
    const breeze=PAINTED_SIGNATURES[id];
    assert.equal(breeze.source,'chilli',`${id} must isolate pictured chilli rather than draw hanging lines`);
  }
  assert.ok(PAINTED_SIGNATURES.market.wide[0]>=.95&&PAINTED_SIGNATURES.market.wide[1]<=.03&&PAINTED_SIGNATURES.market.wide[2]<=1,
    'Sichuan market wide must include the far-right chilli tie point while excluding the vendor and canopy');
  assert.ok(PAINTED_SIGNATURES.market.phone[2]<=.15&&PAINTED_SIGNATURES.market.phone[3]<=.33,
    'Sichuan market phone must keep its left-edge chilli crop above the vendor');
  assert.ok(PAINTED_SIGNATURES.home_kitchen.wide[0]<=.02&&PAINTED_SIGNATURES.home_kitchen.wide[2]<=.10,
    'home kitchen wide must isolate the left chilli braid, away from the garlic and shelves');
  assert.ok(PAINTED_SIGNATURES.home_kitchen.phone[0]>=.10&&PAINTED_SIGNATURES.home_kitchen.phone[2]<=.22,
    'home kitchen phone must isolate the actual chilli braid rather than the left shelf');
  assert.ok(PAINTED_SIGNATURES.courtyard_kitchen.wide[0]>=.61&&PAINTED_SIGNATURES.courtyard_kitchen.phone[0]>=.60,
    'courtyard kitchen snow must stay in the right-side exterior opening in both compositions');
  assert.equal(PAINTED_SIGNATURES.noodle_workshop.leaf,'yellow',
    'noodle workshop uses small outdoor autumn leaves instead of dough dust');
  assert.equal(PAINTED_SIGNATURES.teahouse.source,'red-tassel',
    'teahouse must sway a small painted red tassel rather than replace it with generic light');
  const xinjiangSignatures={
    kebab_grill:'light',naan_bakery:'sunray',polo_kitchen:'light',laghman_shop:'dust',oasis_bazaar:'sunray',
    grape_courtyard:'sunray',oasis_field:'sunray',chaikhana:'sunray',xj_home:'dust',
    caravan_stop:'leaves',tianshan:'mist',evening_feast:'light',
  };
  for(const [id,kind] of Object.entries(xinjiangSignatures))
    assert.equal(PAINTED_SIGNATURES[id].kind,kind,`${id} must use a source-observed material cue instead of invented process geometry`);
  for(const id of Object.keys(xinjiangSignatures))
    assert.ok(!['turn','puff','stir','pull','sway','pour','flow','roll'].includes(PAINTED_SIGNATURES[id].kind),
      `${id} must not draw replacement skewers, bread, spoons, noodles, canopies, liquid or dough over a painting`);
  assert.equal(PAINTED_SIGNATURES.caravan_stop.leaf,'olive',
    'caravan stop replaces the red ember overlay with small green leaves');
  assert.deepEqual(XINJIANG_AMBIENCE.oasis_field.map(p=>p.kind),['birds','breeze'],
    'oasis field must keep its detailed water static and use sky and hanging-grape motion');
  assert.ok(![PAINTED_SIGNATURES.oasis_field,...XINJIANG_AMBIENCE.oasis_field].some(p=>p.kind==='stream-glint'||p.kind==='waterfall-glint'),
    'oasis field must not draw synthetic strokes over its detailed channel or falls');
  assert.ok(![PAINTED_SIGNATURES.grape_courtyard,...XINJIANG_AMBIENCE.grape_courtyard].some(p=>p.kind==='stream-glint'||p.kind==='waterfall-glint'),
    'grape courtyard must leave its already-painted tea stream untouched');
  assert.deepEqual(XINJIANG_AMBIENCE.xj_home.map(p=>p.kind),['leaves'],
    'oasis home kitchen keeps its added motion in the outdoor courtyard');
  assert.equal(XINJIANG_AMBIENCE.xj_home[0].leaf,'yellow',
    'oasis home kitchen uses small yellow leaves rather than oversized foreground foliage');
  assert.ok(XINJIANG_AMBIENCE.xj_home[0].wide[2]<=.57&&XINJIANG_AMBIENCE.xj_home[0].phone[3]<=.19,
    'oasis home leaves stay above and outside, away from the family and food');
  assert.deepEqual(XINJIANG_AMBIENCE.chaikhana.map(p=>p.kind),['breeze','leaves'],
    'Xinjiang tea house combines a painted grape sway with slow outdoor leaf fall');
  assert.deepEqual(XINJIANG_AMBIENCE.naan_bakery.map(p=>p.kind),['leaves'],
    'nan bakery combines its broad sunlight with sparse outdoor leaf fall');
  assert.deepEqual(XINJIANG_AMBIENCE.evening_feast.map(p=>p.kind),['breeze','sunray'],
    'evening feast combines one isolated grape bunch with a broad coherent sunset ray');
  const hangingGrapeRooms=['kebab_grill','grape_courtyard','oasis_field','chaikhana','evening_feast'];
  for(const id of hangingGrapeRooms) {
    const grapeBreezes=XINJIANG_AMBIENCE[id]?.filter(p=>p.kind==='breeze'&&p.source==='grape')??[];
    assert.ok(grapeBreezes.length,
      `${id} needs one isolated painted grape cluster moving in both compositions`);
    for(const grapeBreeze of grapeBreezes) {
      assert.ok(grapeBreeze.wide&&grapeBreeze.phone,`${id} grape motion needs both compositions`);
      for(const [orientation,rect] of [['wide',grapeBreeze.wide],['phone',grapeBreeze.phone]]) {
        assert.ok(rect[2]-rect[0]<=.12&&rect[3]<=.24,
          `${id} grape source crop must stay tight in the upper trellis, away from every face`);
        const sway=grapeBreeze.sway?.[orientation==='phone'?1:0]??0;
        const peakDisplacement=(rect[3]-rect[1])*910*Math.sin(sway);
        assert.ok(peakDisplacement>=14,
          `${id} ${orientation} grape swing must travel at least 14px at its tip so it reads in the busy canopy`);
      }
    }
  }
  const courtyardGrapes=XINJIANG_AMBIENCE.grape_courtyard.filter(p=>p.kind==='breeze'&&p.source==='grape');
  assert.equal(courtyardGrapes.length,2,'grape courtyard moves two isolated painted bunches');
  assert.ok(courtyardGrapes[0].phone[0]<=.64&&courtyardGrapes[0].phone[2]>=.76,
    'grape courtyard phone crop must include the complete large upper bunch');
  for(const grape of courtyardGrapes) for(const [orientation,rect] of [['wide',grape.wide],['phone',grape.phone]]) {
    const sway=grape.sway[orientation==='phone'?1:0];
    const arc=(rect[3]-rect[1])*910*Math.sin(sway);
    assert.ok(arc>=18&&arc<=24,
      `grape courtyard ${orientation} bunch should use a readable but gentle 18-24px arc`);
  }
  const feastGrape=XINJIANG_AMBIENCE.evening_feast.find(p=>p.kind==='breeze'&&p.source==='grape');
  assert.ok(feastGrape.wide[2]-feastGrape.wide[0]<=.03&&feastGrape.phone[3]-feastGrape.phone[1]<=.09,
    'evening feast grape crops remain tight in both compositions so the background never sways');
  const grillGrape=XINJIANG_AMBIENCE.kebab_grill.find(p=>p.kind==='breeze'&&p.source==='grape');
  assert.ok(grillGrape.wide[2]-grillGrape.wide[0]<=.04&&grillGrape.wide[0]>=.32,
    'skewer stall horizontal grape crop excludes the trellis and sky around its chosen bunch');
  const turkeyRooms=['tr_simit','tr_tea','tr_coffee','tr_market','tr_fish','tr_kebab','tr_baklava','tr_pide','tr_yufka','tr_dolma','tr_breakfast','tr_meze','tr_olive','tr_tea_hill','tr_supper'];
  const paintingNative=new Set(['leaves','birds','stream-glint','dust','rain','mist','light','sunray','breeze','snow','embers']);
  for(const [id] of Object.entries(chinaNaturalSignatures))
    assert.ok(paintingNative.has(PAINTED_SIGNATURES[id].kind),`${id} must use the painting-native effect vocabulary`);
  for(const id of turkeyRooms)assert.ok(paintingNative.has(PAINTED_SIGNATURES[id].kind),`${id} must move painted scenery or a natural effect, never draw invented food geometry`);
  const recordCanvas = (width=1600) => {
    const operations=[], stack=[];
    const target={canvas:{width},globalAlpha:1,getTransform:()=>({a:1}),
      save(){stack.push(this.globalAlpha)},restore(){this.globalAlpha=stack.pop()},
      createRadialGradient(...args){operations.push(['createRadialGradient',this.globalAlpha,...args]);return {addColorStop:(...stop)=>operations.push(['addColorStop',this.globalAlpha,...stop])}},
      createLinearGradient(){return {addColorStop(){}}}};
    const context=new Proxy(target,{get:(obj,key)=>key in obj?obj[key]:(...args)=>operations.push([key,context.globalAlpha,...args])});
    return {context,operations};
  };
  for(const portrait of [false,true]) {
    const oasis=paintedScene({id:'oasis_field',folder:'oasis_field',title:'',zh:'',caption:'',painting:true,
      hotspots:[],ambience:XINJIANG_AMBIENCE.oasis_field,light:{x:700,y:100,color:'#fff'}});
    const {context,operations}=recordCanvas(portrait?506:1600);oasis.fx(context,1.6,.016,portrait);
    assert.ok(operations.some(([op])=>op==='fillRect'),`oasis ${portrait?'phone':'wide'} keeps its broad sun ray after motion budgeting`);
    assert.ok(operations.some(([op])=>op==='quadraticCurveTo'),`oasis ${portrait?'phone':'wide'} keeps its birds after motion budgeting`);
    assert.equal(operations.filter(([op])=>op==='lineTo').length,0,`oasis ${portrait?'phone':'wide'} leaves the detailed water untouched`);
  }
  for(const [id,patch] of Object.entries(PAINTED_SIGNATURES))for(const portrait of [false,true]){
    const {context,operations}=recordCanvas(portrait?506:1600),maskWritesBefore=partialMaskWrites,paint=ambientPainter([patch],id);
    paint(context,1.6,portrait);const first=JSON.stringify(operations);
    if(patch.kind!=='breeze')assert.ok(operations.some(([op])=>op==='stroke'||op==='fill'||op==='fillRect'||op==='drawImage'),`${id} draws visible geometry`);
    else {
      assert.ok(partialMaskWrites>maskWritesBefore,`${id} must isolate a non-empty, bounded painted foreground mask`);
      assert.equal(operations.filter(([op])=>op==='drawImage').length,2,`${id} must paint its repaired background and isolated hanging subject`);
      assert.ok(operations.every(([op])=>!['stroke','fill','ellipse'].includes(op)),`${id} must not fall back to invented hanging-food geometry`);
    }
    assert.ok(operations.flat().filter(v=>typeof v==='number').every(Number.isFinite),`${id} has finite canvas coordinates`);
    assert.ok(operations.length<150,`${id} has a bounded drawing budget`);
    operations.length=0;paint(context,3,portrait);
    assert.notEqual(JSON.stringify(operations),first,`${id} signature changes with time in ${portrait?'phone':'wide'}`);
    assert.equal(context.globalAlpha,1,'each signature restores canvas state');
  }
  const meze=paintedScene({id:'tr_meze',folder:'tr_meze',title:'',zh:'',caption:'',painting:true,
    hotspots:[{id:'food',x:700,y:600,label:'Oil',text:''}],light:{x:700,y:100,color:'#fff'}});
  const touchCanvas=recordCanvas();meze.fx(touchCanvas.context,0,0,false);
  assert.ok(touchCanvas.operations.every(([op])=>!['stroke','fill','ellipse'].includes(op)),'meze must not invent an oil drizzle or food silhouette');
  touchCanvas.operations.length=0;
  meze.react('food');meze.fx(touchCanvas.context,.3,.016,false);
  assert.ok(touchCanvas.operations.every(([op])=>!['stroke','fill','ellipse'].includes(op)),'touch must not replace the pictured hanging layer with generic geometry');
  touchCanvas.operations.length=0;meze.fx(touchCanvas.context,4,.016,false);
  assert.ok(touchCanvas.operations.every(([op])=>!['stroke','fill','ellipse'].includes(op)),'the natural breeze remains free of generic geometry');
  touchCanvas.operations.length=0;
  globalThis.matchMedia=()=>({matches:true});meze.react('food');
  meze.fx(touchCanvas.context,4.1,.016,false);
  assert.equal(touchCanvas.operations.length,0,'system reduced motion uses the static painting');
  delete globalThis.matchMedia;
  const quietCanvas=recordCanvas();quietCanvas.context.globalAlpha=.22;
  ambientPainter([{kind:'rain',wide:[.1,.1,.3,.3]}])(quietCanvas.context,1,false);
  assert.ok(quietCanvas.operations.filter(([op])=>op==='stroke').every(([,alpha])=>alpha<=.22),'window rain respects click subordination');
  const flyer=paintedScene({id:'noodle_shop',folder:'noodle_shop',title:'',zh:'',caption:'',painting:true,hotspots:[],
    walkers:[{name:'bird',fly:true,w:48,y:100,from:400,to:900,dur:8,every:40}],
    hang:[{name:'garlic-closeup',prop:true,x:400,w:120}],light:{x:700,y:100,color:'#fff'}});
  assert.ok(flyer.layers.some(l=>l.svg.includes('/props/bird.webp')),'safe sky flyers survive the full-painting guard');
  assert.ok(flyer.layers.every(l=>!l.svg.includes('/props/garlic-closeup.webp')),'full-size hanging duplicates stay suppressed');
  const {TURKEY_AMBIENCE}=await import(pathToFileURL(join(temp,'config.mjs')));
  const baklavaStream=TURKEY_AMBIENCE.tr_baklava.find(p=>p.kind==='stream-glint');
  assert.ok(baklavaStream&&!baklavaStream.wide&&baklavaStream.phone,'baklava phone may highlight only its existing syrup drip');
  assert.ok(baklavaStream.phone[2]-baklavaStream.phone[0]<=.02&&baklavaStream.phone[3]-baklavaStream.phone[1]<=.035,
    'baklava syrup highlight must stay inside the short painted stream');
  assert.ok(TURKEY_AMBIENCE.tr_baklava.some(p=>p.kind==='light'&&p.wide&&!p.phone),'baklava wide uses pastry sheen because it has no depicted syrup stream');
  assert.ok(TURKEY_AMBIENCE.tr_pide.some(p=>p.kind==='dust'&&p.wide&&p.phone),'pide must retain local flour movement beside smoke, fire and tied chillies');
  const loaded=[];
  globalThis.Image=class {complete=true;naturalWidth=20;naturalHeight=32;set src(url){loaded.push(url);this.onload?.()}};
  for(const portrait of [false,true]){
    const leaf=TURKEY_AMBIENCE.tr_meze.find(p=>p.kind==='leaves');assert.ok(leaf?.[portrait?'phone':'wide']);
    const paint=ambientPainter([leaf]);let draws=[],positions=[];
    const leafCtx=new Proxy({canvas:{width:portrait?506:1600},globalAlpha:1,getTransform:()=>({a:1})},{get:(target,k)=>k in target?target[k]:k==='drawImage'?(...args)=>draws.push(args):k==='translate'?(...args)=>positions.push(args):()=>{},set:()=>true});
    paint(leafCtx,0,portrait);const start=positions[0];
    assert.equal(draws.length,4,'recognizable painted leaves must already be in flight on entry');
    assert.ok(draws.every(a=>a[4]>=18&&a[4]<=42),'leaves need readable silhouettes at normal viewing size');
    positions=[];draws=[];paint(leafCtx,1.9,portrait);
    assert.ok(positions[0][1]-start[1]>45,'leaves must travel visibly through the opening, not hover in place');
  }
  assert.ok(loaded.every(url=>url.includes('/hotpot/leaf-')),'ordinary ambience must not load a second copy of the room painting');
  for(const [id,patches] of Object.entries(TURKEY_AMBIENCE))
    assert.ok(patches.every(p=>p.kind!=='water'&&p.kind!=='oil'),`${id} must not draw replacement water or liquid geometry`);
  assert.equal(PAINTED_SIGNATURES.tr_olive.kind,'leaves','olive wide uses its attached foliage because no oil outlet is painted there');
  assert.equal(TURKEY_AMBIENCE.tr_olive.filter(p=>p.kind==='stream-glint'&&p.phone&&!p.wide).length,2,
    'olive phone keeps two short highlights inside its two real oil streams');
  const streamCanvas=recordCanvas(506);
  ambientPainter([{kind:'stream-glint',phone:[.90,.60,.915,.63],paths:[undefined,[[[.85,.05],[.62,.45],[.38,.95]]]]}])(streamCanvas.context,1,true);
  const streamMoves=streamCanvas.operations.filter(([op])=>op==='moveTo');
  const streamEnds=streamCanvas.operations.filter(([op])=>op==='lineTo');
  assert.equal(streamMoves.length,1,'a stream highlight adds one restrained moving accent');
  assert.equal(streamEnds.length,2,'a stream highlight follows only its short, explicitly traced path');
  assert.ok(streamCanvas.operations.every(([op])=>op!=='ellipse'&&op!=='fill'),'a stream highlight never invents a pool, droplet or liquid silhouette');
  const hangingRooms=['tr_market','tr_kebab','tr_pide','tr_dolma','tr_meze','tr_supper'];
  for(const id of hangingRooms) {
    const breeze=[PAINTED_SIGNATURES[id],...TURKEY_AMBIENCE[id]].find(p=>p.kind==='breeze');
    assert.ok(breeze?.wide&&breeze?.phone,`${id} must sway a pictured hanging chilli or garlic cluster in both compositions`);
    for(const rect of [breeze.wide,breeze.phone]) {
      assert.ok(rect[2]-rect[0]<=.22&&rect[3]-rect[1]<=.28,`${id} source layer must be tightly cropped so no wall or person moves`);
    }
  }
  assert.ok(PAINTED_SIGNATURES.tr_market.wide[2]<=.08&&PAINTED_SIGNATURES.tr_market.phone[2]<=.12,
    'market breeze must stay on the isolated left-edge chilli braid, away from vendors and their red caps');
  assert.ok(PAINTED_SIGNATURES.tr_market.phone[2]<=.06&&PAINTED_SIGNATURES.tr_market.phone[3]<=.18,
    'market portrait crop must stop above and left of the vendor fez');
  loaded.length=0;
  const hangingCanvas=recordCanvas();
  ambientPainter([PAINTED_SIGNATURES.tr_kebab],'tr_kebab')(hangingCanvas.context,1.4,false);
  assert.deepEqual(loaded,['/scenes/tr_kebab/wide.jpg','/scenes/tr_kebab/portrait.jpg'],'a hanging layer may load only its own two authored compositions');
  assert.ok(hangingCanvas.operations.every(([op])=>!['stroke','fill','ellipse'].includes(op)),'hanging motion may not draw a substitute chilli or garlic shape');
  const coffee=paintedScene({id:'tr_coffee',folder:'tr_coffee',title:'',zh:'',caption:'',painting:true,hotspots:[],
    steam:[{x:200,y:500,w:40,rate:8}],portrait:{steam:[{x:900,y:500,w:40,rate:8}]},ambience:TURKEY_AMBIENCE.tr_coffee});
  const portraitRain=recordCanvas(506);coffee.fx(portraitRain.context,1,.016,true);
  assert.ok(portraitRain.operations.some(([op,,x,y])=>op==='lineTo'&&Number.isFinite(x)&&Number.isFinite(y)),
    'orientation budgeting must retain a phone-only coffee rain patch');
  assert.ok(PAINTED_SIGNATURES.tr_coffee.phone[1]>=.15&&PAINTED_SIGNATURES.tr_coffee.phone[3]>=.29,
    'coffee phone prioritises the exposed lower-right window pane');
  assert.ok(portraitRain.operations.filter(([op])=>op==='lineTo').length>=8,
    'coffee window rain needs enough readable beads to remain visible over the painted rain');
  console.log('PASS: 53 paired signatures, painting-native China/Turkey/Xinjiang motion, tight hanging layers, bounded geometry, reduced motion, orientation reset, and readable ambience.');
} finally {await rm(temp,{recursive:true,force:true})}
