# map-filters

Per-layer map filtering, applied client-side with MapLibre's
[`map.setFilter()`](https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/#setfilter)
and persisted in localStorage.

## Files

| File | Role |
| --- | --- |
| `types.ts` | Persisted state shape. `FILTER_KINDS`, the `LayerFilter` union, `GlobalFilter`. |
| `constants.ts` | `GROUP_KEYS` — the group names shared by every layer. |
| `storage.ts` | localStorage keys, `FILTERABLE_LAYERS`, non-React readers. |
| `apply-layer-filter.ts` | Expression building, clause composition, the `setFilter` call. |
| `use-layer-filters.ts` | React binding for one layer's own filters. |
| `use-global-filters.ts` | React binding for the filters that apply to every layer. |
| `layers/*.tsx` | One file per layer: which groups it shows, and how to label them. |
| `global-filters.tsx` | The all-layers panel (year). |
| `components/layer-filter-panel.tsx` | The shared card every layer panel renders. |
| `components/checkbox-group.tsx` | Presentational checkbox list. |

## How it fits together

```text
layers/forest-inventory.tsx     declares its FilterGroups (key + propertyName + values)
  └─ useLayerFilters(layerId)   reads/writes this layer's localStorage entry
       └─ refreshLayerFilter()  recomputes that layer

global-filters.tsx              declares GlobalFilterGroups (values unioned across layers)
  └─ useGlobalFilters()         reads/writes the single global entry
       └─ refreshAllLayerFilters()  recomputes every FILTERABLE_LAYER

both end in applyLayerFilter()  ["all", baseFilter, …layerClauses, …globalClauses]
                                 → map.setFilter(layerId, …)
```

`refreshLayerFilter` re-reads **both** entries from localStorage rather than
taking React state. The two panels never share a React tree, and
`useLocalStorage` does not sync across hook instances, but it writes
synchronously — so whichever side triggers a refresh sees the other's latest
value. That is also why a global change has to refresh every layer.

On reload, `refreshAllLayerFilters({ map })` replays the persisted state. It runs
from `map-provider-all4trees.tsx` on `MAP_READY`, **not** from the panels — the
sidebar keeps them in a hidden `<Activity>` until its tab is opened, so their
effects would not have run yet.

## State shape

```ts
// localStorage["d4g:map-filters:inventaire_for"]
{
  "project": { kind: "values", propertyName: "project", values: ["A Kob Ale"] },
  "loc1":    { kind: "values", propertyName: "loc1",    values: [1, 3] }
}

// localStorage["d4g:map-filters:__global__"]
{
  "year": {
    kind: "values",
    values: ["2025", "2026"],
    // Resolved per layer: the same concept is not the same property everywhere
    // (cohort/start_date, project/proj). A layer absent here is left alone.
    propertyNameByLayer: { inventaire_for: "year", inventaire_bio: "year", enquete: "year" }
  }
}
```

Three rules make this work without seeding defaults:

- **Group absent** → no restriction. A fresh visitor has `{}` and sees everything;
  a value the backend starts serving shows up unfiltered.
- **Group present, empty `values`** → deliberate "nothing selected", hides everything.
- `propertyName` is stored with the selection so the reload sync can rebuild the
  expression without waiting for the `getFilters()` payload.

Selections are stored as the API's own values (numbers stay numbers). Checkbox
identifiers are strings, so the hook maps between them with `String(value)`.

## Semantics

- **Within a group → OR.** `["in", ["get", prop], ["literal", [...]]]`, so several
  checked boxes need no special handling.
- **Between groups → AND.** `["all", clauseA, clauseB]`.
- **On top of the layer's own filter.** MapLibre keeps a *single* filter slot per
  layer, and coordo puts `["!", ["has", "point_count"]]` on layers bound to a
  clustered source. `applyLayerFilter` snapshots that base filter on first touch
  and always re-ANDs it, so it is never clobbered.

> **Never call `map.setFilter()` for a filterable layer from anywhere else.** The
> single filter slot means the last caller wins and silently drops every other
> clause. That is why global filters are composed inside `applyLayerFilter`
> rather than applied on their own.

## Where the values come from

`GET /maps/get-filters/` returns `{filter key: {layer id: {property_name, values}}}`,
built by `backend/maps/services/filters.py`. `FILTER_PROPERTIES_BY_LAYER` there
declares the property **per layer**, because the same concept is not always
exposed under the same name — `cohort` is served as `start_date` on
inventaire_bio, and the enquete layer is built with `groupby`, which keeps the
raw source columns (`proj`, uncast `loc1`/`loc2`) instead of the renamed ones.

Value types follow the map config (`backend/configs/all4trees_config.json`):
`loc1`/`loc2`/`ecos` are wrapped in `int()` so they arrive as numbers, while
`type` and `year` are not and arrive as strings. Filters keep whatever type the
API served, since MapLibre compares strictly.

## Recipes

### Add a group to an existing layer

Add one `toPanelGroup(...)` entry to that layer's `groups` array:

```tsx
toPanelGroup({
  key: GROUP_KEYS.ECOS,
  labelListName: "ecos",          // omit to display the raw code
  leaf: filters.ecos[LAYER_ID],   // from the getFilters() payload
  title: t("filters.groups.ecos"),
}),
```

Nothing else to wire: the group key becomes its localStorage key, and the effect
in `useLayerFilters` pushes the change to the map.

If you ever render a `<CheckboxGroup>` yourself instead of going through
`LayerFilterPanel`, pass a `namespace` (`<layerId>-<groupKey>`). Item identifiers
are only unique within a group — `loc1`, `loc2` and `ecos` all start at 1, and
every layer repeats the same codes — so without it the DOM ids collide and each
label activates the first matching checkbox in the document, silently toggling
another group's (or another layer's) box.

### Labels

`LayerFilterPanel` resolves a group's labels through `findLabel`, keyed by
`list_name` + the project. Two traps, both handled per layer rather than
globally:

- **`list_name` is the *source* column**, not the property the map serves.
  `type` looks up `typ` on inventaire_for but `meth` on inventaire_bio.
- **`findLabel` compares strictly**, and the label tables disagree on the key
  type: `for_label`/`bio_label` store numeric `name`, `hh_label` stores strings.
  Hence the panel's `labelKeyType`: `NUMBER` for the inventory layers (whose
  `type` is a string property that must be coerced), `STRING` for enquete (whose
  codes are uncast strings all the way through). Getting this wrong shows raw
  codes instead of names — the lookup fails silently and falls back.

Labels are also keyed by project, and each panel passes `projects.values[0]`.
That is correct while a layer carries a single project; it becomes ambiguous the
day one spans several.

### Add a filterable layer

1. Declare its properties in `FILTER_PROPERTIES_BY_LAYER` (backend `filters.py`)
   and extend the `Filters` type in `shared/api/types.ts`.
2. Create `layers/<layer>.tsx`: wrap `<LayerFilterPanel>` in an
   `<ExternalDataBoundary>` for the layer (the panel resolves labels through
   `useExternalData`), and render it from `map-filters.tsx`.
3. Add the layer id to `FILTERABLE_LAYERS` in `storage.ts` — otherwise its filters
   are **not** replayed on reload and global filters never reach it.

Which groups a layer can offer depends on what it actually serves. The enquete
layer is built with `groupby`, so it only exposes the grouped columns (`proj`,
`loc1`, `loc2`, `year`) plus aggregates — no type, cohort or ecos exist there.

### Add a global (all-layers) filter

1. Add the filter key to `FILTER_PROPERTIES_BY_LAYER` backend-side, listing every
   layer that exposes it.
2. In `global-filters.tsx`, build the group with `buildGlobalFilterGroup({ key,
   leavesByLayer: filters.<key> })` — it unions the values for the checkbox list
   and keeps each layer's own property name — then render a `CheckboxGroup` with
   `getCheckboxGroupProps(group)` from `useGlobalFilters()`.

Nothing else: `applyLayerFilter` already composes global clauses into every
layer's expression, and a change refreshes all layers.

### Add a filter kind

`RANGE` is the worked example — nothing renders it yet, but it is implemented
end to end and is the template to copy.

1. **`types.ts`** — add the kind to `FILTER_KINDS` and its variant to the
   `LayerFilter` union.
2. **`apply-layer-filter.ts`** — add a `case` to `buildFilterClause`. Adding the
   union member first makes the missing case a compile error.
3. **`use-layer-filters.ts`** — the current hook only knows how to *edit* a
   `VALUES` filter (checkbox toggles). A new kind needs its own writer, e.g. a
   `getRangeProps(group)` returning `{ value, onChange }` for a slider or date
   picker. The reading side (the effect, the storage key) is kind-agnostic and
   needs no change.
4. **`components/`** — add the widget.

Returning `null` from `buildFilterClause` means "restricts nothing", which is
also how a state written by an older build (unknown `kind`) degrades.

### Dates and other comparisons

MapLibre expressions have no date type. Store the date on the feature as an
ISO-8601 string (they sort lexicographically, so `>=` / `<=` work as-is) or as an
epoch number, then use a `RANGE` filter:

```ts
{ kind: FILTER_KINDS.RANGE, max: "2025-12-31", min: "2025-01-01", propertyName: "survey_date" }
```

MapLibre compares strictly and **evaluates to `false` on a type mismatch instead
of erroring** — a filter that silently matches nothing is nearly always a bound
whose type differs from the feature property's.

## Known limitation: cluster counts

`setFilter` is a *render-time* filter, while clustering happens at the **source**
level. On a clustered layer (`LAYERS_WITH_CLUSTERS`) the individual points filter
correctly, but the cluster bubbles keep counting filtered-out features.

There is no "recount" API: supercluster indexes whatever is in the source, so the
counts only move if the source data moves. `setClusterOptions()` only toggles
clustering on/off. Options considered, none implemented yet:

- **Re-cluster client-side.** Cache the original FeatureCollection once with
  `GeoJSONSource.getData()`, filter it in JS — `featureFilter()` from
  `@maplibre/maplibre-gl-style-spec` compiles the very expression
  `buildFilterClause` already returns, so there is no second implementation to
  keep in sync — then `source.setData(subset)`. Exact counts, frontend-only,
  works for every kind. Costs: whole dataset in memory, a re-index per change
  (debounce), async-ordering guards, and it conflicts with `setLayerFilters` on
  the same layer.
- **Refetch from the backend** via coordo's `setLayerFilters`, which POSTs a
  filter payload and replaces the source data. No client memory cost, but the
  backend has to implement the `{op, args}` DSL for these properties and it is a
  round-trip per change.
- **Hide the cluster layers** while a filter is active. Cheap and never wrong,
  but loses the summary and renders every point at low zoom.

Source `clusterProperties` was ruled out: it can only aggregate a category set
known at style-build time, so it cannot serve user-chosen values or ranges.
