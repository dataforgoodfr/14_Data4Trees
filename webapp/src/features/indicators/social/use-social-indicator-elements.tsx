import { Hourglass, InfoIcon, UserCheck, Wheat, Zap } from "lucide-react";

import {
  ChartEnergySources,
  ChartWoodEnergyNeeds,
} from "@features/charts/socio-eco";
import { ChartFoodDiversity } from "@features/charts/socio-eco/chart-food-diversity";
import { ChartTimberNeeds } from "@features/charts/socio-eco/chart-timber-needs";
import { IndicatorRawValue } from "@features/indicators/components/indicator-raw-value";
import type { UseIndicatorReturnType } from "@features/indicators/components/types";

import { useTranslation } from "@i18n";

import { ICON_SIZE } from "../components/constants";
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
            iconStart={<Zap size={ICON_SIZE} />}
            value={data.wood.energyConsumption}
          />
          <ChartWoodEnergyNeeds data={data.wood.energyNeeds} />
          <IndicatorRawValue
            dataName={t("indicators.socioEco.sections.wood.collectionTime")}
            iconStart={<Hourglass size={ICON_SIZE} />}
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
            iconStart={<Wheat size={ICON_SIZE} />}
            value={data.food.foodDiversityScore}
          />
          <ChartFoodDiversity benef={data.food.foodDiversity} />
          <IndicatorRawValue
            dataName={t("indicators.socioEco.sections.food.autoConso")}
            iconStart={<UserCheck size={ICON_SIZE} />}
            value={data.food.autoConsumptionNeeds}
          />
          <IndicatorRawValue
            dataName={t("indicators.socioEco.sections.food.leanPeriod")}
            iconStart={<InfoIcon size={ICON_SIZE} />}
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
