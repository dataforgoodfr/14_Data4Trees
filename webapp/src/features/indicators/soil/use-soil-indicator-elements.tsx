import { Bug, Gem, Sprout } from "lucide-react";

import { ChartAquaticErosion } from "@features/charts/soil/ui/chart-aquatic-erosion";
import { ChartTaxonAbundance } from "@features/charts/soil/ui/chart-taxon-abundance";
import { ChartWindErosion } from "@features/charts/soil/ui/chart-wind-erosion";
import type { UseIndicatorReturnType } from "@features/indicators//components/types";
import { IndicatorRawValue } from "@features/indicators/components/indicator-raw-value";
import type { ForestInventoryData } from "@features/popup/forest-inventory";
import type { ExternalData } from "@features/popup/forest-inventory/types";

import { useTranslation } from "@i18n";

import { ICON_SIZE } from "../components/constants";
import { useFormatSoilData } from "./format-data";

export const useSoilIndicatorElements = (
  rawData: ForestInventoryData,
  metadata: ExternalData,
): UseIndicatorReturnType => {
  const { t } = useTranslation("all4trees");

  const data = useFormatSoilData(rawData);

  return [
    {
      children: (
        <>
          <IndicatorRawValue
            dataName={t("indicators.soil.sections.structuration.structure")}
            iconStart={<Sprout size={ICON_SIZE} />}
            value={data.soil_structure_idx}
          />
        </>
      ),
      identifier: "structuration",
      title: t("indicators.soil.sections.structuration.title"),
      type: "section",
    },
    { type: "divider" },
    {
      children: (
        <div className="flex flex-col gap-sm">
          <ChartAquaticErosion
            benef={{
              rainfall: data.soil_eros_rainfall,
              slope: data.soil_eros_slope,
              soilCover: data.soil_eros_cover,
              soilStability: data.soil_eros_stability,
              waterSeepage: data.soil_eros_water_infiltration,
            }}
          />
          <ChartWindErosion
            benef={{
              soilCover: data.soil_eros_cover,
              soilStability: data.soil_eros_stability,
              wind: data.soil_eros_wind,
            }}
          />
        </div>
      ),
      identifier: "erosion",
      title: t("indicators.soil.sections.erosion.title"),
      type: "section",
    },
    { type: "divider" },
    {
      children: (
        <>
          <IndicatorRawValue
            dataName={t("indicators.common.density")}
            iconStart={<Bug size={ICON_SIZE} />}
            value={data.soil_fauna_density}
          />
          <IndicatorRawValue
            dataName={t("indicators.common.speciesRichness")}
            iconStart={<Gem size={ICON_SIZE} />}
            value={data.soil_fauna_diversity}
          />
          <ChartTaxonAbundance
            data={data.soil_fauna_abundance}
            metadata={metadata}
            project={rawData.project}
          />
        </>
      ),
      identifier: "soil-fauna",
      title: t("indicators.soil.sections.soilFauna.title"),
      type: "section",
    },
    { type: "divider" },
    {
      children: (
        <>
          <IndicatorRawValue
            dataName={t("indicators.common.density")}
            iconStart={<Bug size={ICON_SIZE} />}
            value={data.surface_fauna_density}
          />
          <IndicatorRawValue
            dataName={t("indicators.common.speciesRichness")}
            iconStart={<Gem size={ICON_SIZE} />}
            value={data.surface_fauna_diversity}
          />
          <ChartTaxonAbundance
            data={data.surface_fauna_abundance}
            metadata={metadata}
            project={rawData.project}
          />
        </>
      ),
      identifier: "surface-fauna",
      title: t("indicators.soil.sections.surfaceFauna.title"),
      type: "section",
    },
  ];
};
