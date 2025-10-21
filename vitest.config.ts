import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const rootDir = resolve(fileURLToPath(new URL("./", import.meta.url)));

export default defineConfig({
  resolve: {
    alias: {
      "@": rootDir,
    },
  },
  test: {
    include: ["**/*.test.{js,jsx,ts,tsx}", "**/*.spec.{js,jsx,ts,tsx}"],
    exclude: ["tests/performance/**", "node_modules/**"],
    globals: true,
    environment: "jsdom",
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      reportsDirectory: "coverage",
      include: ["app/**/*.{ts,tsx,js,jsx}", "components/**/*.{ts,tsx,js,jsx}", "hooks/**/*.{ts,tsx,js,jsx}", "lib/**/*.{ts,tsx,js,jsx}"],
      exclude: ["**/*.d.ts", "**/index.{ts,tsx,js,jsx}", "app/**/page.{ts,tsx,js,jsx}", "**/*.stories.{ts,tsx,js,jsx}"]
    },
  },
});
