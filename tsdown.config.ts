import { defineConfig } from "tsdown";

export default defineConfig({
  deps: {
    neverBundle: ["react"],
  },
  dts: true,
  exports: true,
  platform: "neutral",
});
