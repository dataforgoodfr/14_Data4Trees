# calculation-filters

Backend filters on the `enquete` (Socio-eco) layer. Where
[`map-filters`](../map-filters/README.md) **hide** points on the client, these
change **which survey rows each point is computed from**: they are sent as a
CQL2 filter through coordo's `setLayerFilters`, the backend applies it as a SQL
`WHERE` on the raw `enquete_menage` resource before the layer's `groupby`, and
the layer data is replaced with the recomputed points.

Display filters still apply on top: coordo's `setSourceData` keeps the
client-side source filter when it replaces the data.

A recomputation takes about 1.5–2 s, so changes are applied explicitly with
"Apply changes" rather than on every click.

## Files

| File | Role |
| --- | --- |
| `types.ts` | Persisted state shape (`CalculationFilter`, `CalculationFiltersState`), `CalculationFilterGroup`, `GroupSelection`. |
| `storage.ts` | localStorage key and the non-React reader. |
| `selection.ts` | Pure transitions between what the widgets show and what is stored, normalization, state comparison. |
| `build-where.ts` | State → CQL2 filter, with coordo's `where` and `cql` builders. |
| `apply-calculation-filters.ts` | `setLayerFilters` / `clearLayerFilters`, and the MAP_READY replay. |
| `use-calculation-filters.ts` | Draft, applied, `isDirty`, `apply()`, loading and error state. |
| `calculation-filters.tsx` | The panel. |

The checkbox list, the range slider (`RangeGroup`) and label resolution come
from [`base-filters`](../base-filters/README.md).

## Where the options come from

`GET /maps/get-calculation-filters/` (`backend/maps/services/calculation_filters.py`,
configured in `backend/configs/calculation_filters.json`), fetched once by the
sidebar:

```json
{
  "layer_id": "enquete",
  "filters": {
    "age": {
      "kind": "range",
      "property_name": "age",
      "values": [{ "value": "1", "label::fr": "Moins de 35 ans", "label::en": "Under 35" }],
      "missing": { "values": ["98", "99"], "include_null": true, "label::fr": "Non renseigné", "label::en": "Not provided" }
    }
  }
}
```

- Groups render in the payload's key order.
- Options are the **full form lists, whatever the data**: an option can match no
  household, and selecting only it gives an empty layer. That is accepted.
- `kind: "values"` → checkboxes; `kind: "range"` → a slider over the ordered
  options. Sentinels such as "Ne sait pas" / "Refuse" are ordinary options.
- `missing` (`null` on most groups) adds one "Non renseigné" checkbox, after the
  checkboxes or below the slider. It stands for its `values` codes and, when
  `include_null` is true, for rows where the column is null.

## State shape

Only the **applied** state is persisted; a draft that was never applied is
dropped on reload.

```ts
// localStorage["d4g:calculation-filters:enquete"]
{
  "typ": { "kind": "values", "propertyName": "typ", "values": ["1", "2"] },
  "coh": {
    "kind": "range", "propertyName": "coh",
    "min": "2022", "max": "2023",
    // Resolved from the ordered options when written, so a reload can replay
    // without waiting for the endpoint payload.
    "values": ["2022", "2023"]
  },
  "age": {
    "kind": "range", "propertyName": "age",
    "min": "1", "max": "2", "values": ["1", "2"],
    // The "Non renseigné" checkbox. Only on groups whose payload has `missing`;
    // `values` and `includeNull` are copied from it for the same reason.
    "missing": { "checked": false, "values": ["98", "99"], "includeNull": true }
  }
}
```

Same rules as `map-filters`:

- **Group absent** → no restriction. A fresh visitor has `{}`.
- **Empty `values`** (and "Non renseigné" unchecked) → matches nothing.
- **Everything selected** → the group is removed: every box checked, or the
  range at full extent with "Non renseigné" checked when the group has one. So
  households with a null value stay included. On a group without `missing` (the
  cohort), a range at full extent is removed too, so households with no cohort
  stay included.

`toCalculationFilter` applies that normalization on every edit, so "Apply
changes" is disabled again as soon as the draft is back to the applied state.

## Compilation

`buildCalculationFilter` (unit-tested in `build-where.test.ts`):

- Groups are ANDed. Each one is `in [values]`; a range is already resolved to
  the options it spans. Not `between`: the columns are strings, so it would
  compare them lexicographically.
- **"Non renseigné" unchecked** → nothing more: the plain `in` already excludes
  the codes and the null rows.
- **"Non renseigné" checked** → `in [values + missing.values]` OR
  `isNull(property)` (when `includeNull`). Only "Non renseigné" checked gives
  the codes OR `isNull`, or `isNull` alone when there are no codes.

coordo's `where` object ANDs one operator per key, so it cannot express "`in`
OR `isNull`". Plain groups go through `where`; groups with "Non renseigné"
checked are built with the `cql` builder and ANDed with the rest via
`whereToCql`. No CQL is written by hand.

## Apply and replay

- **Apply** compiles the draft and calls `setLayerFilters`, or
  `clearLayerFilters` when nothing is restricted. On success the draft becomes
  the applied state and is persisted. On failure the error is shown, the draft
  stays dirty, and the applied state and the map data are unchanged.
- **Replay on reload**: `replayCalculationFilters` runs from
  `map-provider-all4trees.tsx` on `MAP_READY`, next to `refreshAllLayerFilters`,
  **not** from the panel: the sidebar keeps it in a hidden `<Activity>` until
  its tab is opened. Nothing is sent when the persisted state is empty. The
  layer shows unfiltered data until the filtered data arrives.
- coordo keeps one request per layer and cancels the older one with an
  `AbortError` (`isAbortError`), for instance when "Apply" is clicked before the
  replay finished. That error is ignored.

## Recipes

### Add a calculation filter

Backend only: add the column to `filters` in
`backend/configs/calculation_filters.json` (`list_name` or predefined `values`,
optional `missing`). The panel renders it from the payload. Then add its title
to `filters.calculation.groups` in both `all4trees.json` translation files and
to `GROUP_TITLE_KEYS` in `calculation-filters.tsx`; without it the group shows
its raw column name.

### Tests

```sh
npm test
```
