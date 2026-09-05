import { defineConfig } from "vite";
import { resolve } from "node:path";

// GitHub Pages build: Food World only, served under /<repo>/ with exported static data.
export default defineConfig({
  base: process.env.PAGES_BASE ?? "/food-world/",
  define: { "import.meta.env.VITE_STATIC": JSON.stringify("1") },
  build: {
    target: "es2022",
    outDir: "dist-pages",
    rolldownOptions: { input: { index: resolve(__dirname, "world.html") } },
  },
});
