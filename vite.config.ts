import { URL, fileURLToPath } from "node:url";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { oidcSpa } from "oidc-spa/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), oidcSpa()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
