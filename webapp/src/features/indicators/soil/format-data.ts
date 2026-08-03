import { useTranslation } from "react-i18next";

import {
  computeScore,
  formatTaxonAbundance,
  preciseNumericIndicators,
  UNITS,
  useFormatterWithUnit,
} from "@features/indicators/utils";
import type { ForestInventoryData } from "@features/popup/forest-inventory";

import type { ExternalData } from "@entities/data";

import type { NumericKeys } from "@shared/types";

import type { SoilData } from "./types";

const indicatorsToPreciseWithFallBack: NumericKeys<SoilData>[] = [
  "soil_structure_idx",
  "soil_fauna_density",
  "soil_surface_fauna_density",
  "soil_eros_water_infiltration",
  "soil_eros_stability",
] as const;

/**
 * Return data in a convenient way for UI rendering, handling units and fixing
 */
export const useFormatSoilData = (
  data: ForestInventoryData,
  externalData: ExternalData,
) => {
  const { t } = useTranslation("common");
  const { formatWithUnit } = useFormatterWithUnit();

  const {
    soil_structure_idx,
    soil_fauna_diversity,
    soil_fauna_density,
    soil_surface_fauna_diversity,
    soil_surface_fauna_density,
    soil_eros_rainfall,
    soil_eros_wind,
    soil_eros_stability,
    soil_eros_water_infiltration,
    soil_eros_slope,
    soil_eros_cover,
    ...safeData
  } = preciseNumericIndicators<SoilData>(
    data,
    indicatorsToPreciseWithFallBack,
    t("dataManagement.noData"),
  );

  safeData.soil_fauna_abundance = formatTaxonAbundance(
    safeData.soil_fauna_abundance_pop,
    safeData.soil_fauna_total_pop,
  );

  safeData.soil_surface_fauna_abundance = formatTaxonAbundance(
    safeData.soil_surface_fauna_abundance_pop,
    safeData.soil_surface_fauna_total_pop,
  );

  return {
    ...safeData,
    soil_eros_cover:
      String(soil_eros_cover) === t("dataManagement.noData")
        ? soil_eros_cover
        : computeScore(
            data.project,
            "veg",
            soil_eros_cover,
            externalData.for_score,
          ),
    soil_eros_rainfall: soil_eros_rainfall,
    soil_eros_slope:
      String(soil_eros_slope) === t("dataManagement.noData")
        ? soil_eros_slope
        : computeScore(
            data.project,
            "slop",
            soil_eros_slope,
            externalData.for_score,
          ),
    soil_eros_stability: soil_eros_stability,
    soil_eros_water_infiltration:
      String(soil_eros_water_infiltration) === t("dataManagement.noData")
        ? soil_eros_water_infiltration
        : computeScore(
            data.project,
            "infil",
            soil_eros_water_infiltration,
            externalData.for_score,
          ),
    soil_eros_wind: soil_eros_wind,
    soil_fauna_abundance: safeData.soil_fauna_abundance,
    soil_fauna_density: formatWithUnit(
      soil_fauna_density,
      UNITS.individualPerCubicMeter,
    ),
    soil_fauna_diversity: formatWithUnit(
      soil_fauna_diversity,
      UNITS.speciesPerTrap,
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
      UNITS.speciesPerTrap,
    ),
  };
};

export type SoilFormattedData = ReturnType<typeof useFormatSoilData>;
