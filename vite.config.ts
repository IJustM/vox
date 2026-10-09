/// <reference types="vitest/config" />

import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { playwright } from "@vitest/browser-playwright";
import { shikiHighlight } from "./playground/vite-plugin-shiki.ts";

const playgroundSource = fileURLToPath(new URL("playground/src", import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss(), shikiHighlight()],
  resolve: {
    alias: {
      "@": playgroundSource,
    },
  },
  test: {
    browser: {
      enabled: true,
      headless: true,
      instances: [{ browser: "chromium" }],
      provider: playwright(),
    },
    include: ["src/**/*.test.{ts,tsx}", "playground/**/*.test.{ts,tsx}"],
    root: ".",
  },
});
