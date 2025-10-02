import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// import JSON files
import en from "./locales/en/translation.json";
import hi from "./locales/hi/translation.json";
import bn from "./locales/bn/translation.json";
import mr from "./locales/mr/translation.json";
import te from "./locales/te/translation.json";
import ta from "./locales/ta/translation.json";
import or from "./locales/or/translation.json"

i18n
  .use(LanguageDetector) // detects language (localStorage, navigator)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      bn: { translation: bn },
      mr: { translation: mr },
      te: { translation: te },
      ta: { translation: ta },
      or: { translation: or },
    },
    fallbackLng: "en",
    debug: true,
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
