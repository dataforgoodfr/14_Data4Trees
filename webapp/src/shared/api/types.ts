import type { LANGUAGES } from "@shared/i18n";

type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];

/**
 * One value a filter can take, labelled backend-side from the layer's label
 * table (`for_label`, `bio_label`, `hh_label`), per project.
 *
 * A label falls back to the raw value when the table has no row for it, so it
 * keeps the value's type (e.g. `cohort` labels are numbers).
 */
export type FilterOption<T> = { value: T } & {
  [K in `label::${Language}`]: T | string;
};

type FilterLeaf<T> = {
  property_name: string;
  values: Array<FilterOption<T>>;
};

export type Filters = {
  project: {
    inventaire_for: FilterLeaf<string>;
    inventaire_bio: FilterLeaf<string>;
    /** Served as `proj`: `groupby` keeps the source column name. */
    enquete: FilterLeaf<string>;
  };
  loc1: {
    inventaire_for: FilterLeaf<number>;
    inventaire_bio: FilterLeaf<number>;
    enquete: FilterLeaf<string>;
  };
  loc2: {
    inventaire_for: FilterLeaf<number>;
    inventaire_bio: FilterLeaf<number>;
    enquete: FilterLeaf<string>;
  };
  type: {
    inventaire_for: FilterLeaf<string>;
    inventaire_bio: FilterLeaf<string>;
  };
  cohort: {
    inventaire_for: FilterLeaf<number>;
    inventaire_bio: FilterLeaf<number>;
  };
  ecos: {
    inventaire_for: FilterLeaf<number>;
    inventaire_bio: FilterLeaf<number>;
  };
  year: {
    inventaire_for: FilterLeaf<string>;
    inventaire_bio: FilterLeaf<string>;
    enquete: FilterLeaf<string>;
  };
};

export type APIError = {
  status: number;
  message: string;
  cause: string;
};
