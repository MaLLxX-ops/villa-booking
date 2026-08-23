import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

const messagesMap = {
  id: () => import("../messages/id.json"),
  en: () => import("../messages/en.json"),
  fr: () => import("../messages/fr.json"),
  zh: () => import("../messages/zh.json"),
  ja: () => import("../messages/ja.json"),
  ko: () => import("../messages/ko.json"),
};

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  const loader =
    messagesMap[locale as keyof typeof messagesMap] || messagesMap.id;
  const messages = (await loader()).default;

  return {
    locale,
    messages,
  };
});
