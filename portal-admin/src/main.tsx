import { createAdminApp } from "@canop/auth-portals";
import "@canop/ui/styles.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { adminPortalConfig } from "./config";

const AdminApp = createAdminApp(adminPortalConfig);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AdminApp />
  </StrictMode>,
);
