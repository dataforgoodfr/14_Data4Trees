import { i18nInstance } from "@shared/i18n";

import { UNITS, useFormatterWithUnit } from "../utils";

export type BiodiversityData = {
  for: string;
  richness: number;
  dominant_height: number;
};

/**
 * Return data in a convenient way for UI rendering, handling units and fixing
 */
export const useFormatBiodiversityData = (data: BiodiversityData) => {
  const { formatWithUnit } = useFormatterWithUnit();

  return {
    biomass: {
      density: formatWithUnit(120, UNITS.individualPerHectare), // replace hardcoded value
      volume: formatWithUnit(5, UNITS.tonPerHectare), // replace hardcoded value
    },
    date: Intl.DateTimeFormat(i18nInstance.language, {
      dateStyle: "short",
    }).format(new Date()), // to replace
    // replace hardcoded value
    forestPotentialLevel: {
      benef: {
        density: 70,
        diameterDistribution: 22,
        diversity: data.richness,
        masterHeight: data.dominant_height,
        microhabitat: 2,
        ratioDeathmassBiomass: 85,
        spatialDistribution: 43,
        verticalDistribution: 67,
      },
      temoin: {
        density: 80,
        diameterDistribution: 32,
        diversity: 47,
        masterHeight: 98,
        microhabitat: 22,
        ratioDeathmassBiomass: 45,
        spatialDistribution: 39,
        verticalDistribution: 67,
      },
    },
    // replace hardcoded value
    indicatorSpecies: {
      abundanceTaxon1: 43,
      abundanceTaxon2: 56,
      abundanceTaxon3: 33,
      speciesRichnessTaxon1: 47,
      speciesRichnessTaxon2: 23,
      speciesRichnessTaxon3: 24,
    },
    title: "Point #se-4", // to replace
    treeDiversity: {
      shannon: 1.1, // replace hardcoded value
      speciesRichness: formatWithUnit(1257, UNITS.speciesCount), // replace hardcoded value
    },
  };
};

export type FormattedData = ReturnType<typeof useFormatBiodiversityData>;
