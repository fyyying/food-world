// Exports what Food World needs into static files so it can be hosted on GitHub Pages without the API.
// Run with the API server up (npm run dev) — it reads through the same endpoints the app uses.
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const API = process.env.API_URL ?? "http://localhost:5181";
const OUT = join(process.cwd(), "public", "static");
mkdirSync(join(OUT, "bodies"), { recursive: true });
mkdirSync(join(OUT, "images"), { recursive: true });

const { recipes } = await fetch(`${API}/api/recipes?refresh=1`).then((r) => r.json());
const isChina = (r) => r.cuisine === "Chinese" || /mapo|sichuan|szechuan|hong shao/i.test(r.title) || r.cuisine === "Italian" || /italian|caprese|bolognese|lasagn|pizza|pesto/i.test(r.title) || r.cuisine === "Korean" || /korean|bulgogi|bibimbap|kimchi/i.test(r.title);
// full list for the world-map counts (no photo URLs leak), bodies and photos only for the China world
const slim = recipes.map((r) => ({ ...r, imageUrl: isChina(r) && r.imageUrl ? `static/images/${r.id}.jpg` : null }));
writeFileSync(join(OUT, "recipes.json"), JSON.stringify({ recipes: slim, fetchedAt: Date.now(), stale: false }));
let n = 0;
for (const r of recipes.filter(isChina)) {
  const body = await fetch(`${API}/api/recipes/${r.id}/body`).then((x) => x.json());
  writeFileSync(join(OUT, "bodies", `${r.id}.json`), JSON.stringify(body));
  if (r.imageUrl) {
    const res = await fetch(`${API}/api/image/${r.id}`);
    if (res.ok) { writeFileSync(join(OUT, "images", `${r.id}.jpg`), Buffer.from(await res.arrayBuffer())); n++; }
  }
}
console.log(`exported ${recipes.length} recipes, ${recipes.filter(isChina).length} China bodies, ${n} photos → ${OUT}`);
if (!existsSync(join(OUT, "recipes.json"))) process.exit(1);
