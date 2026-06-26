import { useTranslation } from "react-i18next";

import {
  computeScore,
  preciseNumericIndicators,
  UNITS,
  useFormatterWithUnit,
} from "@features/indicators/utils";

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

/**
 * Return data in a convenient way for UI rendering, handling units and fixing
 */
export const useFormatSoilData = (data: SoilData) => {
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

  return {
    ...safeData,
    soil_eros_rainfall: Number(soil_eros_rainfall_and_wind.split("-")[0]),
    soil_eros_stability: soil_eros_stability,
    soil_eros_water_infiltration: computeScore(soil_eros_water_infiltration),
    soil_eros_wind: Number(soil_eros_rainfall_and_wind.split("-")[1]),
    soil_fauna_abundance: safeData.soil_fauna_abundance,
    soil_fauna_density: formatWithUnit(
      soil_fauna_density,
      UNITS.individualPerTrap,
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
      UNITS.individualPerSquaredMeter,
    ),
    surface_fauna_diversity: formatWithUnit(
      soil_surface_fauna_diversity,
      UNITS.speciesCount,
    ),
  };
};

export type SoilFormattedData = ReturnType<typeof useFormatSoilData>;
