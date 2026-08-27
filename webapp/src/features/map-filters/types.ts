/** Value of a filterable GeoJSON property, in the type the API serves it. */
export type FilterValue = string | number;

export const FILTER_KINDS = {
  RANGE: "range",
  VALUES: "values",
} as const;

export type FilterKind = (typeof FILTER_KINDS)[keyof typeof FILTER_KINDS];

/**
 * A "pick from a list" filter — one checkbox group. The selected values are
 * ORed together.
 */
export type ValuesFilter = {
  kind: typeof FILTER_KINDS.VALUES;
  /** GeoJSON property to filter on (`property_name` from the API payload). */
  propertyName: string;
  /** Selected values only. An empty array hides every feature. */
  values: FilterValue[];
};

/**
 * Bound of a {@link RangeFilter}. Strings are for dates: MapLibre expressions
 * have no date type, so a date lives in the feature as an ISO-8601 string or as
 * an epoch number, and both compare correctly (see `buildFilterClause`).
 */
export type RangeBound = string | number;

/**
 * A "between two bounds" filter — dates, scores, tree counts… Both bounds are
 * inclusive and optional, so an open-ended range is just one of them.
 *
 * Nothing renders this yet; it exists as the worked example for adding a kind.
 */
export type RangeFilter = {
  kind: typeof FILTER_KINDS.RANGE;
  propertyName: string;
  /** Inclusive lower bound. Omit for "no lower bound". */
  min?: RangeBound;
  /** Inclusive upper bound. Omit for "no upper bound". */
  max?: RangeBound;
};

/** Add new kinds to this union — `buildFilterClause` then stops compiling. */
export type LayerFilter = ValuesFilter | RangeFilter;

/**
 * Everything persisted for one layer, keyed by group ("project", "loc1", …).
 *
 * A group **absent** from the record restricts nothing, which is why first-time
 * visitors need no seeding: `{}` means "show everything". A group present with
 * an empty `values` is a deliberate "nothing selected".
 *
 * `propertyName` is stored alongside the selection on purpose: it lets the map
 * apply persisted filters on load without waiting for — or knowing about — the
 * `getFilters()` payload. See `refreshAllLayerFilters`.
 */
export type LayerFiltersState = Record<string, LayerFilter>;

/** A checkbox group as offered by the API, before the user touches it. */
export type FilterGroup = {
  /** Stable key, used in localStorage and to look the selection up. */
  key: string;
  propertyName: string;
  /** Every value the API offers, in API order. */
  values: FilterValue[];
};

/* -------------------------------------------------------------------------- */
/*                               Global filters                               */
/* -------------------------------------------------------------------------- */

/** Distributes over the union so each kind keeps its own fields. */
type OmitPropertyName<T> = T extends unknown ? Omit<T, "propertyName"> : never;

/**
 * A filter applied to every layer at once (year, …), persisted in its own
 * localStorage entry.
 *
 * Same kinds as a per-layer filter, except the property is resolved per layer:
 * the same concept is not exposed under the same name everywhere (`cohort` vs
 * `start_date`, `project` vs `proj`). A layer missing from `propertyNameByLayer`
 * does not expose the concept and is left unfiltered by this entry.
 */
export type GlobalFilter = OmitPropertyName<LayerFilter> & {
  propertyNameByLayer: Record<string, string>;
};

export type GlobalFiltersState = Record<string, GlobalFilter>;

/** A global checkbox group as offered by the API, before the user touches it. */
export type GlobalFilterGroup = {
  key: string;
  propertyNameByLayer: Record<string, string>;
  /** Union of every layer's values, deduplicated. */
  values: FilterValue[];
};
