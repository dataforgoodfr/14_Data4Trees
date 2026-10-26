import { useState } from "react";

import { useLocalStorage } from "@shared/hooks/use-local-storage";
import { useMap } from "@shared/hooks/use-map-all4trees";

import type { CheckedState } from "@ui/checkbox";

import {
  applyCalculationFilters,
  isAbortError,
} from "./apply-calculation-filters";
import {
  areStatesEqual,
  readGroupSelection,
  toCalculationFilter,
  withGroupFilter,
} from "./selection";
import { CALCULATION_FILTERS_STORAGE_KEY } from "./storage";
import type {
  CalculationFilterGroup,
  CalculationFiltersState,
  GroupSelection,
} from "./types";

/** Checkbox identifier of the "Non renseigné" option; never a form value. */
export const MISSING_IDENTIFIER = "__missing__";

/**
 * Draft and applied calculation filters.
 *
 * Edits only change the draft. `apply()` sends it to the backend (about 1.5–2 s)
 * and, on success, makes it the applied state, which is the only one
 * persisted. On failure the draft stays dirty and the applied state and map
 * data are unchanged.
 */
export const useCalculationFilters = () => {
  const { isReady, mapApiRef } = useMap();
  const [applied, setApplied] = useLocalStorage<CalculationFiltersState>(
    CALCULATION_FILTERS_STORAGE_KEY,
    {},
  );
  const [draft, setDraft] = useState<CalculationFiltersState>(applied);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const isDirty = !areStatesEqual(draft, applied);

  const apply = async () => {
    const mapApi = mapApiRef.current;
    if (!mapApi || !isDirty || isLoading) return;

    setIsLoading(true);
    setHasError(false);
    try {
      await applyCalculationFilters({ mapApi, state: draft });
      setApplied(draft);
    } catch (error) {
      // Only a newer call can supersede this one, and the button is disabled
      // while it runs: nothing to report.
      if (!isAbortError(error)) {
        console.error(error);
        setHasError(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getSelection = (group: CalculationFilterGroup) =>
    readGroupSelection(group, draft[group.key]);

  const updateSelection = (
    group: CalculationFilterGroup,
    update: (selection: GroupSelection) => GroupSelection,
  ) => {
    setDraft((previous) =>
      withGroupFilter(
        previous,
        group.key,
        toCalculationFilter(
          group,
          update(readGroupSelection(group, previous[group.key])),
        ),
      ),
    );
  };

  /** Spread onto a `<CheckboxGroup>`: the options, then "Non renseigné". */
  const getCheckboxGroupProps = (group: CalculationFilterGroup) => ({
    getIsChecked: (identifier: string) => {
      const selection = getSelection(group);
      return identifier === MISSING_IDENTIFIER
        ? selection.missing
        : selection.values.some((value) => String(value) === identifier);
    },

    getOnCheckedChange: (identifier: string) => (nextValue: CheckedState) => {
      const isChecked = nextValue === true;

      updateSelection(group, (selection) => {
        if (identifier === MISSING_IDENTIFIER) {
          return { ...selection, missing: isChecked };
        }

        const others = selection.values.filter(
          (value) => String(value) !== identifier,
        );
        const toggled = group.options
          .map((option) => option.value)
          .filter((value) => String(value) === identifier);

        return {
          ...selection,
          values: isChecked ? [...others, ...toggled] : others,
        };
      });
    },
  });

  /** Spread onto a `<RangeGroup>`: option indices of the two thumbs. */
  const getRangeProps = (group: CalculationFilterGroup) => {
    const optionValues = group.options.map((option) => option.value);
    const { values } = getSelection(group);
    const lastIndex = optionValues.length - 1;

    return {
      onValueChange: ([minIndex = 0, maxIndex = lastIndex]: number[]) => {
        updateSelection(group, (selection) => ({
          ...selection,
          values: optionValues.slice(minIndex, maxIndex + 1),
        }));
      },
      value: [
        Math.max(optionValues.indexOf(values[0]), 0),
        Math.max(optionValues.indexOf(values.at(-1) ?? optionValues[0]), 0),
      ] as [number, number],
    };
  };

  return {
    applied,
    apply,
    draft,
    getCheckboxGroupProps,
    getRangeProps,
    hasError,
    isDirty,
    isDisabled: !isReady || isLoading,
    isLoading,
  };
};
