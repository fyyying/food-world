import assert from 'node:assert/strict';
import { mkdtemp, rm, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'rolldown';

const temporary = await mkdtemp(join(tmpdir(), 'food-room-tests-'));
const originalRandom = Math.random;
try {
  await build({ input: 'src/fw/scenes-china.ts', platform: 'node', output: { file: join(temporary, 'rooms.mjs'), format: 'esm', banner: 'import.meta.env = { BASE_URL: "/" };' } });
  globalThis.Image = class { complete = false; naturalWidth = 0; };
  const { SCENES } = await import(pathToFileURL(join(temporary, 'rooms.mjs')));
  function render(factory, active, portrait) {
    let seed = 1, draws = 0;
    Math.random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    const scene = factory();
    const action = scene.hotspots.find(h => h.activeLabel);
    if (active) assert.equal(scene.react(action.id), true);
    const ctx = new Proxy({}, { get: (_, key) => key === 'createRadialGradient' ? () => ({ addColorStop() {} }) : () => { draws++; }, set: () => true });
    for (let i = 0; i < 120; i++) scene.fx(ctx, i / 60, 1 / 60, portrait);
    return draws;
  }
  function sampleSteam(factory, portrait) {
    let seed = 1;
    Math.random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    const points = [];
    const target = {
      canvas: { width: portrait ? 506 : 1600 }, globalAlpha: 1, getTransform: () => ({ a: 1 }),
      createRadialGradient(...args) {
        if (args[2] === 0 && args[5] > 5 && Math.abs(args[0]) + Math.abs(args[1]) > 10) points.push([args[0], args[1]]);
        return { addColorStop() {} };
      },
      createLinearGradient: () => ({ addColorStop() {} }),
    };
    const context = new Proxy(target, { get: (object, key) => key in object ? object[key] : () => {}, set: (object, key, value) => (object[key] = value, true) });
    factory().fx(context, 0, .016, portrait);
    return {
      points,
      averageX: points.reduce((sum, point) => sum + point[0], 0) / points.length,
      lowestY: Math.max(...points.map(point => point[1])),
    };
  }
  const grapeTeaWide = sampleSteam(SCENES.grape_courtyard, false);
  assert.ok(grapeTeaWide.averageX >= 580 && grapeTeaWide.averageX <= 590 && grapeTeaWide.lowestY >= 510 && grapeTeaWide.lowestY <= 525,
    'grape courtyard wide steam must begin at the painted tea stream, not below it on the table');
  const grapeTeaPhone = sampleSteam(SCENES.grape_courtyard, true);
  assert.equal(grapeTeaPhone.points.length,14,'grape courtyard portrait keeps a clearly readable tea plume');
  assert.ok(grapeTeaPhone.averageX >= 682 && grapeTeaPhone.averageX <= 694 && grapeTeaPhone.lowestY >= 442 && grapeTeaPhone.lowestY <= 455,
    'grape courtyard phone steam must begin at the painted tea stream, not below it on the table');
  const chaikhanaWide=sampleSteam(SCENES.chaikhana,false);
  assert.equal(chaikhanaWide.points.length,40,'Xinjiang tea house wide keeps one restrained plume on each prominent tea bowl');
  const chaikhanaPhone=sampleSteam(SCENES.chaikhana,true);
  assert.equal(chaikhanaPhone.points.length,40,'Xinjiang tea house portrait keeps one restrained plume on each prominent tea bowl');
  const xjHomeWide=sampleSteam(SCENES.xj_home,false);
  assert.equal(xjHomeWide.points.length,40,'oasis home kitchen wide keeps cooking steam plus two readable tea plumes');
  const xjHomePhone=sampleSteam(SCENES.xj_home,true);
  assert.equal(xjHomePhone.points.length,40,'oasis home kitchen portrait keeps cooking steam plus two readable tea plumes');
  const poloWide=sampleSteam(SCENES.polo_kitchen,false);
  assert.equal(poloWide.points.length,52,'polo kitchen wide keeps a full wok plume plus three serving-bowl plumes');
  const poloPhone=sampleSteam(SCENES.polo_kitchen,true);
  assert.equal(poloPhone.points.length,52,'polo kitchen portrait keeps a full wok plume plus three serving-bowl plumes');
  const grillWide=sampleSteam(SCENES.kebab_grill,false);
  assert.equal(grillWide.points.length,34,'skewer stall wide keeps foreground grill smoke plus softer background BBQ haze');
  const grillPhone=sampleSteam(SCENES.kebab_grill,true);
  assert.equal(grillPhone.points.length,32,'skewer stall portrait keeps foreground grill smoke plus softer background BBQ haze');
  const caravanWide=sampleSteam(SCENES.caravan_stop,false);
  assert.equal(caravanWide.points.length,24,'caravan stop wide keeps steam on the cooking kettle and receiving tea cup');
  const caravanPhone=sampleSteam(SCENES.caravan_stop,true);
  assert.equal(caravanPhone.points.length,24,'caravan stop portrait keeps steam on the cooking kettle and held tea cup');
  const stoneTeaWide = sampleSteam(SCENES.stone_bridge, false);
  assert.equal(stoneTeaWide.points.length,24,'stone bridge wide keeps a full tea plume');
  assert.ok(stoneTeaWide.averageX>=520&&stoneTeaWide.averageX<=540&&stoneTeaWide.lowestY>=700&&stoneTeaWide.lowestY<=765,
    'stone bridge wide steam must rise from the pictured foreground tea bowl');
  const stoneTeaPhone = sampleSteam(SCENES.stone_bridge, true);
  assert.equal(stoneTeaPhone.points.length,24,'stone bridge phone keeps a full tea plume');
  assert.ok(stoneTeaPhone.averageX>=805&&stoneTeaPhone.averageX<=835&&stoneTeaPhone.lowestY>=665&&stoneTeaPhone.lowestY<=725,
    'stone bridge phone steam must rise from the pictured foreground tea bowl');
  const stoneBridgeSvg = SCENES.stone_bridge().layers.map(layer=>layer.svg).join('');
  assert.equal([...stoneBridgeSvg.matchAll(/\/scenes\/props\/swallow\.webp/g)].length,2,
    'stone bridge must keep one close swallow in each authored composition');
  assert.match(stoneBridgeSvg,/class="wide-only"[^>]*>[\s\S]*?\/scenes\/props\/swallow\.webp/,
    'stone bridge wide swallow must remain wide-only');
  assert.match(stoneBridgeSvg,/class="portrait-only"[^>]*>[\s\S]*?\/scenes\/props\/swallow\.webp/,
    'stone bridge phone swallow must remain portrait-only');
  const teahouseWide = sampleSteam(SCENES.teahouse, false);
  assert.equal(teahouseWide.points.length,16,'teahouse wide steams from both pictured tea cups');
  assert.ok(teahouseWide.points.every(([x])=>Math.abs(x-100)<=45||Math.abs(x-1330)<=45)&&teahouseWide.lowestY<=720,
    'teahouse wide steam must rise from the two pictured tea sources');
  const teahousePhone = sampleSteam(SCENES.teahouse, true);
  assert.equal(teahousePhone.points.length,14,'teahouse phone steams from both pictured tea cups');
  assert.ok(teahousePhone.lowestY<=720,'teahouse phone steam must rise from the pictured tea sources');
  const teahouseSvg=SCENES.teahouse().layers.map(layer=>layer.svg).join('');
  assert.equal([...teahouseSvg.matchAll(/\/scenes\/props\/bird\.webp/g)].length,2,
    'teahouse must keep one bird in each authored composition');
  const bingSteamWide=sampleSteam(SCENES.bing_stall,false);
  assert.ok(bingSteamWide.averageX>=860&&bingSteamWide.averageX<=900&&bingSteamWide.lowestY<=395,
    'bing stall wide steam must rise from the pictured cooking pan');
  const bingSteamPhone=sampleSteam(SCENES.bing_stall,true);
  assert.ok(bingSteamPhone.averageX>=815&&bingSteamPhone.averageX<=850&&bingSteamPhone.lowestY<=350,
    'bing stall phone steam must rise from the pictured cooking pan');
  const courtyardSteamWide=sampleSteam(SCENES.courtyard_kitchen,false);
  assert.equal(courtyardSteamWide.points.length,40,'courtyard kitchen wide keeps separate wok and bao steam plumes');
  assert.ok(courtyardSteamWide.points.some(([x])=>x<260)&&courtyardSteamWide.points.some(([x])=>x>300),
    'courtyard kitchen wide steam must cover both pictured heat sources');
  const courtyardSteamPhone=sampleSteam(SCENES.courtyard_kitchen,true);
  assert.equal(courtyardSteamPhone.points.length,40,'courtyard kitchen phone keeps separate wok and bao steam plumes');
  const mantouSteamWide=sampleSteam(SCENES.mantou_kitchen,false);
  assert.equal(mantouSteamWide.points.length,48,'steamed-bread workshop wide keeps all three pictured steamer plumes');
  const mantouSteamPhone=sampleSteam(SCENES.mantou_kitchen,true);
  assert.equal(mantouSteamPhone.points.length,52,'steamed-bread workshop phone keeps all three pictured steamer plumes');
  const noodleSteamWide=sampleSteam(SCENES.noodle_workshop,false);
  assert.equal(noodleSteamWide.points.length,28,'noodle workshop wide keeps a full plume over its cooking pot');
  assert.ok(noodleSteamWide.averageX>=565&&noodleSteamWide.averageX<=585&&noodleSteamWide.lowestY<=395,
    'noodle workshop wide steam rises from the pictured pot');
  const noodleSteamPhone=sampleSteam(SCENES.noodle_workshop,true);
  assert.equal(noodleSteamPhone.points.length,28,'noodle workshop phone keeps a full plume over its cooking pot');
  assert.ok(noodleSteamPhone.averageX>=625&&noodleSteamPhone.averageX<=650&&noodleSteamPhone.lowestY<=505,
    'noodle workshop phone steam rises from the pictured pot');
  const roastSteamWide=sampleSteam(SCENES.roast_duck,false);
  assert.equal(roastSteamWide.points.length,48,'roast duck wide keeps one readable plume for each pictured steamer');
  assert.ok(roastSteamWide.points.some(([x])=>x<240)&&roastSteamWide.points.some(([x])=>x>450&&x<550)&&roastSteamWide.points.some(([x])=>x>980),
    'roast duck wide steam stays separated across all three steamers');
  const roastSteamPhone=sampleSteam(SCENES.roast_duck,true);
  assert.equal(roastSteamPhone.points.length,48,'roast duck phone keeps one readable plume for each pictured steamer');
  assert.ok(roastSteamPhone.points.every(([x])=>x<720),
    'roast duck phone steam stays on the left-side steamers, away from the chef and oven');
  const jiangnanSteamWide=sampleSteam(SCENES.jiangnan_home,false);
  assert.equal(jiangnanSteamWide.points.length,42,'Jiangnan home wide keeps separate fish-steamer, braised-meat and rice plumes');
  assert.ok(jiangnanSteamWide.points.some(([x])=>x>700&&x<800)&&jiangnanSteamWide.points.some(([x])=>x>950&&x<1090)&&jiangnanSteamWide.points.some(([x])=>x>1280),
    'Jiangnan home wide steam stays on the three pictured hot dishes, away from the cutting board');
  const jiangnanSteamPhone=sampleSteam(SCENES.jiangnan_home,true);
  assert.equal(jiangnanSteamPhone.points.length,42,'Jiangnan home phone keeps separate fish-steamer, braised-meat and rice plumes');
  assert.ok(jiangnanSteamPhone.points.some(([x])=>x<630)&&jiangnanSteamPhone.points.some(([x])=>x>650&&x<730)&&jiangnanSteamPhone.points.some(([x])=>x>840),
    'Jiangnan home phone steam stays on the three pictured hot dishes, away from the cutting board');
  const baoSteamWide=sampleSteam(SCENES.bao_shop,false);
  assert.equal(baoSteamWide.points.length,48,'bao shop wide keeps one coordinated plume for each pictured steamer');
  assert.ok(baoSteamWide.points.some(([x])=>x<700)&&baoSteamWide.points.some(([x])=>x>1080&&x<1230)&&baoSteamWide.points.some(([x])=>x>1330),
    'bao shop wide steam stays on all three steamers, away from the working board');
  const baoSteamPhone=sampleSteam(SCENES.bao_shop,true);
  assert.equal(baoSteamPhone.points.length,48,'bao shop phone keeps one coordinated plume for each pictured steamer');
  assert.ok(baoSteamPhone.points.every(([x])=>x>900),
    'bao shop phone steam stays on the right-side steamer stack, away from the working board');
  const wineSteamWide=sampleSteam(SCENES.rice_wine,false);
  assert.equal(wineSteamWide.points.length,34,'rice wine wide keeps steam on both pictured rice baskets');
  assert.ok(wineSteamWide.points.every(([x])=>x<380),
    'rice wine wide steam stays over rice, away from the pouring vessel and people');
  const wineSteamPhone=sampleSteam(SCENES.rice_wine,true);
  assert.equal(wineSteamPhone.points.length,34,'rice wine phone keeps steam on both pictured rice baskets');
  assert.ok(wineSteamPhone.points.every(([x])=>x<720),
    'rice wine phone steam stays over rice, away from the pouring vessel and people');
  for (const [id, factory] of Object.entries(SCENES)) {
    const room = factory();
    assert.ok(room.hotspots.length >= 1, `${id}: missing controls`);
    assert.ok(room.hotspots.every(h => !h.dock), `${id}: corner dock returned`);
    if (id === 'hotpot') {
      const action = room.hotspots.find(h => h.activeLabel);
      assert.equal(room.react(action.id), true);
      assert.equal(room.react(action.id), false);
      assert.equal(factory().react(action.id), true);
      for (const portrait of [false, true]) assert.ok(render(factory, true, portrait) > render(factory, false, portrait));
    } else {
      assert.ok(room.hotspots.length >= 2, `${id}: room-specific touch points`);
      for (const h of room.hotspots) {
        assert.ok(h.interaction && !h.prop && h.text);
        for (const point of [h.interaction.wide, h.interaction.phone]) assert.ok(point.every(n => n > 0 && n < 1));
        assert.ok(h.interaction.extent.every(n => n > 0 && n <= .5));
        await access(`public/scenes/${h.interaction.folder}/wide.jpg`);
        await access(`public/scenes/${h.interaction.folder}/portrait.jpg`);
      }
      const propRefs=room.layers.flatMap(l=>[...l.svg.matchAll(/href="([^"]*\/scenes\/props\/[^"]+)"/g)].map(m=>m[1]));
      const skyRooms=new Set(['noodle_shop','teahouse','stone_bridge','lotus_garden','oasis_bazaar','tianshan','wheat_harvest']);
      const safeSkyProps=propRefs.every(ref=>skyRooms.has(id)&&/(?:bird|swallow)\.webp$/.test(ref));
      assert.ok(propRefs.length===0||(safeSkyProps&&propRefs.length<=2),
        `${id}: only one authored sky bird per composition may accompany the painting (${propRefs.join(', ')})`);
    }
    for (const layer of room.layers) {
      for (const match of layer.svg.matchAll(/<image[^>]*href="([^"]+)"/g)) await access(join('public', match[1]));
    }
  }
  console.log(`PASS: ${Object.keys(SCENES).length} rooms: painted touch points, separate portrait anchors, no duplicate sprites, source images, and hotpot boil regression.`);
} finally {
  Math.random = originalRandom;
  await rm(temporary, { recursive: true, force: true });
}
