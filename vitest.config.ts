import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "happy-dom",

    globals: true,

    setupFiles: ["./vitest.setup.ts"],

    include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],

    exclude: ["node_modules", "dist", ".idea", ".git", ".cache"],
  },
});
