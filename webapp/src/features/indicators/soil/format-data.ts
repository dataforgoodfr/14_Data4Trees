import { useTranslation } from "react-i18next";

import {
  preciseNumericIndicators,
  UNITS,
  useFormatterWithUnit,
} from "@features/indicators/utils";

import type { NumericKeys } from "@shared/types";

import type { SoilData } from "./types";

const indicatorsToPreciseWithFallBack: NumericKeys<SoilData>[] = [
  "soil_structure",
  "soil_composition",
  "soil_fauna_density",
  "surface_fauna_density",
] as const;

// Radar indicators does not need a fallback value other than 0.
// Only 2 of them needs precision, the others are manually set in the form as integer between 0 and 10.
const indicatorsToPreciseWithoutFallBack: NumericKeys<SoilData>[] = [
  "ero_soil_stability",
  "ero_water_seepage",
] as const;

/**
 * Return data in a convenient way for UI rendering, handling units and fixing
 */
export const useFormatSoilData = (data: SoilData) => {
  const { t } = useTranslation("translations");
  const { formatWithUnit } = useFormatterWithUnit();

  const { ero_soil_stability, ero_water_seepage } =
    preciseNumericIndicators<SoilData>(
      data,
      indicatorsToPreciseWithoutFallBack,
    );

  const {
    soil_structure,
    soil_fauna_diversity,
    soil_fauna_density,
    surface_fauna_diversity,
    surface_fauna_density,
    ero_rainfall_and_wind,
    ero_couv_slope_and_cover,
    ...safeData
  } = preciseNumericIndicators<SoilData>(
    data,
    indicatorsToPreciseWithFallBack,
    t("indicators.common.noData"),
  );

  return {
    ...safeData,
    // Temporary fix due to coordo bug
    ero_rainfall: Number(ero_rainfall_and_wind.split("-")[0]),
    ero_slope: Number(ero_couv_slope_and_cover.split("-")[0]),
    ero_soil_cover: Number(ero_couv_slope_and_cover.split("-")[1]),
    ero_soil_stability: ero_soil_stability,
    ero_water_seepage: ero_water_seepage,
    ero_wind: Number(ero_rainfall_and_wind.split("-")[1]),
    soil_fauna_abundance: safeData.soil_fauna_abundance,
    soil_fauna_density: formatWithUnit(
      soil_fauna_density,
      UNITS.individualPerTrap,
    ),
    soil_fauna_diversity: formatWithUnit(
      soil_fauna_diversity,
      UNITS.speciesCount,
    ),
    soil_structure: `${soil_structure}/10`,
    surface_fauna_abundance: safeData.surface_fauna_abundance,
    surface_fauna_density: formatWithUnit(
      surface_fauna_density,
      UNITS.individualPerCubicMeter,
    ),
    surface_fauna_diversity: formatWithUnit(
      surface_fauna_diversity,
      UNITS.speciesCount,
    ),
  };
};

export type SoilFormattedData = ReturnType<typeof useFormatSoilData>;
