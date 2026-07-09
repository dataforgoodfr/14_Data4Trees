import { useTranslation } from "react-i18next";

import {
  formatTaxonAbundance,
  preciseNumericIndicators,
} from "@features/indicators/utils";
import type { BioInventoryData } from "@features/popup/bio-inventory";

import type { LayerMetadata } from "@shared/lib/coordo";
import { findCategoricalLabel } from "@shared/lib/utils";
import type { NumericKeys } from "@shared/types";

const indicatorKeys: NumericKeys<BioInventoryData>[] = [
  "samp_area",
  "density",
  "richness",
  "total_pop",
];

/**
 * Return data in a convenient way for UI rendering, handling units and fixing
 */
export const useFormatBioInventoryData = (
  data: BioInventoryData,
  metadata: LayerMetadata,
) => {
  const { t } = useTranslation("common");

  const safeData = preciseNumericIndicators<BioInventoryData>(
    data,
    indicatorKeys,
    t("dataManagement.noData"),
  );

  safeData.taxons_relative_abundance = formatTaxonAbundance(
    safeData.pop_by_taxon,
    safeData.total_pop,
  );

  return {
    area: `${safeData.samp_area} ${findCategoricalLabel(metadata, "inv_unit", safeData.samp_unit) || t("dataManagement.noUnit")}`,
    density: `${safeData.density} ${safeData.dens_unit || t("dataManagement.noUnit")}`,
    relative_abundance: safeData.taxons_relative_abundance,
    richness: safeData.richness,
    taxon: "Lémuriens", // findCategoricalLabel(metadata, "tax", safeData.taxon) || safeData.taxon
    total_population: safeData.total_pop,
    type:
      findCategoricalLabel(metadata, "meth", safeData.type.toString()) ||
      safeData.type,
  };
};

export type FormattedData = ReturnType<typeof useFormatBioInventoryData>;
