import { precise } from "@shared/lib/utils";

import { UNITS, useFormatterWithUnit } from "../utils";
import type { BiodiversityData } from "./types";

type NumericKeys<T> = {
  [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

const indicatorKeys: NumericKeys<BiodiversityData>[] = [
  "biomass_volume",
  "tree_density",
  "richness",
  "epf_tree_density",
  "epf_necro_biomass_ratio",
  "epf_tree_diversity",
  "epf_spatial_distribution",
  "epf_diameter_distribution",
  "epf_vertical_distribution",
  "epf_dominant_height",
  "epf_microhabitats",
];

/**
 * Return data in a convenient way for UI rendering, handling units and fixing
 */
export const useFormatBiodiversityData = (data: BiodiversityData) => {
  const { formatWithUnit } = useFormatterWithUnit();

  const safeData = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      indicatorKeys.includes(key as (typeof indicatorKeys)[number])
        ? precise(Number(value))
        : value,
    ]),
  ) as BiodiversityData;

  return {
    biomass: {
      density: formatWithUnit(
        safeData.tree_density,
        UNITS.individualPerHectare,
      ),
      volume: formatWithUnit(safeData.biomass_volume, UNITS.tonPerHectare),
    },
    forestPotentialLevel: {
      benef: {
        density: safeData.epf_tree_density,
        diameterDistribution: safeData.epf_diameter_distribution,
        diversity: safeData.epf_tree_diversity,
        dominantHeight: safeData.epf_dominant_height,
        microhabitat: safeData.epf_microhabitats,
        ratioDeathmassBiomass: safeData.epf_necro_biomass_ratio,
        spatialDistribution: safeData.epf_spatial_distribution,
        verticalDistribution: safeData.epf_vertical_distribution,
      },
      temoin: {
        density: 0.02,
        diameterDistribution: 3,
        diversity: 1,
        dominantHeight: 4,
        microhabitat: 0.5,
        ratioDeathmassBiomass: 1,
        spatialDistribution: 1,
        verticalDistribution: 2,
      },
    },
    // replace hardcoded value when data will be available
    indicatorSpecies: {
      abundanceTaxon1: 43,
      abundanceTaxon2: 56,
      abundanceTaxon3: 33,
      speciesRichnessTaxon1: 47,
      speciesRichnessTaxon2: 23,
      speciesRichnessTaxon3: 24,
    },
    treeDiversity: {
      relative_abundance: 1, // replace hardcoded value when data will be available
      speciesRichness: data.richness,
    },
  };
};

export type FormattedData = ReturnType<typeof useFormatBiodiversityData>;
