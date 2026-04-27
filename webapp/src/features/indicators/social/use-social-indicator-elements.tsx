import {
  ChartEnergySources,
  ChartWoodEnergyNeeds,
} from "@features/charts/socio-eco";
import { ChartFoodDiversity } from "@features/charts/socio-eco/chart-food-diversity";
import { ChartTimberNeeds } from "@features/charts/socio-eco/chart-timber-needs";
import { IndicatorRawValue } from "@features/indicators/components/indicator-raw-value";
import type { UseIndicatorReturnType } from "@features/indicators/components/types";

import { useTranslation } from "@i18n";

import { useFormatSocialData } from "./format-data";
import type { SocialData } from "./types";

export const useSocialIndicatorElements = (
  rawData: SocialData,
): UseIndicatorReturnType => {
  const { t } = useTranslation("translations");
  const data = useFormatSocialData(rawData);

  return [
    {
      children: (
        <>
          <ChartEnergySources benef={data.wood.energySources} />
          <IndicatorRawValue
            dataName={t("indicators.socioEco.sections.wood.energyConsumption")}
            value={data.wood.energyConsumption}
          />
          <ChartWoodEnergyNeeds data={data.wood.energyNeeds} />
          <IndicatorRawValue
            dataName={t("indicators.socioEco.sections.wood.collectionTime")}
            value={data.wood.collectionTime}
          />
          <ChartTimberNeeds data={data.wood.timberNeeds} />
        </>
      ),
      identifier: "indicator-wood",
      title: t("indicators.socioEco.sections.wood.title"),
      type: "section",
    },
    {
      children: (
        <>
          <IndicatorRawValue
            dataName={t("indicators.socioEco.sections.food.diversityScore")}
            value={data.food.foodDiversityScore}
          />
          <ChartFoodDiversity benef={data.food.foodDiversity} />
          <IndicatorRawValue
            dataName={t("indicators.socioEco.sections.food.autoConso")}
            value={data.food.autoConsumptionNeeds}
          />
          <IndicatorRawValue
            dataName={t("indicators.socioEco.sections.food.leanPeriod")}
            value={data.food.leanPeriod}
          />
        </>
      ),
      identifier: "indicator-food",
      title: t("indicators.socioEco.sections.food.title"),
      type: "section",
    },
  ];
};
