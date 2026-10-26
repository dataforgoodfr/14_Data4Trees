import { readStorage } from "@features/base-filters";

import { LAYERS } from "@shared/api/layers";

import type { CalculationFiltersState } from "./types";

/** Only the **applied** state is persisted; a draft is dropped on reload. */
export const CALCULATION_FILTERS_STORAGE_KEY = `d4g:calculation-filters:${LAYERS.ENQUETE}`;

/**
 * Read the applied filters outside React, for the MAP_READY replay, which runs
 * before the panel has mounted.
 */
export const readCalculationFilters = (): CalculationFiltersState =>
  readStorage<CalculationFiltersState>(CALCULATION_FILTERS_STORAGE_KEY, {});
