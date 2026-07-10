import { useTranslation } from "react-i18next";

import {
  findLabelInExternalData2,
  formatTaxonAbundance,
  preciseNumericIndicators,
  UNITS,
  useFormatterWithUnit,
} from "@features/indicators/utils";
import type { BioInventoryData } from "@features/popup/bio-inventory";
import type { LabelData } from "@features/popup/forest-inventory/types";

import { i18nInstance } from "@shared/i18n";
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
  metadata: LabelData[],
) => {
  const { t } = useTranslation("common");
  const lang = i18nInstance.language;
  const { formatWithUnit } = useFormatterWithUnit();

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
    area: `${safeData.samp_area} ${
      findLabelInExternalData2(
        metadata,
        data.proj,
        lang,
        "unit",
        Number(safeData.samp_unit),
      ) || t("dataManagement.noUnit")
    }`,
    density: `${safeData.density} ${safeData.dens_unit || t("dataManagement.noUnit")}`,
    relative_abundance: safeData.taxons_relative_abundance,
    richness: formatWithUnit(safeData.richness, UNITS.speciesInventoried),
    taxon:
      findLabelInExternalData2(
        metadata,
        data.proj,
        lang,
        "tax",
        Number(safeData.taxon),
      ) ||
      t("dataManagement.noUnit") ||
      safeData.taxon,
    total_population: safeData.total_pop,
    type:
      findLabelInExternalData2(
        metadata,
        data.proj,
        lang,
        "meth",
        Number(safeData.type),
      ) || safeData.type,
  };
};

export type FormattedData = ReturnType<typeof useFormatBioInventoryData>;
