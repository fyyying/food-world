/** Story depth, room discoveries and sources for the Italy world (`rome`, `venice`, `sicily`).
 *  Owned by the Researcher.
 *
 *  Every date describes a record, not an invented birthday. Legends are written as legends, and anything
 *  that rests on repetition rather than on a document is written "reported", "by tradition" or
 *  "unverified", exactly as section 5 of docs/italy-research.md requires. The eleven unverified facts
 *  listed there are either kept out or carry the hedge in the sentence itself.
 *
 *  The period band is about 1880 to 1914, the decades after unification. Carbonara (1952), tiramisù
 *  (1972), insalata caprese (the nineteen-twenties), the Aperol spritz (Aperol 1919, the word attested
 *  1972), the Vespa (1946) and the counter of twenty cicchetti (after 2010) are all younger than the band
 *  and appear only as dated later developments. `bacaro` is the one grade of Venetian wine house that the
 *  dictionaries support — an osteria — and not a modern cicchetti bar.
 *
 *  Owner ruling, 2026-09-22: the pasticceria's text does not name martorana, because the fruit beside the
 *  pastry tube in `it_card_pasticceria` is a real fig and not one of the painted marzipan fruits the image
 *  brief asked for. Nothing in `pastry`'s blurb, story depth, discoveries or repertoire names it (the
 *  repertoire's marzipan-fruit line came off on 2026-09-23, the second reviewer's item 49). */

/** Three paragraphs of dated history for every object that opens a painted room. Appended to its blurb
 *  in italy-objects.ts, so the card reads as one piece and lands inside the 2,500–3,200 character band. */
export const ITALY_STORY_DEPTH: Record<string, string> = {
  ragu: `The book that first gathered the country's cooking between two covers is contemporary with this room. Pellegrino Artusi, a retired silk and wool merchant living in Florence, could find no publisher for La scienza in cucina e l'arte di mangiar bene and paid for it himself in 1891; it sold about a thousand copies in four years, more than two hundred thousand by his death on 30 March 1911, and ran to 790 recipes in the last edition he saw. Recipe 222 is saltimbocca alla romana, and Artusi says he ate it at a trattoria in Via di Campo Marzio — a Roman dish with a date, a street and a witness.

The dishes this room is now famous for have no such paper. Coda alla vaccinara reaches a cookbook only with Ada Boni's La cucina romana of 1929, in two versions, the broth as a first course and the meat as a second; the Testaccio trattoria Checchino's claim of descent from 1887 is a house claim rather than an independent record. The earliest dated source for cacio e pepe is Boni again, in 1930. Amatriciana is older in print — a sauce "alla matriciana" appears in Francesco Leonardi's L'Apicio moderno of 1790 — but Amatrice was in Abruzzo, province of L'Aquila, until 1927, when it passed to Lazio.

What is dated here is the economy rather than the recipe, and the measure on the marble. Sixtus V regulated Rome's glass wine measures in 1588 against short pouring, and the foglietta is a half litre, not a quarter, with the correct level marked by a notch called the capello. By the end of the 1800s the city is reported to have had nearly six hundred osterie, most of them in Trastevere; that figure comes from a popular history and is attributed here rather than stated.`,

  romeMarket: `The square has two dates and they are a century and a half apart. The food market moved here in 1869 from Piazza Navona, where it had stood since 1478; and on 9 June 1889 Ettore Ferrari's monument to Giordano Bruno was unveiled in the centre of the piazza, on the spot where Bruno had been burned on 17 February 1600. The bronze figure with its hood and its book is the single strongest period marker any picture of this square can carry, and it is younger than the stalls around it.

The artichoke on the trestle is older than both. Cultivation in central Italy is attested from the fifteenth century, arriving from Naples by way of Tuscany; the Etruscan claim, drawn from tomb painting, is a legend. The Roman head is the cimarolo or mammola, the central shoot, spineless and at least ten centimetres across, from the Castellammare and Campagnano cultivars — the IGP that now names it dates only from 2002, so the mark is modern and the vegetable is not.

The other artichoke kitchen was being demolished as this market traded. Carciofi alla giudia is traditionally traced to the Roman ghetto, instituted by Paul IV in 1555; a sixteenth-century manuscript annotation of the recipe is reported to be in the historian Ariel Toaff's possession, and since neither the manuscript nor a catalogue entry could be seen, it is written as reported and not as a record. The ghetto walls came down in 1888 and the quarter was almost entirely demolished; the Great Synagogue that replaced its skyline was begun in 1901 and inaugurated on 28 July 1904.`,

  pasta: `Two trades stand in this room and only one of them is Roman. Through the nineteenth century Roman "maccheroni" came off a rolled sheet and resembled tagliatelle or fettuccine, and until the middle of the century the word meant practically any shape of pasta at all. The dried, extruded kind was Campania's industry: in the first half of the century it was concentrated at Naples, Portici, Torre del Greco, Torre Annunziata and Gragnano, where the climate suited natural drying.

Gragnano was laid out for it. Via Roma and the other main streets were made wide and turned to catch the sea breeze so that pasta could be dried outdoors in them, and Umberto I had a railway built to connect the town to Naples and its port, so industrial distribution existed inside this band. Street drying was still the method; the Cirillo static system, which cut drying from ten days in summer and thirty in winter to four days year round, was invented at Torre Annunziata in 1919, after the band closes.

What could not be established is the link between the two ends. Whether Gragnano or Neapolitan dried pasta actually reached Roman shops in these decades, in what volume, and whether Roman pastifici existed at any scale, is unverified and is not asserted anywhere on this card. What is documented is that the trade existed, that it was rail-connected to Naples, and that the soft-wheat sheet on this board and the durum semolina in that sack are two different raw materials for two different trades.`,

  oven: `The flat sheet in the mouth of this oven is the older Roman thing and the round one is not Roman at all. Pizza bianca and pizza rossa are both mentioned by Italian and French observers through the nineteenth century, and a reference of 1666 gives a pizza bianca mastunicola — a dough base with lard, cheese and basil. Those citations rest on food-media sources rather than on an archive, and they are written here with that caution. Roman forni doubled as ovens for the quarter and for trattoria kitchens with no oven of their own; the Antico Forno Roscioli's premises are dated, in a secondary source, to 1824.

The Neapolitan pizza that a visitor expects has a famous origin story and it does not hold. The 1889 letter thanking Raffaele Esposito, the only evidence that a Margherita was made for the queen, was compared by the historian Zachary Nowak with notes signed in 1891 by Camillo Galli, head of the royal household: the signatures do not match, the seals and stationery are wrong for the date, and the letter addresses a man whose name it gets wrong. Nowak reads it as a document written in the 1930s. Pizza with tomato and mozzarella was in any case well established in Naples before 1889.

Once a year this oven does something else. Porchetta is described in gastronomic treatises back to Maestro Martino's De arte coquinaria in the fifteenth century; the Ariccia production standard and its IGP date only from 2011 and the sagra from 1950, and the Etruscan and Latin-priest origins are legend. The nearest contemporary witness is Johann Gottfried Seume, who complained at Ariccia in 1802 that Prince Chigi had felled the old oaks the free-ranging pigs fed on.`,

  cheese: `The cheese this farmstead is the archetype of had already moved somewhere else. Pecorino Romano's origin is placed in the high Agro Romano, but by the end of the 1800s Sardinia had displaced the Rome area as the main production centre, the technique carried there for the Sardinian breed's milk and the small dairies run by entrepreneurs from Lazio, Tuscany and Naples and sited for shepherd access. The name stayed in Rome and the work left. No export date, tonnage or American port belongs on this card: the Consorzio was founded only in November 1979 and the United States trademark granted in June 1997, and nothing inside the band could be verified.

The oil in the jar has a modern mark over an ancient cultivation. Sabina oil received DOP recognition by EC Regulation 1263/96 on 1 July 1996, cited as the first Italian olive-oil denomination, over thirty-two comuni in the province of Rieti and fifteen in the province of Rome. The trees themselves are named by Strabo, Cato and Horace, which is a literary record and not an agricultural one. The transhumance between Abruzzo and this plain is asserted everywhere in food writing and could not be sourced to a museum or an archive; it is written here as a well-known tradition.

The third thing this yard lives with is illness. At the end of the nineteenth century up to twenty thousand Italians a year died of malaria, much of it on plains like this one. The law of 1900 created a state quinine monopoly, measures in 1901 and 1904 regulated free distribution to workers and settlers in endemic areas, and Giovanni Battista Grassi and the Roman school did their work at Fiumicino, near the Tiber's mouth and within sight of this pasture.`,

  seafood: `This market has the oldest firm date of any food institution on the table. Venice's market was moved to the Rialto in 1097, and the district has been the city's commercial centre since; the trades were zoned and the street names still carry them — Erbaria for greens, Naranzeria for citrus, Beccaria for meat, Casaria for cheese, Pescaria for fish, with the Riva del Vin, del Ferro and del Carbon for wine, iron and coal.

The roof over the slabs is the point of this room, and it is a roof with two dates. From 1884 until the 1900s the fish market stood under a plain iron canopy built by the municipal engineer Annibale Forcellini. The neo-Gothic stone loggia that replaced it was conceived by the painter Cesare Laurenti, who brought in the architect Domenico Rupolo for the working drawings in 1896; the city council approved it on 3 December 1900 and it opened in 1907 or 1908, sources differing. Its designers specified marble slabs with seawater jets, freshwater fountains, grates over the drainage channels and tanks to hold fish alive, and carved its capitals with fish, spider crabs, seaweed and fishermen's heads. The canopy covers twenty-four of this band's thirty-four years, so the canopy is what stands here.

What came in under it was half lagoon and half sea. Lagoon fish arrived from Burano and Murano and sea fish from Chioggia and Pellestrina, with six-oared carline rowing prized fish down from Caorle in about eight hours; David Levi Morenos's study of 1920 records that before the First World War the lagoon-and-valli catch was roughly equal in quantity to the sea catch. Wholesale and retail were not separated here in this period — the two zones were created only in the 1950s.`,

  bacaro: `The word on the modern sign is not in the period's dictionaries. There is no headword bacaro meaning a wine shop in Giuseppe Boerio's Dizionario del dialetto veneziano of 1867 or in the first edition of Panzini's Dizionario moderno of 1905; Boerio has only the root, bàcara, a noisy company of people. A later Panzini edition does carry it, and that contemporary calls it "a recent word of the Venetian dialect" for the wine of Puglia and the shop that sold it retail. Cicheto is not in Boerio at all, and in 1905 cicchetto is a Lombard word for a small glass of cheap spirits, grappa or mistrà. The counter lined with twenty small plates is documented as a phenomenon of the last twenty years; the food historian Danilo Gasparini dates the first cicchetti tours to about 2008 and the boom to after 2010.

What is documented is the grading of the premises. Venetian wine selling ran in ranks: osterie where one ate and drank; caneve and magazeni where wine was sold retail and one might drink but not eat; malvasie for Greek-island and sweet wines; bastioni, magazeni that also lent against pawned goods; and samarchi, subordinate outlets marked with the winged lion. The underlying authority is Elio Zorzi's Osterie veneziane of 1928, which could not be read directly. This room is the first of those grades, which is why it has six dishes and a hearth.

The measure is better attested than the name. Boerio's 1867 entry for ombra gives shadow and figurative suspicion and no wine sense at all, so the campanile-shadow story is folk etymology. Hans Barth, writing in 1910, puts the half-glass at Beniamino Negrin's osteria in Corte Lucatello at San Zulian: served standing at the counter for ten centesimi against the usual carafe at a table. Barth and Zorzi both credit a Professor Marsich with fixing the measure at half a quarter-litre, about 125 millilitres, and name Torbolino, Valpolicella and Recioto as the wines.`,

  lagunaIt: `The crab in the pan is only itself for a few days a year. The moeca is the green crab Carcinus aestuarii, taken in the moult in April and May and again in October and November, cooked alive, floured and fried whole. Slow Food describes the production as halfway between fishing and extensive farming and unique in Italy, practised at Chioggia and in Venice — on Burano, Mazzorbo and the Giudecca. The moecante's skill is sorting: gransi boni are crabs judged fit to moult, spiantani are within days of it, and everything else goes back in the water.

The cage at the step is the tool that makes the trade possible. At Burano the vieri are cube crates of wooden boards, about a metre long and sixty centimetres high, hung from frames of poles driven into the lagoon bed, so the crabs are held alive in their own water until the morning they shed. The hard-shelled females taken full of roe in late summer are a different product with a different name, the masanete, and they are not these.

The purple artichoke in the bowl has a fortnight and a sentence of its own. A castraura is the first apical shoot of the plant, cut off so that the plant throws out more and stronger shoots, eighteen to twenty of them, and it is on sale for ten to fifteen days only, from late April to mid-June. Sant'Erasmo has been described as a single huge garden since the 1500s, its growers correcting the soil with shells and crab shells and banking earth against the wind, and the crop went to the Rialto by boat. The small fish beside it is the gò, the grass goby Zosterisessor ophiocephalus, a cheap protein that was sometimes bartered rather than sold; that its risotto was invented by Burano fishermen in the sixteenth century is tradition, and appears only in recipe and travel writing.`,

  casaVeneta: `The grain in this copper arrived three centuries before this kitchen and then took it over. A 1549 estate map near Vigonza, in the flat country around Padua, shows a field planted with maize, perhaps the earliest Italian representation of one; cultivation was occasional at first, for marginal land and famine years, and became a peasant staple on Po valley estates in the eighteenth century. The arithmetic was simple and ruinous: maize yielded about six times what wheat yielded and wheat sold for about double, so wheat went to market and the household ate maize. Maize took the name formentón from buckwheat, and polenta went from grey to yellow.

Then the arithmetic became a disease. Historians of the period write that maize polenta "became virtually the only food consumed during winter and spring by large sectors of the agricultural population"; national maize consumption ran at 35 kilos a head a year across two million hectares. Pellagra is severe deficiency of niacin and of tryptophan, and the ash-soaking that makes maize's niacin available never crossed the Atlantic with the plant. Recorded Italian cases peaked at 104,067 in 1881, 366 for every hundred thousand people; of 97,855 cases in 1879, 29,836 were in the Veneto, and of 41,768 in 1909, 22,525 were. None of the modern knowledge existed inside this band: Cesare Lombroso was still pushing a mould-toxin theory in 1892, niacin was identified only in 1937.

The state answered late and the people answered by leaving. The law is Legge 21 luglio 1902 n. 427, with a regulation of 5 November 1903: it banned the sale of unripe or spoiled maize, ordered public drying ovens, allowed free salt to pellagrins and put 100,000 lire a year behind it. By the end of the century a third of Italy's emigrants came from the Veneto and nearly two million people had left in twenty-five years, with the same authors recording a close correlation between pellagra and emigration.`,

  friggitoria: `Three of this pan's four products carry an origin story that the reference literature does not support. The Italian entry for panelle traces chickpea-flour paste to Roman and Greek cooking and suggests that frying it probably began under Angevin rule, making no Arab attribution at all; the Arab-origin version, with chickpeas milled during the emirate of 827 to 1091, appears only in food media and recipe writing and is treated here as legend. The claim that pani câ meusa was created by Jewish butchers paid in offal rests, in the English reference article, on a single popular travel book of 2009, and that article carries a single-source warning; it is traditional and not documented.

What is documented is the mechanics, and they are the room. The reference literature is sure about the words and the method and silent about the origin: the roll is a vastedda, it is married when cheese goes on it and single when it does not, the man selling it is the meusaro, and the chickpea paste is set hard on stone before it is ever fried. Against all that, no period description of a Palermo friggitoria around 1900 could be found at all, so this room is reconstructed from a trade still performed rather than from a witness who watched it then.

The rice ball beside them has the one dateable Sicilian record in this cluster, and it is a surprise. Giuseppe Biundi's Sicilian–Italian dictionary defines arancinu as a sweet dish of rice made in the shape of an orange; Mortillaro in 1838 records only the colour sense, and Antonino Traina's Nuovo vocabolario siciliano-italiano of 1868 is the attestation that links the word to a savoury croquette. Biundi's year is given as 1851 in the Italian reference entry and as 1857 in several food-press sources, so the safe form is a Sicilian dictionary of the 1850s. Sfincione's attribution to the nuns of San Vito is traditional rather than archival.`,

  sicilyMarket: `This market has no foundation date, and that absence is the honest record. Ballarò is described in the Italian reference literature as the oldest of Palermo's markets, running from Piazza Casa Professa to the bastions along Corso Tukory in the Albergheria quarter, selling fruit, vegetables, spices, meat and fish brought in from the countryside, with cooked street food alongside the raw produce. But no archival or scholarly foundation date exists for any of the three Palermo markets, and the thousand-year-old Arab market line traces back to tourism copy. Even the name is unsettled: Bahlara, a village near Monreale, an Indian king called Vallaraya, an Arabic phrase and fifteenth-century men named Ballarò are all proposed, and the "place of the fair" gloss is one hypothesis among several.

What the market does have is a documented voice. The abbanniata is the vendors' sung, sing-song sales cry, from the verb abbanniare, cognate with bando, a public proclamation; it is the sound this room would be recorded by if the world had sound, and it is a trade skill rather than local colour.

The fish on the block is older in the record than anything else in Palermo. Harpoon fishing for swordfish in the Strait of Messina is described by Polybius in the second century BC, with a lookout on the Scilla cliffs signalling to small two-man boats carrying an oarsman and a harpooner on the bow; the season runs roughly from April or May to August or September. The tall-masted feluca with its long bow gangway is a twentieth-century development and is not on this water yet. The board of dark paste beside the fish is estratto, tomato dried on boards in the sun for days, which is how the island concentrated tomato before Francesco Cirio's Naples cannery of 1875 gave it another way.`,

  pastry: `Cold is the expensive thing in this shop, and it comes down off a mountain. The neviere, snow pits, were concentrated on Etna and in the Madonie: pits three to six metres deep, natural or dug, walled in brick or dry stone with a small stair, packed with snow in alternating layers with straw to slow the melt. The nivaroli worked winter camps on the slopes, divided by task, and at the end of spring the blocks went down by mule to supply the lowland towns of the Trapani, Agrigento and Caltanissetta provinces. The trade died out in the early 1900s with industrial ice and refrigeration, so it is alive inside this band and dying at the end of it.

The ices themselves have a lineage rather than a document. Granita is conventionally derived from the Arab sharbat, fruit and flower syrups chilled with stored mountain snow; the account is plausible and widely accepted, but no primary Sicilian recipe survives from the emirate, so it is a traditional account and not a documented chain. The sweet roll that now comes with a granita is described as a comparatively modern companion — earlier pairings were with plain bread — and since its spread could not be dated, that breakfast is not in this picture at all.

The two great convent sweets are legends with a clear label. Cassata's derivation from the Arabic quas'at, by way of a shepherd mixing sheep's ricotta and sugar, is explicitly transmitted as legend, and the convent connection is traditional. The cannolo's origin at Caltanissetta, among the concubines of an emir's Qal'at al-Nissa, is explicitly a legend, and the premise is undercut by the surviving remains of the castle, which suggest a military fortress. What is documented is the ricotta, the almond and the calendar of feast days these shops sold against.`,

  tonnaraIt: `This is an industrial plant, and its dates are business dates. The Florio family leased the Favignana tonnara from the Genoese Pallavicini in 1841, and in 1874 Ignazio Florio purchased the islands of Favignana and Formica outright with their fishing rights, for a reported 2,750,000 lire. Florio then commissioned Giuseppe Damiani Almeyda, the architect of Palermo's Politeama, to rebuild the works as a plant for boiling and canning tuna in oil — among the largest industrial buildings in Europe at the time. A commercial source gives employment as over eight hundred, with a crèche for the workers' children; that figure is approximate and is attributed rather than stated. One conflict is worth flagging: the English reference article says instead that the tonnara was established in 1859 and worked until 1977, and the lease-and-purchase sequence is the better attested of the two.

The innovation that makes this room worth a card is the pairing of two ordinary operations. Boiling the loins first and only then packing them and covering them with olive oil is credited to this plant as an industrial first, and it is what turned a seasonal slaughter into a product that could be sold in a shop a year later and a thousand miles away.

Nothing of the fish is thrown away, and the driest part of it is the oldest. Bottarga, the cured and pressed roe of the bluefin, is produced at Favignana as well as at San Vito Lo Capo, Lampedusa, Marzamemi and Portopalo; the practice is old and the documentation is modern — the Favignana product has been a Slow Food presidium since 2007 — and no nineteenth-century production figures could be found, so none is given.`,
};

/** Three discoveries for every painted room, keyed by its `it_` scene id. The subjects are the three the
 *  image brief named and the Stage B picture acceptance confirmed in the delivered files; the Room maker
 *  measures their coordinates on the paintings and uses these labels and texts.
 *
 *  Two Stage B caveats the Room maker inherits with these subjects:
 *  - `it_laguna` (owner ruling, 2026-09-22): the floating cage spans x .049 to .200 in the accepted
 *    portrait, so the cage's marker sits on the cage's **right portion**, inside the phone band, where the
 *    crabs read; the empty hook is at x ≈ .60 and is re-measured at Stage C.
 *  - `it_pescaria`: the big crab on the near slab reads closer to a king crab than to a granseola, so the
 *    crab discovery is written about the live green crabs in the box and never about the spider crab.
 *  - `it_ballaro`: the cut steak rests on the fish rather than opening a gap in it, so the text speaks of
 *    the cut face and the pale wheel and does not claim a steak has been taken out. */
export const ITALY_DISCOVERIES: Record<string, [string, string][]> = {
  it_trattoria: [
    ["Lift the pot lid", "The fifth quarter is what was left after the four saleable quarters went to paying customers: offal, innards, trotters, tail and head. That the vaccinari, the hide-strippers, were paid in it rather than in cash is well-attested tradition rather than a wage record."],
    ["Taste the pasta", "No cream, no butter, no stock. The sauce is pecorino loosened with the water the pasta cooked in, and it is worked off the heat so the cheese does not seize."],
    ["Cut the pecorino", "By the end of the 1800s most “Roman” pecorino was already being made in Sardinia, with the technique carried there from Lazio for the Sardinian breed's milk. The name stayed in Rome and the work left."],
  ],
  it_market: [
    ["Turn the artichoke", "The flat spineless Roman head is the cimarolo, the first shoot of the plant, cut so that the others grow. Cultivation in central Italy is attested from the fifteenth century; the Etruscan claim is a legend from tomb painting."],
    ["Look in the ricotta basket", "Ricotta is made by putting the whey back on the fire until it flowers, which is why it is a by-product of cheese rather than a cheese, and why it is sold on the morning it is made."],
    ["Read the balance", "Prices were weighed on a hand scale and argued over as a matter of form. The statue behind the stalls is Giordano Bruno, unveiled on 9 June 1889, twenty years after the market moved into this piazza."],
  ],
  it_pasta: [
    ["Fold the sheet", "Home pasta is soft wheat and egg; dried pasta is durum semolina and water. They are two different trades in the same street, and only one of them belongs to this board."],
    ["Lift the ribbons", "Fettuccine are cut from a sheet rolled with a pin a metre long until light shows through it. Through the nineteenth century Roman “maccheroni” meant exactly this, a ribbon off a sheet."],
    ["Press the guitar frame", "The square-cut Roman string is made by pressing a sheet through strung wires rather than by a machine. The static drying system that industrialised the other trade was invented at Torre Annunziata in 1919."],
  ],
  it_forno: [
    ["Take the peel", "The long oiled sheet began as the baker's way of testing the oven's heat before the bread went in. The round pizza with tomato and mozzarella is Naples', and Naples is a long way from this counter."],
    ["Look into the oven mouth", "A wood oven is fired and then raked out, and everything after that is baked on falling heat: pizza first while it roars, then bread, then what needs an hour."],
    ["Cut the loaf", "Bread was baked once a week. That is why so many Roman dishes begin with bread that is no longer fresh, and why the oven also bakes the quarter's own dough on the days it is not baking its master's."],
  ],
  it_casale: [
    ["Cut the curd", "The curd is cut to let the whey out, and the finer it is cut the drier and longer-keeping the cheese. Nothing in this room is hot: the work here is pressure, salt and time."],
    ["Follow the whey", "The whey is not waste. It goes back on the fire in the other room and becomes ricotta, which is why a dairy sells two things and throws away neither."],
    ["Lift the wheel", "Dry-salting by hand over months is what lets a pecorino keep for a year without cold. Sabina oil in the jar beside it goes on food raw, always, and received its DOP only in 1996."],
  ],
  it_pescaria: [
    ["Spread the sardines", "A marble plaque at this market gives minimum selling lengths — seven centimetres for a sardine, twenty-five for an eel. Its wording is modern Italian in metric centimetres, so its date is unverified whatever the traditional attribution."],
    ["Look in the crab box", "The green crabs are only worth taking in the two short seasons when they shed their shells, in April and May and again in October and November. The rest of the year they are put back."],
    ["Lift the cuttlefish", "The ink sac is the sauce, and it is why the dish is served over white polenta rather than yellow. The iron canopy overhead was built in 1884; the stone loggia that replaced it was approved in 1900 and opened in 1907 or 1908."],
  ],
  it_bacaro: [
    ["Take the salt cod", "Venice's “baccalà” is dried stockfish, not salted cod: Boerio's dictionary of 1867 defines it as fish dried in the wind and only sometimes salted, and the standard Italian line runs the other way."],
    ["Lift the onions", "The vinegar, onions, raisins and pine nuts were a way of keeping fish aboard a boat rather than a way of making it sweet. The oldest version of the structure, in a manuscript printed in 1899, uses almonds and honey."],
    ["Fill the glass", "The measure is half a quarter-litre, about 125 millilitres, drunk standing at the counter for ten centesimi — described by Hans Barth in 1910 and by Elio Zorzi in 1928, who both credit a Professor Marsich with fixing it."],
  ],
  it_laguna: [
    ["Lift the floating cage", "The crabs are held alive in vieri, board crates hung from poles driven into the lagoon bed, until the day they moult. Gransi boni are fit to moult; spiantani are within days of it."],
    ["Take the crab out of the egg", "The whole animal is eaten, shell and all, because at this stage there is no shell to speak of. It is left in beaten egg, floured and fried alive."],
    ["Halve the purple artichoke", "The castraura is the first shoot cut from each plant on Sant'Erasmo so that eighteen or twenty more come up behind it. It is on sale for ten to fifteen days a year and no longer."],
  ],
  it_veneto: [
    ["Turn the polenta", "Maize came from the Americas but the ash-soaking that makes its niacin available did not come with it. Recorded pellagra cases peaked at 104,067 in 1881, and the Veneto carried more of them than any other region."],
    ["Draw the thread", "Polenta is turned out onto a board and cut with a wire or a thread, never with a knife. The board, the thread and the copper are most of what this kitchen owns."],
    ["Split the red chicory", "It is grown green and then blanched in spring water through the winter until the leaf goes red and the rib white — a field crop turned into a winter vegetable by water rather than by heat."],
  ],
  it_friggitoria: [
    ["Cut the chickpea paste", "The paste is cooked, spread thin on marble to set, cut into squares and only then fried. The Arab origin usually given for it is not documented; the reference literature suggests Angevin frying instead."],
    ["Lift the tongs", "Spleen and lung are boiled and then fried in lard. The roll is called married when cheese goes on it and single when it does not, and the man who sells it is the meusaro."],
    ["Pack the sesame roll", "The whole trade is built on eating standing up, because there is nowhere to sit. No period description of a Palermo friggitoria around 1900 could be found, so this room is built from the mechanics and not from a witness."],
  ],
  it_ballaro: [
    ["Throw the water", "The slab is kept wet through the morning so the fish does not dry and dust does not settle. Swordfish is harpooned from small boats in the Strait, a way of fishing Polybius described in the second century BC."],
    ["Take the fennel", "Wild fennel is gathered off the hillsides rather than grown, and it is the one ingredient the island's most famous sardine pasta cannot do without."],
    ["Press the tomato paste", "Tomato was dried to a dark estratto on boards in the sun for days before there was a cannery to take it. Francesco Cirio opened his first tomato cannery at Naples in 1875."],
  ],
  it_pasticceria: [
    ["Fill the shell", "A cannolo is filled to order, because a filled shell goes soft by evening. Its origin at Caltanissetta, in an emir's harem, is explicitly a legend, and the castle's remains suggest a fortress."],
    ["Cut the layered cake", "The ricotta-and-sponge cake came out of convent kitchens and belongs to Carnival and Easter rather than to an ordinary week. Its Arabic derivation is transmitted as legend."],
    ["Turn the ice tub", "The ice came down from the mountain, cut and packed in straw the winter before by men who worked the snow pits. That trade died out in the early 1900s, at the end of this band."],
  ],
  it_tonnara: [
    ["Lower the loin", "The loins are boiled first and only then packed and covered with oil. Doing those two things in that order is credited to this plant as an industrial first."],
    ["Pour the oil", "Tuna boiled and canned in olive oil is what Ignazio Florio bought these islands for in 1874, and what Giuseppe Damiani Almeyda rebuilt the works to make."],
    ["Shave the pressed roe", "The roe sac is salted, pressed and dried until it is hard enough to shave. The practice is old and its documentation is modern; no nineteenth-century production figures exist for it."],
  ],
};

// --- sources, grouped as docs/italy-research.md section 4.15 groups them ---

const artusi = { title: "Wikipedia · Pellegrino Artusi", url: "https://en.wikipedia.org/wiki/Pellegrino_Artusi" };
const artusi222 = { title: "pellegrinoartusi.it · Recipe 222, saltimbocca alla romana", url: "http://www.pellegrinoartusi.it/222-saltimbocca-alla-romana/" };
const artusi1891 = { title: "Internet Archive · La scienza in cucina, first edition 1891", url: "https://archive.org/details/artusi-1891/" };
const capital = { title: "Wikipedia · Unification of Italy", url: "https://en.wikipedia.org/wiki/Unification_of_Italy" };
const mattatoio = { title: "Turismo Roma · The Testaccio slaughterhouse", url: "https://www.turismoroma.it/en/places/mattatoio" };
const testaccio = { title: "Archidiap · The Testaccio quarter and its housing phases", url: "https://archidiap.com/opera/quartiere-testaccio/" };
const quintoQuartoSrc = { title: "Ve l'avevo detto · What quinto quarto means", url: "https://www.ristorantevelavevodetto.it/che-vuol-dire-quinto-quarto-origine-tagli-e-piatti-tipici/" };
const coda = { title: "Wikipedia · Coda alla vaccinara", url: "https://en.wikipedia.org/wiki/Coda_alla_vaccinara" };
const cacioPepe = { title: "Wikipedia · Cacio e pepe", url: "https://en.wikipedia.org/wiki/Cacio_e_pepe" };
const amatriciana = { title: "Wikipedia · Amatriciana sauce", url: "https://en.wikipedia.org/wiki/Amatriciana_sauce" };
const amatrice = { title: "Wikipedia · Amatrice", url: "https://en.wikipedia.org/wiki/Amatrice" };
const carbonara = { title: "Wikipedia · Carbonara", url: "https://en.wikipedia.org/wiki/Carbonara" };
const carbonara1954 = { title: "Gambero Rosso · The first carbonara recipe, 1954", url: "https://www.gamberorossointernational.com/news/food-news/carbonara-from-1954-the-first-recipe-for-romes-iconic-dish-which-comes-from-milan-and-is-made-with-garlic/" };
const osterieRome = { title: "Slow Food · Che è 'na fojetta", url: "https://www.slowfood.it/slowine/che-e-na-fojetta/" };
const foglietta = { title: "Wikipedia · Roman wine measures", url: "https://it.wikipedia.org/wiki/Unit%C3%A0_di_misura_del_vino_romano" };
const campo = { title: "Wikipedia · Campo de' Fiori", url: "https://en.wikipedia.org/wiki/Campo_de%27_Fiori" };
const campoBefore = { title: "Roma Segreta · Campo de' Fiori before 1869", url: "https://www.romasegreta.it/parione/campo-de-fiori.html" };
const bruno = { title: "Wikipedia · The monument to Giordano Bruno, 9 June 1889", url: "https://en.wikipedia.org/wiki/Monument_to_Giordano_Bruno" };
const carciofoIgp = { title: "Qualigeo · Carciofo Romanesco del Lazio IGP", url: "https://www.qualigeo.eu/prodotto-qualigeo/carciofo-romanesco-del-lazio-igp/" };
const carciofoIt2 = { title: "Wikipedia · Carciofo romanesco del Lazio", url: "https://it.wikipedia.org/wiki/Carciofo_romanesco_del_Lazio" };
const giudia = { title: "Gambero Rosso · Carciofo alla giudia", url: "https://www.gamberorosso.it/rubriche/storie/carciofo-alla-giudia/" };
const ghetto = { title: "Wikipedia · The Roman Ghetto and the demolition of 1888", url: "https://en.wikipedia.org/wiki/Roman_Ghetto" };
const sinagoga = { title: "Turismo Roma · The Great Synagogue, 1901–1904", url: "https://www.turismoroma.it/en/node/57" };
const maccheroni = { title: "97100 · Nineteenth-century Roman maccheroni", url: "https://97100.it/le-origini-della-pasta-italiana-un-viaggio-tra-storia-e-tradizione/" };
const pastaCampana = { title: "Wikipedia · Pasta campana and the Gragnano railway", url: "https://it.wikipedia.org/wiki/Pasta_campana" };
const gragnano = { title: "Cookist · Gragnano's wind street and the Cirillo method of 1919", url: "https://www.cookist.it/una-citta-per-la-pasta-la-via-del-vento-di-gragnano-e-il-metodo-cirillo/" };
const cavalcanti = { title: "Biblioteca Gastronomica Barilla · Cavalcanti, Cucina teorico-pratica, 1837", url: "https://www.barilla.com/it-it/su-di-noi/biblioteca-gastronomica/cucina-teorica-pratica" };
const pizzaBianca = { title: "Wikipedia · Pizza bianca", url: "https://en.wikipedia.org/wiki/Pizza_bianca" };
const romanForno = { title: "Cookist · The history of Roman white pizza", url: "https://www.cookist.com/the-history-of-roman-white-pizza-probably-the-first-pizza-in-history/" };
const margherita = { title: "National Geographic · Was the Margherita named after a queen?", url: "https://www.nationalgeographic.com/history/history-magazine/article/pizza-margherita-may-be-fit-for-a-queen-but-was-it-named-after-one" };
const margheritaNowak = { title: "Scott's Pizza Tours · The real story of pizza Margherita", url: "https://www.scottspizzatours.com/blog/the-real-story-of-pizza-margherita/" };
const porchetta = { title: "Parchi Lazio · Porchetta di Ariccia IGP", url: "https://www.parchilazio.it/castelliromani-schede-13522-porchetta_di_ariccia_igp" };
const seume = { title: "Wikipedia · Porchetta di Ariccia and Seume at Ariccia, 1802", url: "https://it.wikipedia.org/wiki/Porchetta_di_Ariccia" };
const pecorino = { title: "Web Food Culture · Pecorino Romano and its move to Sardinia", url: "https://webfoodculture.com/pecorino-romano-cheese-history-info-interesting-facts/" };
const pecorinoConsorzio = { title: "Pizza e Pasta Italiana · Pecorino Romano DOP and its consortium", url: "https://www.pizzaepastaitaliana.it/archivio/il-pecorino-romano-dop-e-la-storia-del-suo-consorzio-di-tutela" };
const sabina = { title: "Wikipedia · Sabina olive oil DOP", url: "https://it.wikipedia.org/wiki/Sabina_(olio_di_oliva)" };
const sabinaDop = { title: "Consorzio Sabina DOP", url: "https://www.sabinadop.it/" };
const carrettieri = { title: "Rete Italiana Cultura Popolare · Carrettieri a vino", url: "https://www.reteitalianaculturapopolare.org/ar/archivio-partecipato/item/127-carrettieri-a-vino-e-vetturini-romani.html" };
const carrettieriEnd = { title: "La Voce dei Castelli · The last wine carts, October 1917", url: "https://www.lavocedeicastelli.com/rubriche/cultura-tempo-libero/carretti-a-vino-100-anni-fa-la-loro-ultima-corsa/" };
const malaria = { title: "PMC · Malaria in the Agro Romano and the quinine monopoly", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3340992/" };
const meatConsumption = { title: "Taccuini Gastrosofici · Nineteenth-century Italian meat and bread consumption", url: "https://www.taccuinigastrosofici.it/ita/news/contemporanea/antropologia-alimentare/rivoluzione-dei-consumi-di-carne-e-pane-nel-Ottocento.html" };
const moriondo = { title: "Wikipedia · Angelo Moriondo's patent of 16 May 1884", url: "https://en.wikipedia.org/wiki/Angelo_Moriondo" };
const bezzera = { title: "Wikipedia · Luigi Bezzera, 1901, and La Pavoni, 1905", url: "https://en.wikipedia.org/wiki/Luigi_Bezzera" };

const rialto = { title: "Wikipedia · Rialto, Venice: the market from 1097 and its trade zones", url: "https://it.wikipedia.org/wiki/Rialto_(Venezia)" };
const pescariaInsula = { title: "Insula · The Pescaria, Forcellini's canopy and Laurenti's loggia (PDF)", url: "https://www.insula.it/images/pdf/resource/_imgpdf/575.pdf" };
const pescaria1907 = { title: "Canal Grande Venezia · La Pescheria", url: "https://www.canalgrandevenezia.it/palazzi-canal-grande/lato-sinistro/95-la-pescheria" };
const pescariaPlaque = { title: "Conoscere Venezia · The minimum-length plaque", url: "https://www.conoscerevenezia.it/?p=92619" };
const pescariaTrade = { title: "Il Pesce · Who sold and who bought at Rialto", url: "https://www.pubblicitaitalia.com/ilpesce/2000/5/3018.html" };
const saor = { title: "Libro di cucina, anonymous Venetian, ed. Frati 1899 (PDF)", url: "https://www.mori.bz.it/gastronomia/Anonimo%20Veneziano%20-%20Libro%20di%20cucina.pdf" };
const boerio = { title: "Internet Archive · Boerio, Dizionario del dialetto veneziano, 1867", url: "https://archive.org/details/dizionariodeldi00boergoog" };
const panzini = { title: "Internet Archive · Panzini, Dizionario moderno, 1905", url: "https://archive.org/details/dizionariomodern00panzuoft" };
const bacaroWord = { title: "Conoscere Venezia · “Bacaro” is not in Boerio or Panzini", url: "https://www.conoscerevenezia.it/?p=58393" };
const osterieGrades = { title: "Conoscere Venezia · The graded Venetian wine outlets (after Zorzi, 1928)", url: "https://www.conoscerevenezia.it/?p=58388" };
const ombra = { title: "Conoscere Venezia · Barth 1910, Zorzi 1928 and the 125 ml measure", url: "https://www.conoscerevenezia.it/?p=58398" };
const cicchetto = { title: "Treccani · Cicchetto", url: "https://www.treccani.it/vocabolario/cicchetto/" };
const gasparini = { title: "Domani · Danilo Gasparini on what the bacari were", url: "https://www.editorialedomani.it/fatti/lontano-da-venezia-non-si-fa-bacara-blnroxl1" };
const querini = { title: "Dizionario Biografico degli Italiani · Pietro Querini", url: "https://www.treccani.it/enciclopedia/pietro-querini_(Dizionario-Biografico)/" };
const moeche = { title: "Wikipedia · Moleca", url: "https://it.wikipedia.org/wiki/Moleca" };
const moecanti = { title: "Cooperativa San Marco · The moecanti and their vieri", url: "https://www.cooperativasanmarco.com/progetto-granchi.html" };
const castraure = { title: "Slow Food · Carciofo violetto di Sant'Erasmo", url: "https://www.fondazioneslowfood.com/it/presidi-slow-food/carciofo-violetto-di-santerasmo/" };
const goby = { title: "Slow Food · Gò della laguna di Venezia", url: "https://www.fondazioneslowfood.com/it/arca-del-gusto-slow-food/go-della-laguna-di-venezia/" };
const valli = { title: "Treccani · Pesca e caccia in laguna", url: "https://www.treccani.it/enciclopedia/pesca-e-caccia-in-laguna_(Storia-di-Venezia)/" };
const burano = { title: "Visit Venezia · Burano's coloured houses as folklore", url: "https://www.visitvenezia.eu/en/venetianity/tales-of-venice/a-dive-into-the-past-of-burano" };
const pellagra = { title: "Gentilcore & Priani · Pellagra and Pellagrous Insanity, Palgrave 2023 (PDF)", url: "https://link.springer.com/content/pdf/10.1007/978-3-031-22496-6.pdf" };
const pellagraCases = { title: "JASS · Pellagra case numbers and nixtamalization (PDF)", url: "https://www.isita-org.com/jass/contents/2007%20vol85/Articoli/JassPDFAggiunte/Mariani2007.pdf" };
const pellagraLaw = { title: "Bibliography of the 1902 pellagra law (PDF)", url: "http://www.italia-resistenza.it/rete/wp-content/uploads/2012/11/pellagra_bibl.pdf" };
const macinato = { title: "MEF · The tassa sul macinato, 1868–1884", url: "https://www.finanze.gov.it/it/il-dipartimento/fisco-e-storia/i-tributi-nella-storia-ditalia/1868-1884-tassa-sul-macinato/" };
const fegato = { title: "Internet Archive · Leonardi, Apicio moderno, vol. I, 1807", url: "https://archive.org/details/b21525225_0001" };
const riceVerona = { title: "European Commission · Riso Nano Vialone Veronese PGI", url: "https://agriculture.ec.europa.eu/farming/geographical-indications-and-quality-schemes/geographical-indications-food-and-drink/riso-nano-vialone-veronese-pgi_en" };
const riceMonograph = { title: "Monografia statistica ed agraria sulla coltivazione del riso in Italia, 1889", url: "https://books.google.ch/books/about/Monografia_statistica_ed_agraria_sulla_c.html?id=yfN-AAAAIAAJ" };
const riceLaw = { title: "Fondazione Einaudi · The rice-field labour law of 16 June 1907", url: "https://www.luigieinaudi.it/doc/il-progetto-di-legge-sul-lavoro-nelle-risaie-dallarbitrato-alla-conciliazione/" };
const mondine = { title: "Gambero Rosso · The mondine of Vercelli and the 1906 strikes", url: "https://www.gamberorosso.it/notizie/attualita/mondine-vercellesi-sciopero-diritti-donne/" };
const campanile = { title: "Wikipedia · St Mark's Campanile, 14 July 1902 and 25 April 1912", url: "https://en.wikipedia.org/wiki/St_Mark%27s_Campanile" };
const accademia = { title: "Wikipedia · Ponte dell'Accademia", url: "https://en.wikipedia.org/wiki/Ponte_dell%27Accademia" };
const istrian = { title: "Wikipedia · Istrian stone", url: "https://en.wikipedia.org/wiki/Istrian_stone" };
const gondola = { title: "Wikipedia · The gondola and its ferro", url: "https://en.wikipedia.org/wiki/Gondola" };
const spritz = { title: "Treccani · Spritz, attested 1972", url: "https://www.treccani.it/vocabolario/spritz_(Neologismi)/" };

const panelle = { title: "Wikipedia · Panelle", url: "https://it.wikipedia.org/wiki/Panelle" };
const meusa = { title: "Wikipedia · Pani câ meusa", url: "https://en.wikipedia.org/wiki/Pani_c%C3%A2_meusa" };
const arancini = { title: "Wikipedia · Arancino: Biundi, Mortillaro and Traina", url: "https://it.wikipedia.org/wiki/Arancino" };
const arancinienW = { title: "Wikipedia · Arancini", url: "https://en.wikipedia.org/wiki/Arancini" };
const sfincione = { title: "Wikipedia · Sfincione", url: "https://it.wikipedia.org/wiki/Sfincione" };
const acquaiolo = { title: "Palermo Viva · Voci di strada, the acquaiolo and the zammù", url: "https://www.palermoviva.it/voci-di-strada/" };
const ballaro = { title: "Wikipedia · Ballarò, Palermo", url: "https://it.wikipedia.org/wiki/Ballar%C3%B2_(Palermo)" };
const abbanniata = { title: "L'Italo-Americano · The abbanniata", url: "https://italoamericano.org/abbanniata/" };
const swordfish = { title: "Cultura Alimentare · Swordfish in the Strait of Messina, from Polybius", url: "https://culturalimentare.beniculturali.it/sources/pesca-del-pesce-spada-nello-stretto-di-messina" };
const pastaSarde = { title: "Wikipedia · Pasta con le sarde", url: "https://en.wikipedia.org/wiki/Pasta_con_le_sarde" };
const cirio = { title: "Wikipedia · Francesco Cirio", url: "https://en.wikipedia.org/wiki/Francesco_Cirio" };
const cirioHistory = { title: "Cirio · Company history from 1856", url: "https://www.cirio1856.com/group/history/" };
const neviere = { title: "Sicilia Preziosa · The neviere and the nivaroli", url: "https://www.siciliapreziosa.it/storie/storia-tradizioni-neviere-siciliane-nivaroli/" };
const granita = { title: "InformaCibo · Granita and the sharbat lineage", url: "https://www.informacibo.it/granita-siciliana-storia-differenza-sorbetto/" };
const brioche = { title: "Stretto Web · The granita and its modern companion", url: "https://www.strettoweb.com/2021/05/storia-della-granita-siciliana-le-origini-e-gli-ingredienti/1189328/" };
const cassata = { title: "Sicily Addict · Cassata's name as legend", url: "https://www.sicilyaddict.it/blogs/blog/la-storia-della-cassata-siciliana" };
const cannolo = { title: "Cookist · The cannolo's harem origin as legend", url: "https://www.cookist.it/la-strana-origine-del-cannolo-dolce-conventuale-o-invenzione-delle-donne-di-un-harem/" };
const avola = { title: "Wikipedia · Mandorla di Avola and Giuseppe Bianca", url: "https://it.wikipedia.org/wiki/Mandorla_di_Avola" };
const florio = { title: "La Sicilia in Rete · The Florio tonnara at Favignana and Formica", url: "https://www.lasiciliainrete.it/directory-tangibili/listing/ex-stabilimento-florio-delle-tonnare-di-favignana-e-formica/" };
const florioCreche = { title: "Accademia del Tonno Rosso · Favignana (commercial source)", url: "https://accademiadeltonnorossoinsicilia.it/tonnare-2/favignana/" };
const florioConflict = { title: "Wikipedia · Tonnara di Favignana", url: "https://en.wikipedia.org/wiki/Tonnara_di_Favignana" };
const bottarga = { title: "Viva Sicilia · Bottarga di tonno", url: "https://vivasicilia.com/tipicita/pesce-e-derivati/bottarga-di-tonno.html" };
const latifondo = { title: "Wikipedia · The latifondo in Sicily", url: "https://it.wikipedia.org/wiki/Latifondo_in_Sicilia" };
const gabellotto = { title: "Wikipedia · Gabellotto", url: "https://en.wikipedia.org/wiki/Gabellotto" };
const carusi = { title: "Sicilian Post · The carusi of the sulphur mines", url: "https://www.sicilianpost.it/vite-senza-luce-la-tragedia-dei-carusi-nelle-zolfare-siciliane/" };
const grainTrade = { title: "Agrigento Ieri e Oggi · Sicilian grain, from granary to importer", url: "https://www.agrigentoierieoggi.it/il-granaio-del-mediterraneo-storia-millenaria-del-commercio-cerealicolo-siciliano-dal-medioevo-allunita-ditalia/" };
const sicilianDiet = { title: "Agrigento Ieri e Oggi · The Sicilian peasant diet in the 1800s", url: "https://www.agrigentoierieoggi.it/lalimentazione-nella-sicilia-dellottocento-accussi-mori-laffamatu/" };
const lemons = { title: "Journal of Economic History · Origins of the Sicilian Mafia: the Market for Lemons", url: "https://www.cambridge.org/core/journals/journal-of-economic-history/article/origins-of-the-sicilian-mafia-the-market-for-lemons/52B18A611BD8AE26B4FDE3814A4239F1" };
const lemonsAeon = { title: "Aeon · How a growing market for citrus fruit spawned the mafia", url: "https://aeon.co/essays/how-a-growing-market-for-citrus-fruit-spawned-the-mafia" };
const franchetti = { title: "Wikipedia · Franchetti and Sonnino, La Sicilia nel 1876", url: "https://it.wikipedia.org/wiki/La_Sicilia_nel_1876" };
const tarocco = { title: "Wikipedia · Arancia Rossa di Sicilia", url: "https://it.wikipedia.org/wiki/Arancia_Rossa_di_Sicilia" };
const capperi = { title: "Wikipedia · Cappero di Pantelleria, IGP 1996", url: "https://it.wikipedia.org/wiki/Cappero_di_Pantelleria" };
const capperiSalina = { title: "Great Italian Food Trade · Cappero delle Isole Eolie DOP", url: "https://www.greatitalianfoodtrade.it/capperi/cappero-di-salina-anzi-cappero-delle-isole-eolie-dop/" };
const pistacchio = { title: "Consorzio Pistacchio Verde di Bronte DOP · History", url: "https://www.consorziopistacchioverdedibrontedop.it/en/history/" };
const carretto = { title: "Palermo Today · The Sicilian cart and its painting after 1830, per Pitrè", url: "https://www.palermotoday.it/blog/una-finestra-sulla-palermo-che-fu/storia-carretto-siciliano.html" };
const carrettoEn = { title: "Wikipedia · Sicilian cart", url: "https://en.wikipedia.org/wiki/Sicilian_cart" };
const albergheria = { title: "Albergheria e Capo Insieme · The history of the Albergheria", url: "https://albergheriaecapoinsieme.chiesadipalermo.it/albergheria-la-storia/" };
const emigration = { title: "Fondazione Paolo Cresci · Italian emigration statistics", url: "https://www.fondazionepaolocresci.it/en/statistics/" };
const colosseum = { title: "Wikipedia · Colosseum", url: "https://en.wikipedia.org/wiki/Colosseum" };
const pantheon = { title: "Wikipedia · Pantheon, Rome", url: "https://en.wikipedia.org/wiki/Pantheon,_Rome" };
const rialtoBridgeSrc = { title: "Wikipedia · Rialto Bridge", url: "https://en.wikipedia.org/wiki/Rialto_Bridge" };
const etna = { title: "Wikipedia · Mount Etna", url: "https://en.wikipedia.org/wiki/Mount_Etna" };

/** One or more sources for every one of the forty-six objects, including the ten hit-only children, so
 *  that no card in this world makes a historical or specialist claim without a source behind it. */
export const ITALY_SOURCES: Record<string, { title: string; url: string }[]> = {
  // rooms
  ragu: [artusi, artusi222, artusi1891, coda, cacioPepe, amatriciana, amatrice, carbonara, carbonara1954, osterieRome, foglietta, capital],
  romeMarket: [campo, campoBefore, bruno, carciofoIgp, carciofoIt2, giudia, ghetto, sinagoga],
  pasta: [maccheroni, pastaCampana, gragnano, cavalcanti, artusi],
  oven: [pizzaBianca, romanForno, margherita, margheritaNowak, porchetta, seume],
  cheese: [pecorino, pecorinoConsorzio, sabina, sabinaDop, carrettieri, carrettieriEnd, malaria],
  seafood: [rialto, pescariaInsula, pescaria1907, pescariaPlaque, pescariaTrade, saor, boerio],
  bacaro: [bacaroWord, osterieGrades, ombra, cicchetto, panzini, boerio, gasparini, querini, spritz],
  lagunaIt: [moeche, moecanti, castraure, goby, burano],
  casaVeneta: [pellagra, pellagraCases, pellagraLaw, macinato, fegato, emigration],
  friggitoria: [panelle, meusa, arancini, arancinienW, sfincione, acquaiolo],
  sicilyMarket: [ballaro, abbanniata, swordfish, pastaSarde, cirio, cirioHistory, albergheria],
  pastry: [neviere, granita, brioche, cassata, cannolo, avola],
  tonnaraIt: [florio, florioCreche, florioConflict, bottarga],

  // ingredient stops
  carciofoIt: [carciofoIgp, carciofoIt2, giudia],
  pecoraIt: [pecorino, pecorinoConsorzio, meatConsumption],
  olive: [sabina, sabinaDop],
  vinoIt: [carrettieri, carrettieriEnd, foglietta],
  italyBeef: [mattatoio, quintoQuartoSrc, meatConsumption],
  italyChicken: [meatConsumption, sicilianDiet],
  mushrooms: [meatConsumption],
  basil: [cacioPepe, carciofoIt2],
  valliIt: [valli, pescariaTrade],
  riceIt: [riceVerona, riceMonograph, riceLaw, mondine, pellagra],
  granoIt: [latifondo, gabellotto, carusi, grainTrade, franchetti],
  tomato: [cirio, cirioHistory, cavalcanti],
  lemon: [lemons, lemonsAeon, franchetti, tarocco],
  mandorleIt: [avola],
  capperiIt: [capperi, capperiSalina],

  // landmarks and the two other card-only objects
  colosseoIt: [colosseum, capital, testaccio],
  panteonIt: [pantheon, capital],
  quintoQuarto: [mattatoio, testaccio, quintoQuartoSrc, meatConsumption],
  gelateria: [moriondo, bezzera, neviere],
  rialtoIt: [rialto, rialtoBridgeSrc, accademia, istrian],
  campanileIt: [campanile, gondola],
  etnaIt: [etna, neviere, pistacchio],
  carrettoIt: [carretto, carrettoEn],

  // the ten hit-only children
  "stall-tomato": [cirio, cirioHistory],
  "stall-cheese": [pecorino, carciofoIt2],
  "stall-salumi": [mattatoio, quintoQuartoSrc],
  "stall-herbs": [carciofoIt2, cacioPepe],
  "stall-oil": [sabina, sabinaDop],
  trattoria: [coda, cacioPepe, artusi222],
  pizzeria: [pizzaBianca, romanForno, margherita],
  "stall-lemon": [lemons, lemonsAeon],
  "stall-tomato2": [cirio, grainTrade],
  "stall-arancini": [arancini, arancinienW, panelle, meusa],
};

/** Clothing, architecture and settlement reading behind the three areas, kept here so the Builder can
 *  find it. **No profile in section 1.5 of the research is a verified garment list**: these are the named
 *  holdings a picture reviewer pulls one catalogued garment or photograph from before a resident is
 *  dressed, and that gap is still open at Stage C. */
export const ITALY_BACKGROUND_SOURCES: { title: string; url: string }[] = [
  { title: "Museo di Roma in Trastevere · the collection on Roman popular life", url: "https://museodiromaintrastevere.it/en/gruppo-infopage/la-collezione-2" },
  { title: "Turismo Roma · Roesler Franz's “Roma sparita” watercolours", url: "https://www.turismoroma.it/en/places/museum-roma-trastevere" },
  { title: "Archivio Storico Capitolino · Fondo Fotografico, 1870–1950", url: "https://www.archiviocapitolino.it/archivio_fotografico.php" },
  { title: "Museo etnografico siciliano Giuseppe Pitrè, founded 1909", url: "https://it.wikipedia.org/wiki/Museo_etnografico_siciliano_Giuseppe_Pitr%C3%A8" },
  { title: "Foto Arte Architettura · the Palermo photographers Incorpora and Leone", url: "https://www.fotoartearchitettura.it/fotografia/fotografi-storici-di-palermo.html" },
  { title: "Archivio Fotografico Giacomelli, Comune di Venezia", url: "https://archiviofotografico.comune.venezia.it/" },
  { title: "Museo Correr · photographic archive", url: "https://correr.visitmuve.it/it/il-museo/servizi-agli-studiosi/archivio-fotografico/" },
  { title: "Archivi Alinari, Florence", url: "https://www.alinari.it/cms/it/chi-siamo/storia-degli-archivi" },
  { title: "ICCD · photographic holdings from 1840", url: "https://iccd.beniculturali.it/it/fotografia" },
  { title: "1600.venezia.it · the Venetian woman's black fringed shawl", url: "https://1600.venezia.it/it/articolo/dallo-scialle-ai-merletti-come-cambiano-gli-abiti-dei-veneziani-nei-secoli" },
  istrian,
];
