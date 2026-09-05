import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  server: {
    proxy: { "/api": "http://localhost:5181" },
  },
  build: {
    target: "es2022",
    sourcemap: false,
    rolldownOptions: {
      input: {
        tour: resolve(__dirname, "index.html"),
        world: resolve(__dirname, "world.html"),
      },
    },
  },
});
