# map-filters

Per-layer map filtering, applied client-side with MapLibre's
[`map.setFilter()`](https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/#setfilter)
— or, on clustered layers, coordo's `setSourceFilter` (see
[Clustered layers](#clustered-layers-filters-go-to-the-source)) — and persisted
in localStorage.

## Files

| File | Role |
| --- | --- |
| `types.ts` | Persisted state shape. `FILTER_KINDS`, the `LayerFilter` union, `GlobalFilter`, `MapFiltersState`. |
| `constants.ts` | `GROUP_KEYS`, the groups of each panel (`LAYER_GROUP_KEYS`, `GLOBAL_GROUP_KEYS`) and their titles. |
| `groups.ts` | Builds the panels' checkbox groups from the `getFilters()` payload. |
| `storage.ts` | localStorage keys, `FILTERABLE_LAYERS`, non-React readers and writers. |
| `apply-layer-filter.ts` | Expression building, clause composition, the `setFilter` call. |
| `map-filters-provider.tsx` | The single state shared by every panel and the All / None toggle. |
| `use-layer-filters.ts` | Binds one layer's checkboxes to the shared state. |
| `use-global-filters.ts` | Binds the all-layers checkboxes to the shared state. |
| `all-or-none.ts` | Pure "everything" / "nothing" states and their checks, for the toggle. |
| `layers/*.tsx` | One card per layer: icon, colour, title overrides. |
| `global-filters.tsx` | The all-layers panel (year). |
| `components/layer-filter-panel.tsx` | The shared card every layer panel renders. |

The checkbox list, the collapsible card, the All / None buttons, label
resolution, `FilterValue` / `FilterOption` and the safe storage helpers live in
[`base-filters`](../base-filters/README.md), shared with `calculation-filters`.

## How it fits together

```text
MapFiltersProvider              one state { global, byLayer } for every panel
  ├─ LayerFilterPanel           groups from LAYER_GROUP_KEYS + payload
  │    └─ useLayerFilters       updateLayerFilters → write entry → refreshLayerFilter()
  ├─ MapGlobalFilters           groups unioned across layers
  │    └─ useGlobalFilters      updateGlobalFilters → write entry → refreshAllLayerFilters()
  └─ All / None toggle          replaceMapFilters → write all → refreshAllLayerFilters(), once

all end in applyLayerFilter()   ["all", baseFilter, …layerClauses, …globalClauses]
                                 → map.setFilter(layerId, …)
                                 clustered layer: clauses → setSourceFilter(layerId, …)
                                                  baseFilter → map.setFilter(layerId, …)
```

The panels share one React state through `MapFiltersProvider`: a separate
`useLocalStorage` per panel would not sync, so a bulk change would leave the
other panels' boxes stale. Every change is written to storage *before* the
refresh, because `refreshLayerFilter` re-reads **both** entries from storage to
compose them. That is also why a global change has to refresh every layer.

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
built by `backend/maps/services/filters.py`. Each entry of `values` is an option
carrying the raw value and its label in every language:

```json
{ "value": 1, "label::fr": "Makay Nord", "label::en": "North Makay" }
```

 `FILTER_PROPERTIES_BY_LAYER` there
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

Add the key to that layer's list in `LAYER_GROUP_KEYS` (`constants.ts`). The
panel reads the leaf from the `getFilters()` payload and the title from
`GROUP_TITLE_KEYS`. A layer that names the group differently passes a
`groupTitles` override to `LayerFilterPanel` (bio does it for `type`).

Nothing else to wire: the group key becomes its localStorage key, the shared
state pushes the change to the map, and All / None picks the group up.

If you ever render a `<CheckboxGroup>` yourself instead of going through
`LayerFilterPanel`, pass a `namespace` (`<layerId>-<groupKey>`). Item identifiers
are only unique within a group — `loc1`, `loc2` and `ecos` all start at 1, and
every layer repeats the same codes — so without it the DOM ids collide and each
label activates the first matching checkbox in the document, silently toggling
another group's (or another layer's) box.

### Labels

Labels are resolved **backend-side** (`get_labelized_value` in `filters.py`),
against the layer's label table and each feature's own project, so a layer can
span several projects. The frontend does no external-data lookup:
`getOptionLabel` (in `base-filters`) only picks `label::<i18n.language>`,
falling back to I18N_FALLBACK_LNG (i18n/config.ts)
then to the raw value.
Missing or wrong labels are therefore a backend concern — the `list_name`
and key-type mapping live in `LAYER_PROPERTY_TO_LABEL_PROPERTIES`.

Checkbox identifiers and persisted selections stay the **raw values**, never the
labels, so switching language keeps the selection.

A global group unions the options of every layer and deduplicates them by value,
keeping the first layer's labels.

### Add a filterable layer

1. Declare its properties in `FILTER_PROPERTIES_BY_LAYER` (backend `filters.py`)
   and extend the `Filters` type in `shared/api/types.ts`.
2. List its groups in `LAYER_GROUP_KEYS` (`constants.ts`).
3. Create `layers/<layer>.tsx` rendering a `<LayerFilterPanel>`, and render it
   from `map-filters.tsx`.
4. Add the layer id to `FILTERABLE_LAYERS` in `storage.ts` — otherwise its filters
   are **not** replayed on reload, global filters never reach it and All / None
   ignores it.

Which groups a layer can offer depends on what it actually serves. The enquete
layer is built with `groupby`, so it only exposes the grouped columns (`proj`,
`loc1`, `loc2`, `year`) plus aggregates — no type, cohort or ecos exist there.

### Add a global (all-layers) filter

1. Add the filter key to `FILTER_PROPERTIES_BY_LAYER` backend-side, listing every
   layer that exposes it.
2. Add the key to `GLOBAL_GROUP_KEYS` (`constants.ts`). `getGlobalGroups` builds
   it with `buildGlobalFilterGroup`, which unions the values for the checkbox
   list and keeps each layer's own property name.

Nothing else: the panel renders every global group, `applyLayerFilter` already
composes global clauses into every layer's expression, and a change refreshes
all layers.

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
   picker. The reading side (the shared state, the storage key) is
   kind-agnostic and needs no change.
4. **`components/`** — add the widget.
5. **`all-or-none.ts`** — decide what "everything" and "nothing" mean for it.
   Until then, a stored filter of that kind reads as a restriction.

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

## Clustered layers: filters go to the source

`setFilter` is a *render-time* filter, while clustering happens at the **source**
level: supercluster indexes every feature of the source, so on a clustered layer
`setFilter` hides the points but the cluster bubbles keep counting them.

So for layers in `LAYERS_WITH_CLUSTERS`, `applyLayerFilter` sends the composed
clauses to coordo's `setSourceFilter` instead, and the layer keeps only its base
filter. `setSourceFilter` sets the GeoJSON source's worker-side `filter` and
reloads the original data: the MapLibre worker filters the features *before*
building the cluster index, with the same expression evaluator, so the counts
only include matching features. Non-clustered layers keep the cheaper `setFilter`.

What to know:

- **One source filter per source.** Same rule as the layer slot: only
  `applyLayerFilter` may call `setSourceFilter` for a filterable layer.
- **A change re-indexes the source** (data re-sent to the worker, supercluster
  rebuilt). `setSourceFilter` skips unchanged filters, so a global change does
  not re-index layers it does not affect. Rapid changes are coalesced by
  MapLibre (only the latest pending update is sent).
- **`setLayerFilters` composes with it**: coordo keeps the refetched data as the
  new unfiltered reference and the source filter still applies on top.
- The source filter is evaluated per feature at zoom 0, with no feature-state or
  global state — plain `["get", …]` comparisons only, which is all
  `buildFilterClause` produces.
