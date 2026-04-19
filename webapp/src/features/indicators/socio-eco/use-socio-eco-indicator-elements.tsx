import {
  ChartEnergySources,
  ChartWoodEnergyNeeds,
} from "@features/charts/socio-eco";
import { ChartTimberNeeds } from "@features/charts/socio-eco/chart-timber-needs";

import { useTranslation } from "@i18n";

import { IndicatorRawValue } from "../components/indicator-raw-value";
import type { UseIndicatorReturnType } from "../components/types";
import { useFormatSocioEcoData } from "./format-data";
import type { SocioEcoData } from "./types";
import { ChartFoodDiversity } from "@features/charts/socio-eco/chart-food-diversity";

export const useSocioEcoIndicatorElements = (
  rawData: SocioEcoData,
): UseIndicatorReturnType => {
  const { t } = useTranslation("translations");
  const data = useFormatSocioEcoData(rawData);

  return [
    {
      children: (
        <>
          <ChartEnergySources benef={data.wood.energySources} />
          <IndicatorRawValue
            dataName={t("indicators.socio-eco.sections.wood.energyConsumption")}
            value={data.wood.energyConsumption}
          />
          <ChartWoodEnergyNeeds data={data.wood.energyNeeds} />
          <IndicatorRawValue
            dataName={t("indicators.socio-eco.sections.wood.collectionTime")}
            value={data.wood.collectionTime}
          />
          <ChartTimberNeeds data={data.wood.timberNeeds} />
        </>
      ),
      identifier: "indicator-wood",
      title: t("indicators.socio-eco.sections.wood.title"),
      type: "section",
    },
    {
      children: (
        <>
          <IndicatorRawValue
            dataName={t("indicators.socio-eco.sections.food.diversityScore")}
            value={data.food.foodDiversityScore}
          />
        <ChartFoodDiversity benef={data.food.foodDiversity} />
          <IndicatorRawValue
            dataName={t("indicators.socio-eco.sections.food.diversityScore")}
            value={data.food.foodDiversityScore}
          />
          <IndicatorRawValue
            dataName={t("indicators.socio-eco.sections.food.diversityScore")}
            value={data.food.foodDiversityScore}
          />
        </>
      ),
      identifier: "indicator-food",
      title: t("indicators.socio-eco.sections.food.title"),
      type: "section",
    }
  ];
};
