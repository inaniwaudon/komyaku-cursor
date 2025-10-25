// vite.config.js

import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    target: "esnext",
    lib: {
      entry: resolve(__dirname, "src/content/main.ts"),
      name: "DemoApp",
      formats: ["es"],
      fileName: () => `main.js`,
    },
    emptyOutDir: false,
  },
  root: resolve(__dirname, "demo"),
  server: {
    open: true,
  },
});
