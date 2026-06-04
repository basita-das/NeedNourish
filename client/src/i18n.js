import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import hi from "./locales/hi.json";
import bn from "./locales/bn.json";
import kn from "./locales/kn.json";
import ta from "./locales/ta.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // <--- THIS IS THE CRITICAL LINE
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      bn: { translation: bn },
      kn: { translation: kn },
      ta: { translation: ta },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "hi", "bn", "kn", "ta"],
    interpolation: { escapeValue: false },
  });

export default i18n;
