import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const AUTH_API_URL = "http://127.0.0.1:8090";

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
    port: 5174,
    strictPort: true,
    proxy: {
      "/api/auth": {
        target: AUTH_API_URL,
        rewrite: (path) => path.replace(/^\/api\/auth/, ""),
      },
      "/api/admin": {
        target: AUTH_API_URL,
        rewrite: (path) => path.replace(/^\/api\/admin/, ""),
      },
    },
  },
});
