import { escapeHtml as esc } from "../world/plates";
import { fetchBody, minutesLabel, type RecipeBody } from "../data";
import { imageUrl } from "../data";
import { AREAS, SPICE, objectById, type Area, type EnrichedRecipe, type MapRegion, type WorldObject } from "./graph";
import { snapshot } from "./snapshot";

export type UiHandlers = {
  onClose: () => void;
  onOpenRecipe: (r: EnrichedRecipe) => void;
  onExploreDishes: (o: WorldObject, recipes: EnrichedRecipe[]) => void;
  onGoObject: (o: WorldObject) => void;
  onCook: (r: EnrichedRecipe) => void;
  onExploreIngredients: (r: EnrichedRecipe) => void;
  onEnterRegion: (region: MapRegion) => void;
};

const card = () => document.getElementById("card")!;
const ICON_KEYS: Record<string, true> = { saladVeg: true, feta: true, olivesGr: true, fishMed: true, oranges: true, cabbage: true, pulses: true, spicesMed: true, tagine: true, taverna: true, plancha: true, konoba: true, souk: true, mintTea: true, jemaa: true, flamenco: true, riceIt: true, spicesMe: true, chickpeas: true, lambYogurt: true, herbs: true, oliveLemon: true, dates: true, spices: true, saffron: true, mangal: true, spit: true, taboon: true, mezze: true, bazaar: true, tea: true, sweets: true, coffee: true, pilaf: true, camels: true, corn: true, chilliesMx: true, tomatoMx: true, avocado: true, limes: true, cacao: true, beefMx: true, carnitas: true, comal: true, molcajete: true, trompo: true, fonda: true, churros: true, tequila: true, mole: true, pib: true, mariachi: true, xochimilco: true, kimchi: true, hanwoo: true, riceKr: true, namul: true, seafoodKr: true, tangerine: true, blackPig: true, gochugaru: true, aromaticsKr: true, grill: true, dolsot: true, gwangjang: true, pojangmacha: true, "stall-gimbap": true, tomato: true, pasta: true, olive: true, cheese: true, basil: true, italyBeef: true, italyChicken: true, mushrooms: true, lemon: true, seafood: true, oven: true, ragu: true, gelateria: true, bacaro: true, "stall-arancini": true, pastry: true, garlic: true, fish: true, chilli: true, pepper: true, jars: true, tofu: true, veg: true, mushroom: true, rice: true, wheat: true, cow: true, pig: true, chicken: true, aromatics: true, wok: true, claypot: true, griddle: true, prep: true, noodle: true, dumpling: true, hotpot: true, teahouse: true };

/** Which world object a "paired with" word points at, so every partner that exists in the world is clickable. */
const PARTNER_ALIASES: [RegExp, string][] = [
  [/sichuan pepper/i, "pepper"], [/chilli oil|chili|chilli/i, "chilli"], [/doubanjiang|bean paste|preserved|pickled|black bean/i, "jars"],
  [/tofu|soy ?bean/i, "tofu"], [/pork|belly/i, "pig"], [/beef/i, "cow"], [/chicken/i, "chicken"], [/\brice\b/i, "rice"],
  [/noodle|wheat|wrapper|pancake|dough/i, "wheat"], [/shiitake|mushroom/i, "mushroom"], [/cucumber|celery|potato|greens|cabbage|carrot/i, "veg"],
  [/cumin|star anise|five.spice|cassia|cinnamon|fennel/i, "spices"], [/fish|prawn|shrimp/i, "fish"],
  // Korea
  [/kimchi/i, "kimchi"], [/gochu|pepper flakes|ssamjang|chilli|chili/i, "gochugaru"], [/hanwoo|bulgogi|beef/i, "hanwoo"], [/pork|belly|samgyeopsal/i, "blackPig"], [/namul|spinach|sprout|lettuce|perilla|carrot|zucchini|vegetable/i, "namul"],
  [/tangerine|honey|tea/i, "tangerine"], [/\brice\b|\bbap\b/i, "riceKr"], [/garlic|scallion|sesame|soy|ginger|onion|doenjang/i, "aromaticsKr"], [/fish|seafood|anchovy|shrimp|squid|abalone/i, "seafoodKr"], [/grill|barbecue|charcoal/i, "grill"], [/\begg\b|yolk/i, "dolsot"],
  // Mediterranean
  [/tomato|cucumber|pepper|lettuce|red onion|oregano/i, "saladVeg"], [/feta|halloumi|yogurt|cheese|dill|honey/i, "feta"], [/olive|caper|oil/i, "olivesGr"], [/fish|prawn|shrimp|salmon|anchov/i, "fishMed"], [/orange|almond|cinnamon/i, "oranges"], [/cabbage|paprika|vinegar|black pepper/i, "cabbage"],
  [/chickpea|lentil|bean|couscous/i, "pulses"], [/ras el hanout|saffron|preserved lemon|cumin|harissa|apricot|garlic|lemon|rosemary/i, "spicesMed"], [/tea|mint/i, "mintTea"],
  // Middle East
  [/chickpea|tahini|hummus|falafel/i, "chickpeas"], [/lamb|chicken|yogurt|labneh|ayran/i, "lambYogurt"], [/parsley|mint|bulgur|herb|za'atar/i, "herbs"], [/olive|lemon/i, "oliveLemon"], [/date|almond|nut/i, "dates"],
  [/cumin|coriander|paprika|sumac|cinnamon|cardamom|spice|garlic/i, "spicesMe"], [/saffron|pomegranate|rosewater|walnut/i, "saffron"], [/pita|bread|lavash|egg|tomato/i, "taboon"], [/coffee/i, "coffee"], [/\brice\b/i, "pilaf"], [/pickle/i, "spit"],
  // Mexico
  [/corn|tortilla|masa|bean|tamale/i, "corn"], [/chilli|chili|jalapeño|habanero|chipotle|guajillo|ancho/i, "chilliesMx"], [/tomato|tomatillo|salsa/i, "tomatoMx"], [/avocado|guacamole/i, "avocado"],
  [/lime|onion|cilantro|cumin|oregano|garlic/i, "limes"], [/cacao|chocolate|cinnamon/i, "cacao"], [/beef|carne/i, "beefMx"], [/pork|carnitas|lard/i, "carnitas"], [/pineapple|achiote|orange/i, "trompo"], [/\brice\b|stock/i, "fonda"],
  // Italy
  [/tomato/i, "tomato"], [/pasta|lasagn|ragù|ragu/i, "pasta"], [/olive oil|olive/i, "olive"], [/parmesan|mozzarella|cheese|pecorino|ricotta|cream|butter/i, "cheese"],
  [/basil|pesto|herb|rosemary|parsley|oregano|pine nut/i, "basil"], [/beef|pork|salami|prosciutto|soffritto|mince/i, "italyBeef"], [/lemon|orange|citrus/i, "lemon"], [/mushroom|porcini/i, "mushrooms"],
  [/clam|seafood|sardine/i, "seafood"], [/pizza dough|dough|flour|yeast|bread/i, "dough"], [/risotto|\brice\b/i, "riceIt"], [/stock|saffron|white wine|red wine|wine/i, "ragu"],
  [/garlic|ginger|scallion|onion|cilantro|soy sauce|vinegar|sesame|sugar|wine|stock|pickled mustard/i, "garlic"],
];
function partnerObject(p: string, self: WorldObject, all: WorldObject[]): WorldObject | undefined {
  // the first alias whose object actually exists in this world wins, so "pork" is the pig in China and the black pig in Jeju
  for (const [re, id] of PARTNER_ALIASES) {
    if (!re.test(p)) continue;
    const obj = all.find((x) => x.id === id);
    if (obj && obj.id !== self.id) return obj;
  }
  return undefined;
}
const thumb = (r: EnrichedRecipe) => (r.imageUrl ? `style="background-image:url(${imageUrl(r.id)})"` : "");

function dishRows(recipes: EnrichedRecipe[]): string {
  return `<div class="dishes">${recipes.map((r) => `<button class="dish" data-recipe="${r.id}"><span class="th" ${thumb(r)}></span><span class="tx"><b>${esc(r.title)}</b><small>${r.zh ? `<span class="zh">${r.zh}</span> · ` : ""}${esc(minutesLabel(r))}${r.spice ? ` · ${"🌶️".repeat(r.spice)}` : ""}</small></span></button>`).join("")}</div>`;
}

export function mountUi(h: UiHandlers) {
  const el = card();
  el.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    if (t.closest(".close")) { h.onClose(); return; }
    const d = t.closest<HTMLElement>("[data-recipe]");
    if (d) { const r = current.recipes.find((x) => x.id === d.dataset.recipe); if (r) h.onOpenRecipe(r); return; }
    const o = t.closest<HTMLElement>("[data-object]");
    if (o) { h.onGoObject(objectById(o.dataset.object!)); return; }
  });

  const current: { recipes: EnrichedRecipe[] } = { recipes: [] };

  function showObject(o: WorldObject, recipes: EnrichedRecipe[], allObjects: WorldObject[]) {
    current.recipes = recipes;
    const kindLabel = { ingredient: "Ingredient", flavour: "Signature flavour", technique: "Technique", landmark: "Place", place: "Place", dish: "Dish" }[o.kind];
    const partnerObjs = (o.partners ?? []).map((p) => ({ p, obj: partnerObject(p, o, allObjects) }));
    el.className = "";
    el.innerHTML = `
      <button class="close" aria-label="Close">×</button>
      <div class="head">
        <div class="badge">${(() => { const img = snapshot(o.id in ICON_KEYS ? o.id : o.prop); return img ? `<img src="${img}" alt="">` : o.emoji; })()}</div>
        <div class="titles">
          <h2>${esc(o.name)}${o.zh ? `<span class="zh">${o.zh}</span>` : ""}</h2>
          <div class="kind">${o.emoji} ${kindLabel} · ${AREAS[o.area].name}</div>
        </div>
      </div>
      <p class="tagline">${esc(o.tagline)}</p>
      <p class="blurb">${esc(o.blurb)}</p>
      ${o.flavour ? `<h4>Flavour</h4><div class="chips">${o.flavour.map((f) => `<span class="chip fl">${esc(f)}</span>`).join("")}</div>` : ""}
      ${o.partners ? `<h4>Often paired with</h4><div class="chips">${partnerObjs.map(({ p, obj }) => obj ? `<button class="chip link" data-object="${obj.id}">${obj.emoji} ${esc(p)}</button>` : `<span class="chip">${esc(p)}</span>`).join("")}</div>` : ""}
      ${recipes.length ? `<h4>Appears in ${recipes.length} ${recipes.length === 1 ? "dish" : "dishes"} you cook</h4>${dishRows(recipes)}` : ""}
      ${recipes.length ? `<button class="explore" id="explore">Explore ${recipes.length === 1 ? "this dish" : `${recipes.length} dishes`} in the world →</button>` : ""}`;
    el.hidden = false;
    el.scrollTop = 0;
    el.querySelector("#explore")?.addEventListener("click", () => h.onExploreDishes(o, recipes));
  }

  function showRecipePreview(r: EnrichedRecipe) {
    current.recipes = [r];
    el.className = "preview";
    el.innerHTML = `
      <div class="photo" ${thumb(r)}><button class="close" aria-label="Close">×</button><span class="ribbon">📍 ${AREAS[r.area].name} · ${AREAS[r.area].zh}</span></div>
      <div class="inner">
        <h2>${esc(r.title)}${r.zh ? `<span class="zh">${r.zh}</span>` : ""}</h2>
        <div class="meta">
          <span>${r.spice ? "🌶️".repeat(r.spice) + " " + SPICE[r.spice] : "🌿 " + SPICE[0]}</span>
          <span>⏱ ${esc(minutesLabel(r))}</span>
          ${r.weeknight ? `<span>🥢 Weeknight friendly</span>` : ""}
          ${r.stars ? `<span>${"★".repeat(r.stars)}</span>` : ""}
          ${r.portions ? `<span>🍽 ${r.portions} portions</span>` : ""}
        </div>
        <div class="actions">
          <button class="explore" id="cook">Cook this</button>
          <button class="explore ghost" id="ingredients">Explore ingredients</button>
        </div>
        ${r.flavours.length ? `<h4>Main flavours</h4><div class="chips">${r.flavours.map((f) => `<span class="chip fl">${esc(f)}</span>`).join("")}</div>` : ""}
        <h4>Core ingredients</h4><div class="chips">${r.core.map((c) => `<span class="chip">${esc(c)}</span>`).join("")}</div>
      </div>`;
    el.hidden = false;
    el.scrollTop = 0;
    el.querySelector("#cook")!.addEventListener("click", () => h.onCook(r));
    el.querySelector("#ingredients")!.addEventListener("click", () => h.onExploreIngredients(r));
  }

  function showRegion(region: MapRegion, count: number, tourUrl: string) {
    current.recipes = [];
    el.className = "";
    el.innerHTML = `
      <button class="close" aria-label="Close">×</button>
      <div class="badge">${region.emoji[0]}</div>
      <span class="ribbon">Region · ${region.emoji.slice(1).join(" ")}</span>
      <h2>${esc(region.name)}</h2>
      <p class="tagline">${count ? `${count} ${count === 1 ? "dish" : "dishes"} you cook come from here.` : "Nothing cooked from here yet."}</p>
      ${region.built
        ? `<p class="blurb">The only region built so far. Mountains, a river, a village and every Chinese dish in the cookbook.</p><button class="explore" id="enter">Enter ${esc(region.name)} →</button>`
        : `<p class="blurb">This region isn't built yet. Its dishes live on the <a href="${tourUrl}" style="color:inherit">island map</a> for now.</p>`}`;
    el.hidden = false;
    el.querySelector("#enter")?.addEventListener("click", () => h.onEnterRegion(region));
  }

  function hide() { el.hidden = true; }

  return { showObject, showRecipePreview, showRegion, hide, get open() { return !el.hidden; } };
}

// ---------- full recipe page ----------

const AROMATIC = /garlic|ginger|scallion|spring onion|green onion|shallot|onion|cilantro|coriander|leek|chilli|chili|pepper(corn)?s?\b|star anise|cinnamon|bay/i;
const SAUCE = /soy|vinegar|sugar|wine|shaoxing|stock|broth|oil\b|sesame|doubanjiang|bean paste|paste|starch|cornflour|cornstarch|salt|water|honey|sauce|msg|five.spice|powder/i;

function groupIngredients(list: string[]): { title: string; items: string[] }[] {
  const groups = { Main: [] as string[], Aromatics: [] as string[], "Sauce & seasoning": [] as string[] };
  for (const item of list) {
    if (AROMATIC.test(item) && !/bell pepper|red pepper/i.test(item)) groups.Aromatics.push(item);
    else if (SAUCE.test(item)) groups["Sauce & seasoning"].push(item);
    else groups.Main.push(item);
  }
  return Object.entries(groups).filter(([, items]) => items.length).map(([title, items]) => ({ title, items }));
}

export async function showRecipePage(r: EnrichedRecipe, onBack: () => void) {
  const page = document.getElementById("recipe")!;
  page.hidden = false;
  page.scrollTop = 0;
  const facts = [
    r.prepMin != null ? [`${r.prepMin} min`, "prep"] : null,
    r.cookMin != null ? [`${r.cookMin} min`, "cooking"] : null,
    r.prepMin == null && r.cookMin == null && r.totalMin != null ? [`${r.totalMin} min`, "total"] : null,
    [r.effort ?? "—", "difficulty"],
    [r.portions ? String(r.portions) : "—", "servings"],
    [r.spice ? "🌶️".repeat(r.spice) : "mild", "heat"],
  ].filter(Boolean) as string[][];
  page.innerHTML = `
    <div class="hero" ${r.imageUrl ? `style="background-image:url(${imageUrl(r.id)})"` : ""}>
      <button class="back">← Back to the world</button>
      <div class="title">
        <div class="where">📍 ${AREAS[r.area].name} · ${r.cuisine ?? "Chinese"}</div>
        <h1>${esc(r.title)}</h1>
        ${r.zh ? `<div class="zh">${r.zh}</div>` : ""}
      </div>
    </div>
    <div class="facts">${facts.map(([b, s]) => `<div><b>${esc(b)}</b><span>${s}</span></div>`).join("")}</div>
    <div class="cols">
      <div><h3>Ingredients</h3><div id="ing"><p class="note">Loading from Notion…</p></div>
        ${r.flavours.length ? `<h3 style="margin-top:26px">Flavours</h3><div class="chips">${r.flavours.map((f) => `<span class="chip fl">${esc(f)}</span>`).join("")}</div>` : ""}
      </div>
      <div><h3>Method</h3><div id="steps"><p class="note">Loading…</p></div>
        <div class="extras">
          <div><a href="${esc(r.notionUrl)}" target="_blank" rel="noopener">Open in Notion ↗</a>${r.sourceUrl ? `<a href="${esc(r.sourceUrl)}" target="_blank" rel="noopener">Original source ↗</a>` : ""}</div>
          <p class="note">Nutrition, substitutions and make-ahead notes will appear here once they live on the Notion page.</p>
        </div>
      </div>
    </div>`;
  page.querySelector(".back")!.addEventListener("click", () => { page.hidden = true; onBack(); });
  let body: RecipeBody;
  try { body = await fetchBody(r.id); } catch { page.querySelector("#ing")!.innerHTML = `<p class="note">Couldn't load the recipe page.</p>`; return; }
  if (page.hidden) return;
  const notionGroups = (body.groups ?? []).filter((g) => g.items.length);
  const groups = notionGroups.some((g) => g.title) ? notionGroups.map((g) => ({ title: g.title || "Also", items: g.items })) : groupIngredients(body.ingredients);
  page.querySelector("#ing")!.innerHTML = groups.length
    ? groups.map((g) => `${groups.length > 1 ? `<h5>${g.title}</h5>` : ""}<ul class="ing">${g.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`).join("")
    : `<p class="note">No ingredient list on the Notion page yet.</p>`;
  page.querySelector("#steps")!.innerHTML = body.steps.length
    ? `<ol class="steps">${body.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>`
    : `<p class="note">No steps on the Notion page yet.</p>`;
}

// ---------- crumbs, hint, toast ----------

export function setCrumbs(parts: { label: string; onClick?: () => void }[], areas?: { current: Area | null; areas: Area[]; onPick: (a: Area | null) => void }) {
  const nav = document.getElementById("crumbs")!;
  nav.hidden = false;
  nav.innerHTML = parts.map((p, i) => `${i ? `<span class="sep">›</span>` : ""}${p.onClick ? `<button data-i="${i}">${esc(p.label)}</button>` : `<span class="here">${esc(p.label)}</span>`}`).join("")
    + (areas ? `<span class="areas">${areas.areas.map((a) => `<button data-area="${a}" class="${areas.current === a ? "on" : ""}">${AREAS[a].name}<span class="zh">${AREAS[a].zh}</span></button>`).join("")}</span>` : "");
  nav.querySelectorAll<HTMLButtonElement>("button[data-i]").forEach((b) => b.addEventListener("click", () => parts[Number(b.dataset.i)].onClick?.()));
  nav.querySelectorAll<HTMLButtonElement>("button[data-area]").forEach((b) => b.addEventListener("click", () => areas?.onPick(areas.current === b.dataset.area ? null : (b.dataset.area as Area))));
}

let hintTimer: number | undefined;
export function hint(text: string, ms = 7000) {
  const el = document.getElementById("hint")!;
  el.hidden = false; el.textContent = text; el.classList.remove("fade");
  clearTimeout(hintTimer);
  hintTimer = window.setTimeout(() => el.classList.add("fade"), ms);
}

export function toast(message: string, kind: "ok" | "err" = "ok", ms = 2600) {
  const el = document.createElement("div");
  el.className = `toast${kind === "err" ? " err" : ""}`;
  el.textContent = message;
  document.getElementById("toasts")!.appendChild(el);
  setTimeout(() => { el.style.opacity = "0"; el.style.transition = "opacity .3s"; setTimeout(() => el.remove(), 300); }, ms);
}
