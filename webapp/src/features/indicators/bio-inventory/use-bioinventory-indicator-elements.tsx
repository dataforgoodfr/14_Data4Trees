import { Gem, PawPrint, SearchAlert } from "lucide-react";

import { ChartTaxonAbundance } from "@features/charts/components/chart-taxon-abundance";
import type { BioInventoryData } from "@features/popup/bio-inventory/types";

import type { LayerMetadata } from "@shared/lib/coordo";
import { useTranslation } from "@i18n";

import { ICON_SIZE } from "../components/constants";
import { IndicatorRawValue } from "../components/indicator-raw-value";
import type { UseIndicatorReturnType } from "../components/types";
import { useFormatBioInventoryData } from "./format-data";

export const useBioInventoryIndicatorElements = (
  rawData: BioInventoryData,
  metadata: LayerMetadata,
): UseIndicatorReturnType => {
  const { t } = useTranslation("all4trees");
  const data = useFormatBioInventoryData(rawData, metadata);

  return [
    {
      children: (
        <>
          <IndicatorRawValue
            dataName={t("indicators.bioinventory.taxon")}
            iconStart={<SearchAlert size={ICON_SIZE} />}
            value={data.taxon}
          />
          <IndicatorRawValue
            dataName={t("indicators.bioinventory.type")}
            iconStart={<SearchAlert size={ICON_SIZE} />}
            value={data.type}
          />
          <IndicatorRawValue
            dataName={t("indicators.bioinventory.sampArea")}
            iconStart={<SearchAlert size={ICON_SIZE} />}
            value={data.area}
          />
          <IndicatorRawValue
            dataName={t("indicators.common.density")}
            iconStart={<PawPrint size={ICON_SIZE} />}
            value={data.density}
          />
          <IndicatorRawValue
            dataName={t("indicators.common.speciesRichness")}
            iconStart={<Gem size={ICON_SIZE} />}
            value={data.richness}
          />
          <ChartTaxonAbundance
            data={data.relative_abundance}
            metadata={metadata}
          />
        </>
      ),
      identifier: "bio",
      title: t("indicators.bioinventory.title"),
      type: "section",
    },
  ];
};
