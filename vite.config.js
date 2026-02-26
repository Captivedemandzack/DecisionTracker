import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

// Write a version.json into public/ at build time so the app can detect
// stale cached versions at runtime and auto-reload.
function writeVersionPlugin() {
  return {
    name: "write-version",
    buildStart() {
      const version = { v: Date.now() };
      fs.writeFileSync(
        path.resolve(__dirname, "public/version.json"),
        JSON.stringify(version)
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), writeVersionPlugin()],
  build: {
    // Explicitly content-hash every output file so stale CDN/browser caches
    // can never accidentally serve old code after a deploy.
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
});
