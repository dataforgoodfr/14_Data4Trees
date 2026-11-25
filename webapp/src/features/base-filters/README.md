# base-filters

Generic building blocks for filter panels, shared by `map-filters` (display
filters, applied client-side) and `calculation-filters` (backend filters on the
enquete layer).

Import from `@features/base-filters` only: `index.ts` is the public API.

## What belongs here

Pieces that are **generic and layer-agnostic**:

- no map calls (`setFilter`, `setLayerFilters`, …);
- no knowledge of a specific layer, filter key or API payload;
- no persisted state shape — each consumer owns its own (`LayerFilter`,
  `GlobalFilter`, …) and its own storage keys.

If a piece needs any of these, it stays in the feature that uses it. Nothing in
here imports from another feature.

## Files

| File | Role |
| --- | --- |
| `types.ts` | `FilterValue`, `FilterOption` — an API option with its labels. |
| `labels.ts` | `getOptionLabel` picks an option's label for the current language; `toCheckboxItems` maps options to checkbox items. |
| `storage.ts` | `readStorage` / `writeStorage` — safe JSON read and write of a localStorage entry outside React. |
| `components/all-or-none-toggle.tsx` | "All" / "None" buttons. Presentational: each panel decides what all and none mean. |
| `components/checkbox-group.tsx` | Presentational checkbox list. Requires a `namespace` to keep DOM ids unique. The title is optional. Past 3 items, the list scrolls (about 3.5 rows visible). |
| `components/collapsible-section.tsx` | Collapsible card with an icon and a title. Collapsed unless `defaultOpen`. |
| `components/range-group.tsx` | Two-thumb slider over ordered options, with each option's label under its stop. Works on option indices. |

## Labels

Labels are resolved backend-side. `getOptionLabel` only picks
`label::<language>`, falling back to `I18N_FALLBACK_LNG` (i18n/config.ts) then to
the raw value. Checkbox identifiers are the stringified **raw values**, never
the labels, so switching language keeps the selection.
