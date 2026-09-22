/** Ambient and tap speech for every Italian stand, keyed by object id. Owned by the Researcher.
 *
 *  Where this belongs. The module contract in docs/italy-world.md gives `IT_LINES` to the Researcher and
 *  says plainly that speech lines do **not** live in `props-italy.ts`; that file is the Stand maker's, and
 *  it should import or re-export `IT_LINES` from here rather than declare a second copy, exactly as
 *  `props-spain.ts` reads its own `ES_LINES` and `props-thailand.ts` its `TH_LINES`.
 *
 *  Shape and rules. One bubble per line: the local speech first, then the English, separated by " · ",
 *  which is the form `props.ts` already uses for a two-script bubble and the form section 2.5 of
 *  docs/italy-research.md wrote these in. Five lines for each of the thirteen room objects and four for
 *  every other stand, so a stand does not repeat itself inside one visit and nothing wraps more than twice
 *  at 390 px. The lines go to `ambientChat` and to the deferred tap bubble, whose quiet intervals, single
 *  speaker, tap priority and clean-up are what scripts/tests/village-speech.mjs asserts; nothing in the
 *  text itself is tested, so the discipline here is editorial: **no line states a date, a price or a
 *  historical claim**, with the single exception of the osteria's ten centesimi, which is the measure the
 *  room is about. Every record lives on the card.
 *
 *  Orthography, and the warning that goes with it. The thirteen room objects' lines are verbatim from
 *  research section 2.5. They are written in Romanesco for Rome, in Venetian — Buranello on Burano and
 *  plain Veneto on the terraferma — and in Sicilian, with Palermitan for the city and Trapanese at the
 *  tonnara, because that is what the palette in docs/italy-world.md asks for. **A native Romanesco,
 *  Venetian and Sicilian reader must check this file before it ships.** The dish names and the place names
 *  I am confident in; the sentences are the Researcher's own construction, the apostrophes and elisions
 *  are the conventional printed ones rather than a phonetic transcription, and no dialect here has a fixed
 *  orthography to be right against. This is the sixth open item in section 5 of the research and it is
 *  still open.
 *
 *  One card ruling does not reach this file. The owner's ruling of 2026-09-22 keeps martorana out of the
 *  pasticceria's **card text**, because the fruit painted beside the pastry tube is a real fig; the
 *  marzipan fruit was nevertheless what that shop sold for the second of November, so the ambient line
 *  keeps it. Nothing in the card, the story depth or the discoveries names it. */
export const IT_LINES: Record<string, string[]> = {
  // --- the thirteen room objects: verbatim from research section 2.5 ---
  ragu: [
    "Aricordate che la coda vo' tre ore, nun de meno. · Remember the oxtail wants three hours, not less.",
    "Er cacio ce lo metti a foco spento, sennò t'impazzisce. · Put the cheese in off the heat, or it will seize on you.",
    "Hai portato la fojetta? Mettila sur marmo. · Did you bring the foglietta? Put it on the marble.",
    "Er quinto quarto è quello che ce danno ar mattatoio. · The fifth quarter is what they give us at the slaughterhouse.",
    "Sedete dove ve pare, tanto è tutto uguale. · Sit where you like, it is all the same here.",
  ],
  romeMarket: [
    "Carciofi! Cimaroli! Venite a vedé che teste! · Artichokes! Cimaroli! Come and see these heads!",
    "Puntarelle già monnate, ve le do a peso. · Puntarelle already trimmed, I sell them by weight.",
    "'Sta ricotta è de stamattina, toccala. · This ricotta is from this morning, touch it.",
    "Er broccolo vo' lessato e poi ripassato. · The broccoli wants boiling and then frying again.",
    "Nun me pestate le cassette, per carità. · Do not tread on the crates, for pity's sake.",
  ],
  pasta: [
    "Tira, tira, ch'ha da vedé la luce attraverso. · Roll it, roll it; you should see the light through it.",
    "Poc'acqua e tanto gomito. · Little water and plenty of elbow.",
    "Le fettuccine se coceno oggi; domani so' 'n'antra cosa. · Fettuccine are cooked today; tomorrow they are something else.",
    "I maccheroni secchi arriveno cor treno da Napoli. · The dried maccheroni comes up on the train from Naples.",
    "Er grano duro sta ne la semola, nun ne la farina. · The durum is in the semolina, not in the flour.",
  ],
  oven: [
    "Pizza bianca! Appena uscita! · White pizza! Just out!",
    "Er forno me dice quanno è pronto; io nun je dico gnente. · The oven tells me when it is ready; I tell it nothing.",
    "Er pane se fa 'na vorta a settimana e basta. · Bread is made once a week and that is that.",
    "La porchetta ce la metto stanotte, quanno cala. · The porchetta goes in tonight, when the heat drops.",
    "La pizza tonna cor pomodoro è roba de Napoli. · The round pizza with tomato is a Neapolitan thing.",
  ],
  cheese: [
    "Taja la cagliata fina, sennò nun cola. · Cut the curd fine, or it will not drain.",
    "La ricotta se fa cor siero: qui nun se butta gnente. · Ricotta is made from the whey; nothing is thrown away here.",
    "Er pecorino bono mo' lo fanno in Sardegna. · The good pecorino is made in Sardinia now.",
    "L'ojo de la Sabina va crudo, sempre. · Sabina oil goes on raw, always.",
    "Er carretto parte stanotte pe' Roma, coll'antri. · The cart leaves for Rome tonight, with the others.",
  ],
  seafood: [
    "Sardèe! Sardèe frescìssime! · Sardines! Freshest sardines!",
    "'Sta granseola xe de stanote, vardè le sate. · This spider crab is from last night, look at the legs.",
    "El bisato soto i vinticinque no se vende. · Eel under twenty-five centimetres is not sold.",
    "Buta acqua sul marmo, che'l ciapa polvere. · Throw water on the marble, it is catching dust.",
    "Le moéche le vien solo do volte a l'ano. · The moeche come only twice a year.",
  ],
  bacaro: [
    "'N'ombra, come sempre? · A half glass, as always?",
    "Diese centesimi, in pié, e via. · Ten centesimi, standing up, and off you go.",
    "El bacalà lo go batùo mez'ora. · I beat the salt cod for half an hour.",
    "El saór xe mèio doman che ancùo. · The saòr is better tomorrow than today.",
    "Qua se beve; se te vol magnar, sèntete. · Here one drinks; if you want to eat, sit down.",
  ],
  lagunaIt: [
    "Ste chì le xe spiantàne: doman le mua. · These are spiantani; tomorrow they moult.",
    "Tira su el vièro prima che vegna l'acqua granda. · Get the cage up before the high water comes.",
    "El gò no vale gnente, ma el risoto sì. · The goby is worth nothing, but the risotto is.",
    "Le castraùre le dura quìndese zorni, no de più. · The castraure last a fortnight, no longer.",
    "Polenta bianca: qua quela zala no se usa. · White polenta; the yellow one is not used here.",
  ],
  casaVeneta: [
    "Gira, che se no la se taca. · Turn it, or it will stick.",
    "Polenta e polenta, e del resto se vedarà. · Polenta and polenta, and we shall see about the rest.",
    "El mal de la rosa xe tornà in casa dei vicini. · The rose sickness is back in the neighbours' house.",
    "I bisi vien su presto st'ano. · The peas are coming early this year.",
    "Me fradeo el xe partìo par el Brasile. · My brother has left for Brazil.",
  ],
  friggitoria: [
    "Panelle càuri! Càuri! · Hot panelle! Hot!",
    "Maritatu o schettu? · Married or single? (with cheese, or without)",
    "Lu strutto voli essiri forti, no tèpitu. · The lard must be fierce, not warm.",
    "Dui panelle e un cazzillu, cu' lu limuni. · Two panelle and one croquette, with lemon.",
    "Cu' mancia in pedi mancia dui voti. · He who eats standing eats twice.",
  ],
  sicilyMarket: [
    "Câmmura! Câmmura ca sardi! · Come here! Come for the sardines!",
    "Menza fàccia di pisci spata, signura? · Half a face of swordfish, signora?",
    "Lu finucchiettu è di muntagna, no d'ortu. · The fennel is from the hills, not from a garden.",
    "Jetta l'acqua ncapu, ca s'asciuca. · Throw the water over it, it is drying out.",
    "L'estrattu s'asciuca supra li tavuli, tri jorna. · The tomato paste dries on boards for three days.",
  ],
  pastry: [
    "Lu cannolu s'inchi quannu si mancia. · A cannolo is filled when it is eaten.",
    "La nivi scinni di la muntagna, d'invernu. · The snow comes down from the mountain, in winter.",
    "Sta cassata è pi Pasqua, no pi oggi. · This cassata is for Easter, not for today.",
    "Menzu chilu di frutta martorana, pi li morti. · Half a kilo of marzipan fruit, for the second of November.",
    "Lu latti di mènnula è d'Avola, no d'autru. · The almond milk is from Avola and nowhere else.",
  ],
  tonnaraIt: [
    "Càlati, càlati, chianu chianu. · Lower it, lower it, slowly now.",
    "Nenti si jetta di lu tunnu. · Nothing of the tuna is thrown away.",
    "L'ogghiu prima, e poi si chiudi lu stagnu. · The oil first, and then the tin is closed.",
    "La bottarga voli trenta jorna sutta lu pisu. · The bottarga wants thirty days under the weight.",
    "Li Florio accattaru tuttu, macari lu mari. · The Florio bought everything, even the sea.",
  ],

  // --- the fifteen ingredient and flavour stops ---
  carciofoIt: [
    "Taja fin che nun resta che 'r core. · Trim it until nothing is left but the heart.",
    "Er cimarolo se coje pe' primo, sennò l'antri nun veneno. · The cimarolo is cut first, or the others will not come.",
    "Mettili ne l'acqua cor limone, ch'anneriscono. · Put them in lemon water, they go black.",
    "'Sta pianta dà pe' tre anni, poi se rifà. · This plant gives for three years, then you start again.",
  ],
  pecoraIt: [
    "So' cento capi, e me li conto a sera. · A hundred head, and I count them at evening.",
    "Munge presto, ch'er latte se scalla. · Milk early, the milk warms up.",
    "Quanno cala la neve se scenne ar piano. · When the snow comes down we go down to the plain.",
    "Er cane lavora più de me. · The dog works harder than I do.",
  ],
  olive: [
    "La macina gira finché la pasta nun se fa liscia. · The wheel turns until the paste goes smooth.",
    "Le fiscole se impileno e se pressa piano. · The mats are stacked and you press slowly.",
    "'St'ojo va sur pane, nun ne la padella. · This oil goes on bread, not in the pan.",
    "Se raccoje a novembre, prima che gela. · We pick in November, before it freezes.",
  ],
  vinoIt: [
    "Se parte a notte, e semo in tre carretti. · We leave at night, and there are three carts of us.",
    "Cinquecento litri, dieci barili. · Five hundred litres, ten barrels.",
    "A la barriera ce semo a l'arba. · We are at the customs barrier by dawn.",
    "Er mulo la strada la sa mejo de me. · The mule knows the road better than I do.",
  ],
  italyBeef: [
    "Der porco nun se butta gnente. · Of the pig nothing is thrown away.",
    "'Sta guanciala vo' ancora un mese. · This jowl wants another month.",
    "Er bue va giù ar mattatoio domani. · The ox goes down to the slaughterhouse tomorrow.",
    "La sugna serve pe' tutto l'inverno. · The lard has to last all winter.",
  ],
  italyChicken: [
    "L'ova de stamattina so' sette. · Seven eggs this morning.",
    "'Sta gallina nun fa più; domenica va ne la pentola. · This hen has stopped laying; Sunday she goes in the pot.",
    "Chiudi er pollaio, che c'è la vorpe. · Shut the hen house, there is a fox about.",
    "Er brodo de gallina regge tutta la settimana. · Hen broth carries the whole week.",
  ],
  mushrooms: [
    "Dopo la pioggia, sotto li castagni. · After the rain, under the chestnuts.",
    "Se seccheno infilati ar filo, sopra ar camino. · They dry threaded on a string over the hearth.",
    "'Sto qui nun se tocca: nun è bono. · Do not touch that one; it is not good.",
    "Le castagne fanno er pane quanno er grano nun basta. · Chestnuts make the bread when the wheat runs short.",
  ],
  basil: [
    "La mentuccia va dentro ar carciofo, nun sur pomodoro. · The wild mint goes in the artichoke, not on the tomato.",
    "Le puntarelle se spaccheno e se metteno a mollo. · Puntarelle are split and left to soak.",
    "La cicoria se lessa e poi se ripassa. · Chicory is boiled and then fried again.",
    "L'erba se coje la matina, mai a mezzogiorno. · Herbs are cut in the morning, never at midday.",
  ],
  valliIt: [
    "El lavoriero el lavora da par suo. · The trap does the work by itself.",
    "Le grisiòle le lassa passar l'acqua, no i pesse. · The reed fences let the water through, not the fish.",
    "I bisati i va zo co' la luna. · The eels run down with the moon.",
    "Sta note dormo in casón. · Tonight I sleep in the fishing hut.",
  ],
  riceIt: [
    "Se laora co' l'acqua fin al zenocio. · We work with the water up to the knee.",
    "Ghe xe da monda tuto sto camp entro sabo. · This whole field has to be weeded by Saturday.",
    "El chinin lo dà el paron, par leze. · The quinine comes from the master, by law.",
    "Noantre coltivemo riso e magnemo polenta. · We grow rice and eat polenta.",
  ],
  granoIt: [
    "Lu feudu è granni e nun è nostru. · The estate is big and it is not ours.",
    "Lu gabbillotu veni sabatu pi li cunti. · The gabellotto comes on Saturday for the accounts.",
    "Si mieti di la matina prestu, ca doppu cociri. · You reap early, because later it burns.",
    "Me frati si nni jiu n'America. · My brother has gone to America.",
  ],
  tomato: [
    "S'asciucanu supra li tavuli, tri jorna a lu suli. · They dry on the boards, three days in the sun.",
    "Un cucchiaru d'estrattu vasta pi tutta la pignata. · One spoon of estratto is enough for the whole pot.",
    "Càccia li simenti prima. · Take the seeds out first.",
    "Chisti sunnu pi la sarsa, chiddi pi mangiari. · These are for the sauce, those are for eating.",
  ],
  lemon: [
    "Lu giardinu voli acqua ogni ottu jorna. · The garden wants water every eight days.",
    "Càccia li cascati, ca s'ammàrcianu. · Pick up the fallen ones, they rot.",
    "Sti casci partunu pi Londra. · These cases are going to London.",
    "Chiudi lu cancellu quannu nesci. · Shut the gate when you leave.",
  ],
  mandorleIt: [
    "Si vàttinu cu' la canna, supra li linzola. · They are beaten down with a cane, onto the sheets.",
    "La Pizzuta è chidda longa e appizzuta. · The Pizzuta is the long pointed one.",
    "Si scòcciunu a manu, una pi una. · They are shelled by hand, one by one.",
    "Cu' chisti si fa lu latti di mènnula. · Almond milk is made from these.",
  ],
  capperiIt: [
    "Si càccianu prima ca sciùrinu. · They are picked before they flower.",
    "Sali e basta: nenti acqua, nenti acitu. · Salt and nothing else: no water, no vinegar.",
    "Ogni tri jorna si torna a passari. · Every three days you go round again.",
    "La chianta crisci dintra lu muru. · The plant grows out of the wall itself.",
  ],

  // --- the six landmarks and the two other card-only objects ---
  colosseoIt: [
    "Li rondoni esceno sempre a 'st'ora. · The swifts always come out at this hour.",
    "La pietra la sera è ancora calla. · The stone is still warm in the evening.",
    "Mezza Roma nova è fatta co' 'ste pietre. · Half of new Rome is built out of these stones.",
    "Ce se passa davanti e nun se guarda più. · People walk past it and stop looking.",
  ],
  panteonIt: [
    "Quanno piove, l'acqua entra e se ne va da sola. · When it rains the water comes in and drains away by itself.",
    "Er sole gira sur muro tutto er giorno. · The sun turns on the wall all day.",
    "Li piccioni stanno sotto ar portico. · The pigeons keep under the portico.",
    "Er forno sta a quattro strade da qui. · The bakery is four streets from here.",
  ],
  quintoQuarto: [
    "Quattro quarti se vendeno; er quinto resta. · Four quarters are sold; the fifth stays.",
    "La coda portala su da l'oste, corendo. · Take the tail up to the innkeeper, quickly.",
    "'Sta roba nun aspetta: se coce oggi. · This will not wait; it is cooked today.",
    "Er gancio scorre, statte largo. · The hook is running, stand clear.",
  ],
  gelateria: [
    "Un cafè, in piedi. · A coffee, standing up.",
    "La ghiaccia è arrivata stamattina, co' la paja. · The ice came this morning, packed in straw.",
    "Gira er secchio, sennò nun pija. · Turn the pail, or it will not take.",
    "'Sta machina fa più rumore che cafè. · That machine makes more noise than coffee.",
  ],
  rialtoIt: [
    "Fate largo, che passo col ceston. · Make way, I am coming through with the basket.",
    "Soto el ponte passa tuto. · Everything passes under the bridge.",
    "Le botege le verze prima del sol. · The shops open before the sun does.",
    "El marcà xe de qua, no de là. · The market is on this side, not that one.",
  ],
  campanileIt: [
    "Le campane le sona anca par chi no ga orologio. · The bells ring for those with no clock too.",
    "Da sora se vede fin a Ciogia. · From the top you can see as far as Chioggia.",
    "El campanìo el se move un fià col vento. · The bell tower shifts a little in the wind.",
    "Quando sona quela granda, xe mezogiorno. · When the big one rings, it is midday.",
  ],
  etnaIt: [
    "A Muntagna oj fuma. · The mountain is smoking today.",
    "La nivi si cogghi d'invernu e si vinni d'està. · The snow is gathered in winter and sold in summer.",
    "Supra sta terra nivura crisci tuttu. · Everything grows on this black earth.",
    "Li pistacchi si fannu un annu sì e unu no. · The pistachios crop one year in two.",
  ],
  carrettoIt: [
    "Lu carrettu è chinu; nun ci trasi cchiù nenti. · The cart is full; nothing else goes in.",
    "Li culura si vìdinu di luntanu. · The colours are seen from far off.",
    "Lu mulu va a lu passu so'. · The mule goes at its own pace.",
    "La pittura para lu lignu di l'acqua. · The paint keeps the water off the wood.",
  ],
};
