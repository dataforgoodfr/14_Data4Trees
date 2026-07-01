import { useTranslation } from "react-i18next";

import {
  computeScore,
  convertDictToPercentage,
  preciseNumericIndicators,
  UNITS,
  useFormatterWithUnit,
} from "@features/indicators/utils";
import type { ForestInventoryData } from "@features/popup/forest-inventory";

import type { NumericKeys } from "@shared/types";

import type { SoilData } from "./types";

const indicatorsToPreciseWithFallBack: NumericKeys<SoilData>[] = [
  "soil_structure_idx",
  "soil_fauna_density",
  "soil_surface_fauna_density",
] as const;

// Radar indicators does not need a fallback value other than 0.
// Only 2 of them needs precision, the others are manually set in the form as integer between 0 and 10.
const indicatorsToPreciseWithoutFallBack: NumericKeys<SoilData>[] = [
  "soil_eros_stability",
  "soil_eros_water_infiltration",
] as const;

function formatTaxonAbundance(abundancePop: string[], abundanceTotal: number) {
  if (!abundanceTotal) {
    return {};
  }

  const abundancePopRecord: Record<string, number> = {};
  abundancePop.forEach((value) => {
    const [taxon, count] = value.split(":");
    const currentCount = abundancePopRecord[taxon] || 0;
    abundancePopRecord[taxon] = currentCount + parseInt(count, 10);
  });

  return convertDictToPercentage(abundancePopRecord, abundanceTotal, "0");
}

/**
 * Return data in a convenient way for UI rendering, handling units and fixing
 */
export const useFormatSoilData = (data: ForestInventoryData) => {
  const { t } = useTranslation("common");
  const { formatWithUnit } = useFormatterWithUnit();

  const { soil_eros_stability, soil_eros_water_infiltration } =
    preciseNumericIndicators<SoilData>(
      data,
      indicatorsToPreciseWithoutFallBack,
    );

  const {
    soil_structure_idx,
    soil_fauna_diversity,
    soil_fauna_density,
    soil_surface_fauna_diversity,
    soil_surface_fauna_density,
    soil_eros_rainfall_and_wind,
    ...safeData
  } = preciseNumericIndicators<SoilData>(
    data,
    indicatorsToPreciseWithFallBack,
    t("dataManagement.noData"),
  );

  safeData.soil_surface_fauna_abundance = convertDictToPercentage(
    safeData.soil_surface_fauna_abundance,
    Object.values<number>(safeData.soil_surface_fauna_abundance || {}).reduce(
      (a, b) => a + b,
      0,
    ),
    "0",
  ); /*formatTaxonAbundance(
    safeData.soil_surface_fauna_abundance_pop,
    safeData.soil_surface_fauna_total_pop
  )*/

  safeData.soil_fauna_abundance = formatTaxonAbundance(
    safeData.soil_fauna_abundance_pop,
    safeData.soil_fauna_total_pop,
  );

  return {
    ...safeData,
    soil_eros_rainfall: Number(soil_eros_rainfall_and_wind.split("-")[0]),
    soil_eros_stability: soil_eros_stability,
    soil_eros_water_infiltration: computeScore(
      Number(soil_eros_water_infiltration),
    ),
    soil_eros_wind: Number(soil_eros_rainfall_and_wind.split("-")[1]),
    soil_fauna_abundance: safeData.soil_fauna_abundance,
    soil_fauna_density: formatWithUnit(
      soil_fauna_density,
      UNITS.individualPerCubicMeter,
    ),
    soil_fauna_diversity: formatWithUnit(
      soil_fauna_diversity,
      UNITS.speciesCount,
    ),
    // Temporary fix due to coordo bug
    soil_structure_idx: `${soil_structure_idx}/10`,
    surface_fauna_abundance: safeData.soil_surface_fauna_abundance,
    surface_fauna_density: formatWithUnit(
      soil_surface_fauna_density,
      UNITS.individualPerTrap,
    ),
    surface_fauna_diversity: formatWithUnit(
      soil_surface_fauna_diversity,
      UNITS.speciesCount,
    ),
  };
};

export type SoilFormattedData = ReturnType<typeof useFormatSoilData>;
