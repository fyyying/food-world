/** Ambient and tap speech for every Britain stand, keyed by object id. Owned by the Researcher.
 *
 *  Where this belongs. The module contract in docs/london-world.md lists `LD_LINES` among
 *  `props-london.ts`'s exports, and that file is the Stand maker's. The Researcher may not edit it, so
 *  the lines are delivered here and `props-london.ts` should import or re-export them from this file
 *  rather than declare a second copy, exactly as `props-spain.ts` reads its own `ES_LINES`. The alias
 *  `LD_LINES` at the foot of this file exists so that import costs the Stand maker nothing.
 *
 *  Shape and rules. One bubble per line. Where the line is not in English the local language comes
 *  first, then the English, separated by " · ", which is the form `props.ts` already uses for a
 *  two-script bubble. Four to six lines per stand, so a stand does not repeat itself inside one visit,
 *  and nothing long enough to wrap more than twice at 390 px. The lines go to `ambientChat` and to the
 *  deferred tap bubble, whose quiet intervals, single speaker, tap priority and clean-up are what
 *  scripts/tests/village-speech.mjs asserts; nothing in the text itself is tested, so the discipline
 *  here is editorial: **no line states a date, a price or a historical claim.** Every record lives on
 *  the card, where it can carry its source.
 *
 *  Register. This is working speech of about 1880 to 1914 and it is written as people were actually
 *  recorded calling to each other at work - a street cry, an instruction, a complaint, a warning. It is
 *  deliberately **not** stage cockney: no dropped aitches spelt out, no rhyming slang, no "guv'nor",
 *  no "cor blimey". Where a line is regional it is regional in word choice and grammar rather than in
 *  comic spelling, which is the same rule the Spain and Thailand files follow.
 *
 *  Orthography, and what a native reader must check. The thirteen room objects' English and West Riding
 *  lines are verbatim or near-verbatim from docs/london-research.md section 2.5. Beyond those, this pass
 *  wrote the lines for the ten stops and the six landmarks in the same register, and the non-English
 *  fragments are the weak point of the file: the Bengali in `lascarUk`, the Welsh in `cocklesUk` and
 *  `leeksUk`, the Scots in `smokehouseUk`, `herringUk`, `oatsUk`, `forthBridge` and `distilleryUk`, the
 *  Gaelic toast in `distilleryUk` and the Cornish in `pastyUk`. **A native or fluent reader should check
 *  every one of them before this ships.** Cornish is used sparingly and on purpose: the research supplies
 *  one attested phrase, and the rest of the Cornish cluster speaks Cornish-inflected English rather than
 *  invented Cornish, because a wrong sentence in a revived language is worse than none. */
export const UK_LINES: Record<string, string[]> = {
  // --- the thirteen room objects: from research section 2.5 ---
  roastPub: [
    "Two of bitter, and is that beef ready?",
    "Mind the tray, it's hot all round.",
    "Cut me the outside slice, love, I like it brown.",
    "Batter pudding first in this house, gravy on it.",
    "She's taken hers down the baker's, it'll be back at one.",
    "Shut that door, you're letting the fire out.",
  ],
  teaRoomUk: [
    "A pot for one and bread and butter, please.",
    "That table by the window's free, miss.",
    "Hot water when you're ready - it's stewing.",
    "Two scones, and mind you warm the pot first.",
    "She comes in on her own every Thursday, and quite right too.",
  ],
  boroughUk: [
    "Fine cheese, cut you a wedge, taste it first!",
    "Barrow coming through - mind your backs!",
    "Sixpence the lot and I'll not do better.",
    "Fresh in off the night train, that is.",
    "Weigh it honest, George, she's watching you.",
  ],
  pieMashUk: [
    "Two and two, and plenty of liquor.",
    "Eels are good today - jellied or stewed?",
    "Mash goes round the edge, not on top.",
    "Vinegar's on the table, help yourself.",
    "Marble stays cold, that's the whole idea.",
  ],
  chippyUk: [
    "Fish and a penn'orth, salt and vinegar?",
    "Give us two minutes, there's a fresh lot going in.",
    "Scraps in t'bag an' all, go on.",
    "Newspaper's warm enough to hold, mind.",
    "Dripping, not oil - that's why it tastes of summat.",
  ],
  breakfastUk: [
    "Mug o' tea, two slices, and be quick.",
    "Market's open in ten minutes, gentlemen.",
    "Bacon's on, bread's in the fat.",
    "Stand under the flare, you'll get warm.",
    "I've been here since three and I'll be gone by nine.",
  ],
  lascarUk: [
    "ভাত হয়ে গেছে · The rice is done.",
    "আর একটু মশলা দাও · A little more spice.",
    "Ship sails Thursday - eat while you can.",
    "বাড়ির মতো লাগে · It tastes like home.",
    "Sit, sit. There is enough for another man.",
    "Who is cooking tomorrow? Not me again.",
  ],
  hopKitchenUk: [
    "Bin's near full - call the measurer!",
    "Stew's on, and it'll be on till dark.",
    "Hands like tar by Friday, every year.",
    "Six weeks of this and we go home brown.",
    "Keep the little ones off the fire, Ada.",
  ],
  dairyUk: [
    "Curd's ready - it breaks clean.",
    "Turn her down another half, she's still running.",
    "Cloth on before the press, not after.",
    "Whey for the pigs, and a bowl for us.",
    "Six weeks in t'loft and she'll be right.",
  ],
  pastyUk: [
    "Crimp un proper or he'll leak.",
    "Meat this end, apple t'other - that's his dinner and his pudding.",
    "Oven's hot enough to take the hair off your arm.",
    "Put his letters on the corner so he knows which is his.",
    "Yeghes da! · Good health!",
  ],
  cocklesUk: [
    "Mae'r llanw'n troi · The tide's turning.",
    "Rhidyll gynta', wedyn sach · Riddle first, then the sack.",
    "Eight mile to the market, and eight mile back.",
    "Bara lawr a chocos · Laverbread and cockles.",
    "Load her even or the donkey'll go lame.",
  ],
  smokehouseUk: [
    "Tie them in pairs, tails thegither.",
    "Fire's ower fierce - damp it doun.",
    "Hessian on, and we'll gie them the hour.",
    "Hot smoke, no cold - that's the difference.",
    "Eat it wi' your fingers while it's warm.",
  ],
  distilleryUk: [
    "Turn the piece - it's heating in the corner.",
    "Slàinte mhath! · Good health!",
    "Peat's in; she'll take the reek noo.",
    "Watch the middle cut, that's all that matters.",
    "The angels get their share whatever we do.",
  ],

  // --- the ten ingredient and flavour stops: written in this pass, same register ---
  pastryCe: [
    "Keep the butter cold or it'll run out on you.",
    "Six turns, and rest her between every one.",
    "Suet for the boiled, lard for the raised.",
    "Raise it round the dolly while it's warm enough to bend.",
  ],
  oystersUk: [
    "Natives off the smack this morning!",
    "Open them over the barrel, not over your boot.",
    "A dozen and a slice of bread, that's a dinner.",
    "The beds are thinner every season, and that's the truth.",
  ],
  hopsUk: [
    "Bine goes round the string that way, never the other.",
    "Cowl's turned - wind's come round.",
    "Get them in the oast tonight or they're spoilt.",
    "Fuggle this row, Golding the next.",
  ],
  mushroomsCe: [
    "Pick them at first light or the dogs have them.",
    "That one's a cep, and that one you leave alone.",
    "They're up in the beech, after the rain.",
    "Chop it fine and cook it dry - it keeps a few days then.",
  ],
  sheepUk: [
    "She'll not leave her heft, that one, not in a gale.",
    "Wool's fit for carpet and nowt else.",
    "Count them off t'top before the weather turns.",
    "Gate's open at the wall end - fetch her round.",
  ],
  rhubarbUk: [
    "Candle only in there, nowt brighter.",
    "Listen - you can hear the buds crack.",
    "Pull, don't cut. It comes away at the crown.",
    "It's on the night train, so it's off by nine.",
  ],
  orchardUk: [
    "Shake the tree, don't climb it.",
    "Bittersweet in this heap, sharps in that.",
    "Keep the horse walking, he knows the round.",
    "Nobody'd eat one of these, and that's the point.",
  ],
  leeksUk: [
    "Cennin o'r ardd · Leeks from the garden.",
    "Cawl eto heno · Cawl again tonight.",
    "Earth them up again or they'll green all through.",
    "Broth first, then the meat - that's how it's eaten.",
  ],
  oatsUk: [
    "Stir it the one way and salt it, never sugar.",
    "Brose if you're in a hurry, porridge if you're no.",
    "Girdle's ower hot - she'll catch.",
    "Three grades off the stone: pinhead, medium, fine.",
  ],
  herringUk: [
    "Farlane's full - get your knives.",
    "Backs up in the barrel, and salt between.",
    "Bind your fingers first or you'll no last the day.",
    "The boats are in and the train goes at six.",
  ],

  // --- the six landmarks: short bystander lines ---
  bigBen: [
    "Dials are lit - they're sitting late again.",
    "Half past, and nothing decided.",
    "You can set the whole street by that bell.",
    "They'll all be out wanting supper at midnight.",
  ],
  towerBridge: [
    "She's going up - stand back from the gate.",
    "Coaster for the Pool, see her funnel down.",
    "Granite on the outside, steel all the way through.",
    "Two minutes and you can cross again.",
  ],
  redBus: [
    "General, sixpence to the bridge!",
    "Room for two on top, if you don't mind the weather.",
    "Cab, sir? Quicker than waiting on that thing.",
    "Mind the horse, he doesn't care for the engine.",
  ],
  phoneBox: [
    "Last collection's at eight, you've time.",
    "Post it now and she'll have it by tea.",
    "Lamps first, then home - forty-one of them tonight.",
    "They've started painting them red, I see.",
  ],
  forthBridge: [
    "They're on the north cantilever the day.",
    "Start at one end, finish, start again - that's the job.",
    "Fish train's due, you'll feel her come over.",
    "Aa steel, that. No a bit of iron in her.",
  ],
  engineHouseUk: [
    "Beam's rocking steady - she's keeping her down.",
    "Stop that engine an hour and the level's back.",
    "Coal for the boiler's come up the lane.",
    "Dinner's in my pocket and the shift's not done.",
  ],
};

/** The name the Stand maker's module contract uses for the same table. Import one or the other; there
 *  must never be a second copy of these lines in `props-london.ts`. */
export const LD_LINES = UK_LINES;
