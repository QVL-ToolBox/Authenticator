import { createAuthApp } from "@canop/auth-portals";
import "@canop/ui/styles.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { authPortalConfig } from "./config";

const AuthApp = createAuthApp(authPortalConfig);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthApp />
  </StrictMode>,
);
