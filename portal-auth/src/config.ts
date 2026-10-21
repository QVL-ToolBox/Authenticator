import { AuthBrandLayout, type AuthPortalConfig } from "@canop/auth-portals";
import { Icon } from "@canop/ui";
import { createElement } from "react";

const trustedOrigins = (
  import.meta.env.VITE_TRUSTED_REDIRECT_ORIGINS ?? "http://localhost:5174"
).split(",");

export const authPortalConfig: AuthPortalConfig = {
  appName: "My Product",
  terms: { version: "v1", effectiveDate: "2026-10-19" },
  branding: {
    logo: createElement(Icon, { name: "home", variant: "solid", color: "accent", size: "lg" }),
    theme: { defaultMode: "system", storageKey: "my-product-theme" },
    layout: AuthBrandLayout,
  },
  messages: { fr: {}, en: {} },
  redirect: { trustedOrigins, cookieName: "app_redirect" },
};
