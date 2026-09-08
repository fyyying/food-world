import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: { "/api": "http://localhost:5181" },
  },
  build: {
    target: "es2022",
    sourcemap: false,
  },
});
