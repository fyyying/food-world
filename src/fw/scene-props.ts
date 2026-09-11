import type { SceneHotspot } from './scene';
import { playRoomSound } from './room-sound';

export type RoomEffect = 'detail' | 'water' | 'leaves' | 'flour' | 'tea' | 'sizzle' | 'light' | 'chime' | 'purr' | 'woof';
type Point = [number, number];
export type RoomInteraction = {
  effect: RoomEffect;
  icon: string;
  wide: Point;
  phone: Point;
  /** Diameter as a fraction of the painting width, independently composed. */
  extent: [number, number];
  folder: string;
  wideOnly?: boolean;
};
type Entry = { wideOnly?: boolean; label: string; text: string; effect: RoomEffect; wide: Point; phone: Point; extent?: [number, number] };
const item = (label: string, text: string, effect: RoomEffect, wide: Point, phone: Point, extent?: [number, number]): Entry => ({ label, text, effect, wide, phone, extent });
// These refer to features in the complete paintings, never inserted prop sprites.
// Each portrait was inspected separately: it is a different painting, not a crop.
const rooms: Record<string, Entry[]> = {
  noodle_shop: [
    { ...item('Greet the dog', 'The little dog answers with a soft woof.', 'woof', [.786,.61], [.5,.5], [.045,.08]), wideOnly: true },
    item('Watch the noodle maker', 'Follow the fresh strands between the cook’s hands, above the steaming pot.', 'detail', [.20,.41], [.30,.36]),
    item('Look into the noodle bowl', 'Noodles, greens and chilli oil: look closely at the bowl before the first mouthful.', 'detail', [.46,.86], [.32,.86]),
  ],
  teahouse: [
    item('Stroke the sleeping cat', 'The cat gives a soft purr without leaving its sunny spot.', 'purr', [.26,.875], [.27,.735], [.09,.18]),
    item('Warm your tea', 'A little warmth rises from the cup. There is time for another sip.', 'tea', [.52,.89], [.57,.85], [.045,.12]),
    item('Look at the tea service', 'The small cups, kettle and shared table make room for an unhurried afternoon.', 'detail', [.82,.86], [.78,.88]),
  ],
  market: [
    item('Explore the chilli basket', 'Compare the red chillies with the green vegetables around them.', 'detail', [.28,.74], [.26,.74]),
    item('Brush the overhead leaves', 'A few leaves loosen above the busy market lane.', 'leaves', [.44,.06], [.83,.12], [.14,.32]),
  ],
  home_kitchen: [
    item('Explore the chopping board', 'Freshly cut vegetables and a broad kitchen knife sit ready on the family work table.', 'detail', [.56,.86], [.49,.79]),
    item('Listen to the wok', 'The vegetables sizzle in the hot wok beside the cook.', 'sizzle', [.20,.49], [.22,.49], [.10,.20]),
    item('Stroke the sleeping cat', 'A soft mrr, then a contented purr from the cat by the wall.', 'purr', [.67,.74], [.83,.68], [.09,.14]),
  ],
  tower: [
    item('Ring the hanging bell', 'A soft bell note carries out beneath the eaves.', 'chime', [.505,.175], [.42,.20], [.06,.16]),
    item('Look across the valley', 'Follow the river between the rooftops and the mountain ridges.', 'detail', [.69,.57], [.69,.54]),
  ],
  bao_shop: [
    item('Pat the floured board', 'A small puff of flour lifts from the board beside the bun makers.', 'flour', [.26,.70], [.32,.66]),
    item('Inspect the folded buns', 'Each bun has a gathered top. The bamboo baskets hold them above the steaming water.', 'detail', [.78,.82], [.81,.62]),
  ],
  stone_bridge: [
    item('Touch the canal water', 'Rings widen across the canal beneath the stone bridge.', 'water', [.67,.69], [.63,.62], [.14,.30]),
    item('Look at the waterside meal', 'Woven baskets, blue-and-white bowls and small dishes are arranged beside the canal.', 'detail', [.46,.91], [.52,.87]),
  ],
  crab_pond: [
    item('Explore the crab basket', 'Look at the shells and legs in the basket at the centre of the meal.', 'detail', [.54,.66], [.56,.68]),
    item('Brush the autumn branch', 'A few autumn leaves drift down beside the open dining terrace.', 'leaves', [.30,.09], [.70,.06], [.12,.30]),
  ],
  jiangnan_home: [
    item('Feel the basket warmth', 'Warmth rises gently from the bamboo steamer on the kitchen table.', 'tea', [.45,.77], [.65,.57], [.13,.25]),
    item('Explore the family dishes', 'Several small dishes share the table: greens, soup and richer braised food.', 'detail', [.76,.85], [.49,.72]),
  ],
  lotus_garden: [
    item('Touch the lotus pond', 'Small ripples spread through the open water between the lotus leaves.', 'water', [.66,.65], [.67,.50], [.12,.25]),
    item('Look inside a lotus root', 'The sliced root shows its ring of air channels, beside the dishes on the ledge.', 'detail', [.48,.86], [.81,.74]),
  ],
  rice_wine: [
    item('Explore the rice basket', 'Rice is spread out in woven baskets beside the brewing vessels.', 'detail', [.29,.74], [.44,.78]),
    item('Look at the pouring vessel', 'Follow the brewer’s hands from the small vessel to the large jar.', 'detail', [.74,.51], [.66,.47]),
  ],
  river_market: [
    item('Touch the water beside the boats', 'A small ring spreads across the open strip of canal.', 'water', [.88,.75], [.88,.46], [.08,.12]),
    item('Explore the market vegetables', 'Lotus roots, greens and bamboo shoots crowd the baskets at the water’s edge.', 'detail', [.51,.78], [.61,.77]),
  ],
  riverside_restaurant: [
    item('Touch the canal', 'Ripples catch the light beside the restaurant terrace.', 'water', [.85,.57], [.68,.405], [.10,.15]),
    item('Explore the shared dishes', 'Everyone can reach the dishes at the centre of the table.', 'detail', [.53,.77], [.53,.67]),
  ],
  tea_hill: [
    item('Warm the tasting cup', 'A wisp of warmth rises from the tea on the stone table.', 'tea', [.46,.78], [.44,.83], [.04,.10]),
    item('Look at the picked leaves', 'Tender leaves collect in a shallow woven basket beside the tea plants.', 'detail', [.20,.79], [.77,.75]),
  ],
  skewer_courtyard: [
    item('Listen to the grill', 'A brief crackle from the charcoal beneath the skewers.', 'sizzle', [.32,.66], [.36,.58], [.22,.50]),
    item('Explore the grill accompaniments', 'Onions, seasonings and flatbread wait beside the skewers.', 'detail', [.77,.79], [.73,.77]),
  ],
  mantou_kitchen: [
    item('Pat the dough board', 'A little flour rises from the board under the baker’s hands.', 'flour', [.22,.70], [.48,.48]),
    item('Look at the mantou', 'The rounded buns sit side by side in their steaming baskets.', 'detail', [.57,.67], [.31,.73]),
  ],
  dumpling_house: [
    item('Tap the wrapper board', 'A dusting of flour keeps the thin wrappers loose on the board.', 'flour', [.28,.66], [.49,.64]),
    item('Inspect the dumpling folds', 'Look closely at the rows of pleated dumplings waiting in the basket.', 'detail', [.40,.86], [.58,.79]),
  ],
  winter_table: [
    item('Warm your hands by the soup', 'The central bowl sends up a little warmth across the winter table.', 'tea', [.59,.66], [.50,.59], [.12,.25]),
    item('Explore the winter spread', 'Buns, braised dishes and vegetables make a generous family meal.', 'detail', [.65,.82], [.54,.69]),
  ],
  courtyard_kitchen: [
    item('Pat the family dough board', 'A little flour lifts from the board where the wrappers are being shaped.', 'flour', [.50,.64], [.53,.53]),
    item('Inspect the filling ingredients', 'Vegetables and prepared fillings sit within reach of the cooks.', 'detail', [.51,.83], [.57,.73]),
  ],
  hutong: [
    item('Stroke the cat', 'A contented purr from the cat beside the lane.', 'purr', [.89,.835], [.53,.685], [.08,.16]),
    item('Brush the autumn leaves', 'A few leaves drift down from the branch over the lane.', 'leaves', [.72,.07], [.80,.06], [.13,.30]),
    item('Look at the street-side dumplings', 'The dumpling board is close enough to the lane for neighbours to stop and talk.', 'detail', [.24,.59], [.30,.55]),
  ],
  bing_stall: [
    item('Listen to the griddle', 'The hot surface gives a brief, gentle sizzle beneath the flatbreads.', 'sizzle', [.43,.51], [.58,.42], [.18,.34]),
    item('Inspect the browned bing', 'Look for the browned patches and layers in the stacked flatbreads.', 'detail', [.69,.67], [.29,.74]),
  ],
  north_market: [
    item('Tap the noodle board', 'A pinch of flour scatters across the noodle maker’s work surface.', 'flour', [.28,.67], [.29,.47]),
    item('Explore the winter vegetables', 'Cabbage, roots and mushrooms fill the baskets across the market counter.', 'detail', [.66,.80], [.69,.72]),
  ],
  noodle_workshop: [
    item('Dust the noodle board', 'Fine flour settles onto the board beneath the stretched strands.', 'flour', [.46,.63], [.58,.57]),
    item('Follow the pulled strands', 'Look at how one long loop is stretched between the noodle maker’s hands.', 'detail', [.26,.38], [.43,.37]),
  ],
  roast_duck: [
    item('Look at the carved duck', 'Thin slices gather on the carving board beneath the cook’s knife.', 'detail', [.38,.65], [.56,.57]),
    item('Explore the serving tray', 'Thin pancakes, cucumber and sauce accompany the roast duck.', 'detail', [.63,.84], [.59,.78]),
  ],
  vinegar_workshop: [
    item('Look into the grain baskets', 'Grain, broad wooden tubs and dark storage jars share the workshop.', 'detail', [.28,.76], [.18,.71]),
    item('Watch the vinegar being poured', 'Look closely at the small pouring vessel and the mouth of the receiving jar.', 'detail', [.80,.57], [.67,.59]),
  ],
  wheat_harvest: [
    item('Tap the flour basket', 'A little flour rises and settles back into the basket beside the harvested wheat.', 'flour', [.86,.86], [.72,.65]),
    item('Follow wheat to flour', 'Cut wheat, grain baskets and white flour appear together in this harvest scene.', 'detail', [.66,.65], [.33,.51]),
  ],
  kebab_grill: [
    item('Listen to the charcoal', 'A short crackle from the grill below the rows of kebabs.', 'sizzle', [.57,.70], [.42,.58], [.25,.48]),
    item('Explore the grill accompaniments', 'Seasonings, sliced onion and bread are ready beside the kebabs.', 'detail', [.34,.87], [.75,.75]),
  ],
  naan_bakery: [
    item('Dust the baker’s board', 'A small cloud of flour settles beside the shaped dough.', 'flour', [.23,.69], [.53,.52]),
    item('Look at the naan patterns', 'The stamped centres and raised rims give each round its pattern.', 'detail', [.69,.82], [.66,.83]),
  ],
  polo_kitchen: [
    item('Listen to the kazan fire', 'A soft cooking crackle comes from beneath the large kazan.', 'sizzle', [.42,.84], [.46,.67], [.20,.44]),
    item('Explore the polo ingredients', 'Rice, carrots, onions and meat are gathered around the large cooking pot.', 'detail', [.23,.86], [.42,.78]),
  ],
  laghman_shop: [
    item('Dust the stretching board', 'A fine dusting falls on the worktop below the long noodle loops.', 'flour', [.40,.65], [.50,.54]),
    item('Look into the laghman bowl', 'Long noodles sit beneath a colourful topping of vegetables and sauce.', 'detail', [.55,.79], [.61,.69]),
  ],
  oasis_bazaar: [
    item('Explore the cut melons', 'The cut melons reveal pale and orange flesh among the fruit baskets.', 'detail', [.40,.71], [.82,.65]),
    item('Explore the dried fruit', 'Raisins, nuts and dried fruit fill separate baskets on the patterned cloth.', 'detail', [.26,.85], [.37,.72]),
  ],
  grape_courtyard: [
    item('Brush the vine canopy', 'A few vine leaves drift down from the shade above the table.', 'leaves', [.65,.08], [.60,.09], [.16,.35]),
    item('Explore the courtyard meal', 'Fruit, bread and tea share the low table beneath the grapes.', 'detail', [.60,.72], [.53,.60]),
  ],
  oasis_field: [
    item('Touch the irrigation water', 'Small ripples travel along the water channel beside the field.', 'water', [.77,.74], [.84,.46], [.08,.10]),
    item('Look at the harvest', 'Melons and grapes are piled beside the shade of the vine trellis.', 'detail', [.27,.78], [.43,.78]),
  ],
  chaikhana: [
    item('Warm a tea cup', 'A little warmth rises from the tea between the guests.', 'tea', [.64,.66], [.64,.56], [.04,.10]),
    item('Explore the tea table', 'Bread, small bowls and fruit sit together on the cloth-covered table.', 'detail', [.51,.77], [.50,.68]),
  ],
  xj_home: [
    item('Pat the family dough board', 'A little flour lifts from the work surface beside the cook.', 'flour', [.28,.65], [.43,.48]),
    item('Explore the family ingredients', 'Fresh vegetables, meat and round breads are ready around the work table.', 'detail', [.49,.81], [.45,.65]),
  ],
  caravan_stop: [
    item('Warm the travellers’ tea', 'A wisp rises from the tea service at the travellers’ table.', 'tea', [.15,.54], [.28,.53], [.045,.12]),
    item('Explore the roadside provisions', 'Bread, fruit and grain baskets make a generous stopping place.', 'detail', [.29,.82], [.46,.73]),
  ],
  tianshan: [
    item('Touch the mountain stream', 'Ripples spread below the little fall in the channel.', 'water', [.72,.85], [.73,.87], [.12,.27]),
    item('Explore the mountain harvest', 'Melons and grapes fill the stand below the distant snowy peaks.', 'detail', [.20,.83], [.25,.77]),
  ],
  evening_feast: [
    item('Brighten the painted lantern', 'The lantern casts a warmer pool of light over the evening meal.', 'light', [.14,.15], [.11,.22], [.07,.18]),
    item('Explore the feast', 'Follow the platters across the table: bread, skewers, vegetables and fruit.', 'detail', [.62,.78], [.58,.74]),
  ],
};
const icons: Record<RoomEffect, string> = { detail: '⌕', water: '≈', leaves: '❧', flour: '⋯', tea: '♨', sizzle: '♨', light: '☼', chime: '♪', purr: '♡', woof: '♡' };
export function roomProps(id: string, portraitPoint: (x: number, y: number) => { x: number; y: number }): SceneHotspot[] {
  return (rooms[id] ?? []).map((entry, i) => ({
    id: `room-${i}`, label: entry.label, text: entry.text,
    x: entry.wide[0] * 1600, y: entry.wide[1] * 900, portrait: portraitPoint(...entry.phone),
    interaction: { ...entry, icon: icons[entry.effect], extent: entry.extent ?? [.12,.28], folder: id === 'tower' ? 'historical_tower' : id },
  }));
}

/** Local, finite effects. No whole-object translation, artwork replacement or floating props. */
export function animateRoomTouch(host: HTMLElement, interaction: RoomInteraction, trigger?: HTMLElement): () => void {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nodes: HTMLElement[] = [], animations: Animation[] = [];
  const effect = interaction.effect;
  if (effect !== 'detail') trigger?.classList.add('room-responding');
  const spread = Math.max(85, Math.min(180, host.clientWidth || 120));
  // Five times the previous particle density, contained within the painted feature.
  const count = reduced ? 1 : effect === 'water' ? 15 : effect === 'leaves' ? 25 : effect === 'flour' ? 24 : effect === 'sizzle' ? 40 : effect === 'tea' ? 25 : effect === 'chime' || effect === 'purr' || effect === 'woof' ? 5 : 1;
  for (let i = 0; i < count; i++) {
    const node = document.createElement('i');
    node.className = `room-response-particle ${reduced ? 'still' : effect}`;
    host.append(node); nodes.push(node);
    let frames: Keyframe[];
    let duration = 1600, delay = 0;
    if (effect === 'water') {
      frames = [{ opacity: 0, transform: 'translate(-50%,-50%) scale(.12)' }, { opacity: .95, offset: .12 }, { opacity: .6, offset: .55 }, { opacity: 0, transform: 'translate(-50%,-50%) scale(1)' }];
      duration = 2800; delay = i * 95;
    } else if (effect === 'leaves') {
      node.style.left = `${18 + (i * 17) % 65}%`;
      frames = [{ opacity: 0, transform: 'translate(0,0) rotate(-20deg)' }, { opacity: .8, offset: .15 }, { opacity: 0, transform: `translate(${i % 2 ? 24 : -20}px,125px) rotate(${i % 2 ? 65 : -50}deg)` }];
      duration = 3200; delay = i * 55;
    } else if (effect === 'flour') {
      const cloud = i < 8;
      node.className += cloud ? ' flour-cloud' : ' flour-grain';
      const lane = cloud ? i / 7 : (i - 8) / 15;
      const dx = (lane - .5) * spread;
      const rise = spread * (.3 + .25 * Math.sin(lane * Math.PI));
      if (cloud) {
        const size = Math.max(24, spread * .26);
        node.style.width = `${size}px`; node.style.height = `${size * .7}px`;
      }
      frames = [
        { opacity: 0, transform: 'translate(-50%,-50%) scale(.25)' },
        { opacity: cloud ? .8 : .95, offset: .12, transform: `translate(calc(-50% + ${dx * .3}px),calc(-50% - ${rise * .35}px)) scale(.8)` },
        { opacity: cloud ? .55 : .8, offset: .45, transform: `translate(calc(-50% + ${dx * .8}px),calc(-50% - ${rise}px)) scale(${cloud ? 1.8 : 1})` },
        { opacity: 0, transform: `translate(calc(-50% + ${dx}px),calc(-50% - ${cloud ? rise * .6 : 2}px)) scale(${cloud ? 2.6 : .7})` },
      ];
      duration = cloud ? 2200 : 1650; delay = (i % 8) * 22;
    } else if (effect === 'sizzle' || effect === 'tea') {
      const smoke = effect === 'sizzle' && i % 5 === 0;
      if (smoke) node.className += ' grill-smoke';
      node.style.left = `${15 + ((i * 17) % 70)}%`;
      const dx = (i % 5 - 2) * 9;
      const rise = effect === 'tea' || smoke ? 95 : 42;
      frames = [
        { opacity: 0, transform: 'translate(-50%,-50%) scale(.35)' },
        { opacity: smoke ? .55 : .85, offset: .15 },
        { opacity: smoke ? .3 : .5, offset: .5 },
        { opacity: 0, transform: `translate(calc(-50% + ${dx}px),calc(-50% - ${rise}px)) scale(${effect === 'tea' || smoke ? 2.5 : 1.2})` },
      ];
      duration = effect === 'tea' || smoke ? 2800 : 1400; delay = i * (effect === 'tea' ? 55 : 28);
    } else if (effect === 'chime' || effect === 'purr' || effect === 'woof') {
      frames = [{ opacity: 0, transform: 'translate(-50%,-50%) scale(.5)' }, { opacity: .85, offset: .2 }, { opacity: 0, transform: 'translate(-50%,-50%) scale(1.25)' }];
      duration = 2200; delay = i * 220;
    } else {
      frames = [{ opacity: 0 }, { opacity: 1, offset: .2 }, { opacity: .8, offset: .65 }, { opacity: 0 }];
      duration = 2400;
    }
    animations.push(node.animate(reduced ? [{opacity: 0}, {opacity: .5}, {opacity: 0}] : frames, {duration: reduced ? 350 : duration, delay: reduced ? 0 : delay, fill:'both', easing:'ease-out'}));
  }
  const stopSound = effect === 'detail' || effect === 'light' ? () => {} : playRoomSound(effect);
  let done = false;
  const clearVisuals = () => { if (done) return; done = true; animations.forEach(a => a.cancel()); nodes.forEach(n => n.remove()); trigger?.classList.remove('room-responding'); };
  // Reduced motion shortens the visual only, not the audible response.
  Promise.all(animations.map(a => a.finished)).then(clearVisuals, () => {});
  return () => { clearVisuals(); stopSound(); };
}
