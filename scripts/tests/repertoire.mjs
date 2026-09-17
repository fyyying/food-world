/**
 * A place is not one dish.
 *
 * Every room and every place-or-dish object declares its repertoire as world content — the hero dish first, then
 * the dishes that kitchen actually cooks — and the card shows it with the recipe add-on off, because that is how
 * the world is built and reviewed. This harness guards the content and the two places it is drawn:
 *
 *   - every key in the three tables is a real object id or a real room id, so nothing is written for a place
 *     that does not exist and no rename silently drops a list
 *   - every entry has a name and a line of 12 to 25 words, the length band the three tables were written to
 *   - every `recipe` id is a recipe that really exists in the export, so the add-on's link never dead-ends
 *   - a card for an object with a repertoire draws the section with the add-on off, and nothing else about dishes
 *   - the same card with the add-on on grows a recipe link on the entries that name one, and still no fuzzy
 *     "Related recipes" rows: a place with a repertoire has said what it cooks
 *   - a room's story panel (the "The story" button opens the place's card) carries the same list
 */
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'rolldown';

const words = (line) => line.trim().split(/\s+/).filter(Boolean).length;
const temporary = await mkdtemp(join(tmpdir(), 'food-repertoire-'));
try {
  // the rooms are only wanted for their ids, so the painted-scene builder is stubbed out exactly as room-loops.mjs does
  const painted = resolve('src/fw/scene-painted.ts');
  const stub = `export { pAt, at } from ${JSON.stringify(painted)}; export const paintedScene = (cfg) => ({ __cfg: cfg });`;
  // and the card badge is a rendered three.js snapshot, which wants a WebGL canvas Node has not got: the badge is
  // not what this harness reads, so any object may be a fixture instead of only the ones with painted card art
  const plugin = {
    name: 'stub',
    resolveId(src, importer) {
      if (src === './scene-painted' && importer && /scenes-(china|turkey|spain)\.ts$/.test(importer)) return '\0stub';
      if (src === './snapshot' && importer && /ui\.ts$/.test(importer)) return '\0snapshot';
    },
    load(id) {
      if (id === '\0stub') return stub;
      if (id === '\0snapshot') return 'export const snapshot = () => null;';
    },
  };

  const entry = join(temporary, 'entry.ts');
  const src = (f) => resolve(f).replace(/\\/g, '/');
  await writeFile(entry, [
    `export { mountUi } from '${src('src/fw/ui.ts')}';`,
    `export { REPERTOIRE_TABLES, repertoireOf, repertoireLabel, setRepertoireRecipes } from '${src('src/fw/repertoire.ts')}';`,
    `export { CHINA_REPERTOIRE } from '${src('src/fw/china-repertoire.ts')}';`,
    `export { TURKEY_REPERTOIRE } from '${src('src/fw/turkey-repertoire.ts')}';`,
    `export { SPAIN_REPERTOIRE } from '${src('src/fw/spain-repertoire.ts')}';`,
    `export { setRecipeLayerEnabled } from '${src('src/data.ts')}';`,
    `export { ALL_OBJECTS, enrich } from '${src('src/fw/graph.ts')}';`,
    `export { SCENES as CHINA_SCENES } from '${src('src/fw/scenes-china.ts')}';`,
    `export { TURKEY_SCENES } from '${src('src/fw/scenes-turkey.ts')}';`,
    `export { SPAIN_SCENES } from '${src('src/fw/scenes-spain.ts')}';`,
  ].join('\n'));

  // the card is written into one element; the rooms only need enough of a document to be imported
  const element = () => ({ className: '', innerHTML: '', hidden: true, scrollTop: 0, addEventListener() {}, querySelector: () => null, querySelectorAll: () => [], getContext: () => null });
  const card = element();
  globalThis.document = { getElementById: (id) => (id === 'card' ? card : element()), createElement: () => element() };
  globalThis.Image = class { constructor() { this.src = ''; } };
  try { globalThis.localStorage?.removeItem('food-tour:recipes'); } catch { /* storage is optional */ }

  const output = join(temporary, 'repertoire.mjs');
  await build({ input: entry, plugins: [plugin], platform: 'node', output: { file: output, format: 'esm', banner: 'import.meta.env = { BASE_URL: "/", VITE_STATIC: "1" };' } });
  const m = await import(pathToFileURL(output));

  const objectIds = new Set(m.ALL_OBJECTS.map((o) => o.id));
  const roomIds = new Set([...Object.keys(m.CHINA_SCENES), ...Object.keys(m.TURKEY_SCENES), ...Object.keys(m.SPAIN_SCENES)]);
  const { recipes: rawRecipes } = JSON.parse(await readFile('public/static/recipes.json', 'utf8'));
  const recipeIds = new Set(rawRecipes.map((r) => r.id));

  // 1. the content: real keys, a name, a line in the band, and a recipe id that resolves
  const tables = [['CHINA_REPERTOIRE', m.CHINA_REPERTOIRE], ['TURKEY_REPERTOIRE', m.TURKEY_REPERTOIRE], ['SPAIN_REPERTOIRE', m.SPAIN_REPERTOIRE]];
  assert.equal(m.REPERTOIRE_TABLES.length, tables.length, 'repertoireOf merges every world table');
  let entries = 0, linked = 0;
  const seenKeys = new Map();
  for (const [table, rows] of tables) {
    for (const [key, list] of Object.entries(rows)) {
      assert.ok(objectIds.has(key) || roomIds.has(key), `${table}: "${key}" is neither a world object id nor a room id`);
      assert.ok(!seenKeys.has(key), `"${key}" has a repertoire in both ${seenKeys.get(key)} and ${table}`);
      seenKeys.set(key, table);
      assert.ok(Array.isArray(list) && list.length, `${table}.${key}: a repertoire is a non-empty list, the hero first`);
      for (const e of list) {
        entries++;
        assert.ok(typeof e.name === 'string' && e.name.trim(), `${table}.${key}: every entry needs a name`);
        assert.ok(typeof e.line === 'string', `${table}.${key}: ${e.name} needs a line`);
        const n = words(e.line);
        assert.ok(n >= 12 && n <= 25, `${table}.${key}: ${e.name}'s line is ${n} words, outside the 12–25 band`);
        if (e.zh !== undefined) assert.ok(typeof e.zh === 'string' && e.zh.trim(), `${table}.${key}: ${e.name}'s local name is empty`);
        // no repertoire pictures have been delivered yet; when they are, the stem is a file name, not a path
        if (e.art !== undefined) assert.ok(typeof e.art === 'string' && /^[a-z0-9-]+$/.test(e.art), `${table}.${key}: ${e.name}'s art "${e.art}" is not a file stem`);
        if (e.recipe !== undefined) { assert.ok(recipeIds.has(e.recipe), `${table}.${key}: ${e.name} names recipe "${e.recipe}", which is not in the export`); linked++; }
      }
      // a missing key is nothing at all, and a present one comes back through the merged lookup
      assert.deepEqual(m.repertoireOf(key), list, `repertoireOf("${key}") returns ${table}'s list`);
    }
  }
  assert.deepEqual(m.repertoireOf('no-such-object-anywhere'), [], 'a key nobody wrote returns nothing at all');
  assert.equal(m.repertoireLabel('place'), 'What this kitchen cooks', 'a place cooks a list');
  assert.equal(m.repertoireLabel('dish'), 'How it is served', 'a single dish is served a way');
  assert.equal(m.repertoireLabel('dish', true), 'What this kitchen cooks', 'a dish that opens a painted room is a kitchen');

  // 2. every room that is a kitchen declares what it cooks. A landmark room — a stone bridge, a hutong lane, the
  // Tianshan snowmelt — has no kitchen and carries no list, and a "What this kitchen cooks" heading over a
  // mountain would be wrong; those are counted and named here so a real gap is visible instead of hidden.
  const roomObjects = m.ALL_OBJECTS.filter((o) => o.scene && roomIds.has(o.scene));
  const covers = (o) => Boolean(m.repertoireOf(o.id).length || m.repertoireOf(o.scene).length);
  const kitchens = roomObjects.filter((o) => o.kind === 'place' || o.kind === 'dish');
  const kitchensWithout = kitchens.filter((o) => !covers(o)).map((o) => `${o.id} (${o.world})`);
  assert.deepEqual(kitchensWithout, [], 'every painted room that is a kitchen declares what it cooks');
  const landmarkRooms = roomObjects.filter((o) => o.kind !== 'place' && o.kind !== 'dish' && !covers(o)).map((o) => o.id);

  // 3. the card, with the add-on off: the list is there and nothing else about dishes is
  const ui = m.mountUi({ onClose() {}, onOpenRecipe() {}, onGoObject() {}, onCook() {}, onExploreIngredients() {}, onEnterRegion() {}, onStartStory() {} });
  const enriched = rawRecipes.map(m.enrich);
  const withLink = m.ALL_OBJECTS.find((o) => m.repertoireOf(o.id).some((e) => e.recipe && recipeIds.has(e.recipe)));
  assert.ok(withLink, 'the fixture needs an object whose repertoire names a real recipe');
  const list = m.repertoireOf(withLink.id);
  const anchor = list.find((e) => e.recipe && recipeIds.has(e.recipe));

  ui.showObject(withLink, enriched.filter((r) => withLink.match(r)), m.ALL_OBJECTS);
  const off = card.innerHTML;
  assert.ok(/What this kitchen cooks|How it is served/.test(off), `${withLink.id}: the repertoire section is there with the add-on off`);
  assert.ok(off.includes('class="repertoire"'), `${withLink.id}: the repertoire renders as a list`);
  for (const e of list) assert.ok(off.includes(e.name.replace(/&/g, '&amp;')), `${withLink.id}: ${e.name} is on the card with the add-on off`);
  assert.ok(!/data-recipe=/.test(off), 'no recipe is reachable from the repertoire with the add-on off');
  assert.ok(!/class="rlink"/.test(off), 'no recipe link on an entry with the add-on off');
  assert.ok(!/Related recipes/.test(off), 'a place with a repertoire never falls back to the fuzzy "Related recipes" rows');
  assert.ok(!/class="dishes"/.test(off), 'no dish rows on a card with the add-on off');

  // 4. the add-on on: the entries that name a loaded recipe grow a link, and nothing else changes
  m.setRepertoireRecipes(enriched);
  m.setRecipeLayerEnabled(true);
  ui.showObject(withLink, enriched.filter((r) => withLink.match(r)), m.ALL_OBJECTS);
  const on = card.innerHTML;
  assert.ok(new RegExp(`class="rlink"[^>]*data-recipe="${anchor.recipe}"`).test(on), `${withLink.id}: ${anchor.name} links to its recipe with the add-on on`);
  const links = (on.match(/class="rlink"/g) ?? []).length;
  assert.equal(links, list.filter((e) => e.recipe && recipeIds.has(e.recipe)).length, `${withLink.id}: exactly the entries that name a loaded recipe carry a link`);
  assert.ok(!/Related recipes/.test(on), 'the repertoire still replaces the fuzzy rows with the add-on on');
  m.setRecipeLayerEnabled(false);
  ui.showObject(withLink, enriched.filter((r) => withLink.match(r)), m.ALL_OBJECTS);
  assert.equal(card.innerHTML, off, 'switching the add-on off restores exactly the card the world is reviewed against');

  // 5. an ingredient with no repertoire keeps the add-on's fuzzy rows, and loses them again when it goes off
  const ingredient = m.ALL_OBJECTS.find((o) => o.kind === 'ingredient' && !m.repertoireOf(o.id).length && enriched.some((r) => o.match(r)));
  assert.ok(ingredient, 'the fixture needs an ingredient with no repertoire and matching recipes');
  const ingredientRecipes = enriched.filter((r) => ingredient.match(r));
  m.setRecipeLayerEnabled(true);
  ui.showObject(ingredient, ingredientRecipes, m.ALL_OBJECTS);
  assert.ok(/Related recipes/.test(card.innerHTML), `${ingredient.id}: an object with no repertoire keeps its "Related recipes" rows`);
  assert.ok(!/class="repertoire"/.test(card.innerHTML), `${ingredient.id}: no empty repertoire section, no leftover heading`);
  m.setRecipeLayerEnabled(false);
  ui.showObject(ingredient, [], m.ALL_OBJECTS);
  assert.ok(!/Related recipes/.test(card.innerHTML), `${ingredient.id}: and nothing about dishes with the add-on off`);

  // 6. a room's story panel: "The story" opens the place's card, so the room's list is that card's
  const room = kitchens.find((o) => o.world === 'china' && m.repertoireOf(o.id).length);
  assert.ok(room, 'the fixture needs a China room whose object has a repertoire');
  ui.showObject(room, [], m.ALL_OBJECTS);
  const panel = card.innerHTML;
  assert.ok(panel.includes('class="repertoire"'), `${room.id}: the room's story panel carries the list`);
  for (const e of m.repertoireOf(room.id)) assert.ok(panel.includes(e.name.replace(/&/g, '&amp;')), `${room.id}: ${e.name} is in the story panel`);

  console.log(`PASS: ${seenKeys.size} places declare ${entries} dishes (${linked} with a recipe); ${kitchens.length} kitchen rooms all covered${landmarkRooms.length ? `, ${landmarkRooms.length} landmark rooms with no kitchen (${landmarkRooms.join(', ')})` : ''}; the list is card content with the add-on off and only its links come and go.`);
} finally {
  await rm(temporary, { recursive: true, force: true });
}
