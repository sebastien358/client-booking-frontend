import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@stores": fileURLToPath(new URL("./src/stores", import.meta.url)),
      "@features": fileURLToPath(new URL("./src/features", import.meta.url)),
      "@templates": fileURLToPath(new URL("./src/templates", import.meta.url)),
      "@shared": fileURLToPath(new URL("./src/shared", import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ["fsevents"],
  },
  build: {
    rollupOptions: {
      external: ["fsevents"],
    },
  },
});
