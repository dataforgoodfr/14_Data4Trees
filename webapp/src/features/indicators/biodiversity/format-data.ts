import { useTranslation } from "react-i18next";

import {
  preciseNumericIndicators,
  UNITS,
  useFormatterWithUnit,
} from "@features/indicators/utils";

import { precise } from "@shared/lib/utils";
import type { NumericKeys } from "@shared/types";

import type { BiodiversityData } from "./types";

const indicatorKeys: NumericKeys<BiodiversityData>[] = [
  "biomass_volume",
  "tree_density",
  "richness",
  "epf_tree_density",
  "epf_deadWood",
  "epf_tree_diversity",
  "epf_spatial_distribution",
  "epf_diameter_distribution",
  "epf_vertical_distribution",
  "epf_dominant_height",
  "epf_microhabitats",
];

const formatRelativeAbundance = (
  relativeAbundance: BiodiversityData["relative_abundance"],
  treePop: number,
) =>
  Object.entries(relativeAbundance).map(
    ([key, value]) =>
      [key, Number(precise((Number(value) * 100) / treePop))] as [
        string,
        number,
      ],
  );

/**
 * Return data in a convenient way for UI rendering, handling units and fixing
 */
export const useFormatBiodiversityData = (data: BiodiversityData) => {
  const { t } = useTranslation("translations");
  const { formatWithUnit } = useFormatterWithUnit();

  const safeData = preciseNumericIndicators<BiodiversityData>(
    data,
    indicatorKeys,
    t("indicators.common.noData"),
  );

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
        deadWood: safeData.epf_deadWood,
        density: safeData.epf_tree_density,
        diameterDistribution: safeData.epf_diameter_distribution,
        diversity: safeData.epf_tree_diversity,
        dominantHeight: safeData.epf_dominant_height,
        microHabitat: safeData.epf_microhabitats,
        spatialDistribution: safeData.epf_spatial_distribution,
        verticalDistribution: safeData.epf_vertical_distribution,
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
      relative_abundance: formatRelativeAbundance(
        data.relative_abundance,
        data.tree_pop,
      ),
      speciesRichness: data.richness,
      tree_pop: data.tree_pop,
    },
  };
};

export type FormattedData = ReturnType<typeof useFormatBiodiversityData>;
