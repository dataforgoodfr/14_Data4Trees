import {
  ChartEnergySources,
  ChartWoodEnergyNeeds,
} from "@features/charts/socio-eco";
import { ChartLumberNeeds } from "@features/charts/socio-eco/chart-lumber-needs";

import { useTranslation } from "@i18n";

import { IndicatorRawValue } from "../components/indicator-raw-value";
import type { UseIndicatorReturnType } from "../components/types";
import { type SocioEcoData, useFormatSocioEcoData } from "./format-data";

export const useSocioEcoIndicatorElements = (
  rawData: SocioEcoData,
): UseIndicatorReturnType => {
  const { t } = useTranslation("translations");
  const data = useFormatSocioEcoData(rawData);

  return [
    {
      children: (
        <>
          <ChartEnergySources data={data.wood.energySources} />
          <IndicatorRawValue
            dataName={t("indicators.socio-eco.sections.wood.energyConsumption")}
            value={data.wood.energyConsumption}
          />
          <ChartWoodEnergyNeeds data={data.wood.energyNeeds} />
          <IndicatorRawValue
            dataName={t("indicators.socio-eco.sections.wood.collectionTime")}
            value={data.wood.collectionTime}
          />
          <ChartLumberNeeds data={data.wood.lumberNeeds} />
        </>
      ),
      identifier: "indicator-wood",
      title: t("indicators.socio-eco.sections.wood.title"),
      type: "section",
    },
  ];
};
