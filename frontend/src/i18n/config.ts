import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import pl from "./pl.json";
import en from "./en.json";
import de from "./de.json";

const resources = {
  pl: { translation: pl },
  en: { translation: en },
  de: { translation: de },
};

const defaultLanguage = "pl";
const languageStorageKey = "language";
const supportedLanguages = Object.keys(resources);

const getInitialLanguage = () => {
  if (typeof window === "undefined") return defaultLanguage;

  const storedLanguage = window.localStorage.getItem(languageStorageKey);

  return storedLanguage && supportedLanguages.includes(storedLanguage)
    ? storedLanguage
    : defaultLanguage;
};

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: defaultLanguage,
  interpolation: {
    escapeValue: false,
  },
});

i18n.on("languageChanged", (language) => {
  if (typeof window !== "undefined" && supportedLanguages.includes(language)) {
    window.localStorage.setItem(languageStorageKey, language);
  }
});

export default i18n;
