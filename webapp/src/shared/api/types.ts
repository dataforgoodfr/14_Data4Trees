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

/**
 * The "not provided" option of a calculation filter: the codes it stands for
 * and, when `include_null` is true, rows where the column is null.
 */
export type CalculationFilterMissing = {
  values: string[];
  include_null: boolean;
} & {
  [K in `label::${Language}`]: string;
};

type CalculationFilterLeaf = {
  kind: "values" | "range";
  /** Raw `enquete_menage` column. */
  property_name: string;
  /** Every choice of the form list, in order, whatever the data. */
  values: Array<FilterOption<string>>;
  missing: CalculationFilterMissing | null;
};

/**
 * `GET /maps/get-calculation-filters/`, built by
 * `backend/maps/services/calculation_filters.py`. `filters` keys come in
 * display order.
 */
export type CalculationFilters = {
  layer_id: string;
  filters: Record<string, CalculationFilterLeaf>;
};
