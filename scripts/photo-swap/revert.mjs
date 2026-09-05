// Usage: node revert.mjs   restores the original Image URL and cover from originals.json (written before the swap)
import { readFileSync } from "node:fs";
const env = Object.fromEntries(readFileSync("/Users/yingyingfu/Projects/fyying/food-tour/.env","utf8").split("\n").filter(l=>l.includes("=")&&!l.startsWith("#")).map(l=>{const i=l.indexOf("=");return [l.slice(0,i).trim(), l.slice(i+1).trim()];}));
const H = { Authorization:`Bearer ${env.NOTION_TOKEN}`, "Notion-Version":"2022-06-28", "Content-Type":"application/json" };
const originals = JSON.parse(readFileSync(new URL("./originals.json", import.meta.url),"utf8"));
for (const t of originals) {
  const body = { properties: { "Image URL": { url: t.imageUrl ?? null } } };
  if (t.replaceCover) body.cover = t.cover && !t.cover.startsWith("data:") ? { type: "external", external: { url: t.cover } } : null;
  const r = await fetch(`https://api.notion.com/v1/pages/${t.id}`, { method: "PATCH", headers: H, body: JSON.stringify(body) });
  console.log(r.ok ? "OK  " : "FAIL", t.name);
  await new Promise(r => setTimeout(r, 350));
}
