import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["e2e/**", "node_modules/**", ".next/**"],
    environment: "jsdom",
    globals: true,
  },
});
