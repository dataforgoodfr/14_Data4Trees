import { i18nInstance } from "@shared/i18n";
import { precise } from "@shared/lib/utils";

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
  "soil_structure",
  "soil_composition",
];

const forests = [
  { label: "Djilor", value: "1" },
  { label: "Malka", value: "2" },
  { label: "Samba Dia", value: "3" },
  { label: "Takkite", value: "4" },
];

/**
 * Return data in a convenient way for UI rendering, handling units and fixing
 */
export const useFormatBiodiversityData = (data: BiodiversityData) => {
  const { formatWithUnit } = useFormatterWithUnit();

  indicatorKeys.forEach((key) => {
    const value = data[key];
    data[key] = precise(value) as BiodiversityData[typeof key];
    console.log(`Formatted ${key}: ${data[key]} , ${typeof data[key]}`);
  });

  return {
    biomass: {
      density: formatWithUnit(data.tree_density, UNITS.individualPerHectare),
      volume: formatWithUnit(data.biomass_volume, UNITS.tonPerHectare),
    },
    date: Intl.DateTimeFormat(i18nInstance.language, {
      dateStyle: "short",
    }).format(new Date()), // to replace
    forestPotentialLevel: {
      benef: {
        density: data.epf_tree_density,
        diameterDistribution: data.epf_diameter_distribution,
        diversity: data.epf_tree_diversity,
        dominantHeight: data.epf_dominant_height,
        microhabitat: data.epf_microhabitats,
        ratioDeathmassBiomass: data.epf_necro_biomass_ratio,
        spatialDistribution: data.epf_spatial_distribution,
        verticalDistribution: data.epf_vertical_distribution,
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
    // replace hardcoded value
    indicatorSpecies: {
      abundanceTaxon1: 43,
      abundanceTaxon2: 56,
      abundanceTaxon3: 33,
      speciesRichnessTaxon1: 47,
      speciesRichnessTaxon2: 23,
      speciesRichnessTaxon3: 24,
    },
    title: `Placette n°${data.cod} dans la forêt ${forests.find((f) => f.value === data.for)?.label || data.for}`,
    treeDiversity: {
      relative_abundance: 1, // replace hardcoded value
      speciesRichness: data.richness,
    },
  };
};

export type FormattedData = ReturnType<typeof useFormatBiodiversityData>;
