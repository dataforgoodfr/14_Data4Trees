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
  "bio_idx_tree_density",
  "bio_idx_deadWood",
  "bio_idx_tree_diversity",
  "bio_idx_spatial_distribution",
  "bio_idx_diametric_distribution",
  "bio_idx_vertical_distribution",
  "bio_idx_dominant_height",
  "bio_idx_microhabitats",
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
  const { t } = useTranslation("common");
  const { formatWithUnit } = useFormatterWithUnit();

  const safeData = preciseNumericIndicators<BiodiversityData>(
    data,
    indicatorKeys,
    t("dataManagement.noData"),
  );

  return {
    biomass: {
      density: formatWithUnit(
        safeData.tree_density,
        UNITS.individualPerHectare,
      ),
      volume: formatWithUnit(safeData.biomass_volume, UNITS.tonPerHectare),
    },
    treeDiversity: {
      relative_abundance: formatRelativeAbundance(
        data.relative_abundance,
        data.tree_pop,
      ),
      speciesRichness: formatWithUnit(safeData.richness, UNITS.essenceCount),
      tree_pop: data.tree_pop,
    },
    tropicalBiodiversityIndex: {
      benef: {
        deadWood: safeData.bio_idx_deadWood,
        density: safeData.bio_idx_tree_density,
        diameterDistribution: safeData.bio_idx_diametric_distribution,
        diversity: safeData.bio_idx_tree_diversity,
        dominantHeight: safeData.bio_idx_dominant_height,
        microHabitat: safeData.bio_idx_microhabitats,
        spatialDistribution: safeData.bio_idx_spatial_distribution,
        verticalDistribution: safeData.bio_idx_vertical_distribution,
      },
    },
  };
};

export type FormattedData = ReturnType<typeof useFormatBiodiversityData>;
