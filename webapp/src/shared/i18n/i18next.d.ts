// import the original type declarations
import "i18next";

import type common from "./translations/fr/common.json";
import type seed from "./translations/fr/seed.json";
import type translations from "./translations/fr/translations.json";

// import namespace2 from "./translations/fr/namespace2.json"

declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: "translations";
    // custom resources type
    resources: {
      translations: typeof translations;
      common: typeof common;
      seed: typeof seed;
    };
  }
}
