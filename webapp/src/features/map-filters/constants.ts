/**
 * Filter group keys, shared by every layer.
 *
 * They are both the localStorage keys and the keys of the `getFilters()`
 * payload, so a group means the same thing across layers even when the
 * underlying property differs (`cohort` is served as `start_date` on
 * inventaire_bio, `project` as `proj` on enquete).
 */
export const GROUP_KEYS = {
  COHORT: "cohort",
  ECOS: "ecos",
  LOC1: "loc1",
  LOC2: "loc2",
  PROJECT: "project",
  TYPE: "type",
  YEAR: "year",
} as const;
