import { Gem, TreePine, Trees } from "lucide-react";

import { ChartForestPotential } from "@features/charts/biodiversity/chart-forest-potential";
import { ChartRelativeAbundance } from "@features/charts/biodiversity/chart-relative-abundance";

import type { LayerMetadata } from "@shared/lib/coordo";
import { useTranslation } from "@i18n";

import { ICON_SIZE } from "../components/constants";
import { IndicatorRawValue } from "../components/indicator-raw-value";
import type { UseIndicatorReturnType } from "../components/types";
import { useFormatBiodiversityData } from "./format-data";
import type { BiodiversityData } from "./types";

export const useBiodiversityIndicatorElements = (
  rawData: BiodiversityData,
  metadata: LayerMetadata,
): UseIndicatorReturnType => {
  const { t } = useTranslation("all4trees");
  const data = useFormatBiodiversityData(rawData);

  return [
    {
      children: (
        <>
          <IndicatorRawValue
            dataName={t("indicators.biodiversity.sections.biomass.volume")}
            iconStart={<TreePine size={ICON_SIZE} />}
            value={data.biomass.volume}
          />
          <IndicatorRawValue
            dataName={t("indicators.biodiversity.sections.biomass.density")}
            iconStart={<Trees size={ICON_SIZE} />}
            value={data.biomass.density}
          />
        </>
      ),
      identifier: "biomass",
      title: t("indicators.biodiversity.sections.biomass.title"),
      type: "section",
    },
    { type: "divider" },
    {
      children: (
        <>
          <IndicatorRawValue
            dataName={t(
              "indicators.biodiversity.sections.treeDiversity.speciesRichness",
            )}
            iconStart={<Gem size={ICON_SIZE} />}
            value={data.treeDiversity.speciesRichness}
          />
          <ChartRelativeAbundance
            data={data.treeDiversity.relative_abundance}
            metadata={metadata}
          />
        </>
      ),
      identifier: "tree-diversity",
      title: t("indicators.biodiversity.sections.treeDiversity.title"),
      type: "section",
    },
    { type: "divider" },
    {
      children: (
        <ChartForestPotential benef={data.tropicalBiodiversityIndex.benef} />
      ),
      identifier: "forest-potential-level",
      title: t("indicators.biodiversity.sections.tropicalBiodivIndex.title"),
      type: "section",
    },
  ];
};
