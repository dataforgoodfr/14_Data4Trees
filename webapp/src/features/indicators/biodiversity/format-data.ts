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
    title: "Point #se-4", // to replace
    date: Intl.DateTimeFormat(i18nInstance.language, {
      dateStyle: "short",
    }).format(new Date()), // to replace
    biomass: {
      volume: formatWithUnit(5, UNITS.tonPerHectare), // replace hardcoded value
      density: formatWithUnit(120, UNITS.individualPerHectare), // replace hardcoded value
    },
    treeDiversity: {
      specificWealth: formatWithUnit(1257, UNITS.speciesCount), // replace hardcoded value
      shannon: 1.1, // replace hardcoded value
    },
    // replace hardcoded value
    indicatorSpecies: {
      abundanceTaxon1: 43,
      specificWealthTaxon1: 47,
      abundanceTaxon2: 56,
      specificWealthTaxon2: 23,
      abundanceTaxon3: 33,
      specificWealthTaxon3: 24,
    },
    // replace hardcoded value
    forestPotentialLevel: {
      benef: {
        density: 70,
        ratioDeathmassBiomass: 85,
        diversity: data.richness,
        spatialDistribution: 43,
        diameterDistribution: 22,
        verticalDistribution: 67,
        masterHeight: data.dominant_height,
        microhabitat: 2,
      },
      temoin: {
        density: 80,
        ratioDeathmassBiomass: 45,
        diversity: 47,
        spatialDistribution: 39,
        diameterDistribution: 32,
        verticalDistribution: 67,
        masterHeight: 98,
        microhabitat: 22,
      },
    },
  };
};

export type FormattedData = ReturnType<typeof useFormatBiodiversityData>;
