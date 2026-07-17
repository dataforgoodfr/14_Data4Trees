import type { ExternalData } from "@entities/data";
import { Gem, PawPrint, Ruler, SearchAlert, VectorSquare } from "lucide-react";

import { ChartSpeciesStatus } from "@features/charts/bioinventory/chart-species-status";
import { ChartTaxonAbundance } from "@features/charts/components/chart-taxon-abundance";
import type { BioInventoryData } from "@features/popup/bio-inventory/types";

import { useTranslation } from "@i18n";

import { ICON_SIZE } from "../components/constants";
import { IndicatorRawValue } from "../components/indicator-raw-value";
import type { UseIndicatorReturnType } from "../components/types";
import { useFormatBioInventoryData } from "./format-data";

export const useBioInventoryIndicatorElements = (
  rawData: BioInventoryData,
  externalData: ExternalData,
): UseIndicatorReturnType => {
  const { t } = useTranslation("all4trees");
  const data = useFormatBioInventoryData(rawData, externalData.bio_label);

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
            iconStart={<Ruler size={ICON_SIZE} />}
            value={data.type}
          />
          <IndicatorRawValue
            dataName={t("indicators.bioinventory.sampArea")}
            iconStart={<VectorSquare size={ICON_SIZE} />}
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
            metadata={externalData.bio_label}
            project={rawData.proj}
          />
          <ChartSpeciesStatus
            data={data.relative_abundance}
            metadata={externalData.bio_sp}
            project={rawData.proj}
          />
        </>
      ),
      identifier: "bio",
      title: t("indicators.bioinventory.title"),
      type: "section",
    },
  ];
};
