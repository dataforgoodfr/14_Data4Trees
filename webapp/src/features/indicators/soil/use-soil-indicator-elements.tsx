import { ChartAquaticErosion } from "@features/charts/soil/chart-aquatic-erosion";
import { ChartWindErosion } from "@features/charts/soil/chart-wind-erosion";
import type { UseIndicatorReturnType } from "@features/indicators//components/types";
import { IndicatorRawValue } from "@features/indicators/components/indicator-raw-value";

import { useTranslation } from "@i18n";

import { useFormatSoilData } from "./format-data";
import type { SoilData } from "./types";

export const useSoilIndicatorElements = (
  rawData: SoilData,
): UseIndicatorReturnType => {
  const { t } = useTranslation("translations");

  const data = useFormatSoilData(rawData);

  return [
    {
      children: (
        <>
          <IndicatorRawValue
            dataName={t("indicators.soil.sections.structuration.composition")}
            value={data.soil_composition}
          />
          <IndicatorRawValue
            dataName={t("indicators.soil.sections.structuration.structure")}
            value={data.soil_structure}
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
              rainfall: data.ero_rainfall,
              slope: data.ero_slope,
              soilCover: data.ero_soil_cover,
              soilStability: data.ero_soil_stability,
              waterSeepage: data.ero_water_seepage,
            }}
          />
          <ChartWindErosion
            benef={{
              soilCover: data.ero_soil_cover,
              soilStability: data.ero_soil_stability,
              wind: data.ero_wind,
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
            value={data.soil_fauna_density}
          />
          <IndicatorRawValue
            dataName={t("indicators.common.speciesRichness")}
            value={data.soil_fauna_diversity}
          />
          <IndicatorRawValue
            dataName={t("indicators.common.abundance")}
            value={data.soil_fauna_abundance}
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
            value={data.surface_fauna_density}
          />
          <IndicatorRawValue
            dataName={t("indicators.common.speciesRichness")}
            value={data.surface_fauna_diversity}
          />
          <IndicatorRawValue
            dataName={t("indicators.common.abundance")}
            value={data.surface_fauna_abundance}
          />
        </>
      ),
      identifier: "surface-fauna",
      title: t("indicators.soil.sections.surfaceFauna.title"),
      type: "section",
    },
  ];
};
