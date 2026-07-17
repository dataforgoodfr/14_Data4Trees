import type { LabelData } from "@entities/data";
import { useTranslation } from "react-i18next";

import {
  findLabel,
  formatTaxonAbundance,
  preciseNumericIndicators,
  UNITS,
  useFormatterWithUnit,
} from "@features/indicators/utils";
import type { BioInventoryData } from "@features/popup/bio-inventory";

import { i18nInstance } from "@shared/i18n";
import type { NumericKeys } from "@shared/types";

const indicatorKeys: NumericKeys<BioInventoryData>[] = [
  "samp_area",
  "density",
  "richness",
  "taxons_total_pop",
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

  const taxons_relative_abundance = formatTaxonAbundance(
    safeData.taxons_abundance_pop,
    safeData.taxons_total_pop,
  );

  return {
    area: `${safeData.samp_area} ${
      findLabel(
        metadata,
        data.proj,
        lang,
        "unit",
        Number(safeData.samp_unit),
      ) || t("dataManagement.noUnit")
    }`,
    density: `${safeData.density} ${safeData.dens_unit || t("dataManagement.noUnit")}`,
    relative_abundance: taxons_relative_abundance,
    richness: formatWithUnit(safeData.richness, UNITS.speciesInventoried),
    taxon:
      findLabel(metadata, data.proj, lang, "tax", Number(safeData.taxon)) ||
      t("dataManagement.noUnit") ||
      safeData.taxon,
    total_population: safeData.taxons_total_pop,
    type:
      findLabel(metadata, data.proj, lang, "meth", Number(safeData.type)) ||
      safeData.type,
  };
};

export type FormattedData = ReturnType<typeof useFormatBioInventoryData>;
