import { AdminLayout, type AdminPortalConfig } from "@canop/auth-portals";

export const adminPortalConfig: AdminPortalConfig = {
  appName: "My Product",
  authPortalUrl: import.meta.env.VITE_AUTH_PORTAL_URL ?? "http://localhost:5173",
  branding: { theme: { defaultMode: "system", storageKey: "my-product-theme" } },
  adminLayout: AdminLayout,
  messages: {
    fr: { "auth.admin.portal.admin": "Administration", "auth.admin.portal.home": "Accueil" },
    en: { "auth.admin.portal.admin": "Administration", "auth.admin.portal.home": "Home" },
  },
  redirect: { cookieName: "app_redirect" },
};
