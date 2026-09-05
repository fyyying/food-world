// Food Tour API: reads recipes from Notion, caches photos, and talks to the meal planner.
import express from "express";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
loadEnv(join(root, ".env"));

const PORT = Number(process.env.API_PORT ?? 5181);
const NOTION_TOKEN = process.env.NOTION_TOKEN ?? "";
const NOTION_DB = normalizeUuid(process.env.NOTION_RECIPE_DATA_SOURCE_ID ?? "");
const PLANNER_URL = (process.env.PLANNER_URL ?? "").replace(/\/$/, "");
const DATA_DIR = join(root, ".data");
const IMAGE_DIR = join(DATA_DIR, "images");
const RECIPES_CACHE = join(DATA_DIR, "recipes.json");
const BODY_DIR = join(DATA_DIR, "bodies");
const RECIPE_TTL_MS = 10 * 60 * 1000;

for (const dir of [DATA_DIR, IMAGE_DIR, BODY_DIR]) mkdirSync(dir, { recursive: true });

const app = express();
app.use(express.json());

// ---------- Notion ----------

async function notion(path, init = {}) {
  if (!NOTION_TOKEN) throw new Error("NOTION_TOKEN missing in .env");
  const res = await fetch(`https://api.notion.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${NOTION_TOKEN}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`Notion ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res.json();
}

const plain = (rt) => (Array.isArray(rt) ? rt.map((t) => t.plain_text ?? "").join("") : undefined);

function prop(p) {
  if (!p) return undefined;
  switch (p.type) {
    case "title": return plain(p.title);
    case "rich_text": return plain(p.rich_text);
    case "number": return p.number ?? undefined;
    case "checkbox": return p.checkbox;
    case "select": return p.select?.name;
    case "status": return p.status?.name;
    case "multi_select": return p.multi_select?.map((o) => o.name) ?? [];
    case "url": return p.url ?? undefined;
    case "date": return p.date?.start ?? undefined;
    case "formula": return p.formula?.number ?? p.formula?.string ?? undefined;
    default: return undefined;
  }
}

function toRecipe(page) {
  const P = (name) => prop(page.properties?.[name]);
  const prep = P("Prep Time Min");
  const cook = P("Cook Time Min");
  const total = P("Total Time Min") ?? (prep != null || cook != null ? (prep ?? 0) + (cook ?? 0) : P("Preparation (minutes)"));
  const rating = P("Rating");
  return {
    id: page.id,
    title: P("Name") ?? "Untitled",
    cuisine: P("Cuisine") ?? null,
    course: P("Course") ?? null,
    mealType: P("Meal Type") ?? null,
    effort: P("Effort Level") ?? null,
    prepMin: prep ?? null,
    cookMin: cook ?? null,
    totalMin: total ?? null,
    stars: rating ? [...rating].filter((c) => c === "⭐").length : 0,
    liked: P("Liked Score") ?? 0,
    timesCooked: P("Times Cooked") ?? 0,
    lastCooked: P("Last Cooked At") ?? null,
    mainIngredient: P("Main Ingredient") ?? [],
    protein: P("Protein Sources") ?? [],
    tags: P("Tags") ?? [],
    portions: P("Portions") ?? null,
    carb: P("Carb Level") ?? null,
    proteinScore: P("Protein Score") ?? null,
    method: P("Cooking Method") ?? null,
    imageUrl: P("Image URL") ?? null,
    sourceUrl: P("URL") ?? null,
    notionUrl: page.url,
  };
}

let recipeMemo = null;

async function loadRecipes(force = false) {
  if (!force && recipeMemo && Date.now() - recipeMemo.fetchedAt < RECIPE_TTL_MS) return recipeMemo;
  if (!force && !recipeMemo && existsSync(RECIPES_CACHE)) {
    const cached = JSON.parse(readFileSync(RECIPES_CACHE, "utf8"));
    if (Date.now() - cached.fetchedAt < RECIPE_TTL_MS) return (recipeMemo = cached);
  }
  try {
    const results = [];
    let cursor;
    do {
      const body = { page_size: 100, filter: { property: "Active", checkbox: { equals: true } } };
      if (cursor) body.start_cursor = cursor;
      const page = await notion(`/v1/databases/${NOTION_DB}/query`, { method: "POST", body: JSON.stringify(body) });
      results.push(...page.results);
      cursor = page.has_more ? page.next_cursor : undefined;
    } while (cursor);
    recipeMemo = { fetchedAt: Date.now(), recipes: results.map(toRecipe) };
    writeFileSync(RECIPES_CACHE, JSON.stringify(recipeMemo));
    return recipeMemo;
  } catch (error) {
    // Serve a stale cache rather than an empty world when Notion is unreachable.
    if (existsSync(RECIPES_CACHE)) return (recipeMemo = { ...JSON.parse(readFileSync(RECIPES_CACHE, "utf8")), stale: true, error: String(error) });
    throw error;
  }
}

// dev helper: the browser posts a JPEG data URL of the 3D canvas and it lands in .data/shots/<name>.jpg
app.post("/api/debug/shot", express.text({ limit: "40mb", type: "*/*" }), async (req, res) => {
  const name = String(req.query.name ?? "shot").replace(/[^a-z0-9_-]/gi, "_");
  const m = /^data:image\/jpeg;base64,(.+)$/.exec(req.body ?? "");
  if (!m) return res.status(400).json({ error: "expected a jpeg data url" });
  const { mkdirSync, writeFileSync } = await import("node:fs");
  mkdirSync(".data/shots", { recursive: true });
  writeFileSync(`.data/shots/${name}.jpg`, Buffer.from(m[1], "base64"));
  res.json({ ok: true, file: `.data/shots/${name}.jpg` });
});

app.get("/api/recipes", async (req, res) => {
  try {
    const data = await loadRecipes(req.query.refresh === "1");
    res.json({ recipes: data.recipes, fetchedAt: data.fetchedAt, stale: Boolean(data.stale) });
  } catch (error) {
    res.status(502).json({ error: String(error) });
  }
});

// Ingredients & steps live in the page body; fetched on demand (one level of nesting) and cached per page.
async function fetchBlocks(id, depth = 0) {
  const blocks = [];
  let cursor;
  do {
    const page = await notion(`/v1/blocks/${id}/children?page_size=100${cursor ? `&start_cursor=${cursor}` : ""}`);
    for (const b of page.results) {
      const content = b[b.type];
      const text = plain(content?.rich_text)?.trim() ?? "";
      const block = { type: b.type, text, children: [] };
      if (b.has_children && depth < 1 && b.type !== "child_page") block.children = await fetchBlocks(b.id, depth + 1);
      if (text || block.children.length) blocks.push(block);
    }
    cursor = page.has_more ? page.next_cursor : undefined;
  } while (cursor);
  return blocks;
}

app.get("/api/recipes/:id/body", async (req, res) => {
  const id = normalizeUuid(req.params.id);
  const file = join(BODY_DIR, `${id}.json`);
  if (existsSync(file)) {
    const cached = JSON.parse(readFileSync(file, "utf8"));
    if (cached.groups) return res.json(cached);
  }
  try {
    const body = sectionize(await fetchBlocks(id));
    writeFileSync(file, JSON.stringify(body));
    res.json(body);
  } catch (error) {
    res.status(502).json({ error: String(error) });
  }
});

/**
 * Turn the page's blocks into ingredients (flat + grouped), steps and notes.
 * A bullet with children under "Ingredients" is a group heading ("Sauce", "Aromatics"...).
 */
function sectionize(blocks) {
  const out = { ingredients: [], groups: [], steps: [], notes: [] };
  let bucket = "notes";
  let loose = null; // ungrouped ingredients collected as their own group
  const isList = (t) => t === "bulleted_list_item" || t === "to_do" || t === "numbered_list_item";
  for (const b of blocks) {
    if (/^heading/.test(b.type)) {
      const h = b.text.toLowerCase();
      if (/ingredient/.test(h)) { bucket = "ingredients"; loose = null; }
      else if (/instruction|step|method|direction|preparation|procedure/.test(h)) bucket = "steps";
      else if (/note|tip|serve|storage|nutrition|source/.test(h)) bucket = "notes";
      else if (bucket === "ingredients") loose = { title: b.text.replace(/:$/, ""), items: [] }, out.groups.push(loose); // sub-heading = group
      // any other sub-heading keeps the current bucket
      continue;
    }
    if (bucket === "ingredients" && b.type === "paragraph" && !b.children.length && b.text && b.text.length < 40) {
      loose = { title: b.text.replace(/:$/, ""), items: [] };
      out.groups.push(loose);
      continue;
    }
    if (b.type === "callout" || (b.type === "paragraph" && /^source:/i.test(b.text))) continue;
    // an unlabelled page: bullets are ingredients, numbers are steps
    const effective = bucket === "notes" && isList(b.type) ? (b.type === "numbered_list_item" ? "steps" : "ingredients") : bucket;
    if (effective === "ingredients") {
      if (b.children.length) {
        const items = b.children.map((c) => c.text).filter(Boolean);
        out.groups.push({ title: b.text, items });
        out.ingredients.push(...items);
      } else if (b.text) {
        if (!loose) { loose = { title: "", items: [] }; out.groups.push(loose); }
        loose.items.push(b.text);
        out.ingredients.push(b.text);
      }
    } else if (effective === "steps") {
      const step = [b.text, ...b.children.map((c) => c.text)].filter(Boolean).join(" ");
      if (step) out.steps.push(step);
    } else if (b.text) {
      out.notes.push(b.text);
    }
  }
  return out;
}

// ---------- Photos ----------

const TYPES = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif" };

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}

app.get("/api/image/:id", async (req, res) => {
  const data = await loadRecipes().catch(() => recipeMemo);
  const recipe = data?.recipes.find((r) => r.id === req.params.id);
  if (!recipe?.imageUrl) return res.status(404).end();
  const key = `${recipe.id}-${hash(recipe.imageUrl)}`;
  for (const ext of Object.keys(TYPES)) {
    const file = join(IMAGE_DIR, `${key}.${ext}`);
    if (existsSync(file)) return send(res, readFileSync(file), ext);
  }
  try {
    const upstream = await fetch(recipe.imageUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126.0 Safari/537.36", Accept: "image/*,*/*;q=0.8" },
      signal: AbortSignal.timeout(15000),
    });
    const type = upstream.headers.get("content-type") ?? "";
    if (!upstream.ok || !type.startsWith("image/")) return res.status(502).end();
    const ext = type.includes("png") ? "png" : type.includes("webp") ? "webp" : type.includes("gif") ? "gif" : "jpg";
    const buf = Buffer.from(await upstream.arrayBuffer());
    writeFileSync(join(IMAGE_DIR, `${key}.${ext}`), buf);
    send(res, buf, ext);
  } catch {
    res.status(502).end();
  }
});

function send(res, buf, ext) {
  res.set("Content-Type", TYPES[ext]).set("Cache-Control", "public, max-age=31536000, immutable").send(buf);
}

// ---------- Meal planner ----------

async function planner(path, init = {}) {
  if (!PLANNER_URL) throw new Error("PLANNER_URL not configured");
  const res = await fetch(`${PLANNER_URL}/api${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
    signal: AbortSignal.timeout(12000),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error ?? `Planner ${res.status}`);
  return body;
}

app.get("/api/plan", async (_req, res) => {
  if (!PLANNER_URL) return res.json({ online: false, reason: "not configured" });
  try {
    const { plan } = await planner("/plans/current");
    res.json({ online: true, plan, plannerUrl: PLANNER_URL });
  } catch (error) {
    res.json({ online: false, reason: String(error.message ?? error) });
  }
});

// Put a recipe on a day: swap into an existing slot, or add a slot first.
app.post("/api/plan/assign", async (req, res) => {
  const { planId, slotId, day, recipeId } = req.body ?? {};
  try {
    let target = slotId;
    if (!target) {
      const { slot } = await planner(`/plans/${planId}/slots`, { method: "POST", body: JSON.stringify({ day }) });
      target = slot.id;
    }
    const { slot } = await planner(`/meals/${target}/swap`, { method: "POST", body: JSON.stringify({ recipeId }) });
    res.json({ slot });
  } catch (error) {
    res.status(502).json({ error: String(error.message ?? error) });
  }
});

app.post("/api/plan/remove", async (req, res) => {
  const { planId, slotId } = req.body ?? {};
  try {
    await planner(`/plans/${planId}/slots`, { method: "DELETE", body: JSON.stringify({ slotId }) });
    res.json({ ok: true });
  } catch (error) {
    res.status(502).json({ error: String(error.message ?? error) });
  }
});

// ---------- Static (production) ----------

if (process.env.NODE_ENV === "production") {
  const dist = join(root, "dist");
  app.use(express.static(dist));
  app.get(["/world", "/world/*"], (_req, res) => res.sendFile(join(dist, "world.html")));
  app.get("*", (_req, res) => res.sendFile(join(dist, "index.html")));
}

app.listen(PORT, () => console.log(`food-tour api on http://localhost:${PORT}${PLANNER_URL ? ` → planner ${PLANNER_URL}` : " (standalone)"}`));

// ---------- helpers ----------

function loadEnv(file) {
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

function normalizeUuid(value) {
  const hex = value.replace(/-/g, "").match(/[0-9a-f]{32}/i)?.[0];
  if (!hex) return value;
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
