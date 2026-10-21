import { fileURLToPath } from "node:url";
import { startPortalServer } from "@canop/auth-portals/server";

startPortalServer({
  service: "authenticator-portal-auth",
  port: Number(process.env.PORT ?? 5173),
  gatewayUrl: process.env.GATEWAY_URL ?? "http://localhost:8080",
  distDir: fileURLToPath(new URL("./dist", import.meta.url)),
  securityHeaders: true,
});
