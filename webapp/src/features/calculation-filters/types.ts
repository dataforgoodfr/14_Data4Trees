import type { FilterOption, FilterValue } from "@features/base-filters";

import type { CalculationFilterMissing } from "@shared/api/types";

export const CALCULATION_FILTER_KINDS = {
  RANGE: "range",
  VALUES: "values",
} as const;

export type CalculationFilterKind =
  (typeof CALCULATION_FILTER_KINDS)[keyof typeof CALCULATION_FILTER_KINDS];

/**
 * State of the "Non renseigné" checkbox, with what it stands for.
 *
 * `values` and `includeNull` are copied from the payload's `missing` when the
 * filter is written, so a reload can replay it without waiting for the
 * endpoint.
 */
export type MissingSelection = {
  checked: boolean;
  /** Codes meaning "not provided" (`98`, `99` for age). May be empty. */
  values: FilterValue[];
  /** Whether rows where the column is null count as "not provided". */
  includeNull: boolean;
};

/** A checkbox group. The selected values are ORed together. */
export type ValuesCalculationFilter = {
  kind: typeof CALCULATION_FILTER_KINDS.VALUES;
  /** Raw `enquete_menage` column (`property_name` from the payload). */
  propertyName: string;
  /** Selected values only. An empty array (and `missing` unchecked) matches nothing. */
  values: FilterValue[];
  /** Only on groups whose payload has a `missing` option. */
  missing?: MissingSelection;
};

/** A slider over ordered options. Both bounds are inclusive. */
export type RangeCalculationFilter = {
  kind: typeof CALCULATION_FILTER_KINDS.RANGE;
  propertyName: string;
  min: FilterValue;
  max: FilterValue;
  /**
   * Every option from `min` to `max`, resolved from the ordered options when
   * the filter is written, so a reload can replay it without the payload. The
   * filter compiles to `in [values]`: the columns are strings, so a `between`
   * would compare them lexicographically.
   */
  values: FilterValue[];
  missing?: MissingSelection;
};

export type CalculationFilter =
  | ValuesCalculationFilter
  | RangeCalculationFilter;

/**
 * The applied filters, keyed by group (`typ`, `coh`, …).
 *
 * Same rules as `map-filters`: a group **absent** restricts nothing, so a fresh
 * visitor has `{}`. A group where everything is selected is removed rather
 * than stored, so households with a null value stay included.
 */
export type CalculationFiltersState = Record<string, CalculationFilter>;

/** A group as offered by the endpoint, before the user touches it. */
export type CalculationFilterGroup = {
  /** Stable key, used in the state and for the title. */
  key: string;
  kind: CalculationFilterKind;
  propertyName: string;
  /** Every option of the form list, in order. */
  options: FilterOption[];
  missing: CalculationFilterMissing | null;
};

/**
 * What a group's widgets show: the checked options (a contiguous slice of the
 * options for a range) and the "Non renseigné" checkbox. `missing` is `true`
 * on groups without a missing option, so "everything selected" reads the same
 * for every group.
 */
export type GroupSelection = {
  values: FilterValue[];
  missing: boolean;
};
