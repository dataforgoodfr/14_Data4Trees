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
  "soil_eros_water_infiltration",
  "soil_eros_stability",
] as const;

function formatTaxonAbundance(abundancePop: string[], abundanceTotal: number) {
  if (!abundanceTotal) {
    return {};
  }

  const abundancePopRecord: Record<string, number> = {};
  abundancePop.forEach((value) => {
    if (value) {
      const [taxon, count] = value.split(":");
      const currentCount = abundancePopRecord[taxon] || 0;
      abundancePopRecord[taxon] = currentCount + parseInt(count, 10);
    }
  });

  return convertDictToPercentage(abundancePopRecord, abundanceTotal, "0");
}

/**
 * Return data in a convenient way for UI rendering, handling units and fixing
 */
export const useFormatSoilData = (data: ForestInventoryData) => {
  const { t } = useTranslation("common");
  const { formatWithUnit } = useFormatterWithUnit();

  const {
    soil_structure_idx,
    soil_fauna_diversity,
    soil_fauna_density,
    soil_surface_fauna_diversity,
    soil_surface_fauna_density,
    soil_eros_rainfall_and_wind,
    soil_eros_stability,
    soil_eros_water_infiltration,
    ...safeData
  } = preciseNumericIndicators<SoilData>(
    data,
    indicatorsToPreciseWithFallBack,
    t("dataManagement.noData"),
  );

  safeData.soil_surface_fauna_abundance = formatTaxonAbundance(
    safeData.soil_surface_fauna_abundance_pop,
    safeData.soil_surface_fauna_total_pop,
  );

  safeData.soil_fauna_abundance = formatTaxonAbundance(
    safeData.soil_fauna_abundance_pop,
    safeData.soil_fauna_total_pop,
  );

  return {
    ...safeData,
    soil_eros_rainfall: Number(soil_eros_rainfall_and_wind.split("-")[0]),
    soil_eros_stability: soil_eros_stability,
    soil_eros_water_infiltration:
      String(soil_eros_water_infiltration) === t("dataManagement.noData")
        ? soil_eros_water_infiltration
        : computeScore(soil_eros_water_infiltration),
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
    soil_structure_idx:
      String(soil_structure_idx) === t("dataManagement.noData")
        ? soil_structure_idx
        : `${soil_structure_idx}/10`,
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
