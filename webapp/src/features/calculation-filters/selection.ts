import {
  CALCULATION_FILTER_KINDS,
  type CalculationFilter,
  type CalculationFilterGroup,
  type CalculationFiltersState,
  type GroupSelection,
} from "./types";

/**
 * Pure state transitions between what a group's widgets show
 * ({@link GroupSelection}) and what is stored ({@link CalculationFilter}). The
 * hook only wires them to React state.
 */

const getOptionValues = (group: CalculationFilterGroup) =>
  group.options.map((option) => option.value);

/** Everything checked: what an untouched group shows. */
const getFullSelection = (group: CalculationFilterGroup): GroupSelection => ({
  missing: true,
  values: getOptionValues(group),
});

/**
 * What a group's widgets show for a stored filter.
 *
 * - No filter → everything checked.
 * - A filter of another kind (written by an older build) is ignored the same
 *   way: the widget owns its group.
 * - Values the form no longer offers drop out; a range bound it no longer
 *   offers falls back to that end of the slider.
 */
export const readGroupSelection = (
  group: CalculationFilterGroup,
  filter: CalculationFilter | undefined,
): GroupSelection => {
  if (!filter || filter.kind !== group.kind) {
    return getFullSelection(group);
  }

  const optionValues = getOptionValues(group);
  const missing = group.missing ? (filter.missing?.checked ?? false) : true;

  if (filter.kind === CALCULATION_FILTER_KINDS.RANGE) {
    const minIndex = optionValues.indexOf(filter.min);
    const maxIndex = optionValues.indexOf(filter.max);

    return {
      missing,
      values: optionValues.slice(
        Math.max(minIndex, 0),
        (maxIndex === -1 ? optionValues.length - 1 : maxIndex) + 1,
      ),
    };
  }

  return {
    missing,
    values: optionValues.filter((value) =>
      filter.values.some((selected) => String(selected) === String(value)),
    ),
  };
};

/**
 * The filter to store for a selection, or `undefined` when everything is
 * selected: the group is then removed, so rows with a null value stay
 * included (a range at full extent on the cohort keeps households with no
 * cohort, for instance).
 */
export const toCalculationFilter = (
  group: CalculationFilterGroup,
  selection: GroupSelection,
): CalculationFilter | undefined => {
  const optionValues = getOptionValues(group);
  // Rebuilt from the options, so order is preserved whatever the click order.
  const values = optionValues.filter((value) =>
    selection.values.includes(value),
  );

  if (values.length === optionValues.length && selection.missing) {
    return undefined;
  }

  const missing = group.missing
    ? {
        checked: selection.missing,
        includeNull: group.missing.include_null,
        values: group.missing.values,
      }
    : undefined;

  if (group.kind === CALCULATION_FILTER_KINDS.RANGE) {
    // A slider always spans at least one option.
    const min = values[0] ?? optionValues[0];
    const max = values.at(-1) ?? optionValues[0];

    return {
      kind: CALCULATION_FILTER_KINDS.RANGE,
      max,
      min,
      propertyName: group.propertyName,
      values,
      ...(missing && { missing }),
    };
  }

  return {
    kind: CALCULATION_FILTER_KINDS.VALUES,
    propertyName: group.propertyName,
    values,
    ...(missing && { missing }),
  };
};

/** Replace one group of the state, removing it when `filter` is `undefined`. */
export const withGroupFilter = (
  state: CalculationFiltersState,
  key: string,
  filter: CalculationFilter | undefined,
): CalculationFiltersState => {
  const { [key]: _previous, ...rest } = state;
  return filter ? { ...rest, [key]: filter } : rest;
};

/** JSON with sorted keys, so two states compare by content only. */
const toCanonicalJson = (value: unknown): string =>
  JSON.stringify(value, (_key, nested) =>
    nested !== null && typeof nested === "object" && !Array.isArray(nested)
      ? Object.fromEntries(
          Object.entries(nested).sort(([a], [b]) => a.localeCompare(b)),
        )
      : nested,
  );

/** Whether the draft differs from the applied state ("Apply" is enabled). */
export const areStatesEqual = (
  a: CalculationFiltersState,
  b: CalculationFiltersState,
) => toCanonicalJson(a) === toCanonicalJson(b);
