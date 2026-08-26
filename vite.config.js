import { defineConfig } from "vite";

export default defineConfig({
  base: "/battleship-game/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
});
