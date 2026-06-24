// import the original type declarations
import "i18next";

import type all4trees from "./translations/fr/all4trees.json";
import type common from "./translations/fr/common.json";
import type seed from "./translations/fr/seed.json";

// import namespace2 from "./translations/fr/namespace2.json"

declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: "common";
    // custom resources type
    resources: {
      all4trees: typeof all4trees;
      common: typeof common;
      seed: typeof seed;
    };
  }
}
