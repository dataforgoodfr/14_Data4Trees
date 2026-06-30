import { Calendar, Hourglass, Soup, Wheat, Zap } from "lucide-react";

import {
  ChartEnergySources,
  ChartWoodEnergyNeeds,
} from "@features/charts/socio-eco";
import { ChartFoodDiversity } from "@features/charts/socio-eco/chart-food-diversity";
import { ChartTimberNeeds } from "@features/charts/socio-eco/chart-timber-needs";
import { IndicatorRawValue } from "@features/indicators/components/indicator-raw-value";
import type { UseIndicatorReturnType } from "@features/indicators/components/types";
import type { SocioEcoData } from "@features/popup/socio-eco";

import { useTranslation } from "@i18n";

import { ICON_SIZE } from "../components/constants";
import { useFormatSocialData } from "./format-data";

export const useSocialIndicatorElements = (
  rawData: SocioEcoData,
): UseIndicatorReturnType => {
  const { t } = useTranslation("all4trees");
  const data = useFormatSocialData(rawData);

  return [
    {
      children: (
        <>
          <ChartEnergySources benef={data.wood.fuelSources} />
          <IndicatorRawValue
            dataName={t("indicators.socioEco.sections.wood.energyConsumption")}
            iconStart={<Zap size={ICON_SIZE} />}
            value={data.wood.energyConsumption}
          />
          <ChartWoodEnergyNeeds data={data.wood.firewoodNeeds} />
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
            iconStart={<Soup size={ICON_SIZE} />}
            value={data.food.foodDiversityScore}
          />
          <ChartFoodDiversity benef={data.food.foodDiversity} />
          <IndicatorRawValue
            dataName={t("indicators.socioEco.sections.food.autoConso")}
            iconStart={<Wheat size={ICON_SIZE} />}
            value={data.food.foodSelfSufficiency}
          />
          <IndicatorRawValue
            dataName={t("indicators.socioEco.sections.food.leanPeriod")}
            iconStart={<Calendar size={ICON_SIZE} />}
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
