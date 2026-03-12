import i18n from "i18next";
import languageDetector from "i18next-browser-languagedetector";
import httpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

export const LANGUAGES = {
  ENGLISH: "en",
  FRENCH: "fr",
} as const;

const NAMESPACES = ["translations"];

i18n
  /** Passes i18n down to react-i18next */
  .use(initReactI18next)
  /**
   * Language detection plugin used to detect user language in the browser.
   * By default, it uses localStorage with i18nextLang key.
   * https://www.i18next.com/overview/plugins-and-utils#language-detector
   * https://github.com/i18next/i18next-browser-languageDetector
   * https://github.com/i18next/i18next-browser-languageDetector?tab=readme-ov-file#detector-options
   */
  .use(languageDetector)
  /**
   * Plugin to serve translations via http request on the CDN public files.
   * Options are set in init -> options.backend.
   * https://www.i18next.com/overview/plugins-and-utils#backends
   * https://github.com/i18next/i18next-http-backend
   */
  .use(httpBackend)
  .init({
    /**
     * https://github.com/i18next/i18next-http-backend?tab=readme-ov-file#backend-options
     */
    backend: {
      /** Allow cross domain requests => used for XmlHttpRequest */
      crossDomain: false,
      loadPath: "/locales/{{lng}}/{{ns}}.json",
      /** OverrideMimeType sets request.overrideMimeType("application/json") => used for XmlHttpRequest */
      overrideMimeType: false,
      /** Used for fetch, can also be a function (payload) => ({ method: 'GET' }) */
      requestOptions: {
        cache: "default",
        credentials: "same-origin",
        method: "GET",
        mode: "cors",
      },
      /** Allow credentials on cross domain requests => used for XmlHttpRequest */
      withCredentials: false,
    },

    fallbackLng: LANGUAGES.FRENCH,

    interpolation: {
      /** react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape */
      escapeValue: false,
    },
    /** Avoid loading en-US or en-GB when loading en */
    load: "languageOnly",

    /** Name of the JSON files - Single namespace to start with */
    ns: NAMESPACES,
    supportedLngs: Object.values(LANGUAGES),
  });

i18n.on("languageChanged", (lng) => {
  /** @todo Update Intl Locale */
  console.log("Language changed to ", lng);
});

export default i18n;
