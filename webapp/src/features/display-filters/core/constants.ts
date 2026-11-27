import { LAYERS } from "@shared/api/layers";

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

export type GroupKey = (typeof GROUP_KEYS)[keyof typeof GROUP_KEYS];

/**
 * The groups each layer panel offers, in display order.
 *
 * Data rather than JSX so that "None" can empty every group without rendering
 * the panels. `year` is not listed: the global panel covers it.
 *
 * The enquete layer is built with `groupby`, so it only exposes the grouped
 * columns (`proj`, `loc1`, `loc2`, `year`) plus aggregates — there is no type,
 * cohort or ecos to filter on.
 */
export const LAYER_GROUP_KEYS: Record<string, GroupKey[]> = {
  [LAYERS.INVENTORY_FOR]: [
    GROUP_KEYS.PROJECT,
    GROUP_KEYS.TYPE,
    GROUP_KEYS.COHORT,
    GROUP_KEYS.LOC1,
    GROUP_KEYS.LOC2,
    GROUP_KEYS.ECOS,
  ],
  [LAYERS.INVENTORY_BIO]: [
    GROUP_KEYS.PROJECT,
    GROUP_KEYS.TYPE,
    GROUP_KEYS.COHORT,
    GROUP_KEYS.LOC1,
    GROUP_KEYS.LOC2,
    GROUP_KEYS.ECOS,
  ],
  [LAYERS.ENQUETE]: [GROUP_KEYS.PROJECT, GROUP_KEYS.LOC1, GROUP_KEYS.LOC2],
};

/** The groups of the all-layers panel. */
export const GLOBAL_GROUP_KEYS: GroupKey[] = [GROUP_KEYS.YEAR];

/** Translation key of each group title. */
export const GROUP_TITLE_KEYS = {
  cohort: "filters.groups.cohort",
  ecos: "filters.groups.ecos",
  loc1: "filters.groups.loc1",
  loc2: "filters.groups.loc2",
  project: "filters.groups.project",
  type: "filters.groups.type",
  year: "filters.groups.year",
} as const satisfies Record<GroupKey, string>;
