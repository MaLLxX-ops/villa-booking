import { routing } from "@/i18n/routing";

export const SITE_URL = "https://stayvilla-booking.vercel.app";

export function localizedPath(locale: string, path = "") {
  const normalizedPath = path ? `/${path.replace(/^\//, "")}` : "";
  return locale === routing.defaultLocale
    ? `${SITE_URL}${normalizedPath || "/"}`
    : `${SITE_URL}/${locale}${normalizedPath}`;
}

export function alternateLanguages(path = "") {
  return Object.fromEntries(
    routing.locales.map((locale) => [locale, localizedPath(locale, path)])
  );
}