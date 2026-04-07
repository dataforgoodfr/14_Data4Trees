import { precise } from "@shared/lib/utils";
import type { NumericKeys } from "@shared/types";

import { UNITS, useFormatterWithUnit } from "../utils";
import type { SoilData } from "./types";

const indicatorsToPrecise: NumericKeys<SoilData>[] = [
  "soil_structure",
  "soil_composition",
  "ero_soil_stability",
  "ero_water_seepage",
  "soil_fauna_density",
  "soil_fauna_diversity",
  "surface_fauna_density",
  "surface_fauna_diversity",
] as const;

/**
 * Return data in a convenient way for UI rendering, handling units and fixing
 */
export const useFormatSoilData = (data: SoilData) => {
  const { formatWithUnit } = useFormatterWithUnit();

  const {
    soil_structure,
    soil_fauna_diversity,
    soil_fauna_density,
    surface_fauna_diversity,
    surface_fauna_density,
    ...safeData
  } = Object.fromEntries(
    Object.entries(data).map(([key, value]) => {
      console.log(`Processing soil data key: ${key}, value: ${value}`);
      return [
      key,
      indicatorsToPrecise.includes(key as (typeof indicatorsToPrecise)[number])
        ? precise(Number(value))
        : value || 'Donnée non renseignée',
    ]
    }),
  ) as SoilData;

  return {
    ...safeData,
    soil_fauna_density: formatWithUnit(
      soil_fauna_density,
      UNITS.individualPerTrap,
    ),
    soil_fauna_diversity: formatWithUnit(
      soil_fauna_diversity,
      UNITS.speciesCount,
    ),
    soil_structure: `${soil_structure}/10`,
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
