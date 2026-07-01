import { useTranslation } from "react-i18next";

import {
  convertDictToPercentage,
  preciseNumericIndicators,
  UNITS,
  useFormatterWithUnit,
} from "@features/indicators/utils";
import type { ForestInventoryData } from "@features/popup/forest-inventory/types";

import type { NumericKeys } from "@shared/types";

import type { BiodiversityData } from "./types";
import type { ForestInventoryData } from "@features/popup/forest-inventory/types";

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

/**
 * Return data in a convenient way for UI rendering, handling units and fixing
 */
export const useFormatBiodiversityData = (data: ForestInventoryData) => {
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
      relative_abundance: convertDictToPercentage(
        data.relative_abundance,
        data.tree_pop,
        "0",
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
