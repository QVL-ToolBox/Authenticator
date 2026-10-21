import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: [
      "react",
      "react-dom",
      "react-router-dom",
      "@canop/ui",
      "@mui/material",
      "@emotion/react",
    ],
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      "/api/auth": {
        target: "http://127.0.0.1:8090",
        rewrite: (path) => path.replace(/^\/api\/auth/, ""),
      },
    },
  },
});
