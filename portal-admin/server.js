import { fileURLToPath } from "node:url";
import { startPortalServer } from "@canop/auth-portals/server";

startPortalServer({
  service: "authenticator-portal-admin",
  port: Number(process.env.PORT ?? 5174),
  gatewayUrl: process.env.GATEWAY_URL ?? "http://localhost:8080",
  distDir: fileURLToPath(new URL("./dist", import.meta.url)),
  securityHeaders: true,
});
