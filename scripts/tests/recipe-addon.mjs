/**
 * The recipe add-on: recipes are an optional layer over a finished world, off by default.
 *
 * What this guards, after the owner asked for the layer to become something she can turn off while she builds
 * ("the dishes are random currently and distracting on the cards"):
 *   - the layer is off when nothing has been stored
 *   - a card rendered with the layer off carries no dish rows and no "Related recipes" heading, even when the
 *     object really does match recipes
 *   - the same card with the layer on carries both
 *   - a room's dish row is nothing at all with the layer off, and the row with it on
 *
 * Node has no localStorage, which is exactly the "storage unavailable" case: the layer must still default to
 * off and still switch for the visit.
 */
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'rolldown';

const temporary = await mkdtemp(join(tmpdir(), 'food-recipe-addon-'));
try {
  // one bundle, so the card, the room and the switch share a single copy of the add-on's state
  const entry = join(temporary, 'entry.ts');
  const src = (f) => resolve(f).replace(/\\/g, '/');
  await writeFile(entry, [
    `export { mountUi } from '${src('src/fw/ui.ts')}';`,
    `export { sceneDishRowHtml } from '${src('src/fw/scene.ts')}';`,
    `export { isRecipeLayerEnabled, setRecipeLayerEnabled } from '${src('src/data.ts')}';`,
    `export { enrich, objectsOf, isChinaRecipe } from '${src('src/fw/graph.ts')}';`,
    `export { repertoireOf } from '${src('src/fw/repertoire.ts')}';`,
  ].join('\n'));

  // the card is written into one element: a stub is enough to read the markup mountUi produces
  const element = () => ({
    className: '', innerHTML: '', hidden: true, scrollTop: 0,
    addEventListener() {}, querySelector: () => null, querySelectorAll: () => [],
  });
  const card = element();
  globalThis.document = { getElementById: (id) => (id === 'card' ? card : element()) };

  // a Node build that does have working storage must not carry a previous run's choice into this one
  try { globalThis.localStorage?.removeItem('food-tour:recipes'); } catch { /* storage is optional */ }

  const output = join(temporary, 'recipe-addon.mjs');
  await build({ input: entry, platform: 'node', output: { file: output, format: 'esm', banner: 'import.meta.env = { BASE_URL: "/", VITE_STATIC: "1" };' } });
  const { mountUi, sceneDishRowHtml, isRecipeLayerEnabled, setRecipeLayerEnabled, enrich, objectsOf, isChinaRecipe, repertoireOf } = await import(pathToFileURL(output));

  // 1. off by default, and off is what a missing localStorage gives
  assert.equal(isRecipeLayerEnabled(), false, 'the recipe add-on is off until it is switched on');

  // a real object with real matching recipes: cards whose badge is painted art, so no prop has to be rendered
  const { recipes: raw } = JSON.parse(await readFile('public/static/recipes.json', 'utf8'));
  const chinaRecipes = raw.filter(isChinaRecipe).map(enrich);
  const chinaObjects = objectsOf('china');
  const painted = ['hotpot', 'noodle', 'wok', 'chilli', 'tofu', 'mushroom', 'dumpling', 'teahouse', 'rice', 'veg'];
  // A place that declares its own repertoire says what it cooks instead of guessing, so the fuzzy rows this
  // harness is about belong to the objects without one: the ingredients. See repertoire.mjs for the other half.
  const subject = chinaObjects.find((o) => painted.includes(o.id) && !repertoireOf(o.id).length && chinaRecipes.some((r) => o.match(r)));
  assert.ok(subject, 'the fixture needs a China object with no repertoire that really matches recipes');
  const matching = chinaRecipes.filter((r) => subject.match(r));
  assert.ok(matching.length >= 1, `${subject.id} matches at least one recipe`);

  const ui = mountUi({
    onClose() {}, onOpenRecipe() {}, onGoObject() {}, onCook() {},
    onExploreIngredients() {}, onEnterRegion() {}, onStartStory() {},
  });

  // 2. the layer off: the card names the place and nothing about dishes
  ui.showObject(subject, matching, chinaObjects);
  const off = card.innerHTML;
  assert.ok(off.includes(subject.name.replace(/&/g, '&amp;')), 'the card still shows the object with the add-on off');
  assert.ok(!off.includes('class="dishes"'), 'no dish rows on a card with the add-on off');
  assert.ok(!/Related recipes/.test(off), 'no "Related recipes" heading with the add-on off');
  assert.ok(!/data-recipe=/.test(off), 'no recipe is reachable from a card with the add-on off');
  for (const r of matching) assert.ok(!off.includes(r.title), `${r.title} is not on the card with the add-on off`);

  // 3. switched on: the same card, the same object, with its recipes back
  setRecipeLayerEnabled(true);
  assert.equal(isRecipeLayerEnabled(), true, 'the switch holds for the visit even when storage refuses it');
  ui.showObject(subject, matching, chinaObjects);
  const on = card.innerHTML;
  assert.ok(on.includes('class="dishes"'), 'dish rows come back with the add-on on');
  assert.ok(/Related recipes/.test(on), 'the "Related recipes" heading comes back with the add-on on');
  for (const r of matching) assert.ok(on.includes(r.title), `${r.title} is on the card with the add-on on`);

  // 4. rooms: the "FROM THIS KITCHEN" row is the add-on's too
  assert.ok(sceneDishRowHtml(matching, 'From this kitchen').includes('From this kitchen'), 'a room shows its kitchen row with the add-on on');
  assert.ok(sceneDishRowHtml(matching, 'From this kitchen').includes('class="plates"'), 'a room shows its dish chips with the add-on on');
  setRecipeLayerEnabled(false);
  assert.equal(sceneDishRowHtml(matching, 'From this kitchen'), '', 'a room has no kitchen row at all with the add-on off — no heading, no chips, no gap');
  assert.equal(sceneDishRowHtml(matching, 'On the table'), '', 'the same for a room that would say "On the table"');

  // and the card follows the switch back down
  ui.showObject(subject, matching, chinaObjects);
  assert.equal(card.innerHTML, off, 'switching the add-on off restores exactly the card the world is built and reviewed against');

  console.log(`PASS: the recipe add-on is off by default; ${subject.id} keeps its ${matching.length} matching recipes off the card and out of the room until it is switched on.`);
} finally {
  await rm(temporary, { recursive: true, force: true });
}
