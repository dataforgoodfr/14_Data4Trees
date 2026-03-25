import { i18nInstance } from "@shared/i18n";

import { UNITS, useFormatterWithUnit } from "../utils";

export type BiodiversityData = {
  for: string;
  cod: number;
  total_trees: number;
  biomass_volume: number;
  tree_density: number;
  richness: number;
  epf_tree_density: number;
  epf_necro_biomass_ratio: number;
  epf_tree_diversity: number;
  epf_spatial_distribution: number;
  epf_diameter_distribution: number;
  epf_vertical_distribution: number;
  epf_dominant_height: number;
  epf_microhabitats: number;
  soil_structure: number;
  soil_composition: number;
};

/**
 * Return data in a convenient way for UI rendering, handling units and fixing
 */
export const useFormatBiodiversityData = (data: BiodiversityData) => {
  const { formatWithUnit } = useFormatterWithUnit();

  return {
    biomass: {
      density: formatWithUnit(data.tree_density, UNITS.individualPerHectare),
      volume: formatWithUnit(data.biomass_volume, UNITS.tonPerHectare),
    },
    date: Intl.DateTimeFormat(i18nInstance.language, {
      dateStyle: "short",
    }).format(new Date()), // to replace
    // replace hardcoded value
    forestPotentialLevel: {
      benef: {
        density: data.epf_tree_density,
        ratioDeathmassBiomass: data.epf_necro_biomass_ratio,
        diversity: data.epf_tree_diversity,
        spatialDistribution: data.epf_spatial_distribution,
        diameterDistribution: data.epf_diameter_distribution,
        verticalDistribution: data.epf_vertical_distribution,
        dominantHeight: data.epf_dominant_height,
        microhabitat: data.epf_microhabitats,
      },
      temoin: {
        density: 80,
        ratioDeathmassBiomass: 45,
        diversity: 47,
        spatialDistribution: 39,
        diameterDistribution: 32,
        verticalDistribution: 67,
        dominantHeight: 98,
        microhabitat: 22,
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
    title: `Placette n°${data.cod}`,
    treeDiversity: {
      relative_abundance: 1, // replace hardcoded value
      speciesRichness: data.richness,
    },
  };
};

export type FormattedData = ReturnType<typeof useFormatBiodiversityData>;
