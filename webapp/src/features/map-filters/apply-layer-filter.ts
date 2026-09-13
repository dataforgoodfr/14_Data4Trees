import type { FilterSpecification, MapInstance } from "@shared/lib/coordo";

import {
  FILTERABLE_LAYERS,
  readGlobalFilters,
  readLayerFilters,
} from "./storage";
import {
  FILTER_KINDS,
  type GlobalFilter,
  type GlobalFiltersState,
  type LayerFilter,
  type LayerFiltersState,
} from "./types";

/**
 * Filters a layer already carries — notably the `["!", ["has", "point_count"]]`
 * clause coordo puts on layers bound to a clustered source. MapLibre keeps a
 * single filter per layer, so we snapshot that one on first touch and keep
 * ANDing ours onto it. Keyed by map instance so a remount starts clean.
 */
const BASE_FILTERS = new WeakMap<
  MapInstance,
  Map<string, FilterSpecification | undefined>
>();

const getBaseFilter = (map: MapInstance, layerId: string) => {
  let baseFilterByLayer = BASE_FILTERS.get(map);
  if (!baseFilterByLayer) {
    baseFilterByLayer = new Map();
    BASE_FILTERS.set(map, baseFilterByLayer);
  }

  if (!baseFilterByLayer.has(layerId)) {
    // `getFilter` is declared as `FilterSpecification | void`; the void branch
    // is `undefined` at runtime (layer without a filter).
    baseFilterByLayer.set(
      layerId,
      map.getFilter(layerId) as FilterSpecification | undefined,
    );
  }

  return baseFilterByLayer.get(layerId);
};

/**
 * Turn one persisted filter into a MapLibre expression. Add a `case` here when
 * you add a kind to {@link LayerFilter}.
 *
 * MapLibre compares strictly: an expression whose operands have different types
 * evaluates to `false` instead of erroring, so a filter that silently matches
 * nothing is almost always a type mismatch between the bound and the feature
 * property.
 *
 * - `VALUES` — OR within the group. `in` against a literal array matches any of
 *   the selected values, so several checked boxes need no special handling.
 *   Values keep the type the API served them with: `["literal", ["3"]]` would
 *   never match a numeric `3`.
 *
 * - `RANGE` — inclusive `>=` / `<=`, ANDed when both bounds are set.
 *   Dates go through here: MapLibre has no date type, so a date is stored on the
 *   feature either as an ISO-8601 string — which sorts lexicographically, so
 *   plain `>=` works, provided every feature uses the same format and offset —
 *   or as an epoch number.
 *
 *   ```ts
 *   // "surveyed during 2025", property stored as ISO strings
 *   { kind: FILTER_KINDS.RANGE, max: "2025-12-31", min: "2025-01-01", propertyName: "survey_date" }
 *
 *   // same window, property stored as epoch milliseconds
 *   { kind: FILTER_KINDS.RANGE, max: Date.UTC(2025, 11, 31), min: Date.UTC(2025, 0, 1), propertyName: "survey_date" }
 *   ```
 */
const buildFilterClause = (filter: LayerFilter): FilterSpecification | null => {
  switch (filter.kind) {
    case FILTER_KINDS.VALUES:
      return [
        "in",
        ["get", filter.propertyName],
        ["literal", filter.values],
      ] as FilterSpecification;

    case FILTER_KINDS.RANGE: {
      const bounds: FilterSpecification[] = [];

      if (filter.min !== undefined) {
        bounds.push([
          ">=",
          ["get", filter.propertyName],
          filter.min,
        ] as FilterSpecification);
      }

      if (filter.max !== undefined) {
        bounds.push([
          "<=",
          ["get", filter.propertyName],
          filter.max,
        ] as FilterSpecification);
      }

      // A range with neither bound restricts nothing.
      return bounds.length > 0
        ? (["all", ...bounds] as FilterSpecification)
        : null;
    }

    // Reached only when localStorage holds a kind this build no longer knows.
    default:
      return null;
  }
};

/**
 * Narrow a global filter down to one layer.
 *
 * Returns `null` when the layer does not expose the concept at all — the enquete
 * layer has no `ecos`, for instance — so it stays unfiltered by that entry.
 */
const resolveGlobalFilter = (
  globalFilter: GlobalFilter,
  layerId: string,
): LayerFilter | null => {
  const propertyName = globalFilter.propertyNameByLayer[layerId];
  if (!propertyName) return null;

  const { propertyNameByLayer: _byLayer, ...filter } = globalFilter;
  // Safe by construction: `GlobalFilter` is a `LayerFilter` whose `propertyName`
  // was swapped for the per-layer map we just resolved.
  return { ...filter, propertyName } as LayerFilter;
};

/**
 * Push a layer's whole filter state to the map: AND between groups, on top of
 * the layer's own base filter.
 *
 * WARNING: every clause targeting `layerId` must go through this one call —
 * MapLibre has a single filter slot per layer, so a caller that runs
 * `setFilter` itself would silently drop all the other clauses. That is why
 * global filters are composed here rather than applied on their own.
 */
export const applyLayerFilter = ({
  map,
  layerId,
  layerFilters,
  globalFilters,
}: {
  map: MapInstance;
  layerId: string;
  layerFilters: LayerFiltersState;
  globalFilters: GlobalFiltersState;
}) => {
  // The panel can render before the style declares the layer.
  if (!map.getLayer(layerId)) return;

  const baseFilter = getBaseFilter(map, layerId);
  const clauses = [
    ...Object.values(layerFilters),
    ...Object.values(globalFilters)
      .map((globalFilter) => resolveGlobalFilter(globalFilter, layerId))
      .filter((filter) => filter !== null),
  ]
    .map(buildFilterClause)
    .filter((clause) => clause !== null);

  const allClauses = baseFilter ? [baseFilter, ...clauses] : clauses;

  map.setFilter(
    layerId,
    allClauses.length > 0
      ? (["all", ...allClauses] as FilterSpecification)
      : null,
  );
};

/**
 * Recompute one layer's filter from the persisted state.
 *
 * Both sides are read from localStorage rather than from React state: the
 * per-layer panel and the global panel own different pieces of the expression
 * and never share a React tree, but `useLocalStorage` writes synchronously, so
 * whichever one triggers the refresh sees the other's latest value.
 */
export const refreshLayerFilter = ({
  map,
  layerId,
}: {
  map: MapInstance;
  layerId: string;
}) =>
  applyLayerFilter({
    globalFilters: readGlobalFilters(),
    layerFilters: readLayerFilters(layerId),
    layerId,
    map,
  });

/**
 * Recompute every layer — after a global filter changes, and on MAP_READY to
 * replay the persisted state onto a freshly loaded map.
 */
export const refreshAllLayerFilters = ({ map }: { map: MapInstance }) => {
  FILTERABLE_LAYERS.forEach((layerId) => {
    refreshLayerFilter({ layerId, map });
  });
};
