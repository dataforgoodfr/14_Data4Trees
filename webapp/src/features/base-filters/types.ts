import type { FilterOption as ApiFilterOption } from "@shared/api/types";

/** Value of a filterable GeoJSON property, in the type the API serves it. */
export type FilterValue = string | number;

/** A value offered by the API, with its label in every supported language. */
export type FilterOption = ApiFilterOption<FilterValue>;
